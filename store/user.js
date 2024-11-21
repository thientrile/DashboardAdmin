/** @format */

import { defineStore } from 'pinia';
export const useUserStore = defineStore('user', {
	state: () => ({
		isAuthenticated: false,
		profile: {
			username: null,
			role: null,
			slug: null,
			menu: null,			
		},
		c_user: null,
		token: {
			accessToken: null,
			refreshToken: null
		}
	}),

	actions: {
		async authenticate(tokens, uniqueId, profile = null) {
		
			this.profile = profile;
			this.token = tokens;
			this.c_user = uniqueId;
			this.isAuthenticated = true;
			useCookie('accessToken').value = tokens.accessToken;
			useCookie('refreshToken').value = tokens.refreshToken;
			useCookie('c_user').value = uniqueId;
		},
		async logout() {
			this.isAuthenticated = false;
			this.profile = null;
			this.c_user = null;
			this.token = null;

			// Clear tokens from cookies
			useCookie('accessToken').value = null;
			useCookie('refreshToken').value = null;
			useCookie('c_user').value = null;
			// }
		},

		loadFromCookies() {
			useCookie('c_user');
			this.token.accessToken = useCookie('accessToken').value;
			this.token.refreshToken = useCookie('refreshToken').value;
			this.isAuthenticated = !!this.token.accessToken;
			this.c_user = useCookie('c_user').value;
		}
	},
	getters: {
		isLogin: (state) => !!state.accessToken // Check if the user has a valid token
	}
});
