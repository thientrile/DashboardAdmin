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
		isEditRole: false
	}),

	actions: {
		async getSrc({ page = 1, limit = 30, search = '' }) {
			try {
				const offset = (page - 1) * limit;
				const query = { limit, offset, search };
				const queryString = new URLSearchParams(query).toString();
				const url = `/api/admin/rbac/get_resources?${queryString}`;
				const request = await $fetch(url);

				if (request.metadata) {
					this.selectSrc = null;
					this.resources = request.metadata;
				} else if (request.code == 403) {
					useUserStore().isPermission = true;
				} else if (request.code == 401) {
					await useUserStore().refreshCookie();
				}
			} catch (e) {
				console.error(e);
				return false;
			}
		},
		async createSrc(name, description) {
			try {
				const req = await $fetch('/api/admin/rbac/post_resource', {
					method: 'POST',
					body: {
						name,
						description
					}
				});
				if (req.code == 401) {
					await useUserStore().refreshCookie();
				} else if (req.code == 403) {
					useUserStore().isPermission = true;
				} else if (req.metadata) {
					this.getSrc();
					return true;
				}
				return false;
			} catch (e) {
				console.error(e);
				return false;
			}
		},
		async createRole(body) {
			try {
				const req = await $fetch('/api/admin/rbac/post_role', {
					method: 'POST',
					body
				});

				if (req.code == 401) {
					await useUserStore().refreshCookie();
					// this.createRole(body);
				} else if (req.code == 403) {
					useUserStore().isPermission = true;
				} else if (req.metadata) {
					this.roles = req.metadata;
					return true;
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
				const req = await $fetch('/api/admin/rbac/get_roles');
				useGeneralStore().IsOverLoading = false;
				if (req.code == 401) {
					await useUserStore().refreshCookie();
					// this.getAllListRoles();
				} else if (req.code == 403) {
					useUserStore().isPermission = true;
				} else if (req.metadata) {
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
			try {
				const req = await $fetch('/api/admin/rbac/patch_role', {
					method: 'DELETE',
					body
				});
				if (req.code == 401) {
					await useUserStore().refreshCookie();
					// this.deleteGrantToRole(body);
				} else if (req.code == 403) {
					useUserStore().isPermission = true;
				} else if (req.metadata) {
					return true;
				}
				return false;
			} catch (e) {
				console.error(e);
				return false;
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
					// this.addGrantToRole(body);
				} else if (req.code == 403) {
					useUserStore().isPermission = true;
				} else if (req.metadata) {
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
					// this.setGrantToRole(body);
				} else if (req.code == 403) {
					useUserStore().isPermission = true;
				} else if (req.metadata) {
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
				const req = await $fetch('/api/admin/rbac/del_role', {
					method: 'DELETE',
					body
				});

				if (req.code == 401) {
					await useUserStore().refreshCookie();
					// this.deleteRole(body);
				} else if (req.code == 403) {
					useUserStore().isPermission = true;
				} else if (req.metadata) {
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
				const req = await $fetch('/api/admin/rbac/del_resource', {
					method: 'DELETE',
					body
				});

				if (req.code == 401) {
					await useUserStore().refreshCookie();
					// this.deleteRole(body);
				} else if (req.code == 403) {
					useUserStore().isPermission = true;
				} else if (req.metadata) {
					this.roles = req.metadata;
					return true;
				}
				return false;
			} catch (e) {
				console.error(e);
				return false;
			}
		},
		async SyncSrc() {
			try {
				const req = await $fetch('/api/admin/get_import_resource', {
					method: 'GET'
				});

				if (req.code == 401) {
					await useUserStore().refreshCookie();
					// this.deleteRole(body);
				} else if (req.code == 403) {
					useUserStore().isPermission = true;
				} else if (req.metadata) {
					return true;
				}
			} catch (e) {
				console.error(e);
				return false;
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
