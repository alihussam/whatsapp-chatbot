import { Timestamp } from '@google-cloud/firestore';
import { ACCEPTED_BILL_IDS } from '../constants';
import { sendWhatsappMessage } from '../libs/twilio.lib';
import { replaceEverythingExceptNumbers } from '../utils/common.utils';
import { getEnvConfig } from '../utils/env.utils';
import { InteractionType, saveInteractionRecord } from './interactions.service';

const ASSISTANCE_HARDCODE = `I'll connect you to a human shortly ;)`;

const STATS_COMMAND = 'Stats';
const DASHBOARD_COMMAND = 'Dashboard';
const ASSISTANCE_COMMAND = 'Assistance';
const GO_BACK_MAIN = 'Go to main selection';

const DEFAULT_DIALOG = `Hey there,
I am Peakflo Bot. Here are some commands that I understand.

1. ${DASHBOARD_COMMAND}
2. ${ASSISTANCE_COMMAND}
`;

const MAIN_SELECTION = `Select one of the following:

1. ${DASHBOARD_COMMAND}
2. ${ASSISTANCE_COMMAND}
`;

const DASHBOARD_SELECTION = `What do you want to see in your dashboard:

1. ${STATS_COMMAND}
2. ${GO_BACK_MAIN}
`;

const UNRECOGNIZED_COMMAND = `Try sending one of these 👇

1. ${DASHBOARD_COMMAND}
2. ${ASSISTANCE_COMMAND}
`;

const STATS_HARDCODE = `Your daily stats,

Overdue: IDR 23,343,423
Outstanding: IDR 32,33,45

You have 34 actions pending today

1. ${GO_BACK_MAIN}
`;

export async function sendMessage({ message, to }: { to: string; message: string }) {
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
}

async function handleStatsCommand(params: {
	userId: string;
	message: string;
	interactionRecordId: string;
	hasPreviouslyInteracted: boolean;
}) {
	await sendMessage({
		to: params.userId,
		message: STATS_HARDCODE,
	});
}

async function handleAssistanceCommand(params: {
	userId: string;
	message: string;
	interactionRecordId: string;
	hasPreviouslyInteracted: boolean;
}) {
	await sendMessage({
		to: params.userId,
		message: ASSISTANCE_HARDCODE,
	});
}

async function handleGoBackCommand(params: {
	userId: string;
	message: string;
	interactionRecordId: string;
	hasPreviouslyInteracted: boolean;
}) {
	await sendMessage({
		to: params.userId,
		message: MAIN_SELECTION,
	});
}

async function handleDashboardCommand(params: {
	userId: string;
	message: string;
	interactionRecordId: string;
	hasPreviouslyInteracted: boolean;
}) {
	await sendMessage({
		to: params.userId,
		message: DASHBOARD_SELECTION,
	});
}

// return bill number or null
function isBillApproval(command: string): string | null {
	const billRegex = /Approve Bill#[0-9]+./g;

	if (billRegex.test(command)) {
		let found = command.split('#')[1];
		// eslint-disable-next-line prefer-destructuring
		found = found.split('.')[0];
		return found;
	}

	return null;
}

// return bill number or null
function isBillRejection(command: string): string | null {
	const billRegex = /Reject Bill#[0-9]+./g;

	if (billRegex.test(command)) {
		let found = command.split('#')[1];
		// eslint-disable-next-line prefer-destructuring
		found = found.split('.')[0];
		return found;
	}

	return null;
}

export async function handleDialog(params: {
	userId: string;
	message: string;
	interactionRecordId: string;
	hasPreviouslyInteracted: boolean;
}) {
	const commandToFunctionMap: Record<string, any> = {
		[STATS_COMMAND]: handleStatsCommand,
		[ASSISTANCE_COMMAND]: handleAssistanceCommand,
		[GO_BACK_MAIN]: handleGoBackCommand,
		[DASHBOARD_COMMAND]: handleDashboardCommand,
	};

	// check if message is a command
	if (commandToFunctionMap?.[params.message.trim()]) {
		console.log('Command found, calling handler', params.message.trim());
		const handler = commandToFunctionMap[params.message.trim()];

		await handler(params);
		return;
	}

	// check if message is bill approval
	const billApprovalStatus = isBillApproval(params.message.trim());
	if (billApprovalStatus) {
		if (ACCEPTED_BILL_IDS.includes(billApprovalStatus)) {
			await sendMessage({ message: `Bill #${billApprovalStatus} is approved`, to: params.userId });
		} else {
			await sendMessage({ message: `Bill #${billApprovalStatus} not found`, to: params.userId });
		}

		return;
	}

	// check if message is bill approval
	const billRejectionStatus = isBillRejection(params.message.trim());
	if (billRejectionStatus) {
		if (ACCEPTED_BILL_IDS.includes(billRejectionStatus)) {
			await sendMessage({ message: `Bill #${billRejectionStatus} is approval rejected`, to: params.userId });
		} else {
			await sendMessage({ message: `Bill #${billApprovalStatus} not found`, to: params.userId });
		}

		return;
	}

	if (!params.hasPreviouslyInteracted) {
		// if interacting for first time reply with default message
		await sendMessage({ message: DEFAULT_DIALOG, to: params.userId });
		return;
	}

	// send unrecognized command message
	await sendMessage({
		to: params.userId,
		message: UNRECOGNIZED_COMMAND,
	});
}
