export const chatService = {
	processChatStream,
	reset,
}

const BASE_URL = process.env.NODE_ENV === 'production'
    ? '/chat/'
    : '//localhost:3031/chat/';

async function processChatStream(userInput, history, language) {

	try {
		const response = await fetch(BASE_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ 
				message: encodeURIComponent(userInput), 
				history,
				language 
			}),
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

async function reset() {
	try {
		const response = await fetch(`${BASE_URL}reset`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
		});
		if (!response.ok) {
			throw new Error(`Failed to reset chat: ${response.status} ${response.statusText}`);
		}
		return true;
	} catch (error) {
		console.error('Failed to reset chat:', error);
		return false;
	}
}