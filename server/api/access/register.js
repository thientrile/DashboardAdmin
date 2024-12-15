/** @format */


// server/api/login.ts

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const body = await readBody(event);

try{
  const response = await $fetch(config.app.apiUrl + '/access/_register', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'x-api-key': config.app.apiKey
		},
		body: JSON.stringify(body)
	});
	// Return the exact response structure received
	return response;
}catch(e){
  return e.data;
}
	
});
