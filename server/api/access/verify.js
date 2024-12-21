/** @format */
import crypto from 'node:crypto';
export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	
	try {
		const timestamp = new Date().getTime();
		const hmacSignature = crypto
			.createHmac('sha256', config.app.secretKey)
			.update(timestamp.toString() + JSON.stringify({}))
			.digest('hex');

		const response = await $fetch(config.app.apiUrl + '/access/_verify', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': config.app.apiKey,
				'x-client-id': getCookie(event, 'x-client-id'),
				'x-rtoken-id': getCookie(event, 'x-rtoken-id')
				,
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
