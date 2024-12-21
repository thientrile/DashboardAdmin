/** @format */

import crypto from 'node:crypto';
export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const body = await readBody(event);

	try {
		const timestamp = new Date().getTime();
		const hmacSignature = crypto
			.createHmac('sha256', config.app.secretKey)
			.update(timestamp.toString() + JSON.stringify(body || {}))
			.digest('hex');

		const response = await $fetch(config.app.apiUrl + '/user/_info', {
			method: 'GET',
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
		return e.data;
	}
});
