/** @format */


import { useUserStore } from "~/store/user";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useUserStore();



  if (! useCookie("c_user").value) {	
	  return navigateTo("/");
	}

});
