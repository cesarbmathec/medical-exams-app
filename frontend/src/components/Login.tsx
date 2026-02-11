import { useState } from "react";
import logo from "../assets/images/logo.png";
import "../style.css";

import { apiClient } from "../api/client";

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Usamos el cliente unificado. No importa si es Wails o Web, él decide.
      const response = await apiClient.post("/login", { username, password });

      if (response?.data?.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        onLoginSuccess();
      }
    } catch (err: any) {
      setError(err.message || "Error de autenticación");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Lado Izquierdo: Visual/Gradiente (Oculto en móviles pequeños si prefieres) */}
      <div className="hidden md:flex md:w-1/2 bg-linear-to-br from-brand-orange to-brand-pink items-center justify-center p-12 text-white">
        <div className="max-w-md text-center">
          <img
            src={logo}
            alt="Logo"
            className="w-48 h-48 mx-auto mb-8 drop-shadow-2xl"
          />
          <h1 className="text-4xl font-bold mb-4">Bienvenido de nuevo</h1>
          <p className="text-lg opacity-90">
            Accede al sistema de gestión de exámenes médicos y laboratorio
            clínico.
          </p>
        </div>
      </div>

      {/* Lado Derecho: Formulario */}
      <div className="flex-1 flex items-center justify-center bg-white p-8 md:p-16">
        <div className="max-w-sm w-full space-y-8">
          {/* Logo visible solo en móviles */}
          <div className="md:hidden text-center">
            <img src={logo} alt="Logo" className="w-24 h-24 mx-auto mb-4" />
          </div>

          <div className="text-center md:text-left">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Iniciar Sesión
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usuario
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all bg-gray-50"
                  placeholder="Nombre de usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all bg-gray-50"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200 animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 px-4 rounded-xl font-bold text-white shadow-lg transition-all cursor-pointer
                ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gray-900 hover:bg-black active:transform active:scale-95"
                }`}
            >
              {isLoading ? "Procesando..." : "Entrar al Sistema"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 pt-8">
            &copy; 2024 Medical Exams App. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
