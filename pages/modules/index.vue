<!-- @format -->

<template>
  <Main>
    <div id="module-page"
      class="sticky top-0 flex justify-between text-xs z-50 bg-white dark:bg-black shadow-sm p-3 rounded-2xl"
    >
      <div>
        <UInput
          type="text"
          v-model="filter.search"
          placeholder="Enter keyword for search"
          trailing-icon="rivet-icons:magnifying-glass"
          @change="refresh()"
        >
          <template v-if="filter.search?.length" #trailing>
            <UButton
              color="neutral"
              variant="link"
              size="sm"
              icon="i-lucide-circle-x"
              aria-label="Clear input"
              @click="
                filter.search = '';
                refresh();
              "
            />
          </template>
        </UInput>
      </div>
      <div class="flex items-center space-x-2">
        <div>
          <UInput
            label="Limit"
            type="number"
            v-model="filter.limit"
            :max="total"
            min="1"
            @change="refresh()"
          >
            <template #trailing>
              <output
                id="character-count"
                class="text-xs text-(--ui-text-muted) tabular-nums"
                aria-live="polite"
              >
                {{ filter.limit }}/{{ total }}
              </output>
            </template>
          </UInput>
        </div>
        <div>
          <UTooltip text="Refresh">
            <UButton
              icon="ic:baseline-refresh"
              variant="outline"
              :loading="isLoading"
              @click="refresh"
            />
          </UTooltip>
        </div>
      <ModalNew />
        
      </div>
    </div>
    <div class="mt-2 w-full bg-white dark:bg-black shadow-2xl p-5 rounded-2xl">
      <ListModule  />
      <div class="flex justify-center mt-5">
        <UPagination
          v-model:page="filter.page"
          :items-per-page="1"
          :total="totalPages"
          v-on:update:page="refresh()"
        />
      </div>
    </div>
  </Main>
</template>

<script setup>
definePageMeta({ middleware: "auth" });
import Main from "@/layouts/main.vue";
import ModalNew from "~/components/module/ModalNew.vue";
import ListModule from "~/components/module/ListModule.vue";
import { useAdminStore } from "~/store/admin";
const admin = useAdminStore();
const filter = ref({
  page: 1,
  limit: 10,
  search: "",
});
const isLoading = ref(false);
const total = ref(0);
const totalPages = ref(Math.ceil(total.value / filter.value.limit));
const refresh = async () => {
  await admin.getAllListRoles();
  isLoading.value = true;
  const reslut = await admin.getlistModules(filter.value);
  isLoading.value = false;
  total.value = reslut.totalCount;
  totalPages.value = Math.ceil(total.value / filter.value.limit);
  filter.value.limit =
    reslut.limit < reslut.totalCount ? reslut.limit : reslut.totalCount;
};
onMounted(async () => {
  await refresh();
});
defineShortcuts({
  r: async () => await refresh(),
});
</script>
