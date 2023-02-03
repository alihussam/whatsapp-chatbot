import { NextFunction, Request, Response } from 'express';
import moment from 'moment';
import { Timestamp } from '@google-cloud/firestore';
import { sendWhatsappMessage } from '../../libs/twilio.lib';
import { InteractionType, saveInteractionRecord } from '../../services/interactions.service';
import { replaceEverythingExceptNumbers } from '../../utils/common.utils';
import { getEnvConfig } from '../../utils/env.utils';
import { sendSuccessResponse } from '../../utils/response.utils';
import { ACCEPTED_BILL_IDS } from '../../constants';

interface SendMessageParams {
	to: string;
}

function buildInitMessage({ placeholder1, placeholder2 }: { placeholder1: string; placeholder2: string }) {
	return `Your ${placeholder1} appointment is coming up on ${placeholder2}`;
}

/**
 * Handles send message request
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export async function sendApprovalMessageController(req: Request, res: Response, next: NextFunction) {
	try {
		const { to } = req.body as SendMessageParams;

		// create init message
		const message = buildInitMessage({
			placeholder1: `Bill Approval for Bill #${ACCEPTED_BILL_IDS[0]}`,
			placeholder2: `\n\nApprove Bill#${ACCEPTED_BILL_IDS[0]}\nReject Bill#${ACCEPTED_BILL_IDS[0]}`,
		});

		const result = await sendWhatsappMessage({
			to,
			message,
			from: getEnvConfig().WHATSAPP_FROM_NUMBER,
		});

		// save interaction
		await saveInteractionRecord({
			messageId: result.sid,
			to: replaceEverythingExceptNumbers(result.to),
			interactionRecord: {
				message,
				lastUpdatedAt: Timestamp.now(),
				type: InteractionType.OUTGOING,
				sourceData: result,
				status: result.status || 'sent',
			},
		});

		sendSuccessResponse({ res, data: 'OK' });
	} catch (error) {
		console.error(`[SendInitMessage] Error initiating convo message`, error);
		next(error);
	}
}
