import { useEffect, useState } from "react";
import { apiClient } from "../api/client";
import {
  Users,
  ClipboardList,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  UserCircle,
  Menu,
} from "lucide-react";

export default function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // El estado ahora controla el colapso manual
  const [isCollapsed, setIsCollapsed] = useState(false);
  // Estado para móviles
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const resp = await apiClient.get("/patients");
        if (resp && resp.data) {
          setPatients(resp.data);
        }
      } catch (err) {
        console.error("Error loading patients:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 text-slate-900 overflow-hidden font-sans">
      {/* Sidebar con lógica responsiva */}
      <aside
        className={`
    ${isCollapsed ? "w-20" : "w-64"} 
    ${showMobileMenu ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
    fixed lg:relative h-full z-40
    bg-gradient-to-br from-brand-orange to-brand-pink text-white 
    transition-all duration-300 flex flex-col shadow-2xl
  `}
      >
        {/* Botón Toggle - Ahora con fondo oscuro para resaltar sobre el gradiente */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-10 bg-slate-900 text-white rounded-full p-1 shadow-lg hover:scale-110 transition-transform z-50 cursor-pointer"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>

        <div
          className={`p-6 mb-6 ${isCollapsed ? "text-center" : "text-left"}`}
        >
          <h1 className="font-black tracking-tighter text-white font-raleway text-2xl drop-shadow-md">
            {isCollapsed ? "L" : "LabSystem"}
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 font-raleway">
          <NavItem
            icon={<Users size={22} />}
            label="Patients"
            active={true}
            collapsed={isCollapsed}
          />
          <NavItem
            icon={<ClipboardList size={22} />}
            label="Results"
            collapsed={isCollapsed}
          />
        </nav>

        {/* Logout renovado: más elegante, menos "pesado" */}
        <button
          onClick={onLogout}
          className="font-raleway m-4 p-3 bg-white/10 hover:bg-red-500/80 border border-white/20 text-white rounded-xl font-bold flex items-center justify-center transition-all gap-3 cursor-pointer backdrop-blur-sm"
        >
          <LogOut size={22} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </aside>

      {/* Overlay para cerrar menú móvil al hacer click fuera */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header Responsivo */}
        <header className="p-4 md:p-8 pb-4 flex flex-col md:flex-row justify-between items-center bg-white/50 backdrop-blur-md gap-4 shadow">
          <div className="flex items-center justify-between w-full md:w-auto">
            {/* Botón Menú Móvil */}
            <button
              className="lg:hidden p-2 text-slate-600 cursor-pointer"
              onClick={() => setShowMobileMenu(true)}
            >
              <Menu size={24} />
            </button>

            <div className="text-right md:text-left flex-1 md:flex-none">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight font-raleway">
                Registry
              </h2>
              <p className="hidden sm:block text-slate-500 text-sm">
                Patient laboratory records
              </p>
            </div>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none transition-all w-full md:w-48 shadow-sm text-sm font-sans"
              />
            </div>
            <button className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold hover:bg-black transition flex items-center gap-2 shadow-lg cursor-pointer text-sm">
              <Plus size={16} /> <span className="hidden xs:inline">Add</span>
            </button>
          </div>
        </header>

        {/* Tabla Responsiva (Scroll horizontal en móviles) */}
        <section className="flex-1 p-4 md:p-8 overflow-y-auto pt-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-400"></div>
              <p className="mt-4 text-slate-500 animate-pulse font-raleway">
                Fetching records...
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-x-auto">
              <table className="w-full text-left min-w-xl">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr className="font-raleway text-slate-400 text-[10px] uppercase tracking-widest">
                    <th className="p-4 md:p-5 font-bold">Patient Name</th>
                    <th className="p-4 md:p-5 font-bold">ID Number</th>
                    <th className="p-4 md:p-5 font-bold text-center">Gender</th>
                    <th className="p-4 md:p-5 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-sans">
                  {patients.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="p-4 md:p-5">
                        <div className="flex items-center gap-3">
                          <UserCircle size={20} className="text-slate-300" />
                          <div className="font-semibold text-slate-700 text-sm">
                            {p.first_name} {p.last_name}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 md:p-5 text-slate-500 font-mono text-xs">
                        {p.document_number}
                      </td>
                      <td className="p-4 md:p-5 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            p.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {p.gender}
                        </span>
                      </td>
                      <td className="p-4 md:p-5 text-right">
                        <button className="text-pink-500 font-bold text-xs hover:underline cursor-pointer">
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

// Actualización del Subcomponente NavItem
function NavItem({ icon, label, active = false, collapsed }: any) {
  return (
    <div className={`
      flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all group relative
      ${active 
        ? "bg-white/20 backdrop-blur-md text-white shadow-xl shadow-black/5 border border-white/30" 
        : "text-white/70 hover:bg-white/10 hover:text-white"
      }
      ${collapsed ? "justify-center" : ""}
    `}>
      <div className={`${active ? "scale-110" : "group-hover:scale-110 transition-transform"}`}>
        {icon}
      </div>
      {!collapsed && <span className="font-semibold text-sm tracking-wide">{label}</span>}
      
      {/* Tooltip para modo colapsado */}
      {collapsed && (
        <div className="absolute left-16 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[10px] opacity-0 group-hover:opacity-100 pointer-events-none transition-all transform translate-x-2 group-hover:translate-x-0 whitespace-nowrap z-50 shadow-xl border border-slate-700">
          {label}
        </div>
      )}
    </div>
  );
}
