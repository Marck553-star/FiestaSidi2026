import {
  calculateParticipantCount,
  PRIZE_STOCK,
  SPORTS,
  WHATSAPP_COMMUNITY_URL,
} from "../shared/sports";

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

assert(
  calculateParticipantCount({ deporte: "futbolin-infantil", pareja: "si" }) === 2,
  "Futbolín infantil debe sumar 2.",
);
assert(
  calculateParticipantCount({ deporte: "futbolin-masculino", pareja: "si" }) === 2,
  "Futbolín masculino debe sumar 2.",
);
assert(
  calculateParticipantCount({ deporte: "basket-3x3-masculino", pareja: "si" }) === 3,
  "Basket 3x3 debe sumar 3.",
);
assert(SPORTS["natacion-infantil"].requiresAge === true, "Falta Natación Infantil.");
assert(PRIZE_STOCK.competitions[0].quantity === 35, "Deben constar 35 trofeos.");
assert(PRIZE_STOCK.competitions[3].quantity === 31, "Deben constar 31 medallas de plata.");
assert(WHATSAPP_COMMUNITY_URL.includes("chat.whatsapp.com"), "Falta el enlace de WhatsApp.");

console.log("✓ Futbolín, Basket, Natación, premios y WhatsApp verificados.");
