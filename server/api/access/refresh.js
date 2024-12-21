/** @format */
import crypto from 'node:crypto';

export default defineEventHandler(async (event) => {
	
	
	try {
		const config = useRuntimeConfig();
		const body = await readBody(event);
		const timestamp = new Date().getTime();
			const hmacSignature = crypto
				.createHmac('sha256', config.app.secretKey)
				.update(timestamp.toString() + JSON.stringify(body||{}))
				.digest('hex');
		const response = await $fetch(config.app.apiUrl + '/access/_refresh', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': config.app.apiKey,
				'x-client-id': getCookie(event, 'x-client-id'),
				'x-rtoken-id': getCookie(event, 'x-rtoken-id'),
				'x-timestamp': timestamp,
				'x-hmac-signature': hmacSignature
			}
		});

		return response;
	} catch (e) {
		return e.data;
	}
});
