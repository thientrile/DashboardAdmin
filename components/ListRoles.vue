<!-- @format -->

<template>
	<div class="ms-2 min-w-[200px] h-full text-xs">
		<nav class="flex flex-col border-r-2">
			<div class="flex ms-5 w-full">
				<button
					type="button"
					@click="isNew = !isNew"
					class="rounded-sm my-1 flex items-center p-1.5 hover:bg-gray-200 dark:hover:text-black">
					<span class="text-sm font-bold text-nowrap">New Role</span>
					<Icon
						name="ic:baseline-plus"
						class="font-bold text-xl" />
				</button>
				<button
					class="rounded-sm flex items-center p-1.5 hover:bg-gray-200 dark:hover:text-black"
					@click="filter.isshow = !filter.isshow">
					<Icon
						name="uil:filter"
						class="font-bold text-xl" />
				</button>
				<button
					type="button"
					@click="getlistRole"
					class="rounded-sm flex items-center p-1.5 hover:bg-gray-200 dark:hover:text-black">
					<Icon
						name="eos-icons:loading"
						v-if="isLoading"
						class="font-bold text-xl" />
					<Icon
						name="mdi:reload"
						v-else
						class="font-bold text-xl" />
					<span>({{ listRoles.length }})</span>
				</button>
			</div>

			<ul class="ms-5">
				<li v-show="filter.isshow">
					<div class="flex gap-3">
						<div class="flex items-center">
							<input
								id="filterIsRoot"
								name="filterIsRoot"
								type="checkbox"
								@change="roleData"
								class="cursor-pointer"
								v-model="filter.isRoot" />
							<label
								for="filterIsRoot"
								class="cursor-pointer"
								>Root</label
							>
						</div>
						<div class="flex items-center">
							<input
								id="filterIsActive"
								type="checkbox"
								class="cursor-pointer"
								@change="roleData"
								v-model="filter.isActive" />
							<label
								for="filterIsActive"
								class="cursor-pointer"
								>Active</label
							>
						</div>
						<div class="flex items-center">
							<input
								type="text"
								placeholder="Search"
								v-model="filter.search"
								@keyup="roleData"
								class="py-1.4 w-full" />
						</div>
					</div>
				</li>
				<li
					v-show="isNew"
					class="flex items-center w-full rounded-md border hover:bg-gray-200">
					<div class="flex items-center gap-2 w-full cursor-pointer">
						<span class="relative w-[15em]">
							<input
								placeholder="Enter new role"
								type="text"
								class="py-1.5 w-full"
								@keyup.enter="newRole"
								v-model="roleNameNew"
								:disabled="isLoading" />
							<span
								v-show="isErrorNewrole"
								class="absolute top-[-10px] left-0 text-red-500"
								>Role already exists</span
							>
						</span>
						<div v-if="isLoading">
							<Icon name="line-md:loading-loop" />
						</div>
						<button
							type="button"
							v-else
							class="hover:bg-gray-200 w-10"
							@click="
								isNew = false;
								roleNameNew = '';
								isErrorNewrole = false;
							">
							<Icon
								name="material-symbols:close"
								class="font-bold" />
						</button>
					</div>
				</li>
			</ul>

			<ul class="ms-5 max-h-80 overflow-hidden overflow-y-auto">
				<li
					@click="isNew = false"
					v-for="(role, idx) in listRoles"
					class="flex items-center rounded-md border hover:bg-gray-200 dark:hover:text-black"
					:class="
						role.slug == admin.selectRol ? 'border-b-gray-500 bg-gray-400' : ''
					">
					<div
						class="flex items-center w-full cursor-pointer"
						@click="admin.selectRol = role.slug">
						<span v-show="role.status == 'active'">
							<Icon
								name="icon-park-outline:dot"
								class="py-1.5 text-green-500" />
						</span>

						<span v-if="role.isEdit">
							<input
								class="py-1.5 w-full"
								type="text"
								v-model="role.newName"
								@keyup.enter="editRoleName(role._id, idx)" />
						</span>
						<span
							class="py-1.5 max-w-[10em] overflow-hidden text-ellipsis whitespace-nowrap"
							v-else>
							{{ role.name }}
						</span>
					</div>
					<div
						v-show="!role.isRoot"
						v-if="!role.isLoading">
						<div
							class="flex"
							v-if="!role.isEdit">
							<button
								type="button"
								@click="role.isEdit = true"
								class="flex justify-center p-1.5 items-center min-w-[0.5em] hover:bg-gray-300">
								<Icon
									name="solar:pen-bold"
									class="text-xs" />
							</button>
							<button
								type="button"
								@click="deleteRole(role._id, idx)"
								class="flex justify-center p-1.5 items-center min-w-[0.5em] hover:bg-gray-300">
								<Icon
									name="tabler:trash"
									class="text-xs text-red-300" />
							</button>
						</div>
						<div
							v-else
							class="w-[2em] flex justify-center items-center cursor-pointer"
							@click="
								role.isEdit = false;
								role.isError = false;
								role.newName = role.name;
							">
							<Icon name="material-symbols:close" />
						</div>
					</div>
					<div v-else>
						<Icon name="line-md:loading-loop" />
					</div>
				</li>
			</ul>
		</nav>
	</div>
</template>

<script setup>
	const router = useRouter();
	import { useAdminStore } from '~/store/admin';
	const listRoles = ref([]);
	const roleNameNew = ref('');
	const admin = useAdminStore();
	const isNew = ref(false);
	const isLoading = ref(false);
	const isErrorNewrole = ref(false);
	const filter = ref({
		isshow: true,
		isRoot: true,
		isActive: true,
		search: ''
	});
	const getlistRole = async () => {
		isLoading.value = true;
		await admin.getAllListRoles();
		isLoading.value = false;
	};
	onMounted(async () => {
		await admin.getAllListRoles();
	});
	watch(
		() => admin.roles,

		() => {
			roleData();
		}
	);

	const roleData = () => {
		listRoles.value = admin.roles
			.map((role) => ({
				_id: role._id,
				name: role.name,
				slug: role.slug,
				newName: role.name,
				status: role.status,
				isRoot: role.isRoot,
				isEdit: false,
				isError: false,
				isLoading: false
			}))
			.filter((item) => {
				return (
					item.isRoot == filter.value.isRoot &&
					(item.status == 'active') == filter.value.isActive &&
					item.name.toLowerCase().includes(filter.value.search.toLowerCase())
				);
			});
	};
	const newRole = async () => {
		if (!roleNameNew.value) {
			isErrorNewrole.value = false;
			isNew.value = false;
			roleNameNew.value = '';
			return;
		}
		const body = {
			name: roleNameNew.value
		};
		isLoading.value = true;
		const result = await admin.createRole(body);

		isLoading.value = false;
		if (result) {
			isErrorNewrole.value = false;
			isNew.value = false;
			roleNameNew.value = '';
		} else {
			isErrorNewrole.value = true;
		}
	};
	const deleteRole = async (id, idx) => {
		const body = {
			roleId: id
		};
		listRoles.value[idx].isLoading = true;
		await admin.deleteRole(body);
		listRoles.value[idx].isLoading = false;
	};
	const editRoleName = async (id, idx) => {
		if (listRoles.value[idx].newName == listRoles.value[idx].name) {
			listRoles.value[idx].isEdit = false;
			return false;
		}
	};
</script>
