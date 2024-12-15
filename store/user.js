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
			id: '',
			avatar: '/avatar.jpg'
		},
		isOverLogout: false,
		isPermission: false
	}),

	actions: {
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
			localStorage.setItem('x-client-id', uniqueId);
		},
		async logout() {
			// Clear tokens from cookies
			const result = await $fetch('/api/access/logout');
			if (result.code !== 500) {
				this.isAuthenticated = false;
				useCookie('authorization', { maxAge: -1 }).value = null;
				useCookie('x-rtoken-id', { maxAge: -1 }).value = null;
				useCookie('x-client-id', { maxAge: -1 }).value = null;
				this.isAuthenticated = false;
				this.profile = {};

				navigateTo('/');
			}
		},

		async refreshCookie() {
			let req = await $fetch('/api/access/refresh');
			if (req.metadata) {
				const { tokens, uniqueId } = req.metadata;
				await this.authenticate(tokens, uniqueId);
			} else if (req.code === 401 && this.isAuthenticated) {
				this.isOverLogout = true;
				this.logout();
			} else if (req.code == 429) {
				setTimeout(() => {
					this.refreshCookie();
				}, 60000);
			} else {
				this.isAuthenticated = false;
				this.logout();
			}
			// else if(this.isOverLogout){
			// 	this.isOverLogout = false;
			// 	await this.logout();
			// }
		},
		async verify() {
			let req = await $fetch('/api/access/verify');
			if (req.metadata) {
				this.isAuthenticated = true;
				return true;
			} else if (req.code === 401) {
				await this.refreshCookie();
				await this.verify();
			}
			return false;
		},
		async getinfo() {
			let req = await $fetch('/api/user/info');
			if (req.metadata) {
				this.profile = req.metadata;
				this.profile.avatar = this.profile.avatar || '/avatar.jpg';
				this.isAuthenticated = true;
				return true;
			} else if (req.code === 403) {
				this.isPermission = true;
				return false;
			} else if (req.code === 401) {
				await this.refreshCookie();
				await this.getinfo();
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
