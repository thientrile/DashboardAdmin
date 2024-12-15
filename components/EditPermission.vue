<!-- @format -->

<template>
	<div class="w-full flex flex-col justify-between text-sm">
		<div class="px-1.5">
			<table class="my-1 border-collapse border border-slate-400 w-full">
				<thead class="sticky top-0 shadow-md text-center">
					<tr>
						<th
							class="border border-black ..."
							rowspan="2">
							Access name
						</th>
						<th
							class="border border-black ..."
							colspan="4">
							Permission
						</th>
						<th
							class="border border-black ..."
							rowspan="2">
							Attribute
						</th>
						<th
							class="border border-black ..."
							rowspan="2">
							Actions
						</th>
					</tr>
					<tr>
						<td class="border border-black font-bold">Create</td>
						<td class="border border-black font-bold">Read</td>
						<td class="border border-black font-bold">Update</td>
						<td class="border border-black font-bold">Delete</td>
					</tr>
				</thead>

				<tbody class="border-1 max-h-[300px] min-h-[150px] overflow-y-auto">
					<!-- start list grants -->
					<tr
						v-for="(item, idx) in grants"
						class="border-1">
						<td class="border border-black ...">{{ item.name }}</td>
						<td class="border border-black">
							<span
								:class="item.permission.create.any ? 'font-bold' : ''"
								v-if="item.permission.isRoots">
								{{ item.permission.create.checked ? 'Allowed ' : 'Not allow ' }}
							</span>

							<label
								v-else
								class="cursor-pointer"
								:for="`create-${idx}`"
								:class="item.permission.create.checked ? 'font-bold' : ''">
								<input
									:id="`create-${idx}`"
									class="mr-1"
									type="checkbox"
									@change="isChange = true"
									v-model="item.permission.create.checked"
									:checked="item.permission.create.checked" />
								{{ item.permission.create.checked ? 'Allowed ' : 'Not allow ' }}
							</label>
							<span
								class="cursor-pointer"
								:class="item.permission.create.any ? 'font-bold' : ''"
								v-show="item.permission.create.checked"
								@click="changeGrantValueAny(idx, 'create')">
								: {{ item.permission.create.any ? 'any' : 'own' }}
							</span>
						</td>
						<td class="border border-black ...">
							<span
								:class="item.permission.read.checked ? 'font-bold' : ''"
								v-if="item.permission.isRoots">
								{{ item.permission.read.checked ? 'Allowed ' : 'Not allow ' }}
							</span>
							<label
								v-else
								class="cursor-pointer"
								:for="`read-${idx}`"
								:class="item.permission.read.checked ? 'font-bold' : ''">
								<input
									class="mr-1"
									:id="`read-${idx}`"
									type="checkbox"
									@change="isChange = true"
									v-model="item.permission.read.checked"
									:checked="item.permission.read.checked" />
								{{ item.permission.read.checked ? 'Allowed ' : 'Not allow ' }}
							</label>
							<span
								class="cursor-pointer"
								:class="item.permission.read.any ? 'font-bold' : ''"
								v-show="item.permission.read.checked"
								@click="changeGrantValueAny(idx, 'read')">
								: {{ item.permission.read.any ? 'any' : 'own' }}
							</span>
						</td>
						<td class="border border-black ...">
							<span
								:class="item.permission.update.checked ? 'font-bold' : ''"
								v-if="item.permission.isRoots">
								{{ item.permission.update.checked ? 'Allowed ' : 'Not allow ' }}
							</span>

							<label
								v-else
								class="cursor-pointer"
								:for="`update-${idx}`"
								:class="item.permission.update.checked ? 'font-bold' : ''">
								<input
									class="mr-1"
									:id="`update-${idx}`"
									type="checkbox"
									@input="isChange = true"
									v-model="item.permission.update.checked"
									:checked="item.permission.update.checked" />
								{{ item.permission.update.checked ? 'Allowed ' : 'Not allow ' }}
							</label>
							<span
								class="cursor-pointer"
								:class="item.permission.update.any ? 'font-bold' : ''"
								v-show="item.permission.update.checked"
								@click="changeGrantValueAny(idx, 'update')">
								: {{ item.permission.update.any ? 'any' : 'own' }}
							</span>
						</td>
						<td class="border border-black ...">
							<span
								v-if="item.permission.isRoots"
								:class="item.permission.delete.checked ? 'font-bold' : ''">
								{{ item.permission.delete.checked ? 'Allowed ' : 'Not allow ' }}
							</span>
							<label
								v-else
								class="cursor-pointer"
								:for="`delete-${idx}`"
								:class="item.permission.delete.checked ? 'font-bold' : ''">
								<input
									class="mr-1"
									:id="`delete-${idx}`"
									type="checkbox"
									@change="isChange = true"
									v-model="item.permission.delete.checked"
									:checked="item.permission.delete.checked" />
								{{ item.permission.delete.checked ? 'Allowed ' : 'Not allow ' }}
							</label>
							<span
								class="cursor-pointer"
								:class="item.permission.delete.any ? 'font-bold' : ''"
								v-show="item.permission.delete.checked"
								@click="changeGrantValueAny(idx, 'delete')">
								: {{ item.permission.delete.any ? 'any' : 'own' }}
							</span>
						</td>
						<td class="border border-black flex relative">
							<USelectMenu
								searchable
								@change="isChange = true"
								v-if="item.suggest.length > 0"
								class="w-full border-none h-full py-2 forcus:border-sky-300 dark:text-white dark:bg-gray-800"
								v-model="item.attributes"
								:options="
									item.attributes.includes('*')
										? notSuggest(item.suggest)
										: item.suggest
								"
								multiple />
							<input
								v-else
								:id="`attributes-${idx}`"
								class="w-full border-none h-full py-2 forcus:border-sky-300 dark:text-white dark:bg-gray-800"
								type="text"
								@input="isChange = true"
								v-model="item.attributes" />
						</td>
						<td class="border border-black text-center">
							<button
								v-show="!item.permission.isRoots"
								@click="deleteGrant(item._id, idx)"
								class="ring-red-500 ring-2 text-white min-w-[50px] py-1.5 px-2 rounded-sm flex justify-center items-center"
								:disable="item.isLoading">
								<span v-if="item.isLoading">
									Deleting <Icon name="line-md:loading-loop" />
								</span>

								<span v-else> Delete </span>
							</button>
						</td>
					</tr>
					<!-- end list grants -->
					<!-- start litst new grants -->
					<tr
						v-for="(item, idx) in newGrants"
						class="border-1 backdrop-opacity-10">
						<td class="border border-black">
							<div class="flex gap-2 w-full">
								<span>
									{{ item.name }}
								</span>
								<span
									class="bg-green-300 px-1 shadow-sm relative top-[-5px] right-0 text-white rounded-md text-[0.5em]">
									New
								</span>
							</div>
						</td>
						<td class="border border-black">
							<input
								v-show="item.permission.isRoots"
								:id="item.permission.isRoots ? `create-new-${idx}` : ''"
								class="mr-1"
								type="checkbox"
								@change="isChange = true"
								v-model="item.permission.create.checked"
								:checked="item.permission.create.checked" />

							<label
								class="cursor-pointer"
								:for="`create-new-${idx}`"
								:class="item.permission.create.checked ? 'font-bold' : ''">
								{{ item.permission.create.checked ? 'Allowed ' : 'Not allow ' }}
							</label>
							<span
								class="cursor-pointer"
								:class="item.permission.create.any ? 'font-bold' : ''"
								v-show="item.permission.create.checked"
								@click="changeNewGrantValueAny(idx, 'create')">
								: {{ item.permission.create.any ? 'any' : 'own' }}
							</span>
						</td>
						<td class="border border-black ...">
							<input
								class="mr-1"
								v-show="item.permission.isRoots"
								:id="item.permission.isRoots ? `read-new-${idx}` : ''"
								type="checkbox"
								@change="isChange = true"
								v-model="item.permission.read.checked"
								:checked="item.permission.read.checked" />

							<label
								class="cursor-pointer"
								:for="`read-new-${idx}`"
								:class="item.permission.read.checked ? 'font-bold' : ''">
								{{ item.permission.read.checked ? 'Allowed ' : 'Not allow ' }}
							</label>
							<span
								class="cursor-pointer"
								:class="item.permission.read.any ? 'font-bold' : ''"
								v-show="item.permission.read.checked"
								@click="changeNewGrantValueAny(idx, 'read')">
								: {{ item.permission.read.any ? 'any' : 'own' }}
							</span>
						</td>
						<td class="border border-black ...">
							<input
								class="mr-1"
								v-show="item.permission.isRoots"
								:id="item.permission.isRoots ? `update-new-${idx}` : ''"
								type="checkbox"
								@change="isChange = true"
								v-model="item.permission.update.checked"
								:checked="item.permission.update.checked" />

							<label
								class="cursor-pointer"
								:for="`update-new-${idx}`"
								:class="item.permission.update.checked ? 'font-bold' : ''">
								{{ item.permission.update.checked ? 'Allowed ' : 'Not allow ' }}
							</label>
							<span
								class="cursor-pointer"
								:class="item.permission.update.any ? 'font-bold' : ''"
								v-show="item.permission.update.checked"
								@click="changeNewGrantValueAny(idx, 'update')">
								: {{ item.permission.update.any ? 'any' : 'own' }}
							</span>
						</td>
						<td class="border border-black ...">
							<input
								class="mr-1"
								v-show="item.permission.isRoots"
								:id="item.permission.isRoots ? `delete-new-${idx}` : ''"
								type="checkbox"
								@change="isChange = true"
								v-model="item.permission.delete.checked"
								:checked="item.permission.delete.checked" />

							<label
								class="cursor-pointer"
								:for="`delete-new-${idx}`"
								:class="item.permission.delete.checked ? 'font-bold' : ''">
								{{ item.permission.delete.checked ? 'Allowed ' : 'Not allow ' }}
							</label>
							<span
								class="cursor-pointer"
								:class="item.permission.delete.any ? 'font-bold' : ''"
								v-show="item.permission.delete.checked"
								@click="changeNewGrantValueAny(idx, 'delete')">
								: {{ item.permission.delete.any ? 'any' : 'own' }}
							</span>
						</td>
						<td class="border border-black ...">
							<input
								disabled
								class="w-full h-full py-2 focus-visible:border-sky-300 dark:text-white dark:bg-gray-800"
								type="text"
								:readonly="!item.permission.isRoots"
								v-model="item.attributes" />
						</td>
						<td class="border border-black">
							<button
								v-if="!item.isLoading"
								@click="delNewGrant(idx)"
								class="ring-red-400 ring-2 text-white min-w-[50px] py-1.5 px-2 rounded-sm">
								Remove
							</button>
							<span v-else
								>Adding <Icon name="svg-spinners:3-dots-fade"
							/></span>
						</td>
					</tr>
					<!-- end list new gratns -->
					<!-- start button action -->
					<tr class="sticky top-0">
						<td colspan="7">
							<div class="flex justify-end m-2 items-center gap-2">
								<button
									v-show="newGrants.length > 0"
									@click="addPermission"
									type="button"
									class="rounded-sm min-w-[100px] py-1.5 px-2 ring-2 hover:ring-4">
									<span
										v-if="isAdd"
										class="w-full"
										>Adding

										<Icon name="svg-spinners:3-dots-fade" />
									</span>
									<span v-else> Add </span>
								</button>

								<button
									v-if="!isChange"
									@click="buttonRefresh"
									class="bg-gray-200 dark:bg-gray-800 rounded-sm min-w-[100px] ms-2 py-1.5 px-2 ring-2 hover:ring-4">
									Refresh
								</button>
								<button
									class=" rounded-sm min-w-[100px] ring-green-200 ms-2 py-1.5 px-2 ring-2 hover:ring-4"
									v-else="isChange"
									@click="savePermission">
									<span
										class="w-full"
										v-if="isSave"
										>Saving <Icon name="svg-spinners:3-dots-fade" />
									</span>
									<span v-else>Save </span>
								</button>
							</div>
						</td>
					</tr>
					<!-- end button action -->
				</tbody>
			</table>
			<LIstResource isActions="false" />
		</div>
	</div>
