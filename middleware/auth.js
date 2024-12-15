/** @format */

export default defineNuxtRouteMiddleware(async (to, from) => {
	if (!useCookie('x-client-id').value) {
		return navigateTo('/auth');
	}
});
