/** @format */
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

		const response = await $fetch(`${config.app.apiUrl}:3056/_verify`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': config.app.apiKey,
				 'authorization': headers['authorization'],
        'x-client-id': headers['x-client-id'],
				'x-timestamp': timestamp,
				'x-hmac-signature': hmacSignature
	
			}
		});

		return response;
	} catch (e) {
		console.log(e);
		return e.data;
	}
});
