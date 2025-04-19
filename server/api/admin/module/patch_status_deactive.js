/** @format */
import crypto from 'node:crypto';
export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const query = getQuery(event);
    const body = await readBody(event);
    const headers= getHeaders(event);
    const queryString = new URLSearchParams(query).toString();
    const timestamp = new Date().getTime();
    const hmacSignature = crypto
      .createHmac('sha256', config.app.secretKey)
      .update(timestamp.toString() + JSON.stringify(body||{}))
      .digest('hex');
    const url = `${config.app.apiUrl}:3057/module/_update/status/deactive?${queryString}`;
    const response = await $fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.app.apiKey,
        'authorization': headers['authorization'],
        'x-client-id': headers['x-client-id'],
        'x-timestamp': timestamp,
        'x-hmac-signature': hmacSignature
      },
      body: JSON.stringify(body)
    });
    // Return the exact response structure received
    return response;
  } catch (e) {
    return e.data;
  }
});
