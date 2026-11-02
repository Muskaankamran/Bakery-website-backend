import Swal from "sweetalert2";

function getAlertTheme() {
  const styles = getComputedStyle(document.documentElement);
  return {
    background: styles.getPropertyValue("--surface").trim(),
    color: styles.getPropertyValue("--ink").trim(),
    confirmButtonColor: styles.getPropertyValue("--action-color").trim(),
    cancelButtonColor: styles.getPropertyValue("--cancel-color").trim(),
  };
}

function fireAlert(options) {
  return Swal.fire({
    ...getAlertTheme(),
    customClass: { popup: "bakery-swal" },
    ...options,
  });
}

export function showSuccessAlert(title, text) {
  return fireAlert({ icon: "success", title, text });
}

export function showErrorAlert(title, text) {
  return fireAlert({ icon: "error", title, text });
}

export function showValidationAlert(text) {
  return fireAlert({ icon: "warning", title: "Please check the details", text });
}

export async function confirmAction(title, text, confirmButtonText = "Confirm") {
  const result = await fireAlert({
    icon: "warning",
    title,
    text,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText: "Cancel",
    reverseButtons: true,
    focusCancel: true,
  });
  return result.isConfirmed;
}

export function confirmLogout() {
  return confirmAction(
    "Sign out of this browser?",
    "This clears the storefront session. The backend login cookie remains valid until it expires.",
    "Sign out"
  );
}

export function getApiErrorMessage(error, fallback) {
  return error.response?.data?.message
    || (error.request ? fallback : error.message)
    || fallback;
}
