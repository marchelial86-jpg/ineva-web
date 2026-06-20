"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Utensils, Phone, Clock, Settings, LogOut, Save, Plus, Trash2, ExternalLink } from "lucide-react";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("menu");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/admin/login");
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-2xl font-bold">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-black">IN</span>
          </div>
          <h1 className="text-2xl font-black text-gray-800">INEVA ADMIN</h1>
        </div>
        <div className="flex gap-3">
          <a 
            href="/" 
            target="_blank"
            className="px-4 py-2 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 flex items-center gap-2"
          >
            <ExternalLink size={16} /> Ver Web
          </a>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 flex items-center gap-2"
          >
            <LogOut size={16} /> Salir
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-4 overflow-x-auto">
            <button onClick={() => setActiveTab("menu")} className={`px-6 py-4 font-bold flex items-center gap-2 ${activeTab === "menu" ? "text-orange-600 border-b-4 border-orange-600" : "text-gray-500"}`}>
              <Utensils size={18} /> Menú
            </button>
            <button onClick={() => setActiveTab("contacto")} className={`px-6 py-4 font-bold flex items-center gap-2 ${activeTab === "contacto" ? "text-orange-600 border-b-4 border-orange-600" : "text-gray-500"}`}>
              <Phone size={18} /> Contacto
            </button>
            <button onClick={() => setActiveTab("horarios")} className={`px-6 py-4 font-bold flex items-center gap-2 ${activeTab === "horarios" ? "text-orange-600 border-b-4 border-orange-600" : "text-gray-500"}`}>
              <Clock size={18} /> Horarios
            </button>
            <button onClick={() => setActiveTab("general")} className={`px-6 py-4 font-bold flex items-center gap-2 ${activeTab === "general" ? "text-orange-600 border-b-4 border-orange-600" : "text-gray-500"}`}>
              <Settings size={18} /> General
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "menu" && <MenuEditor />}
        {activeTab === "contacto" && <ContactoEditor />}
        {activeTab === "horarios" && <HorariosEditor />}
        {activeTab === "general" && <GeneralEditor />}
      </div>
    </div>
  );
}

