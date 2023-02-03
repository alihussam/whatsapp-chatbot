import { Timestamp } from '@google-cloud/firestore';
import { NextFunction, Request, Response } from 'express';
import { updateInteractionRecord } from '../../services/interactions.service';
import { replaceEverythingExceptNumbers } from '../../utils/common.utils';
import { sendSuccessResponse } from '../../utils/response.utils';

interface TwilioMessageStatusPayload {
	SmsSid: string;
	SmsStatus: string;
	MessageStatus: string;
	ChannelToAddress: string;
	To: string;
	ChannelPrefix: string;
	MessageSid: string;
	AccountSid: string;
	From: string;
	ApiVersion: string;
	ChannelInstallSid: string;
}

/**
 * Handles send message request
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export async function messageStatusController(req: Request, res: Response, next: NextFunction) {
	try {
		console.log('[MessageStatus] Message status received', JSON.stringify(req.body));

		// extract message status from body
		const { MessageStatus, MessageSid, To } = req.body as TwilioMessageStatusPayload;
		if (!MessageStatus) {
			throw new Error('Message status missing in status callback');
		}

		await updateInteractionRecord({
			interactionRecord: {
				status: MessageStatus,
				lastUpdatedAt: Timestamp.now(),
			},
			messageId: MessageSid,
			to: replaceEverythingExceptNumbers(To),
		});

		sendSuccessResponse({ res, data: 'OK' });
	} catch (error) {
		console.error(`[MessageStatus] Error initiating convo message`, error);
		next(error);
	}
}
