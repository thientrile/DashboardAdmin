/** @format */

import { useUserStore } from '~/stores/user.js';
export default defineNuxtRouteMiddleware((to, from) => {
	const user = useUserStore();

	if (!user.isLogin) {
		// console.log("no esta autenticado");
		return navigateTo('/auth');
	}
});