// ============================================
// EDITOR DE MENÚ
// ============================================
function MenuEditor() {
  const [menuData, setMenuData] = useState<any>({ dia: [], noche: [] });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadMenuData();
  }, []);

  const loadMenuData = async () => {
  const docRef = doc(db, "website", "menu");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    setMenuData(docSnap.data());
  } else {
    // Datos correctos de la web
    setMenuData({
      dia: [
        { id: 1, nombre: "Pollo al Horno con Papas Doradas", desc: "Pollo entero al horno con papas doradas y ensalada", precio: "$16.500", img: "" },
        { id: 2, nombre: "Asado al Horno", desc: "Cortes seleccionados al horno con guarnición", precio: "$18.500", img: "" },
        { id: 3, nombre: "Guiso de Lentejas", desc: "Guiso tradicional de lentejas con verduras", precio: "$8.500", img: "" },
        { id: 4, nombre: "Milanesa Napolitana", desc: "Con jamón, muza y salsa de tomate casera", precio: "$12.000", img: "" },
        { id: 5, nombre: "Empanadas al Horno", desc: "Docena de empanadas caseras al horno", precio: "$7.500", img: "" },
        { id: 6, nombre: "Pizzas", desc: "Muzza, especial, napolitana y más variedades", precio: "$9.000", img: "" },
      ],
      noche: [
        { id: 1, nombre: "Gin Tonic", desc: "Gin tonic premium", precio: "$6.500", img: "" },
        { id: 2, nombre: "Aperol Spritz", desc: "Aperol, prosecco y soda", precio: "$7.000", img: "" },
        { id: 3, nombre: "Picada para 2", desc: "Fiambres, quesos, aceitunas y pan", precio: "$15.000", img: "" },
        { id: 4, nombre: "Hamburguesa Ineva", desc: "Hamburguesa artesanal con papas", precio: "$11.000", img: "" },
      ]
    });
  }
};

  const saveMenuData = async () => {
    setSaving(true);
    await setDoc(doc(db, "website", "menu"), menuData);
    setMessage("✅ Menú guardado correctamente");
    setTimeout(() => setMessage(""), 3000);
    setSaving(false);
  };

  const addItem = (turno: string) => {
    const newData = { ...menuData };
    const newId = Math.max(...newData[turno].map((i: any) => i.id || 0), 0) + 1;
    newData[turno].push({ id: newId, nombre: "", desc: "", precio: "", img: "" });
    setMenuData(newData);
  };

  const updateItem = (turno: string, index: number, field: string, value: string) => {
    const newData = { ...menuData };
    newData[turno][index][field] = value;
    setMenuData(newData);
  };

  const deleteItem = (turno: string, index: number) => {
    if (confirm("¿Eliminar este item?")) {
      const newData = { ...menuData };
      newData[turno].splice(index, 1);
      setMenuData(newData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black">Editar Menú</h2>
        <button onClick={saveMenuData} disabled={saving} className="px-8 py-3 bg-green-500 text-white font-bold rounded-xl flex items-center gap-2">
          <Save size={20} /> {saving ? "Guardando..." : "Guardar"}
        </button>
      </div>

      {message && <div className="bg-green-100 text-green-700 px-6 py-4 rounded-xl">{message}</div>}

      {/* Menú Diurno */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">☀️ Menú Diurno</h3>
          <button onClick={() => addItem("dia")} className="px-4 py-2 bg-orange-500 text-white rounded-xl flex items-center gap-2">
            <Plus size={16} /> Agregar Plato
          </button>
        </div>
        {menuData.dia?.map((item: any, index: number) => (
          <div key={index} className="mb-4 p-4 border rounded-xl">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-bold text-gray-400">Plato #{index + 1}</span>
              <button onClick={() => deleteItem("dia", index)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
            </div>
            <input type="text" value={item.nombre} onChange={(e) => updateItem("dia", index, "nombre", e.target.value)} className="w-full mb-2 px-4 py-2 border rounded-lg font-bold" placeholder="Nombre del plato" />
            <textarea value={item.desc} onChange={(e) => updateItem("dia", index, "desc", e.target.value)} className="w-full mb-2 px-4 py-2 border rounded-lg" placeholder="Descripción" rows={2} />
            <input type="text" value={item.precio} onChange={(e) => updateItem("dia", index, "precio", e.target.value)} className="w-full mb-2 px-4 py-2 border rounded-lg" placeholder="Precio (ej: $16.500)" />
            <input type="text" value={item.img} onChange={(e) => updateItem("dia", index, "img", e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="URL de la imagen (ImgBB)" />
          </div>
        ))}
      </div>

      {/* Menú Nocturno */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">🌙 Menú Nocturno</h3>
          <button onClick={() => addItem("noche")} className="px-4 py-2 bg-purple-500 text-white rounded-xl flex items-center gap-2">
            <Plus size={16} /> Agregar Trago
          </button>
        </div>
        {menuData.noche?.map((item: any, index: number) => (
          <div key={index} className="mb-4 p-4 border rounded-xl">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-bold text-gray-400">Trago #{index + 1}</span>
              <button onClick={() => deleteItem("noche", index)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
            </div>
            <input type="text" value={item.nombre} onChange={(e) => updateItem("noche", index, "nombre", e.target.value)} className="w-full mb-2 px-4 py-2 border rounded-lg font-bold" placeholder="Nombre del trago" />
            <textarea value={item.desc} onChange={(e) => updateItem("noche", index, "desc", e.target.value)} className="w-full mb-2 px-4 py-2 border rounded-lg" placeholder="Descripción" rows={2} />
            <input type="text" value={item.precio} onChange={(e) => updateItem("noche", index, "precio", e.target.value)} className="w-full mb-2 px-4 py-2 border rounded-lg" placeholder="Precio (ej: $6.500)" />
            <input type="text" value={item.img} onChange={(e) => updateItem("noche", index, "img", e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="URL de la imagen (ImgBB)" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// EDITOR DE CONTACTO
// ============================================
function ContactoEditor() {
  const [contacto, setContacto] = useState({ whatsappDia: "3878541224", whatsappNoche: "3878750460", fijo: "3878770614", direccion: "López y Planes 470", ciudad: "Orán, Salta" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const saveContacto = async () => {
    setSaving(true);
    await setDoc(doc(db, "website", "contacto"), contacto);
    setMessage("✅ Contacto guardado");
    setTimeout(() => setMessage(""), 3000);
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black">Editar Contacto</h2>
        <button onClick={saveContacto} disabled={saving} className="px-8 py-3 bg-green-500 text-white font-bold rounded-xl flex items-center gap-2">
          <Save size={20} /> {saving ? "Guardando..." : "Guardar"}
        </button>
      </div>
      {message && <div className="bg-green-100 text-green-700 px-6 py-4 rounded-xl">{message}</div>}
      <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
        <div><label className="block text-sm font-bold mb-2">WhatsApp Diurno</label><input type="text" value={contacto.whatsappDia} onChange={(e) => setContacto({...contacto, whatsappDia: e.target.value})} className="w-full px-4 py-3 border rounded-xl" /></div>
        <div><label className="block text-sm font-bold mb-2">WhatsApp Nocturno</label><input type="text" value={contacto.whatsappNoche} onChange={(e) => setContacto({...contacto, whatsappNoche: e.target.value})} className="w-full px-4 py-3 border rounded-xl" /></div>
        <div><label className="block text-sm font-bold mb-2">Teléfono Fijo</label><input type="text" value={contacto.fijo} onChange={(e) => setContacto({...contacto, fijo: e.target.value})} className="w-full px-4 py-3 border rounded-xl" /></div>
        <div><label className="block text-sm font-bold mb-2">Dirección</label><input type="text" value={contacto.direccion} onChange={(e) => setContacto({...contacto, direccion: e.target.value})} className="w-full px-4 py-3 border rounded-xl" /></div>
        <div><label className="block text-sm font-bold mb-2">Ciudad</label><input type="text" value={contacto.ciudad} onChange={(e) => setContacto({...contacto, ciudad: e.target.value})} className="w-full px-4 py-3 border rounded-xl" /></div>
      </div>
    </div>
  );
}

// ============================================
// EDITOR DE HORARIOS
// ============================================
function HorariosEditor() {
  const [horarios, setHorarios] = useState({ dia: "09:00 - 15:00", noche: "21:00 - 04:00" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const saveHorarios = async () => {
    setSaving(true);
    await setDoc(doc(db, "website", "horarios"), horarios);
    setMessage("✅ Horarios guardados");
    setTimeout(() => setMessage(""), 3000);
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black">Editar Horarios</h2>
        <button onClick={saveHorarios} disabled={saving} className="px-8 py-3 bg-green-500 text-white font-bold rounded-xl flex items-center gap-2">
          <Save size={20} /> {saving ? "Guardando..." : "Guardar"}
        </button>
      </div>
      {message && <div className="bg-green-100 text-green-700 px-6 py-4 rounded-xl">{message}</div>}
      <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
        <div><label className="block text-sm font-bold mb-2">Horario Diurno</label><input type="text" value={horarios.dia} onChange={(e) => setHorarios({...horarios, dia: e.target.value})} className="w-full px-4 py-3 border rounded-xl" /></div>
        <div><label className="block text-sm font-bold mb-2">Horario Nocturno</label><input type="text" value={horarios.noche} onChange={(e) => setHorarios({...horarios, noche: e.target.value})} className="w-full px-4 py-3 border rounded-xl" /></div>
      </div>
    </div>
  );
}

// ============================================
// EDITOR GENERAL
// ============================================
function GeneralEditor() {
  const [general, setGeneral] = useState({ titulo: "INEVA", subtitulo: "RESTO-BAR" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const saveGeneral = async () => {
    setSaving(true);
    await setDoc(doc(db, "website", "general"), general);
    setMessage("✅ Configuración guardada");
    setTimeout(() => setMessage(""), 3000);
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black">Configuración General</h2>
        <button onClick={saveGeneral} disabled={saving} className="px-8 py-3 bg-green-500 text-white font-bold rounded-xl flex items-center gap-2">
          <Save size={20} /> {saving ? "Guardando..." : "Guardar"}
        </button>
      </div>
      {message && <div className="bg-green-100 text-green-700 px-6 py-4 rounded-xl">{message}</div>}
      <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
        <div><label className="block text-sm font-bold mb-2">Título</label><input type="text" value={general.titulo} onChange={(e) => setGeneral({...general, titulo: e.target.value})} className="w-full px-4 py-3 border rounded-xl" /></div>
        <div><label className="block text-sm font-bold mb-2">Subtítulo</label><input type="text" value={general.subtitulo} onChange={(e) => setGeneral({...general, subtitulo: e.target.value})} className="w-full px-4 py-3 border rounded-xl" /></div>
      </div>
    </div>
  );
}