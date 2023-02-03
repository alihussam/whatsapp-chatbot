import twilio from 'twilio';

// init twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

export async function sendWhatsappMessage({ to, from, message }: { to: string; message: string; from: string }) {
	const result = await client.messages.create({
		from: `whatsapp:${from}`,
		body: message,
		to: `whatsapp:${to}`,
	});

	console.log(`[Twilio][Lib] Whatsapp message send to ${to}`, JSON.stringify(result));

	return JSON.parse(JSON.stringify(result));
}
