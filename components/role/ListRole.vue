<!-- @format -->

<template>
	<div
		id="seach"
		class="sticky top-0 flex justify-between text-xs z-50 bg-white dark:bg-black shadow-sm p-3 rounded-2xl">
		<div class="flex items-center">
			<UInput
				v-model="filter.search"
				placeholder="Search"
				icon="ic:baseline-search"
				class="w-full" />
		</div>
		<div class="flex gap-2 justify-between items-center">
			<UTooltip text="Refresh list">
				<UButton
					@click="handleRefresh"
					:loading="isloading"
					icon="material-symbols:refresh"
					color="primary"
					variant="subtle" />
			</UTooltip>
			<div v-show="general.actions.create">
				<UTooltip text="Add new resource">
					<UButton
						@click="newRole.isShow = !newRole.isShow"
						icon="material-symbols:add"
						color="primary"
						variant="subtle" />
				</UTooltip>
			</div>
		</div>
	</div>
	<div
		class="mt-2 flex justify-around bg-white dark:bg-black shadow-2xl p-5 rounded-2xl">
		<table class="border-collapse border border-slate-400 w-full">
			<thead>
				<tr>
					<th class="border border-slate-300 ...">Name</th>
					<th class="border border-slate-300 ...">Description</th>
					<th class="border border-slate-300 ...">Parents</th>
					<th class="border border-slate-300 ...">Status</th>
					<th class="border border-slate-300 w-20">Actions</th>
				</tr>
			</thead>
			<tbody>
				<tr
					@keyup.enter="handleAddRole"
					v-show="newRole.isShow && general.actions.create">
					<td class="border border-slate-300">
						<div class="relative">
							<UInput
								placeholder="Enter new role name"
								@key-up.enter="handleAddRole"
								v-model="newRole.name"
								@input="newRole.error = ''"
								:color="newRole.error ? 'error' : 'primary'"
								class="w-full" />
							<span
								v-show="newRole.error !== ''"
								class="absolute top-[-0.8em] text-red-500 left-0 z-10 text-xs"
								>{{ newRole.error }}</span
							>
						</div>
					</td>
					<td class="border border-slate-300">
						<div>
							<UInput
								placeholder="Enter new role description"
								v-model="newRole.description"
								class="w-full" />
						</div>
					</td>
					<td class="border border-slate-300">
						<span>
							<USelect
								v-model="newRole.parents"
								class="w-full"
								multiple
								:items="parents" />
						</span>
					</td>
					<td class="border border-slate-300">
						<USelect
							v-model="newRole.status"
							:items="status"
							class="w-full" />
					</td>
					<td class="border border-slate-300 w-20">
						<div class="w-full flex">
							<div class="ms-2">
								<UTooltip text="Add New Role">
									<UButton
										:loading="newRole.isLoading"
										@click="handleAddRole"
										icon="material-symbols:add"
										color="neutral"
										variant="subtle" />
								</UTooltip>
							</div>
							<div class="ms-2">
								<UTooltip text="Cancel">
									<UButton
										@click="handleclear"
										icon="material-symbols:close"
										color="error"
										variant="subtle" />
								</UTooltip>
							</div>
						</div>
					</td>
				</tr>
				<tr
					v-for="(item, idx) in listRole"
					:id="`role_${item.slug}`"
					@keyup.enter="handlEdit(item, idx)">
					<td
						class="border border-slate-300 w-64"
						@dblclick="item.change.name = !item.change.name">
						<span
							v-if="item.change.name"
							class="relative">
							<UInput
								placeholder="Enter role name"
								v-model="item.name"
								class="w-full" />
						</span>
						<span
							class="w-full px-2"
							v-else>
							{{ item.name }}
						</span>
					</td>
					<td
						class="border border-slate-300 w-64"
						@dblclick="item.change.description = !item.change.description">
						<span
							class="w-full"
							v-if="item.change.description">
							<UInput
								id="newRole"
								placeholder="Enter role description"
								v-model="item.description"
								class="w-full" />
						</span>
						<span
							class="w-full"
							v-else>
							{{ item.description }}</span
						>
					</td>
					<td class="border border-slate-300 w-32">
						<USelect
							v-on:update:open="item.change.generate = true"
							v-model="item.parents"
							class="w-full"
							multiple
							:items="parents" />
					</td>
					<td class="border border-slate-300 w-30">
						<USelect
							:disabled="item.isRoot || !general.actions.update"
							@change="item.change.generate = true"
							v-model="item.status"
							:items="status"
							class="w-full" />
					</td>
					<td class="border border-slate-300 w-30">
						<div class="flex">
							<div
								class="ms-2"
								v-show="general.actions.update">
								<UTooltip
									:delay-duration="0"
									text="Access permission">
									<UButton
										:loading="item.isLoading"
										@click="router.push(`/roles/${item.name}`)"
										icon="icon-park-outline:permissions"
										color="neutral"
										variant="outline" />
								</UTooltip>
							</div>
							<div
								v-show="
									(item.change.name ||
										item.change.description ||
										item.change.generate) &&
									general.actions.update
								"
								class="ms-2">
								<UTooltip
									:loading="item.isLoading"
									:delay-duration="0"
									text="Save Role">
									<UButton
										color="success"
										:loading="item.isLoading"
										@click="handlEdit(item, idx)"
										icon="material-symbols:save-outline"
										variant="outline" />
								</UTooltip>
							</div>

							<div
								v-show="!item.isRoot && general.actions.delete"
								class="ms-2">
								<UTooltip
									:delay-duration="0"
									text="Delete Role">
									<UButton
										@click="handlDeletRole(item._id, idx)"
										:loading="item.isLoading"
										color="error"
										icon="tabler:trash"
										variant="outline" />
								</UTooltip>
							</div>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script setup>
	const router = useRouter();
	import { useGeneralStore } from '~/store/general';
	const general = useGeneralStore();
	import { useAdminStore } from '~/store/admin';
	const admin = useAdminStore();
	const isloading = ref(false);
	const filter = ref({
		search: '',
		limit: 10,
		page: 1
	});
	const newRole = ref({
		name: '',
		description: '',
		parents: [],
		status: 'active',
		isLoading: false,
		isShow: false,
		error: ''
	});
	const listRole = ref([]);
	const status = ref([
		{
			value: 'active',
			label: 'Active'
		},
		{
			value: 'inactive',
			label: 'Inactive'
		}
	]);
	const parents = ref([]);
	const handleRefresh = async () => {
		isloading.value = true;
		await admin.getAllListRoles();
		isloading.value = false;
	};
	onMounted(async () => {
		await handleRefresh();
	});
	watch(
		() => admin.roles,
		() => {
			listRole.value = admin.roles.map((item) => {
				return {
					...item,
					change: {
						name: false,
						description: false,
						generate: false
					},
					isLoading: false
				};
			});
			parents.value = listRole.value.map((item) => {
				return {
					value: item._id,
					label: item.name
				};
			});
		}
	);

	const handleAddRole = async () => {
		if (newRole.value.name == '') {
			newRole.value.error = 'Role name is required';
			return;
		}
		const body = {
			name: newRole.value.name.trim().replace(' ', '_'),
			description: newRole.value.description,
			parents: newRole.value.parents,
			status: newRole.value.status
		};
		newRole.value.isLoading = true;
		const result = await admin.createRole(body);
		if (result) {
			handleclear();
		} else {
			newRole.value.error = 'Role name is already exist';
		}
		newRole.value.isLoading = false;
	};
	const handleclear = () => {
		newRole.value.isShow = false;
		newRole.value.name = '';
		newRole.value.description = '';
		newRole.value.parents = [];
		newRole.value.status = 'active';
		newRole.value.error = '';
	};
	const handlDeletRole = async (id, idx) => {
		const body = {
			roleId: id
		};
		listRole.value[idx].isLoading = true;
		const result = await admin.deleteRole(body);
		if (result) {
			listRole.value.splice(idx, 1);
		}
		listRole.value[idx].isLoading = false;
	};
	const handlEdit = async (item, idx) => {
		const body = {
			_id: item._id,
			name: item.name.trim().replace(' ', '_'),
			description: item.description,
			parents: item.parents,
			status: item.status
		};
		listRole.value[idx].isLoading = true;
		await admin.updateRole(body);
		listRole.value[idx].isLoading = false;
		listRole.value[idx].change = {
			name: false,
			description: false,
			generate: false
		};
	};
	defineShortcuts({
		ctrl_s: async () => {
			if (general.actions.update) {
				const lists = listRole.value.map(async (item, idx) => {
					if (
						item.change.name ||
						item.change.description ||
						item.change.generate
					) {
						return await handlEdit(item, idx);
					}
				});
				await Promise.all(lists);
			}
		}
	});
</script>
