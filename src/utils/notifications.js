import Swal from 'sweetalert2'
import { getApiErrorMessage } from 'api/axiosConfig'

const THEME = {
  background: 'rgba(28, 25, 25, 0.95)',
  color: '#fff',
}

const ICON_COLORS = {
  success: '#18890e',
  info: '#0a15d1',
  warning: '#e1a100',
  error: '#b30a0a',
}

const BASE_DURATION = {
  success: 2500,
  info: 2500,
  warning: 4000,
  error: 6000,
}

const MAX_DURATION = 10000
const MS_PER_CHAR = 60

const getDuration = (type, title = '', text = '') => {
  const readingTime = (String(title).length + String(text).length) * MS_PER_CHAR
  return Math.min(MAX_DURATION, Math.max(BASE_DURATION[type], readingTime))
}

const Toast = Swal.mixin({
  ...THEME,
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timerProgressBar: true,
  customClass: { timerProgressBar: 'toast-progress-dark' },
  didOpen: (element) => {
    element.addEventListener('mouseenter', Swal.stopTimer)
    element.addEventListener('mouseleave', Swal.resumeTimer)
  },
})

const show = (type, { title, text, timer, ...options } = {}) =>
  Toast.fire({
    icon: type,
    iconColor: ICON_COLORS[type],
    title,
    text,
    timer: timer ?? getDuration(type, title, text),
    showCloseButton: type === 'error',
    ...options,
  })

export const toast = {
  success: (options) => show('success', options),
  info: (options) => show('info', options),
  warning: (options) => show('warning', options),
  error: ({ title = '¡Error!', ...options } = {}) =>
    show('error', { title, ...options }),
  apiError: (
    error,
    fallback = 'No se pudo conectar con el servidor',
    options = {},
  ) =>
    show('error', {
      title: '¡Error!',
      text: getApiErrorMessage(error, fallback),
      ...options,
    }),
}

export const confirmDialog = async ({
  title,
  text,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  danger = false,
}) => {
  const { isConfirmed } = await Swal.fire({
    ...THEME,
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    reverseButtons: true,
    focusCancel: danger,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: danger ? 'var(--red-700)' : 'var(--blue-900)',
    cancelButtonColor: danger ? 'var(--blue-900)' : 'var(--red-700)',
  })

  return isConfirmed
}
