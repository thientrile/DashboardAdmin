/** @format */
import { defineStore } from 'pinia';
export const useUserStore = defineStore('user', {
	state: () => ({
		isAuthenticated: false,
		profile: {
			email: '',
			name: '',
			phone: '',
			role: '',
			id: ''
		},
		isOverLogout: false,
		isPermission: false
	}),

	actions: {
		async login(body) {
			const req = await $fetch('/api/access/login', {
				method: 'POST',
				body: JSON.stringify(body)
			});

			if (req.metadata) {
				const { tokens, uniqueId } = req.metadata;
				await this.authenticate(tokens, uniqueId);
				return true;
			}
			return false;
		},
		async register(body) {
			const req = await $fetch('/api/access/register', {
				method: 'POST',
				body: JSON.stringify(body)
			});
			if (req.metadata) {
				const { tokens, uniqueId } = req.metadata;
				await this.authenticate(tokens, uniqueId);
				return true;
			}
			return false;
		},

		async authenticate(tokens, uniqueId) {
			this.isAuthenticated = true;
			useCookie('authorization', {
				maxAge: 60 * 60 * 24 * 1
			}).value = tokens.accessToken;
			useCookie('x-rtoken-id', {
				maxAge: 60 * 60 * 24 * 7
			}).value = tokens.refreshToken;
			useCookie('x-client-id', {
				maxAge: 60 * 60 * 24 * 7
			}).value = uniqueId;
		},
		async logout() {
			const req = await $fetch('/api/access/logout', {
				method: 'POST'
			});

			if (req.code === 401) {
				this.refreshCookie();
				return false;
			}
			if (req.metadata) {
				// Clear tokens from cookies
				this.isAuthenticated = false;
				this.isAuthenticated = false;
				this.profile = {};
				useCookie('authorization', { maxAge: -1 }).value = null;
				useCookie('x-rtoken-id', { maxAge: -1 }).value = null;
				useRouter().push('/auth');
				useCookie('x-client-id', { maxAge: -1 }).value = null;
				return true;
			}
		},

		async refreshCookie() {
			let req = await $fetch('/api/access/refresh', {
				method: 'POST'
			});
			if (req.metadata) {
				const { tokens, uniqueId } = req.metadata;
				await this.authenticate(tokens, uniqueId);
				return true;
			} else if (req.code === 401) {
				this.isAuthenticated = false;
				this.isAuthenticated = false;
				this.profile = {};
				useCookie('authorization', { maxAge: -1 }).value = null;
				useCookie('x-rtoken-id', { maxAge: -1 }).value = null;
				useCookie('x-client-id', { maxAge: -1 }).value = null;
				useRouter().push('/auth');
				return false;
			}
		},
		async verify() {
			if (!useCookie('x-client-id').value) {
				this.isAuthenticated = false;
				this.isAuthenticated = false;
				this.profile = {};
				useCookie('authorization', { maxAge: -1 }).value = null;
				useCookie('x-rtoken-id', { maxAge: -1 }).value = null;
				useCookie('x-client-id', { maxAge: -1 }).value = null;
				useRouter().push('/auth');
				return false;
			}

			let req = await $fetch('/api/access/verify')
		
			if (req.metadata) {
				this.profile = req.metadata;
				this.isAuthenticated = true;
				return true;
			} else if (req.code === 401) {
				const reslut = await this.refreshCookie();
				if (reslut) {
					await this.verify();
				}
				return false;
			}
		},
		async getinfo() {
			let req = await $fetch('/api/user/info', {
				method: 'POST'
			});
			if (req.metadata) {
				this.profile = req.metadata;

				this.isAuthenticated = true;
				return true;
			} else if (req.code === 403) {
				this.isPermission = true;
				return false;
			} else if (req.code === 401) {
				await this.refreshCookie();
			}
			return false;
		},

		checkAuth() {
			this.isAuthenticated = true;
		}
	},
	getters: {
		isLogin: (state) => state.isAuthenticated // Check if the user has a valid token
	}
});