</template>

<script setup>
	import { useAdminStore } from '~/store/admin';
	import LIstResource from './LIstResource.vue';
	const admin = useAdminStore();
	const grants = ref([]);
	const newGrants = ref([]);
	const isAdd = ref(false);
	const isChange = ref(false);
	const isSave = ref(false);
	watch(
		() => admin.selectRole,
		() => {
			ListActions();
		}
	);

	watch(
		() => admin.selectSRC,
		() => {
			if (admin.selectSRC[0]) {
				const temp = admin.selectSRC[0];
				const obj = {
					resourceId: temp.resourceId,
					permission: {
						read: { checked: false, any: false },
						create: { checked: false, any: false },
						update: { checked: false, any: false },
						delete: { checked: false, any: false },
						isRoots: true
					},
					name: temp.name,
					actions: [],
					attributes: '*',
					isLoading: false
				};
				const checkNew = newGrants.value.findIndex(
					(item) => item.resourceId == temp.resourceId
				);
				if (checkNew == -1) {
					newGrants.value.push(obj);
				}
			}
		}
	);

	const ListActions = () => {
		newGrants.value = [];
		isChange.value = false;
		if (admin.selectRole[0].grants[0].actions) {
			grants.value = admin.selectRole[0].grants;
			grants.value.forEach((grant, i) => {
				initializeGrant(grant, i);
			});
		} else {
			grants.value = [];
		}
	};

	const initializeGrant = (grant, index) => {
		const actions = grant.actions;
		const isRoots = grant.isRoot;
		const obj = createPermissionObject(isRoots);

		actions.forEach((action) => {
			const [attr, value] = action.split(':');
			obj[attr].checked = true;
			obj[attr].any = value === 'any';
		});

		grant.permission = obj;
		grant.isLoading = false;

		if (grant.suggest.length > 0) {
			initializeAttributes(grant);
		}
	};

	const createPermissionObject = (isRoots) => {
		return {
			read: { checked: false, any: false },
			create: { checked: false, any: false },
			update: { checked: false, any: false },
			delete: { checked: false, any: false },
			isRoots
		};
	};

	const initializeAttributes = (grant) => {
		if (!Array.isArray(grant.attributes)) {
			grant.attributes = grant.attributes.split(',');
		}

		if (!grant.suggest.includes('*')) {
			grant.suggest.push('*');
		}
	};
	const deleteGrant = async (id, idx) => {
		const body = {
			roleId: admin.selectRole[0]._id,
			grantId: id
		};
		isSave.value = false;
		grants.value[idx].isLoading = true;
		await admin.deleteGrantToRole(body);
		grants.value[idx].isLoading = false;
		grants.value.splice(idx, 1);
	};
	const delNewGrant = (idx) => {
		newGrants.value.splice(idx, 1);
	};
	const changeGrantValueAny = async (idx, action) => {
		isChange.value = true;

		if (!grants.value[idx].permission.isRoots) {
			grants.value[idx].permission[action].any =
				!grants.value[idx].permission[action].any;
		}
	};
	const changeNewGrantValueAny = (idx, action) => {
		if (newGrants.value[idx].permission.isRoots) {
			newGrants.value[idx].permission[action].any =
				!newGrants.value[idx].permission[action].any;
		}
	};
	const buttonRefresh = async () => {
		await admin.getAllListRoles();
		ListActions();
	};

	const savePermission = async () => {
		for (let i in grants.value) {
			grants.value[i].attributes = grants.value[i].attributes.join(',');
			const actions = [];
			for (let action in grants.value[i].permission) {
				if (grants.value[i].permission[action].checked) {
					actions.push(
						`${action}:${
							grants.value[i].permission[action].any ? 'any' : 'own'
						}`
					);
				}
			}

			grants.value[i].actions = actions;
		}

		const obj = {
			roleId: admin.selectRole[0]._id,
			grants: grants.value
		};
		isSave.value = true;
		await admin.setGrantToRole(obj);
		isSave.value = false;
		isChange.value = false;
	};
	const addPermission = async () => {
		isAdd.value = true;
		for (let i in newGrants.value) {
			newGrants.value[i].isLoading = true;
			const actions = [];
			for (let action in newGrants.value[i].permission) {
				if (newGrants.value[i].permission[action].checked) {
					actions.push(
						`${action}:${
							newGrants.value[i].permission[action].any ? 'any' : 'own'
						}`
					);
				}
			}
			newGrants.value[i].actions = actions;
		}
		const obj = {
			roleId: admin.selectRole[0]._id,
			grants: newGrants.value
		};

		await admin.addGrantToRole(obj);
		isAdd.value = false;

		newGrants.value = [];
	};
	const notSuggest = (arr) => {
		const temp = arr.map((item) => {
			if (item != '*') {
				return `!${item}`;
			}
			return item;
		});

		return temp;
	};
</script>
