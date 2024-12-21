/** @format */

import crypto from 'node:crypto';
// server/api/login.ts

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const body = await readBody(event);

try{
	const timestamp = new Date().getTime();
	const hmacSignature = crypto
		.createHmac('sha256', config.app.secretKey)
		.update(timestamp.toString() + JSON.stringify(body||{}))
		.digest('hex');

  const response = await $fetch(config.app.apiUrl + '/access/_register', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'x-api-key': config.app.apiKey,
			
				'x-timestamp': timestamp,
				'x-hmac-signature': hmacSignature
		},
		body: JSON.stringify(body)
	});
	// Return the exact response structure received
	return response;
}catch(e){
  return e.data;
}
	
});
