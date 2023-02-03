import { Timestamp } from '@google-cloud/firestore';
import { NextFunction, Request, Response } from 'express';
import { handleDialog } from '../../services/dialog.service';
import {
	getInteraction,
	InteractionFirestore,
	InteractionType,
	saveInteractionRecord,
	updateInteraction,
} from '../../services/interactions.service';
import { addHoursInDate, replaceEverythingExceptNumbers } from '../../utils/common.utils';
import { sendSuccessResponse } from '../../utils/response.utils';

interface TwilioIncomingMessagePayload {
	SmsMessageSid: string;
	NumMedia: string;
	ProfileName: string;
	SmsSid: string;
	WaId: string;
	SmsStatus: string;
	Body: string;
	To: string;
	NumSegments: string;
	ReferralNumMedia: string;
	MessageSid: string;
	AccountSid: string;
	From: string;
	ApiVersion: string;
}

/**
 * Handles send message request
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export async function incomingMessageController(req: Request, res: Response, next: NextFunction) {
	try {
		console.log('[IncomingMessage] Incoming message received', JSON.stringify(req.body));

		const { MessageSid, From, SmsStatus, Body } = req.body as TwilioIncomingMessagePayload;

		const userId = replaceEverythingExceptNumbers(From);

		// first check if there has already been an interaction with this user
		// if it already exists, need to update free form slot if valid
		const interaction = await getInteraction({ userId });

		const interactionUpdate: Partial<InteractionFirestore> = { lastIncomingMessage: Timestamp.now() };

		// only update free form timestamp if previous one has expired
		if (
			!interaction?.freeFormWindowOpenedAt ||
			addHoursInDate({ date: interaction.freeFormWindowOpenedAt?.toDate(), hours: 24 }) < new Date()
		) {
			interactionUpdate.freeFormWindowOpenedAt = Timestamp.now();
		}

		await updateInteraction({ userId, interaction: interactionUpdate });

		// save incoming interaction record
		// save interaction
		await saveInteractionRecord({
			messageId: MessageSid,
			to: userId,
			interactionRecord: {
				message: Body,
				lastUpdatedAt: Timestamp.now(),
				type: InteractionType.INCOMING,
				sourceData: req.body,
				status: SmsStatus || 'received',
			},
		});

		// pass message details to dialog builder
		try {
			handleDialog({
				userId,
				message: Body,
				interactionRecordId: MessageSid,
				// passed to check in case if this was not the first incoming message from user
				hasPreviouslyInteracted: !!interaction?.lastIncomingMessage,
			});
		} catch (error) {
			console.error('Some error occured while handling dialog for incoming message');
		}

		sendSuccessResponse({ res, data: 'OK' });
	} catch (error) {
		console.error(`[IncomingMessage] Error initiating convo message`, error);
		next(error);
	}
}
