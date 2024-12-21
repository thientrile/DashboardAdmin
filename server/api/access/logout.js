/** @format */

// server/api/login.ts
import crypto from 'node:crypto';
export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();

	try {
		const timestamp = new Date().getTime();
		const hmacSignature = crypto
			.createHmac('sha256', config.app.secretKey)
			.update(timestamp.toString() + JSON.stringify({}))
			.digest('hex');

		const response = await $fetch(config.app.apiUrl + '/access/_logout', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': config.app.apiKey,
				'x-client-id': getCookie(event, 'x-client-id'),
				authorization: getCookie(event, 'authorization'),
				'x-timestamp': timestamp,
				'x-hmac-signature': hmacSignature
			}
		});
		// Return the exact response structure received
		return response;
	} catch (e) {
		console.log(e);
		return e.data;
	}
});
