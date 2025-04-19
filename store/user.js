/** @format */
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    isAuthenticated: false,
    profile: {
      email: "",
      name: "",
      phone: "",
      role: "",
      id: "",
    },
    isOverLogout: false,
    isPermission: false,
  }),

  actions: {
    async login(body) {
      console.log("🚀 ~ login ~ body:", body);
      const { handleApiError } = useApiErrorHandler();
      try {
        const req = await $fetch("/api/access/login", {
          method: "POST",
          body: JSON.stringify(body),
        });
        console.log("🚀 ~ login ~ req:", req);

        if (req.metadata) {
          const { tokens, uniqueId } = req.metadata;
          await this.authenticate(tokens, uniqueId);
          return true;
        }
        return false;
      } catch (error) {
        handleApiError(error);
        return false;
      }
    },

    async register(body) {
      const { handleApiError } = useApiErrorHandler();
      try {
        const req = await $fetch("/api/access/register", {
          method: "POST",
          body: JSON.stringify(body),
        });

        if (req.metadata) {
          const { tokens, uniqueId } = req.metadata;
          await this.authenticate(tokens, uniqueId);
          return true;
        }
        return false;
      } catch (error) {
        handleApiError(error);
        return false;
      }
    },

    async authenticate(tokens, uniqueId) {
      try {
        this.isAuthenticated = true;
        useCookie("c_user").value = uniqueId;
        localStorage.setItem("authorization", tokens.accessToken);
        localStorage.setItem("x-rtoken-id", tokens.refreshToken);
        localStorage.setItem("x-client-id", uniqueId);
      } catch (error) {
        console.error("Authenticate error:", error);
      }
    },

    async logout() {
      const { handleApiError } = useApiErrorHandler();
      try {
        const req = await $fetch("/api/access/logout", {
          method: "POST",
          headers: {
            "x-rtoken-id": localStorage.getItem("x-rtoken-id"),
            "x-client-id": localStorage.getItem("x-client-id"),
          },
        });

        if (req.code === 401) {
          await this.refreshCookie();
          return false;
        }

        if (req.metadata) {
          this.isAuthenticated = false;
          this.profile = {};
          localStorage.removeItem("authorization");
          localStorage.removeItem("x-rtoken-id");
          localStorage.removeItem("x-client-id");
          navigateTo("/");
          return true;
        }
      } catch (error) {
        handleApiError(error);
        return false;
      }
    },

    async refreshCookie() {
      const { handleApiError } = useApiErrorHandler();
      try {
        const req = await $fetch("/api/access/refresh", {
          method: "POST",
          headers: {
            "x-rtoken-id": localStorage.getItem("x-rtoken-id"),
            "x-client-id": localStorage.getItem("x-client-id"),
          },
        });

        if (req.metadata) {
          const { tokens, uniqueId } = req.metadata;
          await this.authenticate(tokens, uniqueId);
          return true;
        } else if (req.code === 401) {
          this.isAuthenticated = false;
          this.profile = {};
          return false;
        }
      } catch (error) {
        handleApiError(error);
        return false;
      }
    },

    async verify() {
      const { handleApiError } = useApiErrorHandler();
      try {
        const req = await $fetch("/api/access/verify", {
          method: "POST",
          headers: {
            authorization: localStorage.getItem("authorization"),
            "x-client-id": localStorage.getItem("x-client-id"),
          },
        });

        if (req.metadata) {
          this.profile = req.metadata;
          this.isAuthenticated = true;
          return true;
        } else if (req.code === 401) {
          const result = await this.refreshCookie();
          if (result) return await this.verify();
        }
        return false;
      } catch (error) {
        handleApiError(error);
        return false;
      }
    },

    async getinfo() {
      const { handleApiError } = useApiErrorHandler();
      try {
        const req = await $fetch("/api/user/info", {
          method: "POST",
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
      } catch (error) {
        handleApiError(error);
        return false;
      }
    },

    checkAuth() {
      this.isAuthenticated = true;
    },
  },

  getters: {
    isLogin: (state) => state.isAuthenticated,
  },
});
