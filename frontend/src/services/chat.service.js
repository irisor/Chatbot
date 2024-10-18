export const chatService = {
	processChatStream,
}

const BASE_URL = process.env.NODE_ENV === 'production'
    ? '/api/'
    : '//localhost:3031/chat/';

async function processChatStream(userInput, history) {

	try {
		const response = await fetch(BASE_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ message: encodeURIComponent(userInput), history }),
		});
		if (!response.ok) {
			throw new Error(`Failed to get bot response: ${response.status} ${response.statusText}`);
		}
		const botResponse = await response.json();
		return botResponse;
	} catch (error) {
		throw new Error(`Failed to get bot response: ${error.message}`);
	}
}