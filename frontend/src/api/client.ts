// frontend/src/api/client.ts
const isWails = !!(window as any).go;

export const apiClient = {
  // Para enviar datos (Login, Crear Paciente, entre otros)
  post: async (endpoint: string, data: any) => {
    const token = localStorage.getItem("token");

    if (isWails) {
      // @ts-ignore
      const resp = await window.go.main.App.GenericRequest(
        "POST",
        endpoint,
        data,
        token,
      );
      return resp;
    } else {
      const axios = (await import("axios")).default;
      const response = await axios.post(
        `http://127.0.0.1:8080/api/v1${endpoint}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` }, // Cabecera estándar para la Web
        },
      );
      return response.data;
    }
  },

  // Para pedir datos (Listar Pacientes, entre otros)
  get: async (endpoint: string) => {
    const token = localStorage.getItem("token");
    if (isWails) {
      // Enviamos un objeto vacío en lugar de null para evitar el error de reflexión
      // @ts-ignore
      return await window.go.main.App.GenericRequest(
        "GET",
        endpoint,
        {},
        token,
      );
    } else {
      const axios = (await import("axios")).default;
      const response = await axios.get(
        `http://127.0.0.1:8080/api/v1${endpoint}`,
        {
          headers: { Authorization: `Bearer ${token}` }, // Cabecera estándar para la Web
        },
      );
      return response.data;
    }
  },
};
