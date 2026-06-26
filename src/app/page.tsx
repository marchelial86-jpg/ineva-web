"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sun, Moon, Utensils, Wine, ChevronDown, Star, Clock, MapPin, 
  QrCode, Download, Phone, Music, 
  Map, Navigation, ChefHat, Calendar, X
} from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { QRCodeSVG } from "qrcode.react";

// ============================================
// 🇦 BANDERA DE CONTROL - MUNDIAL ARGENTINA
// ============================================
const MOSTRAR_ELEMENTOS_MUNDIAL = true; // Cambiar a false para ocultar todo

// --- DATOS DEL MENÚ DIURNO ---
const menuDataDefault = {
  dia: [
    { 
      id: 1, 
      nombre: "Pollo al Horno con Papas Doradas", 
      desc: "Pollo entero al horno con papas doradas y ensalada.", 
      precio: "$16.500", 
      img: "https://i.ibb.co/jPzxByN0/Pollo.jpg"
    },
    { 
      id: 2, 
      nombre: "Asado al Horno", 
      desc: "Cortes seleccionados al horno con guarnición.", 
      precio: "$18.500", 
      img: "https://i.ibb.co/N2Xm3ZXc/asado.jpg"
    },
    { 
      id: 3, 
      nombre: "Guiso de Lentejas", 
      desc: "Guiso tradicional de lentejas con verduras.", 
      precio: "$8.500", 
      img: "https://i.ibb.co/ZzqQ5BWh/guiso2.jpg"
    },
    { 
      id: 4, 
      nombre: "Milanesa Napolitana", 
      desc: "Con jamón, muzza y salsa de tomate casera.", 
      precio: "$12.000", 
      img: "https://i.ibb.co/q3CXB44B/milanesa-napo.jpg"
    },
    { 
      id: 5, 
      nombre: "Empanadas al Horno", 
      desc: "Docena de empanadas caseras al horno.", 
      precio: "$7.500", 
      img: "https://i.ibb.co/v60kHz5s/empanadas.jpg"
    },
    { 
      id: 6, 
      nombre: "Pizzas", 
      desc: "Muzza, especial, napolitana y más variedades.", 
      precio: "$9.000", 
      img: "https://i.ibb.co/7tjQKjHW/pizza.jpg"
    },
  ],
  noche: [
    { 
      id: 7, 
      nombre: "Gin Tonic Premium", 
      desc: "Gin tonic con tónica premium y guarnición a elección.", 
      precio: "$6.500", 
      img: "https://i.ibb.co/s9DSqj68/gintonic.jpg"
    },
    { 
      id: 8, 
      nombre: "Black Label", 
      desc: "Whisky Johnnie Walker Black Label 12 años.", 
      precio: "$8.500", 
      img: "https://i.ibb.co/fdhDpt3r/blackleabel.jpg"
    },
    { 
      id: 9, 
      nombre: "Caipiriña", 
      desc: "Trago brasileño con cachaça, lima y azúcar.", 
      precio: "$5.500", 
      img: "https://i.ibb.co/8twGzNJ/caipifr.jpg"
    },
    { 
      id: 10, 
      nombre: "Corona", 
      desc: "Cerveza Corona con limón. Botella 330ml.", 
      precio: "$4.000", 
      img: "https://i.ibb.co/Lz9LkjJM/corona.jpg"
    },
    { 
      id: 11, 
      nombre: "Red Label", 
      desc: "Whisky Johnnie Walker Red Label.", 
      precio: "$6.000", 
      img: "https://i.ibb.co/rRv5tqhg/redleabel.jpg"
    },
    { 
      id: 12, 
      nombre: "Baileys", 
      desc: "Licor de crema irlandesa con hielo.", 
      precio: "$5.000", 
      img: "https://i.ibb.co/YTk9DQT2/baylis.jpg"
    },
    { 
      id: 13, 
      nombre: "Picada Ineva", 
      desc: "Promo Picada Ineva Mas Coca de 1 Litro.", 
      precio: "info", 
      img: "https://i.ibb.co/23WVdbzn/picadaineva.jpg"
    },
  ]
};

