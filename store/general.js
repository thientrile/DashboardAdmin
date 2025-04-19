/** @format */
import crypto from 'node:crypto';
import { defineStore } from 'pinia';
import { useUserStore } from './user';
export const useGeneralStore = defineStore('general', {
	state: () => ({
		IsOverLoading: false,
		IsError: false,
		ErrorMessage: '',
		paths: [],
		menuArrs: [],
		menu: {},
		breadcrumb: [],
		actions: {
			create: false,
			read: false,
			update: false,
			delete: false
		},
		icons: [],
		redirectPath: ''
	}),

	actions: {
		async getMenu() {
			const req = await $fetch('/api/admin/_getMenu', {
				method: 'GET',
				 headers: {
          authorization: localStorage.getItem("authorization"),
          "x-client-id": localStorage.getItem("x-client-id"),
        },
			});
			if (req.metadata) {
				this.menuArrs = req.metadata.map((item) => {
					return {
						...item
					};
				});
				return true;
			}
			if (req.code == 401) {
				await useUserStore().refreshCookie();
				return false;
			}
			if (req.code == 403) {
				useUserStore().isPermission = true;
				return false;
			}
		},
		async getIcon(search) {
			const req = await $fetch(
				`https://api.iconify.design/search?query=${search}&limit=999`,
				{
					method: 'GET'
				}
			);
			this.icons = req.icons;
			return req.icons;
		},
		async callApi(path, method = 'GET', body = {}, query = {}, type = 0) {
			try {
				const config = useRuntimeConfig();
				const queryString = query ? new URLSearchParams(query).toString() : '';
				const timestamp = Date.now();

				// Generate raw string for HMAC
				const rawString = method.toUpperCase() === 'GET' ? query : body;
				const hmacSignature = crypto
					.createHmac('sha256', config.app.secretKey)
					.update(`${timestamp}${JSON.stringify(rawString)}`)
					.digest('hex');

				// Shared headers
				const headers = {
					'Content-Type': 'application/json',
					'x-api-key': config.app.apiKey,
					'x-timestamp': timestamp,
					'x-hmac-signature': hmacSignature
				};

				// Extend headers based on type
				if (type === 0) {
					headers['x-rtoken-id'] = useCookie('x-rtoken-id').value;
				} else if (type === 1) {
					headers['x-client-id'] = useCookie('x-client-id').value;
					headers['authorization'] = useCookie('authorization').value;
				}

				// Configure request options
				const options = {
					method: method.toUpperCase(),
					headers,
					...(method.toUpperCase() !== 'GET' && { body: JSON.stringify(body) })
				};

				// Construct full URL
				const url = `${config.app.apiUrl}${path}${
					queryString ? `?${queryString}` : ''
				}`;

				// Make API call
				return await $fetch(url, options);
			} catch (e) {
				return e.data;
			}
		}
	},
	getters: {}
});
