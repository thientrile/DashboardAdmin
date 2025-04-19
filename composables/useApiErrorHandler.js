export const useApiErrorHandler = () => {
  const handleApiError = (error) => {
    const status = error?.response?.status;

    switch (status) {
      case 401:
        console.warn("🔒 Chưa đăng nhập");
        return navigateTo("/auth");
      case 403:
        console.warn("🚫 Không có quyền");
        return navigateTo("/unauthorized");
      case 500:
        console.error("💥 Server lỗi nội bộ");
        break;
      default:
        console.error("❌ Lỗi khác:", status);
    }
  };

  return { handleApiError };
};
