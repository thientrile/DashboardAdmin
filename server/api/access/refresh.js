/** @format */
import crypto from 'node:crypto';

export default defineEventHandler(async (event) => {
	const headers= getHeaders(event);
	
	try {
		const config = useRuntimeConfig();
		const body = await readBody(event);
		const timestamp = new Date().getTime();
			const hmacSignature = crypto
				.createHmac('sha256', config.app.secretKey)
				.update(timestamp.toString() + JSON.stringify(body||{}))
				.digest('hex');
		const response = await $fetch(`${config.app.apiUrl}:3056/_refresh`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': config.app.apiKey,
				'x-rtoken-id': headers['x-rtoken-id'],
				'x-client-id': headers['x-client-id'],
				'x-timestamp': timestamp,
				'x-hmac-signature': hmacSignature
			}
		});

		return response;
	} catch (e) {
		return e.data;
	}
});
