/** @format */

import { defineStore } from "pinia";
import { useUserStore } from "./user";
import { useGeneralStore } from "./general";

export const useAdminStore = defineStore("admin", {
  state: () => ({
    roles: [],
    resources: [],
    selectSrc: null,
    selectRol: null,
    isNewRole: false,
    isEditRole: false,
    options: {},
    modules: [],
  }),

  actions: {
    async getSrc({ page = 1, limit = 30, search = "" }) {
      const offset = (page - 1) * limit;
      const query = { limit, offset, search };
      const queryString = new URLSearchParams(query).toString();
      const url = `/api/admin/resource/get_all?${queryString}`;
      const request = await $fetch(url,{
        method: "post",
        headers: {
          authorization: localStorage.getItem("authorization"),
          "x-client-id": localStorage.getItem("x-client-id"),
        },
      });

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
      const req = await $fetch("/api/admin/resource/create_resource", {
        headers: {
          authorization: localStorage.getItem("authorization"),
          "x-client-id": localStorage.getItem("x-client-id"),
        },
        method: "POST",
        body,
      });
      if (req.metadata) {

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
        const req = await $fetch("/api/admin/role/create_role", {
          headers: {
            authorization: localStorage.getItem("authorization"),
            "x-client-id": localStorage.getItem("x-client-id"),
          },
          method: "POST",
          body,
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
        const req = await $fetch("/api/admin/role/get_all",{
          headers: {
            authorization: localStorage.getItem("authorization"),
            "x-client-id": localStorage.getItem("x-client-id"),
          },
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
      const req = await $fetch("/api/admin/rbac/delete_grants", {
        headers: {
          authorization: localStorage.getItem("authorization"),
          "x-client-id": localStorage.getItem("x-client-id"),
        },
        method: "POST",
        body,
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
        const req = await $fetch("/api/admin/rbac/add_grants", {
          headers: {
            authorization: localStorage.getItem("authorization"),
            "x-client-id": localStorage.getItem("x-client-id"),
          },
          method: "PATCH",
          body,
        });

        if (req.metadata) {
          this.roles = req.metadata;
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
    async setGrantToRole(body) {
      try {
        useGeneralStore().IsOverLoading = true;
        const req = await $fetch("/api/admin/rbac/set_grants", {
          headers: {
            authorization: localStorage.getItem("authorization"),
            "x-client-id": localStorage.getItem("x-client-id"),
          },
          method: "PATCH",
          body,
        });

        if (req.metadata) {
          this.getAllListRoles();
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
    async deleteRole(body) {
      try {
        const req = await $fetch("/api/admin/role/del_role", {
          headers: {
            authorization: localStorage.getItem("authorization"),
            "x-client-id": localStorage.getItem("x-client-id"),
          },
          method: "DELETE",
          body,
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
        const req = await $fetch("/api/admin/resource/delete_resource", {
          headers: {
            authorization: localStorage.getItem("authorization"),
            "x-client-id": localStorage.getItem("x-client-id"),
          },
          method: "DELETE",
          body,
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
        const req = await $fetch("/api/admin/resource/import_resource", {
          headers: {
            authorization: localStorage.getItem("authorization"),
            "x-client-id": localStorage.getItem("x-client-id"),
          },
          method: "GET",
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
      const req = await $fetch("/api/admin/resource/put_resource", {
        headers: {
          authorization: localStorage.getItem("authorization"),
          "x-client-id": localStorage.getItem("x-client-id"),
        },
        method: "PUT",
        body,
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
    async addAttr(body){
      const req = await $fetch("/api/admin/resource/patch_attr", {
        headers: {
          authorization: localStorage.getItem("authorization"),
          "x-client-id": localStorage.getItem("x-client-id"),
        },
        method: "PATCH",
        body,
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
      const req = await $fetch("/api/admin/role/edit_role", {
        headers: {
          authorization: localStorage.getItem("authorization"),
          "x-client-id": localStorage.getItem("x-client-id"),
        },
        method: "PATCH",
        body,
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
    // handle page module
    async getlistModules(filter) {
      const offset = (filter.page - 1) * filter.limit;

      const query = { limit: filter.limit, offset, search: filter.search };
      const queryString = new URLSearchParams(query).toString();
      const req = await $fetch(`/api/admin/module/get_module?${queryString}`, {
        headers: {
          authorization: localStorage.getItem("authorization"),
          "x-client-id": localStorage.getItem("x-client-id"),
        },
        method: "POST",
      });

      if (req.metadata) {
        this.modules = req.metadata;
        this.modules = this.modules.map((item) => ({
          ...item,
          edit: false,
          isLoading: false,
        }));
        return req.options;
      }
      if (req.code == 401) {
        await useUserStore().refreshCookie();
        return false;
      }
      if (req.code == 403) {
        useUserStore().isPermission = true;
      }
    },
    async createModule(body) {
      const req = await $fetch("/api/admin/module/post_module", {
        headers: {
          authorization: localStorage.getItem("authorization"),
          "x-client-id": localStorage.getItem("x-client-id"),
        },
        method: "POST",
        body,
      });
      if (req.metadata) {
        await this.getlistModules({});
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
    async ActiveModule(body){
      const req = await $fetch("/api/admin/module/patch_status_active", {
        headers: {
          authorization: localStorage.getItem("authorization"),
          "x-client-id": localStorage.getItem("x-client-id"),
        },
        method: "POST",
        body,
      });
      if(req.metadata){
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
    async DeactiveModule(body){
      const req = await $fetch("/api/admin/module/patch_status_deactive", {
        headers: {
          authorization: localStorage.getItem("authorization"),
          "x-client-id": localStorage.getItem("x-client-id"),
        },
        method: "POST",
        body,
      });
      if(req.metadata){
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
    async DeleteModule(body){
      const req = await $fetch("/api/admin/module/del_md", {
        headers: {
          authorization: localStorage.getItem("authorization"),
          "x-client-id": localStorage.getItem("x-client-id"),
        },
        method: "POST",
        body,
      });
      if(req.metadata){
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
    async UpdateModule(body){
      console.log("🚀 ~ UpdateModule ~ body:", body)
      const req = await $fetch("/api/admin/module/update", {
        headers: {
          authorization: localStorage.getItem("authorization"),
          "x-client-id": localStorage.getItem("x-client-id"),
        },
        method: "POST",
        body,
      });
      if(req.metadata){
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
    }
    
  },

  getters: {
    selectSRC: (state) => {
      return state.resources.filter((item) => item.slug == state.selectSrc);
    },

    selectRole: (state) => {
      return state.roles.filter((item) => item.slug == state.selectRol);
    },
  },
});
