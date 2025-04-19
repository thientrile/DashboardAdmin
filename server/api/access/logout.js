/** @format */

// server/api/login.ts
import crypto from 'node:crypto';
export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const headers= getHeaders(event);
	try {
		const timestamp = new Date().getTime();
		const hmacSignature = crypto
			.createHmac('sha256', config.app.secretKey)
			.update(timestamp.toString() + JSON.stringify({}))
			.digest('hex');

		const response = await $fetch(`${config.app.apiUrl}:3056/_logout`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': config.app.apiKey,
				 'x-rtoken-id': headers['x-rtoken-id'],
        			'x-client-id': headers['x-client-id'],
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
