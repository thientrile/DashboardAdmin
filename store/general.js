/** @format */

import { defineStore } from 'pinia';
export const useGeneralStore = defineStore('general', {
	state: () => ({
		IsOverLoading: false,
    IsError: false,
    ErrorMessage: '',
			
	}),

	actions: {
	
	},
	getters: {
	
	}
});
