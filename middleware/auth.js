/** @format */
import { useUserStore } from '~/store/user';

export default defineNuxtRouteMiddleware(async (to, from) => {
	const user = useUserStore();
	
	
	if (!useCookie('x-client-id').value) {
		user.isAuthenticated = false;
		user.isAuthenticated = false;
		user.profile = {};
		useCookie('authorization', { maxAge: -1 }).value = null;
		useCookie('x-rtoken-id', { maxAge: -1 }).value = null;
		useCookie('x-client-id', { maxAge: -1 }).value = null;

		return useRouter().push('/auth');
	}
});
