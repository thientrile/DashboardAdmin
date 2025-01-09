<!-- @format -->

<template>
	<Main>
		<div
			id="seach"
			class="sticky top-0 flex justify-between text-xs z-50 bg-white dark:bg-black shadow-sm p-3 rounded-2xl">
			<div class="flex items-center">
				<UInput
					placeholder="Search"
					icon="ic:baseline-search"
					class="w-full" />
			</div>
			<div class="flex gap-2 justify-between items-center">
				<UTooltip text="Refresh permissions">
					<UButton
						icon="material-symbols:refresh"
						:loading="isLoading"
						@click="refresh"
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
						<th
							class="border border-slate-300 text-center"
							rowspan="2">
							STT
						</th>
						<th
							class="border border-slate-300 text-center"
							rowspan="2">
							Name resource
						</th>
						<th
							class="border border-slate-300 text-center"
							colspan="4">
							Permissions
						</th>
						<th
							class="border border-slate-300 text-center"
							rowspan="2">
							Attribute
						</th>
						<th
							class="border border-slate-300 text-center"
							rowspan="2">
							Actions
						</th>
					</tr>
					<tr>
						<td class="border border-slate-300 text-center font-bold">Read</td>
						<td class="border border-slate-300 text-center font-bold">
							Create
						</td>
						<td class="border border-slate-300 text-center font-bold">
							Update
						</td>
						<td class="border border-slate-300 text-center font-bold">
							Delete
						</td>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="(item, idx) in role.grants"
						:key="idx">
						<td class="border border-slate-300 w-20 text-center">{{ idx }}</td>
						<td class="border border-slate-300 w-20">{{ item.name }}</td>
						<td class="border border-slate-300 ...">
							<div class="flex gap-2 px-2">
								<USwitch
									v-model="item.permissions.read.checked"
									:disabled="item.isRoot" />
								<URadioGroup
									:disabled="item.isRoot"
									v-show="item.permissions.read.checked"
									orientation="horizontal"
									v-model="item.permissions.read.isAny"
									:items="isAny" />
							</div>
						</td>
						<td class="border border-slate-300 ...">
							<div class="flex gap-2 px-2">
								<USwitch
									v-model="item.permissions.create.checked"
									:disabled="item.isRoot" />
								<URadioGroup
									:disabled="item.isRoot"
									v-show="item.permissions.create.checked"
									orientation="horizontal"
									v-model="item.permissions.create.isAny"
									:items="isAny" />
							</div>
						</td>
						<td class="border border-slate-300 ...">
							<div class="flex gap-2 px-2">
								<USwitch
									v-model="item.permissions.update.checked"
									:disabled="item.isRoot" />
								<URadioGroup
									:disabled="item.isRoot"
									v-show="item.permissions.update.checked"
									orientation="horizontal"
									v-model="item.permissions.update.isAny"
									:items="isAny" />
							</div>
						</td>
						<td class="border border-slate-300 ...">
							<div class="flex gap-2 px-2">
								<USwitch
									v-model="item.permissions.delete.checked"
									:disabled="item.isRoot" />
								<URadioGroup
									:disabled="item.isRoot"
									v-show="item.permissions.delete.checked"
									orientation="horizontal"
									v-model="item.permissions.delete.isAny"
									:items="isAny" />
							</div>
						</td>
						<td class="border border-slate-300 w-30">
							<div class="flex justify-between w-40">
								<USelect
									:disabled="item.isRoot"
									v-if="!item.isAdd"
									v-model="item.attributes"
									multiple
									:items="
										item.attributes.includes('*')
											? item.suggest_not
											: item.suggest
									"
									class="w-full overflow-hidden text-ellipsis whitespace-normal" />
								<UInput
									placeholder="Enter attribute"
									v-model="item.attrNewValue"
									v-else
									class="w-full" />
								<UTooltip
									text="New attribute"
									v-if="!item.isAdd">
									<UButton
										:disabled="item.isRoot"
										@click="item.isAdd = !item.isAdd"
										variant="outline"
										icon="material-symbols:add" />
								</UTooltip>
								<UTooltip
									text="Add attribute"
									v-else>
									<UButton
										@click="addItemAtt(idx)"
										variant="outline"
										icon="material-symbols:add" />
								</UTooltip>
							</div>
						</td>
						<td class="border border-slate-300 ...">
							<div class="flex">
								<div v-show="!item.isRoot">
									<UTooltip text="Save Grant">
										<UButton
											:loading="item.isloading"
											icon="material-symbols:save-outline"
											color="success"
											variant="outline" />
									</UTooltip>
								</div>
								<div v-show="!item.isRoot">
									<UTooltip text="Delete Grant">
										<UButton
											:loading="item.isloading"
											@click="deleteGrants(item._id, idx)"
											icon="tabler:trash"
											color="error"
											variant="outline" />
									</UTooltip>
								</div>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</Main>
