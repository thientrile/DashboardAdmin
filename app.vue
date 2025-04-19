<!-- @format -->

<template>
  <UApp id="App">
    <!-- <LoadingScreen /> -->

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup>


const route = useRoute();
import { useGeneralStore } from "~/store/general";

const general = useGeneralStore();
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - SCMS` : "SCMS";
  },
});
import { useUserStore } from "~/store/user";


const user = useUserStore();
onMounted(async () => {
  user.isAuthenticated = !!localStorage.getItem("x-client-id");
  const loading = useGlobalLoading()
  loading.value = false
});

watch(
  () => user.isAuthenticated,
  async () => {
    if (user.isAuthenticated) {
      try {
        await user.verify();
      } catch (e) {
        console.log(e);
        await user.logout();
      }
      handleMenu();
    }
  }
);
const generateBreadcrumbs = () => {
  const route = useRoute();
  const pathArray = route.path.split("/").filter(Boolean); // Phân tích path hiện tại

  // Lọc bỏ các params (các đoạn bắt đầu bằng dấu : trong path)
  const filteredPathArray = pathArray.filter(
    (segment) => !segment.startsWith(":")
  );

  const breadcrumbs = filteredPathArray.map((segment, index) => {
    const path = "/" + filteredPathArray.slice(0, index + 1).join("/"); // Xây dựng đường dẫn đầy đủ và tránh dấu gạch chéo thừa

    // Kiểm tra và sửa lỗi dấu gạch chéo thừa
    const correctedPath = path.replace(/\/\//g, "/"); // Loại bỏ các dấu gạch chéo thừa nếu có

    const menuItem = general.menuArrs.find((item) => item.to === correctedPath); // Tìm menu item tương ứng

    if (menuItem) {
      // Nếu khớp với menu, sử dụng thông tin từ menu
      return {
        label: menuItem.label,
        icon: menuItem.icon,
        to: index === filteredPathArray.length - 1 ? null : correctedPath, // Chỉ sử dụng link nếu không phải mục cuối
      };
    }

    // Nếu không khớp với menu, sử dụng segment làm fallback
    return {
      label: segment.charAt(0).toUpperCase() + segment.slice(1), // Capitalize segment
      icon: "material-symbols:link", // Icon mặc định
      to: index === filteredPathArray.length - 1 ? null : correctedPath,
    };
  });

  return breadcrumbs;
};

watch(
  () => route.path,
  () => {
	
    handleMenu();
  }
);
const handleMenu = () => {
  general.breadcrumb = generateBreadcrumbs();
  for (let i of general.menuArrs) {
    if (i.to.includes(route.path)) {
      general.menu = i;

      break;
    }
  }
  if (!general?.menu?.actions) {
    general.menu = general.menuArrs.find((item) => {
      return general.breadcrumb[general.breadcrumb.length - 1].to == item.to;
    });
  } else {
    general.menu.actions.forEach((item) => {
      if (item.includes("read")) {
        general.actions.read = true;
      }
      if (item.includes("update")) {
        general.actions.update = true;
      }
      if (item.includes("create")) {
        general.actions.create = true;
      }
      if (item.includes("delete")) {
        general.actions.delete = true;
      }
    });
  }
};

</script>
