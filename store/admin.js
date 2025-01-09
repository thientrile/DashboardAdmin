/** @format */

import { defineStore } from 'pinia';
import { useUserStore } from './user';
import { useGeneralStore } from './general';

export const useAdminStore = defineStore('admin', {
	state: () => ({
		roles: [],
		resources: [],
		selectSrc: null,
		selectRol: null,
		isNewRole: false,
		isEditRole: false,
		options: {}
	}),

	actions: {
		async getSrc({ page = 1, limit = 30, search = '' }) {
			const offset = (page - 1) * limit;
			const query = { limit, offset, search };
			const queryString = new URLSearchParams(query).toString();
			const url = `/api/admin/resource/get_all?${queryString}`;
			const request = await $fetch(url);
			console.log('🚀 ~ getSrc ~ request:', request);

			if (request.metadata) {
				this.options = request.options;
				this.selectSrc = null;
				this.resources = request.metadata;
			}
			if (request.code == 403) {
				useUserStore().isPermission = true;
			}
			if (request.code == 401) {
				await useUserStore().refreshCookie();
			}
		},
		async createSrc(body) {
			const req = await $fetch('/api/admin/resource/create_resource', {
				method: 'POST',
				body
			});
			if (req.metadata) {
				console.log('🚀 ~ createSrc ~ req.metadata:', req.metadata);
				this.resources.unshift(req.metadata);
				return true;
			}
			if (req.code == 401) {
				await useUserStore().refreshCookie();
			}
			if (req.code == 403) {
				useUserStore().isPermission = true;
			}
		},
		async createRole(body) {
			try {
				const req = await $fetch('/api/admin/role/create_role', {
					method: 'POST',
					body
				});
				if (req.metadata) {
					this.roles = req.metadata;
					return true;
				}
				if (req.code == 401) {
					await useUserStore().refreshCookie();
				}
				if (req.code == 403) {
					useUserStore().isPermission = true;
				}

				return false;
			} catch (e) {
				console.error(e);
				return false;
			}
		},
		async getAllListRoles() {
			try {
				useGeneralStore().IsOverLoading = true;
				const req = await $fetch('/api/admin/role/get_all');
				useGeneralStore().IsOverLoading = false;
				if (req.code == 401) {
					await useUserStore().refreshCookie();
					return false;
				}
				if (req.code == 403) {
					useUserStore().isPermission = true;
				}
				if (req.metadata) {
					this.roles = req.metadata;
					this.selectSrc = null;
					this.selectRol =
						this.selectRol == null ? this.roles[0].slug : this.selectRol;
					return true;
				}
				return false;
			} catch (e) {
				console.error(e);
				return false;
			}
		},
		async deleteGrantToRole(body) {
			const req = await $fetch('/api/admin/rbac/delete_grants', {
				method: 'POST',
				body
			});
			if (req.metadata) {
				return true;
			}
			if (req.code == 401) {
				await useUserStore().refreshCookie();
				return false;
			}
			if (req.code == 403) {
				useUserStore().isPermission = true;
			}
		},
		async addGrantToRole(body) {
			try {
				const req = await $fetch('/api/admin/rbac/patch_grants', {
					method: 'PATCH',
					body
				});

				if (req.code == 401) {
					await useUserStore().refreshCookie();
					return false;
				}
				if (req.code == 403) {
					useUserStore().isPermission = true;
				}
				if (req.metadata) {
					this.roles = req.metadata;
					return true;
				}
				return false;
			} catch (e) {
				console.error(e);
				return false;
			}
		},
		async setGrantToRole(body) {
			try {
				useGeneralStore().IsOverLoading = true;
				const req = await $fetch('/api/admin/rbac/set_grants', {
					method: 'PATCH',
					body
				});

				useGeneralStore().IsOverLoading = false;

				if (req.code == 401) {
					await useUserStore().refreshCookie();
					return false;
				}
				if (req.code == 403) {
					useUserStore().isPermission = true;
				}
				if (req.metadata) {
					this.getAllListRoles();
					return true;
				}
				return false;
			} catch (e) {
				console.error(e);
				return false;
			}
		},
		async deleteRole(body) {
			try {
				const req = await $fetch('/api/admin/role/del_role', {
					method: 'DELETE',
					body
				});

				if (req.code == 401) {
					await useUserStore().refreshCookie();
					return false;
				}
				if (req.code == 403) {
					useUserStore().isPermission = true;
				}
				if (req.metadata) {
					this.roles = req.metadata;
					return true;
				}
				return false;
			} catch (e) {
				console.error(e);
				return false;
			}
		},
		async deleteSrc(body) {
			try {
				const req = await $fetch('/api/admin/resource/delete_resource', {
					method: 'DELETE',
					body
				});
				if (req.metadata) {
					return true;
				}
				if (req.code == 401) {
					await useUserStore().refreshCookie();
					return false;
				}
				if (req.code == 403) {
					useUserStore().isPermission = true;
				}

				return false;
			} catch (e) {
				console.error(e);
				return false;
			}
		},
		async SyncSrc() {
			try {
				const req = await $fetch('/api/admin/resource/import_resource', {
					method: 'GET'
				});
				if (req.metadata) {
					return true;
				}
				if (req.code == 401) {
					await useUserStore().refreshCookie();
					return false;
				}
				if (req.code == 403) {
					useUserStore().isPermission = true;
				}
			} catch (e) {
				console.error(e);
				return false;
			}
		},
		async updateSrc(body) {
			const req = await $fetch('/api/admin/resource/patch_resource', {
				method: 'PATCH',
				body
			});
			if (req.metadata) {
				return true;
			}
			if (req.code == 401) {
				await useUserStore().refreshCookie();
				return false;
			}
			if (req.code == 403) {
				useUserStore().isPermission = true;
			}
		},
		async updateRole(body) {
			const req = await $fetch('/api/admin/role/edit_role', {
				method: 'PATCH',
				body
			});
			if (req.metadata) {
				return true;
			}
			if (req.code == 401) {
				await useUserStore().refreshCookie();
				return false;
			}
			if (req.code == 403) {
				useUserStore().isPermission = true;
			}
		}
	},

	getters: {
		selectSRC: (state) => {
			return state.resources.filter((item) => item.slug == state.selectSrc);
		},

		selectRole: (state) => {
			return state.roles.filter((item) => item.slug == state.selectRol);
		}
	}
});
