import { useEffect, useState } from "react";
import { apiClient } from "../api/client";

export default function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPacientes = async () => {
      setLoading(true);
      try {
        const resp = await apiClient.get("/patients");
        if (resp && resp.data) {
          setPacientes(resp.data);
        }
        console.log(resp.data);
      } catch (err) {
        console.error("Error al cargar:", err);
      } finally {
        setLoading(false); // Quitamos el cargando
      }
    };
    fetchPacientes();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 text-slate-900">
      {/* Sidebar Simple */}
      <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col">
        <h1 className="text-xl font-black mb-10 text-brand-orange">
          LAB-SYSTEM
        </h1>
        <nav className="space-y-4 flex-1">
          <button className="w-full text-left p-3 bg-brand-orange rounded-xl font-bold">
            Pacientes
          </button>
          <button className="w-full text-left p-3 hover:bg-slate-800 rounded-xl transition">
            Resultados
          </button>
        </nav>
        <button
          onClick={onLogout}
          className="p-3 bg-red-500 rounded-xl font-bold"
        >
          Salir
        </button>
      </aside>

      {/* Contenido */}
      <main className="flex-1 p-8 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
            <p className="mt-4 text-slate-500 font-medium">
              Cargando pacientes...
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Lista de Pacientes</h2>
              <button className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-black transition">
                + Nuevo Paciente
              </button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="p-4 font-bold text-slate-400 text-xs uppercase">
                      Paciente
                    </th>
                    <th className="p-4 font-bold text-slate-400 text-xs uppercase">
                      Cédula
                    </th>
                    <th className="p-4 font-bold text-slate-400 text-xs uppercase">
                      Género
                    </th>
                    <th className="p-4 font-bold text-slate-400 text-xs uppercase">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pacientes.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-slate-50 hover:bg-slate-50/50 transition"
                    >
                      <td className="p-4 font-medium">
                        {p.first_name} {p.last_name}
                      </td>
                      <td className="p-4 text-slate-500">{p.document_number}</td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            p.is_active === true
                              ? "bg-green-100 text-green-600"
                              : "bg-orange-100 text-orange-600"
                          }`}
                        >
                          {p.gender}
                        </span>
                      </td>
                      <td className="p-4 text-brand-pink font-bold cursor-pointer">
                        Ver detalle
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
