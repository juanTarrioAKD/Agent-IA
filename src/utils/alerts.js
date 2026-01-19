import Swal from 'sweetalert2';

// Configuración base para mantener consistencia visual
// Usamos los colores de tu CSS (#4bb6b7)
const mainColor = '#4bb6b7'; 

const showAlerts = {
  // 1. ALERTA DE ÉXITO (Simple y rápida)
  success: (title, message = '') => {
    return Swal.fire({
      icon: 'success',
      title: title,
      text: message,
      confirmButtonColor: mainColor,
      timer: 3000, // Se cierra sola a los 3 seg
      timerProgressBar: true,
      showConfirmButton: false
    });
  },

  // 2. ALERTA DE ERROR (Para fallos de login/registro)
  error: (title, message = '') => {
    return Swal.fire({
      icon: 'error',
      title: title,
      text: message || 'Algo salió mal, intenta de nuevo.',
      confirmButtonColor: '#d33', // Rojo estándar
      confirmButtonText: 'Cerrar'
    });
  },

  // 3. CONFIRMACIÓN (Para acciones peligrosas como borrar cuenta)
  // Devuelve una promesa: true si aceptó, false si canceló
  confirm: async (title, text = 'No podrás revertir esto') => {
    const result = await Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: mainColor,
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar'
    });

    return result.isConfirmed;
  },

  // 4. TOAST (Notificación pequeña en la esquina, ideal para Login)
  toast: (title, icon = 'success') => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    
    Toast.fire({
      icon: icon,
      title: title
    });
  }
};

export default showAlerts;