import { Timestamp } from '@google-cloud/firestore';
import { INTERACTIONS_COLLECTION, INTERACTIONS_RECORDS_COLLECTION } from '../constants';
import { firestore } from '../libs/firestore.lib';

export enum InteractionType {
	INCOMING = 'incoming',
	OUTGOING = 'outgoing',
}

export interface InteractionRecord {
	type: InteractionType;
	message: string;
	lastUpdatedAt: Timestamp;
	sourceData: any;
	status: string;
}

export interface InteractionFirestore {
	freeFormWindowOpenedAt?: Timestamp;
	lastIncomingMessage?: Timestamp;
}

export async function getInteraction({ userId }: { userId: string }): Promise<InteractionFirestore | null> {
	const snap = await firestore.collection(INTERACTIONS_COLLECTION).doc(userId).get();

	return snap.exists ? snap.data() : null;
}

export async function updateInteraction({
	userId,
	interaction,
}: {
	userId: string;
	interaction: Partial<InteractionFirestore>;
}) {
	await firestore.collection(INTERACTIONS_COLLECTION).doc(userId).set(interaction, { merge: true });
}

export async function saveInteractionRecord({
	interactionRecord,
	to,
	messageId,
}: {
	to: string;
	messageId: string;
	interactionRecord: InteractionRecord;
}) {
	await firestore
		.collection(INTERACTIONS_COLLECTION)
		.doc(to)
		.collection(INTERACTIONS_RECORDS_COLLECTION)
		.doc(messageId)
		.create(interactionRecord);
}

export async function updateInteractionRecord({
	interactionRecord,
	to,
	messageId,
}: {
	to: string;
	messageId: string;
	interactionRecord: Partial<InteractionRecord>;
}) {
	await firestore
		.collection(INTERACTIONS_COLLECTION)
		.doc(to)
		.collection(INTERACTIONS_RECORDS_COLLECTION)
		.doc(messageId)
		.set({ lastUpdatedAt: Timestamp.now(), ...interactionRecord }, { merge: true });
}