</template>

<script setup>
	import Main from '~/layouts/main.vue';
	import { useGeneralStore } from '~/store/general';
	import { useAdminStore } from '~/store/admin';
	const admin = useAdminStore();
	const general = useGeneralStore();
	const route = useRoute();
	const router = useRouter();
	const grants = ref([]);
	const isLoading = ref(false);

	const role = ref({});
	const isAny = ref([
		{
			label: 'Any',
			value: true
		},
		{
			label: 'Own',
			value: false
		}
	]);
	definePageMeta({ middleware: 'auth' });
	const refresh = async () => {
		isLoading.value = true;
		await admin.getAllListRoles();
		isLoading.value = false;

		getGrants();
	};
	onMounted(async () => {
		if (admin.roles.length === 0) {
			isLoading.value = true;
			await admin.getAllListRoles();
			isLoading.value = false;
		}

		getGrants();
	});

	const getGrants = () => {
		if (route.query.slug) {
			role.value = admin.roles.find((item) => item.slug == route.query.slug);
		} else if (route.params.id) {
			role.value = admin.roles.find((item) => item.name == route.params.id);
		} else {
			router.push('/roles');
		}

		role.value.grants.forEach((grant) => {
			// Convert attributes to an array
			if (typeof grant.attributes === 'string') {
				grant.attributes = grant.attributes.split(',');
			}
			grant.isloading = false;
			// Prepare suggestions
			grant.suggest_not = grant.suggest.map((item) => `!${item}`);
			grant.suggest.push('*');
			grant.suggest_not.push('*');

			// Initialize additional properties
			grant.isAdd = false;
			grant.isEdit = false;
			grant.attrNewValue = '';

			// Initialize permissions
			grant.permissions = {
				read: { checked: false, isAny: false },
				create: { checked: false, isAny: false },
				update: { checked: false, isAny: false },
				delete: { checked: false, isAny: false }
			};

			// Update permissions based on actions
			grant.actions.forEach((action) => {
				const [actionType, scope] = action.split(':');
				const isAny = scope === 'any';

				if (grant.permissions[actionType]) {
					grant.permissions[actionType].isAny = isAny;
					grant.permissions[actionType].checked = true;
				}
			});
		});
		return grants;
	};

	const addItemAtt = (idx) => {
		if (role.value.grants[idx].attrNewValue === '') {
			role.value.grants[idx].attrNewValue = '';
			role.value.grants[idx].isAdd = false;
			return;
		}
		const newvalue =
			role.value.grants[idx].attributes.includes('*') &&
			!role.value.grants[idx].attrNewValue.includes('!')
				? `!${role.value.grants[idx].attrNewValue}`
				: role.value.grants[idx].attrNewValue;
		if (!role.value.grants[idx].attributes.includes(newvalue)) {
			role.value.grants[idx].attributes.push(newvalue);
		}
		if (
			role.value.grants[idx].attributes.includes('*') &&
			!role.value.grants[idx].suggest_not.includes(newvalue)
		) {
			role.value.grants[idx].suggest_not.push(newvalue);
		} else if (!role.value.grants[idx].suggest.includes(newvalue)) {
			role.value.grants[idx].suggest.push(newvalue);
		}
		role.value.grants[idx].attrNewValue = '';
		role.value.grants[idx].isAdd = false;
	};
	const deleteGrants = async (id, idx) => {
		const body = {
			roleId: role.value._id,
			grantId: id
		};
		role.value.grants[idx].isloading = true;
		await admin.deleteGrantToRole(body);
		role.value.grants.splice(idx, 1);
		role.value.grants[idx].isloading = false;
	};
</script>
