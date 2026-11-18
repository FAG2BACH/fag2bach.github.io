/* Datos de ejemplo de Oficio Vivo (nombre provisional).
   Todo lo que la web enseña sale de aquí: para añadir un mentor, se añade un bloque a MENTORES.
   Las personas son inventadas; en la versión real irán con su permiso y su foto. */
"use strict";

window.OV_DATOS = {
  TELEFONO: "900 000 000",

  TEMAS: [
    { id: "costura", nombre: "Costura", color: "#F6D6C8" },
    { id: "carpinteria", nombre: "Carpintería", color: "#F3E3B8" },
    { id: "campo", nombre: "Campo y viñedo", color: "#D8EAD6" },
    { id: "cocina", nombre: "Cocina", color: "#FBE0C2" },
    { id: "dinero", nombre: "Dinero y emprender", color: "#D5E3F5" },
    { id: "salud", nombre: "Salud y cuidados", color: "#E6DCF3" },
    { id: "estudio", nombre: "Estudio e idiomas", color: "#F9EDB0" },
    { id: "mecanica", nombre: "Mecánica", color: "#DCE7E3" }
  ],

  MODOS: [
    { id: "persona", nombre: "En persona", corto: "en persona" },
    { id: "video", nombre: "Videollamada", corto: "por videollamada" },
    { id: "telefono", nombre: "Por teléfono", corto: "por teléfono" }
  ],

  MENTORES: [
    {
      id: "carmen", nombre: "Carmen Rodríguez", edad: 71, pueblo: "Zamora", tema: "costura",
      modos: ["persona", "telefono"], valoracion: 4.9, sesiones: 23,
      frase: "Te enseño a sacar un patrón desde cero.",
      historia: "Empezó a coser a los catorce años en el taller de su tía, en la calle de San Torcuato. Durante cuarenta años hizo trajes de novia, arreglos y uniformes para medio Zamora. Ahora le gusta enseñar lo que nadie explica en los tutoriales: cómo se toma bien una medida y por qué una costura tira.",
      aprendes: ["Tomar medidas y sacar un patrón", "Coser a máquina sin miedo", "Arreglos: bajos, cremalleras, entallar", "Elegir telas y no tirar el dinero"],
      disponibilidad: "Tardes de lunes a jueves",
      opiniones: [{ autor: "Lucía, 19", texto: "Me ayudó con los patrones de mi trabajo de fin de grado. Tiene una paciencia infinita." }]
    },
    {
      id: "antonio", nombre: "Antonio Martín", edad: 68, pueblo: "Toro", tema: "dinero",
      modos: ["video", "telefono"], valoracion: 4.8, sesiones: 17,
      frase: "Hablemos de tu primer presupuesto antes de pedir un préstamo.",
      historia: "Fue director de una sucursal bancaria durante treinta años y vio nacer (y cerrar) cientos de negocios. Sabe qué preguntas hace un banco y qué números hay que tener claros antes de lanzarse.",
      aprendes: ["Hacer un presupuesto realista", "Entender un préstamo y sus letras pequeñas", "Plan de empresa sencillo", "Ahorrar con un sueldo pequeño"],
      disponibilidad: "Mañanas, por videollamada",
      opiniones: [{ autor: "David, 22", texto: "Quería montar una tienda de bicis. Con él hice los números y vi que tenía que empezar más pequeño." }]
    },
    {
      id: "manuel", nombre: "Manuel Alonso", edad: 72, pueblo: "Fermoselle", tema: "campo",
      modos: ["persona"], valoracion: 5.0, sesiones: 9,
      frase: "Ven en vendimia y lo ves con tus manos.",
      historia: "Planta, poda y vendimia en los Arribes desde que era un crío. Su padre le enseñó a leer el tiempo mirando el cielo y a cuidar una cepa vieja. Le preocupa que nadie del pueblo quiera seguir con las viñas.",
      aprendes: ["Poda e injerto", "Calendario del viñedo", "Cómo se hace el vino en casa", "Huerto de temporada"],
      disponibilidad: "Fines de semana; en vendimia, cualquier día",
      opiniones: [{ autor: "Grupo de 1º de Bachillerato", texto: "Fuimos un sábado a la viña y nos explicó cada cepa. Lo mejor de la excursión." }]
    },
    {
      id: "pilar", nombre: "Pilar Gómez", edad: 74, pueblo: "Benavente", tema: "estudio",
      modos: ["persona", "video"], valoracion: 4.9, sesiones: 31,
      frase: "Estudiar más horas no es estudiar mejor.",
      historia: "Maestra durante treinta y ocho años en Benavente. Ha visto a tres generaciones de alumnos agobiarse antes de los exámenes y tiene un método muy suyo para organizar la semana y leer con atención.",
      aprendes: ["Organizar la semana de estudio", "Técnicas para memorizar", "Comprensión lectora", "Preparar la PAU sin agobios"],
      disponibilidad: "Martes y jueves por la tarde",
      opiniones: [{ autor: "Sara, 17", texto: "Pasé de estudiar muchas horas a estudiar bien. Me cambió el segundo trimestre." }]
    },
    {
      id: "rosa", nombre: "Rosa Prieto", edad: 66, pueblo: "Zamora", tema: "salud",
      modos: ["persona"], valoracion: 4.8, sesiones: 12,
      frase: "Primeros auxilios que de verdad se recuerdan.",
      historia: "Enfermera de urgencias en el hospital de Zamora durante más de treinta años. Ahora enseña lo básico que todo el mundo debería saber: qué hacer en los primeros minutos y cómo cuidar a un familiar en casa.",
      aprendes: ["Primeros auxilios y reanimación", "Cuidar a una persona mayor en casa", "Botiquín y medicamentos", "Si te interesa la enfermería, cómo es el trabajo"],
      disponibilidad: "Lunes y miércoles",
      opiniones: [{ autor: "Pablo, 18", texto: "Quiero estudiar Enfermería y me contó cómo es una guardia de verdad." }]
    },
    {
      id: "julian", nombre: "Julián Fernández", edad: 79, pueblo: "Zamora", tema: "carpinteria",
      modos: ["persona"], valoracion: 5.0, sesiones: 14,
      frase: "Un día en el taller vale más que un manual.",
      historia: "Ebanista desde 1962. Su taller sigue abierto, aunque ya solo trabaja por gusto. Restaura muebles antiguos y enseña a usar las herramientas de mano con seguridad.",
      aprendes: ["Herramientas de mano", "Restaurar un mueble", "Ensambles sin tornillos", "Tipos de madera"],
      disponibilidad: "Mañanas en su taller",
      opiniones: [{ autor: "Marcos, 20", texto: "Restauramos juntos la mesilla de mi abuela. Ahora tengo mis propias herramientas." }]
    },
    {
      id: "mariajesus", nombre: "María Jesús Lorenzo", edad: 69, pueblo: "Toro", tema: "cocina",
      modos: ["persona", "video"], valoracion: 4.9, sesiones: 19,
      frase: "La cocina de siempre, sin recetas de internet.",
      historia: "Llevó durante veinticinco años la cocina de un mesón de Toro. Cocina a ojo, pero sabe explicar por qué cada paso importa. Le encanta enseñar a los que se van a estudiar fuera a comer bien con poco.",
      aprendes: ["Guisos y legumbres", "Cocinar para toda la semana", "Aprovechar sobras", "Platos típicos de Zamora"],
      disponibilidad: "Mañanas de lunes a viernes",
      opiniones: [{ autor: "Irene, 18", texto: "Me fui a Salamanca sabiendo hacer cinco platos. Mis compañeros de piso se lo agradecen." }]
    },
    {
      id: "felipe", nombre: "Felipe Ramos", edad: 75, pueblo: "Zamora", tema: "mecanica",
      modos: ["persona"], valoracion: 4.7, sesiones: 8,
      frase: "Antes de llevarlo al taller, ábrelo y mira.",
      historia: "Mecánico durante cuarenta y cinco años, primero de tractores y luego de coches. Le gusta enseñar a entender una avería en lugar de asustarse con ella.",
      aprendes: ["Mantenimiento básico del coche", "Mecánica de motos y bicis", "Entender un presupuesto de taller", "Herramientas imprescindibles"],
      disponibilidad: "Tardes, en su garaje",
      opiniones: []
    },
    {
      id: "conchi", nombre: "Conchi Barrios", edad: 70, pueblo: "Benavente", tema: "cocina",
      modos: ["persona", "telefono"], valoracion: 5.0, sesiones: 11,
      frase: "La repostería es paciencia y buen horno.",
      historia: "Tuvo una pastelería en Benavente durante treinta años. Sus rosquillas y su bica tienen fama en toda la comarca. Enseña repostería tradicional y también a llevar un pequeño negocio de cara al público.",
      aprendes: ["Repostería tradicional", "Masas y tiempos de horno", "Atender a clientes", "Montar un puesto o una pequeña tienda"],
      disponibilidad: "Miércoles y viernes",
      opiniones: [{ autor: "Nerea, 21", texto: "Además de recetas, me explicó cómo calculaba precios en la pastelería." }]
    },
    {
      id: "luis", nombre: "Luis Calvo", edad: 73, pueblo: "Zamora", tema: "dinero",
      modos: ["persona", "video"], valoracion: 4.8, sesiones: 15,
      frase: "Cuarenta años detrás de un mostrador enseñan mucho.",
      historia: "Llevó una ferretería familiar durante cuarenta años. Sabe de proveedores, de inventario, de fiar o no fiar y de cómo aguantar los meses malos. Ayuda a quien quiere montar un pequeño comercio.",
      aprendes: ["Abrir un pequeño comercio", "Proveedores e inventario", "Atención al cliente", "Pasar los meses flojos"],
      disponibilidad: "Mañanas",
      opiniones: [{ autor: "Hugo, 24", texto: "Me ayudó a negociar con mi primer proveedor. Sin él habría pagado el doble." }]
    },
    {
      id: "teresa", nombre: "Teresa Vicente", edad: 67, pueblo: "Puebla de Sanabria", tema: "estudio",
      modos: ["video", "telefono"], valoracion: 4.9, sesiones: 27,
      frase: "Un idioma se aprende hablando, no rellenando fichas.",
      historia: "Profesora de francés en institutos de Zamora y de Lyon. Da conversación en francés e inglés y prepara entrevistas y exámenes orales, siempre desde casa y por videollamada.",
      aprendes: ["Conversación en francés", "Conversación en inglés", "Preparar exámenes orales", "Entrevistas de trabajo en otro idioma"],
      disponibilidad: "Tardes, por videollamada",
      opiniones: [{ autor: "Alba, 17", texto: "Aprobé el oral de francés sin quedarme en blanco." }]
    },
    {
      id: "ramon", nombre: "Ramón Esteban", edad: 77, pueblo: "Fermoselle", tema: "campo",
      modos: ["persona"], valoracion: 4.9, sesiones: 6,
      frase: "Un buen queso empieza en el campo, no en la quesería.",
      historia: "Pastor y quesero toda la vida. Conoce cada camino de los Arribes y sabe hacer queso como se hacía antes. Le gustaría que alguien joven aprendiera el oficio antes de que se pierda.",
      aprendes: ["Cuidar un rebaño", "Hacer queso artesano", "Caminos y plantas de los Arribes", "Vivir del campo hoy"],
      disponibilidad: "Mañanas, en el campo",
      opiniones: []
    }
  ],

  EPISODIOS: [
    { n: 4, titulo: "El motor que nadie quería arreglar", mentor: "felipe", minutos: 22, resumen: "Felipe cuenta cómo aprendió mecánica desmontando tractores y por qué una avería es una pregunta, no un drama." },
    { n: 3, titulo: "Cuarenta años entre telas", mentor: "carmen", minutos: 24, resumen: "De aprendiza a los catorce a vestir a medio Zamora: Carmen repasa una vida de taller." },
    { n: 2, titulo: "La viña que plantó mi padre", mentor: "manuel", minutos: 31, resumen: "Manuel habla de los Arribes, de las cepas viejas y del miedo a que nadie siga." },
    { n: 1, titulo: "Lo que aprendí prestando dinero", mentor: "antonio", minutos: 27, resumen: "Treinta años en un banco dan para muchas historias. Antonio explica qué separa a un negocio que dura de uno que cierra." }
  ],

  SERVICIOS: [
    { id: "charla", nombre: "Charlas", para: "Colegios, institutos, residencias y asociaciones", duracion: "1 hora", texto: "Un mentor cuenta su oficio y su vida, y responde preguntas. Se adapta a la edad del grupo." },
    { id: "taller", nombre: "Un día en el taller", para: "Grupos de hasta 6 estudiantes", duracion: "Una mañana", texto: "Prácticas de una jornada en el taller, la viña o la cocina de un mentor, con actividades preparadas." },
    { id: "programa", nombre: "Programa anual", para: "Ayuntamientos y empresas", duracion: "Un curso", texto: "Mentorías, charlas y salidas a lo largo del curso, con un informe de resultados al final." }
  ]
};