// --- IMÁGENES DE CATERING ---
const cateringImages = [
  "https://i.ibb.co/jP6mFBLG/Whats-App-Image-2026-06-18-at-21-49-16-1.jpg",
  "https://i.ibb.co/jZLJk35m/Whats-App-Image-2026-06-18-at-21-49-16-2.jpg",
  "https://i.ibb.co/YF9kdD2h/Whats-App-Image-2026-06-18-at-21-49-16.jpg",
];

// --- COORDENADAS DE INEVA ---
const LATITUD = -23.135048754636838;
const LONGITUD = -64.32535996257522;

// --- COMPONENTE DE RESERVA ---
function ReservaModal({ isOpen, onClose, turno }: { isOpen: boolean; onClose: () => void; turno: string }) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    personas: "",
    horario: "",
    evento: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const mensaje = `🎉 *NUEVA RESERVA* 🎉%0A%0A` +
      `👤 *Nombre:* ${formData.nombre}%0A` +
      `👤 *Apellido:* ${formData.apellido}%0A` +
      `📱 *Teléfono:* ${formData.telefono}%0A` +
      `👥 *Personas:* ${formData.personas}%0A` +
      `🕐 *Horario:* ${formData.horario}%0A` +
      `🎊 *Evento:* ${formData.evento}%0A%0A` +
      `*Turno:* ${turno === "dia" ? "☀️ Diurno" : "🌙 Nocturno"}`;
    
    const whatsappUrl = `https://wa.me/5493878750460?text=${mensaje}`;
    window.open(whatsappUrl, "_blank");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <X size={24} className="text-gray-600 dark:text-gray-300" />
        </button>

        <h2 className="text-3xl font-black mb-6 text-center bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
          Reservar Mesa
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Nombre</label>
            <input
              type="text"
              required
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-orange-500 focus:outline-none transition-colors"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Apellido</label>
            <input
              type="text"
              required
              value={formData.apellido}
              onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-orange-500 focus:outline-none transition-colors"
              placeholder="Tu apellido"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Teléfono</label>
            <input
              type="tel"
              required
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-orange-500 focus:outline-none transition-colors"
              placeholder="3878XXXXXX"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Cantidad de Personas</label>
            <input
              type="number"
              min="1"
              required
              value={formData.personas}
              onChange={(e) => setFormData({ ...formData, personas: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-orange-500 focus:outline-none transition-colors"
              placeholder="2"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Horario de Reserva</label>
            <input
              type="time"
              required
              value={formData.horario}
              onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-orange-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Evento</label>
            <select
              value={formData.evento}
              onChange={(e) => setFormData({ ...formData, evento: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-orange-500 focus:outline-none transition-colors"
              required
            >
              <option value="">Seleccionar...</option>
              <option value="Cumpleaños">Cumpleaños</option>
              <option value="Aniversario">Aniversario</option>
              <option value="Reunión Familiar">Reunión Familiar</option>
              <option value="Reunión de Amigos">Reunión de Amigos</option>
              <option value="Cena Romántica">Cena Romántica</option>
              <option value="Evento Corporativo">Evento Corporativo</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 mt-6"
          >
            <Phone size={20} />
            Enviar Reserva por WhatsApp
          </button>

          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
            Al enviar, aceptas nuestros términos y condiciones de reserva.
          </p>
        </form>
      </motion.div>
    </div>
  );
}

// --- COMPONENTE DE NOTIFICACIÓN ---
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] bg-green-600 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2"
    >
      <Star size={20} fill="white" />
      {message}
    </motion.div>
  );
}

export default function Home() {
  const [menuData, setMenuData] = useState<any>(menuDataDefault);
  const [turno, setTurno] = useState<"dia" | "noche">("dia");
  const [reservaOpen, setReservaOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const docRef = doc(db, "website", "menu");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const firebaseData = docSnap.data();
          if (firebaseData.dia && firebaseData.noche) {
            setMenuData(firebaseData);
          }
        }
      } catch (error) {
        console.error("Error cargando menú:", error);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const cls = (...classes: string[]) => classes.filter(Boolean).join(" ");

  const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

  const contacto = turno === "dia" 
    ? { whatsapp: "3878541224", fijo: "3878770614" }
    : { whatsapp: "3878750460", fijo: "3878770614" };

  const handleVerCarta = () => {
    const menuSection = document.getElementById('menu-section');
    menuSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAgregarProducto = (nombre: string) => {
    setToast(`${nombre} agregado al carrito`);
  };

  const handleConsultarCatering = () => {
    const mensaje = `Hola Ineva! 👋%0A%0AQuisiera consultar presupuesto de catering.%0A%0A*Turno:* ${turno === "dia" ? "☀️ Diurno" : "🌙 Nocturno"}`;
    const whatsappUrl = `https://wa.me/549${contacto.whatsapp}?text=${mensaje}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className={cls(
      "min-h-screen transition-colors duration-700 font-sans selection:bg-purple-500 selection:text-white",
      turno === "dia" ? "bg-stone-50 text-stone-900" : "bg-[#0a0a0a] text-white"
    )}>
      
      {/* --- MODAL DE RESERVA --- */}
      <ReservaModal 
        isOpen={reservaOpen} 
        onClose={() => setReservaOpen(false)} 
        turno={turno}
      />

      {/* --- NOTIFICACIÓN TOAST --- */}
      <AnimatePresence>
        {toast && <Toast message={toast} onClose={() => setToast("")} />}
      </AnimatePresence>

      {/* ============================================
           🇦🇷 ELEMENTOS MUNDIAL ARGENTINA
           ============================================ */}
      {MOSTRAR_ELEMENTOS_MUNDIAL && (
        <>
          {/* Badge flotante Argentina - Esquina superior izquierda */}
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="fixed top-24 left-4 z-40 hidden md:block"
          >
            <div className="relative">
              <div className="bg-gradient-to-r from-sky-400 via-white to-sky-400 p-3 rounded-2xl shadow-2xl border-2 border-yellow-400">
                <div className="text-center">
                  <div className="text-3xl mb-1">🇦</div>
                  <div className="text-xs font-bold text-sky-600">Vamos Argentina</div>
                </div>
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse" />
            </div>
          </motion.div>

          {/* Banner superior Mundial */}
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-sky-500 via-white to-sky-500 py-2 px-4 text-center shadow-lg"
          >
            <div className="flex items-center justify-center gap-2 text-sky-700 font-bold text-sm md:text-base">
              <span className="text-2xl">🏆</span>
              <span>🇦 Ineva te acompaña en el Mundial 🇦🇷</span>
              <span className="text-2xl">⚽</span>
            </div>
          </motion.div>

          {/* Césped animado - Esquina inferior derecha */}
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="fixed bottom-4 right-4 z-40 hidden md:block"
          >
            <div className="bg-gradient-to-br from-green-400 to-green-600 p-4 rounded-full shadow-2xl">
              <div className="text-4xl">⚽</div>
            </div>
          </motion.div>
        </>
      )}
      {/* ============================================ */}

      {/* --- BOTONES FLOTANTES REDES SOCIALES --- */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        <a href={`https://wa.me/549${contacto.whatsapp}`} target="_blank" rel="noopener noreferrer"
          className={cls(
            "w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110",
            turno === "dia" ? "bg-green-500 text-white" : "bg-green-600 text-white"
          )}>
          <img src="https://i.ibb.co/Y41PQrm4/whathsapp.jpg" alt="WhatsApp" className="w-8 h-8" />
        </a>
        <a href="https://instagram.com/ineva.social" target="_blank" rel="noopener noreferrer"
          className={cls(
            "w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110",
            turno === "dia" ? "bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white" : "bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white"
          )}>
          <img src="https://i.ibb.co/0RJWRQdf/insta.jpg" alt="Instagram" className="w-8 h-8" />
        </a>
        <a href="https://facebook.com/ineva.restobar" target="_blank" rel="noopener noreferrer"
          className={cls(
            "w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110",
            turno === "dia" ? "bg-blue-600 text-white" : "bg-blue-700 text-white"
          )}>
          <img src="https://i.ibb.co/FknZsZKg/facebook.jpg" alt="Facebook" className="w-8 h-8" />
        </a>
      </div>

      {/* --- HEADER CON LOGO --- */}
      <nav className={cls(
        "fixed top-0 w-full z-50 backdrop-blur-md border-b flex justify-between items-center px-6 py-4 transition-all duration-500",
        turno === "dia" ? "bg-white/80 border-stone-200" : "bg-black/80 border-purple-500/30"
      )}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-3">
          <img src="https://i.ibb.co/mFgqvLS0/Whats-App-Image-2026-06-19-at-00-09-10.jpg" alt="Ineva Logo" className="w-12 h-12" />
          <div className="text-2xl font-black tracking-tighter uppercase flex items-center gap-2">
            <span>INEVA</span>
            <span className={cls("font-bold", turno === "dia" ? "text-orange-600" : "text-purple-500")}>RESTO-BAR</span>
          </div>
        </motion.div>

        <div className={cls(
          "flex rounded-full p-1 gap-1 border transition-all duration-300",
          turno === "dia" ? "bg-stone-200 border-stone-300" : "bg-purple-900/30 border-purple-500/30"
        )}>
          <button onClick={() => setTurno("dia")} className={cls(
            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300",
            turno === "dia" ? "bg-white text-orange-600 shadow-lg scale-105" : "text-stone-500 hover:text-stone-700"
          )}><Sun size={16} /> Día</button>
          
          <button onClick={() => setTurno("noche")} className={cls(
            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300",
            turno === "noche" ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)] scale-105" : "text-stone-500 hover:text-stone-300"
          )}><Moon size={16} /> Noche</button>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto space-y-32">
        
        {/* --- HERO SECTION --- */}
        <section className="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-8">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8">
            <motion.div variants={fadeInUp} className={cls(
              "inline-block px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase border",
              turno === "dia" ? "border-orange-200 bg-orange-50 text-orange-700" : "border-purple-500/40 bg-purple-900/20 text-purple-300"
            )}>
              {turno === "dia" ? "MENÚS DIARIOS • ASADOS DE FIN DE SEMANA • SABOR CASERO" : "Experiencia Nocturna • Tragos & Fiesta"}
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-6xl md:text-8xl font-black leading-tight tracking-tighter flex items-center justify-center gap-4 flex-wrap">
              {MOSTRAR_ELEMENTOS_MUNDIAL && (
                <img 
                  src="https://flagcdn.com/w320/ar.png" 
                  alt="Bandera Argentina" 
                  className="bandera-flameando w-16 h-12 md:w-24 md:h-16 object-cover rounded shadow-lg"
                />
              )}
              <span className="flex flex-col items-center">
                DOS MUNDOS. <br />
                <span className={cls(
                  "bg-clip-text text-transparent bg-gradient-to-r",
                  turno === "dia" ? "from-orange-500 to-red-600" : "from-purple-500 via-pink-500 to-cyan-400"
                )}>UN SOLO LUGAR.</span>
              </span>
              {MOSTRAR_ELEMENTOS_MUNDIAL && (
                <img 
                  src="https://flagcdn.com/w320/ar.png" 
                  alt="Bandera Argentina" 
                  className="bandera-flameando w-16 h-12 md:w-24 md:h-16 object-cover rounded shadow-lg"
                  style={{ animationDelay: '2s' }}
                />
              )}
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-xl md:text-2xl max-w-2xl mx-auto font-light opacity-80 leading-relaxed">
              {turno === "dia" 
                ? "De Lunes a Viernes el Menú Ejecutivo mas completo y Económico. Sábados y Domingos, El autentico Ritual del Mejor Asado y Pollo al Horno. Rápido, Rico y Bien Argentino" 
                : "Viví la noche con cócteles de autor, picadas premium, DJ en vivo y la mejor vibra de la ciudad."}
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 justify-center pt-8">
              <a 
  href="https://app.inevarestobar.com.ar"
  target="_blank"
  rel="noopener noreferrer"
  className={cls(
    "px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 hover:shadow-xl flex items-center gap-2 cursor-pointer",
    turno === "dia" ? "bg-orange-600 text-white hover:bg-orange-700 shadow-orange-500/30" : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 shadow-purple-500/40"
  )}>
  <Utensils size={20} /> 
  {turno === "dia" ? "🍽️ Pedir Menú Diurno" : "🍸 Pedir Menú Nocturno"}
</a>
              
              <button 
                onClick={() => setReservaOpen(true)}
                className={cls(
                  "px-8 py-4 rounded-full font-bold text-lg border-2 transition-all hover:bg-opacity-10 flex items-center gap-2 cursor-pointer",
                  turno === "dia" ? "border-stone-300 hover:bg-stone-100 text-stone-700" : "border-purple-500/50 hover:bg-purple-900/30 text-purple-300"
                )}><Wine size={20} /> Reservar Mesa</button>
            </motion.div>
          </motion.div>

          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="mt-20 opacity-50">
            <ChevronDown size={32} />
          </motion.div>
        </section>

        {/* --- MENÚ INTERACTIVO --- */}
        <section id="menu-section">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
              Nuestra Carta <span className={turno === "dia" ? "text-orange-600" : "text-purple-500"}>{turno === "dia" ? "Diurna" : "Nocturna"}</span>
            </h2>
            <p className="text-lg opacity-70 max-w-2xl mx-auto">
              {turno === "dia" ? "Sabores tradicionales preparados con fuego y pasión." : "Experiencias sensoriales para disfrutar la noche."}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatePresence mode="wait">
              {menuData[turno]?.map((item: { id: number; nombre: string; desc: string; precio: string; img: string }, index: number) => (
                <motion.div
                  key={`${turno}-${item.id}`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className={cls(
                    "group relative overflow-hidden rounded-3xl border transition-all duration-500 cursor-pointer",
                    turno === "dia" ? "bg-white border-stone-200 shadow-xl hover:shadow-2xl hover:shadow-orange-500/10" : "glass-panel neon-glow hover:border-purple-500/50"
                  )}
                >
                  <div className="h-64 overflow-hidden relative">
                    <img src={item.img} alt={item.nombre} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-bold text-white mb-1">{item.nombre}</h3>
                      <p className="text-sm text-white/80 line-clamp-2">{item.desc}</p>
                    </div>
                  </div>
                  <div className="p-6 flex justify-between items-center">
                    {/* PRECIO ELIMINADO - Solo se muestra en la app */}
                    <button 
                      onClick={() => handleAgregarProducto(item.nombre)}
                      className={cls(
                        "px-6 py-2 rounded-full font-bold text-sm transition-all transform hover:scale-105",
                        turno === "dia" ? "bg-stone-900 text-white hover:bg-orange-600" : "bg-purple-600 text-white hover:bg-pink-600"
                      )}>Ver en App</button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* --- DJ MARCK NOCTURNO --- */}
        {turno === "noche" && (
          <section className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-purple-900 via-black to-pink-900 p-12 md:p-20">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571266028243-371695063d60?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center mix-blend-overlay" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="space-y-6 text-center md:text-left">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600 text-white font-bold"
                >
                  <img src="https://i.ibb.co/KckFjNyS/logodj.jpg" alt="DJ Logo" className="w-6 h-6" />
                  EN VIVO
                </motion.div>
                <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter">
                  DJ MARCK
                </h2>
                <p className="text-xl text-purple-200">Los mejores éxitos en vivo</p>
                <div className="flex gap-4 pt-4">
                  <div className="text-center px-6 py-3 rounded-xl bg-white/10 backdrop-blur-md">
                    <div className="text-2xl font-bold text-purple-400">21:00</div>
                    <div className="text-xs uppercase tracking-widest text-purple-300">Apertura</div>
                  </div>
                  <div className="text-center px-6 py-3 rounded-xl bg-white/10 backdrop-blur-md">
                    <div className="text-2xl font-bold text-pink-400">04:00</div>
                    <div className="text-xs uppercase tracking-widest text-pink-300">Cierre</div>
                  </div>
                </div>
              </div>
              <motion.div 
                initial={{ opacity: 0, rotate: -10 }}
                whileInView={{ opacity: 1, rotate: 0 }}
                className="w-64 h-64 rounded-full border-4 border-purple-500/50 shadow-[0_0_50px_rgba(168,85,247,0.5)] overflow-hidden"
              >
                <img 
                  src="https://i.ibb.co/8LRBMjb2/manosdj.jpg" 
                  alt="DJ Marck" 
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </section>
        )}

        {/* --- SERVICIO DE CATERING --- */}
        <section className={cls(
          "py-20 rounded-[3rem] px-8 md:px-16 overflow-hidden relative",
          turno === "dia" ? "bg-gradient-to-br from-orange-100 to-stone-100" : "bg-gradient-to-br from-purple-900/40 to-black border border-purple-500/20"
        )}>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className={cls("inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase", turno === "dia" ? "bg-orange-200 text-orange-800" : "bg-purple-500/20 text-purple-300")}>
                <ChefHat size={16} /> Servicio Premium
              </div>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
                Servicio de Catering
              </h2>
              <p className="text-lg opacity-80 leading-relaxed">
                Llevamos la experiencia Ineva a tu evento. Bodas, cumpleaños, eventos corporativos o reuniones privadas. 
                Menús personalizados y servicio profesional.
              </p>
              <ul className="space-y-3">
                {[
                  "Menús personalizados",
                  "Servicio de mozos profesionales",
                  "Equipamiento completo",
                  "Ambientación según tu evento"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Star size={16} className={turno === "dia" ? "text-orange-600" : "text-purple-500"} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={handleConsultarCatering}
                className={cls(
                  "px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 flex items-center gap-2 cursor-pointer",
                  turno === "dia" ? "bg-orange-600 text-white hover:bg-orange-700" : "bg-purple-600 text-white hover:bg-purple-700"
                )}>
                <Calendar size={20} /> Consultar Presupuesto
              </button>
            </motion.div>
            
            <div className="grid grid-cols-2 gap-4">
              {cateringImages.map((img, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={cls(
                    "rounded-2xl overflow-hidden shadow-xl",
                    i === 0 ? "col-span-2 h-64" : "h-40"
                  )}
                >
                  <img src={img} alt={`Catering ${i+1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- SECCIÓN DESCARGAR APP --- */}
<section className={cls(
  "py-20 rounded-[3rem] px-8 md:px-16 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden relative",
  turno === "dia" ? "bg-gradient-to-br from-orange-50 to-stone-100 border-2 border-orange-200" : "bg-gradient-to-br from-purple-900/60 to-black border-2 border-purple-500/40"
)}>
  <div className="relative z-10 max-w-xl space-y-6 text-center md:text-left">
    <div className={cls("inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider", turno === "dia" ? "bg-orange-200 text-orange-800" : "bg-purple-500/30 text-purple-200")}>
      <Star size={16} /> La Experiencia Completa
    </div>
    <h2 className="text-4xl md:text-5xl font-black leading-tight">
      Hacé tu pedido online
    </h2>
    <p className="text-lg opacity-90 leading-relaxed">
      Pedí desde tu celular de forma rápida y fácil. Acumulá puntos, accedé a promociones exclusivas y hacé tu pedido en segundos. ¡Sin esperas!
    </p>
    
    {/* Botón principal: Abrir App */}
    <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
      <a 
        href="https://app.inevarestobar.com.ar" 
        target="_blank" 
        rel="noopener noreferrer"
        className={cls(
          "px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-xl",
          turno === "dia" ? "bg-orange-600 text-white hover:bg-orange-700" : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
        )}
      >
        <Utensils size={24} /> 
        <div className="text-left">
          <div className="text-xs opacity-80">Abrir</div>
          <div className="text-lg leading-none">App de Pedidos</div>
        </div>
      </a>
      
      <button 
        onClick={() => setReservaOpen(true)}
        className={cls(
          "px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all transform hover:scale-105 border-2",
          turno === "dia" ? "border-orange-600 text-orange-600 hover:bg-orange-50" : "border-purple-500 text-purple-300 hover:bg-purple-900/20"
        )}
      >
        <Calendar size={24} />
        <div className="text-left">
          <div className="text-xs opacity-80">Reservar</div>
          <div className="text-lg leading-none">Una Mesa</div>
        </div>
      </button>
    </div>
    
    <p className="text-sm opacity-70 mt-4">
      También podés escanear el código QR con la cámara de tu celular
    </p>
  </div>
  
  {/* QR Code Real */}
  <motion.div 
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className="relative"
  >
    <div className={cls(
      "w-72 h-72 rounded-3xl border-8 flex items-center justify-center shadow-2xl transform rotate-[-6deg] hover:rotate-0 transition-transform duration-500 bg-white p-6",
      turno === "dia" ? "border-orange-300" : "border-purple-500"
    )}>
      <QRCodeSVG 
        value="https://app.inevarestobar.com.ar" 
        size={220}
        level="H"
        includeMargin={true}
      />
    </div>
    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-2 rounded-full text-sm font-bold shadow-lg whitespace-nowrap">
      📱 Escaneá para descargar la App
    </div>
  </motion.div>
</section>

        {/* --- SECCIÓN CONTÁCTANOS --- */}
        <section className={cls(
          "py-20 rounded-[3rem] px-8 md:px-16",
          turno === "dia" ? "bg-stone-100" : "bg-gradient-to-br from-purple-900/30 to-black border border-purple-500/20"
        )}>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Contactanos</h2>
            <p className="text-lg opacity-70">Estamos aquí para ayudarte</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* WhatsApp */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className={cls(
                "p-8 rounded-2xl text-center",
                turno === "dia" ? "bg-white shadow-lg" : "glass-panel"
              )}
            >
              <div className={cls(
                "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4",
                turno === "dia" ? "bg-green-100" : "bg-green-900/30"
              )}>
                <img src="https://i.ibb.co/Y41PQrm4/whathsapp.jpg" alt="WhatsApp" className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold mb-2">WhatsApp {turno === "dia" ? "Diurno" : "Nocturno"}</h3>
              <p className="text-2xl font-bold text-green-600 mb-2">{contacto.whatsapp}</p>
              <a href={`https://wa.me/549${contacto.whatsapp}`} target="_blank" rel="noopener noreferrer"
                className="inline-block px-6 py-2 bg-green-600 text-white rounded-full font-bold hover:bg-green-700 transition-colors">
                Escribir
              </a>
            </motion.div>

            {/* Teléfono Fijo */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className={cls(
                "p-8 rounded-2xl text-center",
                turno === "dia" ? "bg-white shadow-lg" : "glass-panel"
              )}
            >
              <div className={cls(
                "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4",
                turno === "dia" ? "bg-blue-100" : "bg-blue-900/30"
              )}>
                <Phone size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Teléfono Fijo</h3>
              <p className={cls("text-2xl font-bold mb-2", turno === "dia" ? "text-blue-600" : "text-blue-400")}>{contacto.fijo}</p>
              <p className="text-sm opacity-60">Ambos turnos</p>
            </motion.div>

            {/* Ubicación */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className={cls(
                "p-8 rounded-2xl text-center",
                turno === "dia" ? "bg-white shadow-lg" : "glass-panel"
              )}
            >
              <div className={cls(
                "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4",
                turno === "dia" ? "bg-orange-100" : "bg-purple-900/30"
              )}>
                <MapPin size={32} className={turno === "dia" ? "text-orange-600" : "text-purple-500"} />
              </div>
              <h3 className="text-xl font-bold mb-2">Ubicación</h3>
              <p className="opacity-80 mb-2">López y Planes 470</p>
              <p className="text-sm opacity-60">Orán, Salta</p>
            </motion.div>
          </div>

          {/* Mapa de Google con coordenadas reales */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-12 rounded-2xl overflow-hidden shadow-2xl border-4 border-opacity-20 border-current"
          >
            <iframe 
              src={`https://maps.google.com/maps?q=${LATITUD},${LONGITUD}&z=17&output=embed`}
              width="100%" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa Ineva Resto-Bar"
            />
          </motion.div>

          {/* Botón Cómo Llegar con coordenadas reales */}
          <div className="mt-8 text-center">
            <a 
              href={`https://www.google.com/maps/dir/?api=1&destination=${LATITUD},${LONGITUD}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cls(
                "inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105",
                turno === "dia" ? "bg-orange-600 text-white hover:bg-orange-700" : "bg-purple-600 text-white hover:bg-purple-700"
              )}
            >
              <Navigation size={20} />
              Cómo Llegar desde mi Ubicación
            </a>
          </div>
        </section>

        {/* --- FOOTER --- */}
        <footer className={cls("py-12 border-t flex flex-col md:flex-row justify-between items-center gap-6 text-sm opacity-80", turno === "dia" ? "border-stone-200" : "border-purple-900/30")}>
          <div className="flex items-center gap-3">
            <img src="https://i.ibb.co/mFgqvLS0/Whats-App-Image-2026-06-19-at-00-09-10.jpg" alt="Ineva" className="w-10 h-10" />
            <div className="font-black text-xl tracking-tighter">INEVA © 2024</div>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <span className="flex items-center gap-2"><Phone size={16} /> {contacto.whatsapp}</span>
            <span className="flex items-center gap-2"><Clock size={16} /> {turno === "dia" ? "09:00 - 15:00" : "21:00 - 04:00"}</span>
          </div>
          <div className="flex gap-4">
            <img src="https://i.ibb.co/0RJWRQdf/insta.jpg" alt="Instagram" className="w-6 h-6 cursor-pointer hover:opacity-70 transition-opacity" />
            <img src="https://i.ibb.co/FknZsZKg/facebook.jpg" alt="Facebook" className="w-6 h-6 cursor-pointer hover:opacity-70 transition-opacity" />
          </div>
        </footer>

        {/* --- TÉRMINOS LEGALES --- */}
        <section className="py-12 px-6 border-t border-opacity-20 border-current">
          <div className="max-w-4xl mx-auto text-center space-y-4 text-sm opacity-60">
            <p>
              <strong>Términos y Condiciones:</strong> Las reservas están sujetas a confirmación. 
              Se requiere un anticipo del 20% para grupos mayores a 10 personas. 
              Cancelaciones con menos de 24hs de anticipación no tienen reembolso.
            </p>
            <p>
              <strong>Política de Privacidad:</strong> Los datos proporcionados serán utilizados únicamente 
              para fines de reserva y comunicación. No compartimos información con terceros.
            </p>
            <p className="text-xs">
              © 2024 Ineva Resto-Bar. Todos los derechos reservados. | López y Planes 470, Orán, Salta
            </p>
          </div>
        </section>

        {/* --- ESTILOS BANDERA FLAMEANDO --- */}
        <style>{`
          @keyframes flamear {
            0%, 100% {
              transform: rotate(-3deg) skewX(0deg);
            }
            25% {
              transform: rotate(2deg) skewX(2deg);
            }
            50% {
              transform: rotate(-2deg) skewX(-1deg);
            }
            75% {
              transform: rotate(3deg) skewX(1deg);
            }
          }
          .bandera-flameando {
            animation: flamear 4s ease-in-out infinite;
            transform-origin: left center;
          }
        `}</style>

      </main>
    </div>
  );
}