export const DEMO_HOUSEHOLD = {
  id: "H001", owner: "María García", address: "Cra 19 #14-22, B. Centro",
  zone: "Centro", score: 92, status: "Excelente", points: 450, level: "Oro",
  irsu: { name: "Sandra Morales", phone: "3201234567" },
  recycler: { name: "Pedro López", phone: "3201112233" },
  history: [
    { month: "Enero", score: 85 }, { month: "Febrero", score: 88 },
    { month: "Marzo", score: 90 }, { month: "Abril", score: 87 },
    { month: "Mayo", score: 91 }, { month: "Junio", score: 92 },
  ],
  nextPickup: { green: "Mañana 6:00 AM", white: "Miércoles 6:00 AM", black: "Jueves 6:00 AM" },
  rewards: [
    { date: "2026-06-10", type: "Descuento 15% tarifa aseo", points: -100 },
    { date: "2026-05-15", type: "Bono COP $30.000 comercio local", points: -150 },
    { date: "2026-06-01", type: "+50 puntos clasificación perfecta", points: 50 },
    { date: "2026-05-20", type: "+25 puntos consistencia mensual", points: 25 },
  ],
  notifications: [
    { id: 1, text: "¡Felicidades! Tu puntaje subió a 92. Nivel ORO alcanzado 🏆", time: "Hace 2 días", read: false },
    { id: 2, text: "Próxima recolección de reciclables: miércoles 6:00 AM", time: "Hace 1 día", read: true },
    { id: 3, text: "Nuevo incentivo disponible: sorteo de electrodoméstico para hogares Platino", time: "Hace 3 días", read: false },
  ]
};
