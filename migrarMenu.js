import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAhaqx8Wkn6MOtkCdJK--WhfTy3ZcULOeo",
  authDomain: "pagina-ineva.firebaseapp.com",
  projectId: "pagina-ineva",
  storageBucket: "pagina-ineva.firebasestorage.app",
  messagingSenderId: "634812168080",
  appId: "1:634812168080:web:ebf993399d546c36bc6515"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Menú completo con Picada Ineva agregada
const menuData = {
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
      img: "https://i.ibb.co/P8xdKTq/picadaineva.jpg"
    }
  ]
};

// Función para migrar el menú
async function migrarMenu() {
  console.log(' Iniciando migración del menú...\n');
  
  try {
    // Referencia al documento
    const menuRef = doc(db, 'website', 'menu');
    
    console.log('📝 Escribiendo datos en Firestore...');
    await setDoc(menuRef, menuData);
    
    console.log('✅ Menú migrado exitosamente!');
    console.log(`   - ${menuData.dia.length} productos en menú diurno`);
    console.log(`   - ${menuData.noche.length} productos en menú nocturno`);
    console.log('\n🎉 Picada Ineva agregada al menú nocturno!');
    console.log('\n💡 Ahora podés ver los cambios en:');
    console.log('   https://inevarestobar.com.ar\n');
    
  } catch (error) {
    console.error('❌ Error al migrar el menú:', error.message);
    console.error('\n💡 Posibles soluciones:');
    console.error('   1. Verificá que las reglas de Firestore permitan escritura');
    console.error('   2. Verificá tu conexión a internet');
    console.error('   3. Verificá que las credenciales de Firebase sean correctas\n');
  }
  
  process.exit(0);
}

// Ejecutar la migración
migrarMenu();