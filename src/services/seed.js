import { db } from "./firebase";
import { ref, set, get } from "firebase/database";

/**
 * Dados iniciais extraídos do DGUSTE_v3_1.jsx
 * Roda uma vez para popular o Firebase Realtime Database
 */

const CARDAPIO = {
  "Hambúrguer": [
    { id: 1, nome: "DGUSTE TRIPLO", preco: 40, trio: 45, emoji: "🍔", tag: "TOP", ing: ["Pão brioche", "3 blends", "4 fatias bacon", "3 fatias cheddar", "Molho especial", "Alface", "Tomate"], desc: "Três blends artesanais, bacon em camadas e cheddar derretido. Pra quem não brinca." },
    { id: 2, nome: "DGUSTE DUPLO", preco: 30, trio: 35, emoji: "🍔", tag: "+ PEDIDO", ing: ["Pão brioche", "2 blends", "2 fatias bacon", "2 fatias cheddar", "Molho especial", "Alface", "Tomate"], desc: "Duplo blend, duplo cheddar, duplo sabor." },
    { id: 3, nome: "DGUSTE TUDO", preco: 30, trio: 35, emoji: "🤯", tag: "ESPECIAL", ing: ["Pão brioche", "Blend 120g", "Bacon", "Cheddar", "Salsicha", "Ovo", "Milho", "Batata palha", "Molho especial", "Alface", "Tomate"], desc: "Tudo que tem de bom num só burger." },
    { id: 4, nome: "DGUSTE BACON", preco: 22, trio: 27, emoji: "🥓", tag: null, ing: ["Pão brioche", "Blend 120g", "Bacon confitado", "Cheddar", "Molho especial", "Alface", "Tomate"], desc: "Blend artesanal com bacon confitado e cheddar cremoso." },
    { id: 5, nome: "DGUSTE CARAMELIZADO", preco: 22, trio: 27, emoji: "🧅", tag: null, ing: ["Pão brioche", "Blend 120g", "Cebola caramelizada", "Cheddar", "Molho especial", "Alface", "Tomate"], desc: "Cebola caramelizada artesanalmente." },
    { id: 6, nome: "DGUSTE CALABRESA", preco: 22, trio: 27, emoji: "🌶️", tag: null, ing: ["Pão brioche", "Blend 120g", "Calabresa", "Cheddar", "Molho especial", "Alface", "Tomate"], desc: "Calabresa defumada com blend artesanal." },
    { id: 7, nome: "DGUSTE SALADA", preco: 22, trio: 27, emoji: "🥗", tag: null, ing: ["Pão brioche", "Blend 120g", "Cheddar", "Molho especial", "Alface", "Tomate"], desc: "O clássico. Simples, equilibrado, sempre gostoso." },
    { id: 8, nome: "DGUSTE FRANGO", preco: 22, trio: 27, emoji: "🍗", tag: null, ing: ["Pão brioche", "Filé de frango", "Cheddar", "Bacon", "Molho especial", "Alface", "Tomate"], desc: "Filé de frango suculento com bacon e cheddar." },
    { id: 9, nome: "DGUSTE EMPANADO", preco: 25, trio: 30, emoji: "🍗", tag: "CROCANTE", ing: ["Pão brioche", "Filé de frango empanado", "Cheddar", "Bacon", "Molho especial", "Alface", "Tomate"], desc: "Frango empanado extra crocante com bacon e cheddar." },
  ],
  "Hot Dog": [
    { id: 10, nome: "DOG DGUSTE", preco: 15, trio: 20, emoji: "🌭", tag: null, ing: ["Pão", "Salsicha", "Creme cheddar", "Molho especial", "Milho", "Batata palha"], desc: "O dog artesanal da casa. Cremoso e saboroso." },
    { id: 11, nome: "DOG BACON", preco: 15, trio: 20, emoji: "🌭", tag: null, ing: ["Pão", "Salsicha", "Bacon", "Creme cheddar", "Molho especial", "Milho", "Batata palha"], desc: "Com bacon crocante por cima." },
    { id: 12, nome: "DOG FRANGO", preco: 15, trio: 20, emoji: "🌭", tag: null, ing: ["Pão", "Salsicha", "Filé de frango", "Creme cheddar", "Molho especial", "Milho", "Batata palha"], desc: "Com filé de frango temperado." },
    { id: 13, nome: "DOG CALABRESA", preco: 15, trio: 20, emoji: "🌭", tag: null, ing: ["Pão", "Salsicha", "Calabresa", "Creme cheddar", "Molho especial", "Milho", "Batata palha"], desc: "Com calabresa defumada." },
  ],
  "Combos": [
    { id: 14, nome: "COMBO INDIVIDUAL", preco: 45, trio: null, emoji: "🍔", tag: "ECONÔMICO", ing: ["1 Dguste Salada", "Fritas cheddar bacon", "Anéis de cebola", "Coxinhas", "Molho à escolha"], desc: "1 Dguste Salada + fritas + anéis + coxinhas + molho." },
    { id: 15, nome: "COMBO DGUSTE", preco: 65, trio: null, emoji: "🍟", tag: "POPULAR", ing: ["2 Dguste Salada", "Fritas cheddar bacon", "Anéis de cebola", "Coxinhas", "Molho à escolha"], desc: "2 Dguste Salada + fritas + anéis + coxinhas + molho." },
    { id: 16, nome: "COMBO TRIPLO", preco: 80, trio: null, emoji: "🍟", tag: null, ing: ["3 Dguste Salada", "Fritas cheddar bacon", "Anéis de cebola", "Coxinhas", "Molho à escolha"], desc: "3 Dguste Salada + fritas + anéis + coxinhas + molho." },
    { id: 17, nome: "COMBO TETRA", preco: 95, trio: null, emoji: "🍟", tag: "GRUPO", ing: ["4 Dguste Salada", "Fritas cheddar bacon", "Anéis de cebola", "Coxinhas", "Molho à escolha"], desc: "4 Dguste Salada + fritas + anéis + coxinhas + molho." },
    { id: 18, nome: "COMBO FAMÍLIA", preco: 120, trio: null, emoji: "👨‍👩‍👧‍👦", tag: "MELHOR VALOR", ing: ["5 Dguste Salada", "Fritas cheddar bacon", "Anéis de cebola", "Coxinhas", "Molho à escolha"], desc: "5 Dguste Salada + fritas + anéis + coxinhas + molho. Família toda!" },
  ],
  "Porções": [
    { id: 19, nome: "Fritas Cheddar Bacon", preco: 25, trio: null, emoji: "🍟", tag: "FAVORITA", ing: ["Batata frita", "Cheddar cremoso", "Bacon crocante"], desc: "Irresistível! A mais pedida." },
    { id: 20, nome: "Anéis de Cebola", preco: 25, trio: null, emoji: "🧅", tag: null, ing: ["Anéis empanados"], desc: "Crocantes e saborosos." },
    { id: 21, nome: "Fritas Simples", preco: 20, trio: null, emoji: "🍟", tag: null, ing: ["Batata frita temperada"], desc: "Fritas crocantes no ponto." },
    { id: 22, nome: "Fritas + Anéis", preco: 25, trio: null, emoji: "🍟", tag: null, ing: ["Batata frita", "Anéis de cebola"], desc: "Mix crocante das duas." },
  ],
  "Acréscimos": [
    { id: 23, nome: "Blend 120g", preco: 7, trio: null, emoji: "🥩", tag: null, ing: [], desc: "Blend artesanal extra." },
    { id: 24, nome: "Bacon fatiado", preco: 4, trio: null, emoji: "🥓", tag: null, ing: [], desc: "Fatias de bacon crocante." },
    { id: 25, nome: "Cebola caramelizada", preco: 4, trio: null, emoji: "🧅", tag: null, ing: [], desc: "Cebola caramelizada." },
    { id: 26, nome: "Cheddar fatiado", preco: 5, trio: null, emoji: "🧀", tag: null, ing: [], desc: "Fatias de cheddar." },
    { id: 27, nome: "Mussarela", preco: 5, trio: null, emoji: "🧀", tag: null, ing: [], desc: "Fatias de mussarela." },
    { id: 28, nome: "Calabresa", preco: 4, trio: null, emoji: "🌶️", tag: null, ing: [], desc: "Calabresa defumada." },
    { id: 29, nome: "Bacon cheddar trio", preco: 4, trio: null, emoji: "🍟", tag: null, ing: [], desc: "Adicional especial." },
    { id: 30, nome: "Ovo", preco: 2, trio: null, emoji: "🍳", tag: null, ing: [], desc: "Ovo frito ou mexido." },
  ],
  "Bebidas": [
    { id: 31, nome: "Refrigerante 310ml", preco: 5, trio: null, emoji: "🥤", tag: null, ing: [], desc: "Lata gelada 310ml." },
    { id: 32, nome: "Refrigerante 220ml", preco: 4, trio: null, emoji: "🥤", tag: null, ing: [], desc: "Lata gelada 220ml." },
    { id: 33, nome: "Refrigerante 1,5L", preco: 10, trio: null, emoji: "🍾", tag: null, ing: [], desc: "Garrafa 1,5L." },
    { id: 34, nome: "Suco caixinha", preco: 3, trio: null, emoji: "🧃", tag: null, ing: [], desc: "Suco de caixinha 200ml." },
  ],
  "Molhos": [
    { id: 35, nome: "Molho verde", preco: 2, trio: null, emoji: "🫙", tag: null, ing: [], desc: "Molho verde artesanal." },
    { id: 36, nome: "Pasta de alho", preco: 2, trio: null, emoji: "🫙", tag: null, ing: [], desc: "Pasta de alho cremosa." },
    { id: 37, nome: "Maionese picante", preco: 2, trio: null, emoji: "🌶️", tag: null, ing: [], desc: "Maionese com toque picante." },
    { id: 38, nome: "Baconese", preco: 2, trio: null, emoji: "🥓", tag: null, ing: [], desc: "Maionese especial de bacon." },
    { id: 39, nome: "Barbecue", preco: 2, trio: null, emoji: "🫙", tag: null, ing: [], desc: "Barbecue defumado artesanal." },
  ],
};

const REGIOES = [
  { id: 1, nome: "Asa Norte", taxa: 0 },
  { id: 2, nome: "Asa Sul", taxa: 0 },
  { id: 3, nome: "Lago Norte", taxa: 5 },
  { id: 4, nome: "Lago Sul", taxa: 5 },
  { id: 5, nome: "Sudoeste", taxa: 3 },
  { id: 6, nome: "Noroeste", taxa: 3 },
  { id: 7, nome: "Taguatinga", taxa: 8 },
  { id: 8, nome: "Ceilândia", taxa: 10 },
  { id: 9, nome: "Samambaia", taxa: 10 },
  { id: 10, nome: "Guará", taxa: 6 },
  { id: 11, nome: "Park Way", taxa: 8 },
  { id: 12, nome: "Sobradinho", taxa: 12 },
  { id: 13, nome: "Planaltina", taxa: 15 },
  { id: 14, nome: "Outras regiões", taxa: 15 },
];

const CUPONS = {
  DGUSTE10: { desc: 10, tipo: "pct", label: "10% de desconto", ativo: true, limite: 200, uso: 34, val: "2026-12-31" },
  FRETEGRATIS: { desc: 0, tipo: "frete", label: "Frete grátis", ativo: true, limite: 500, uso: 89, val: "2026-12-31" },
  CLIENTEVIP: { desc: 15, tipo: "pct", label: "15% VIP", ativo: true, limite: 50, uso: 12, val: "2026-06-30" },
  PROMO20: { desc: 20, tipo: "pct", label: "20% PROMO", ativo: true, limite: 30, uso: 5, val: "2026-03-31" },
};

const PEDIDOS_DEMO = [
  { id: "#001", cliente: "João Silva", tel: "(61)99999-0001", endereco: "Asa Norte, 912 Bl.B", regiao: "Asa Norte", itens: [{ nome: "DGUSTE BACON", nomeFull: "DGUSTE BACON", qty: 2, precoUni: 22, emoji: "🥓" }, { nome: "Fritas Cheddar Bacon", nomeFull: "Fritas Cheddar Bacon", qty: 1, precoUni: 25, emoji: "🍟" }], total: 69, status: "entregue", hora: "18:32", data: "14/03/2026", nota: 4.8 },
  { id: "#002", cliente: "Maria Costa", tel: "(61)98888-0002", endereco: "Asa Sul, 408 Bl.A", regiao: "Asa Sul", itens: [{ nome: "DGUSTE TRIPLO", nomeFull: "DGUSTE TRIPLO", qty: 1, precoUni: 40, emoji: "🍔" }, { nome: "Refrigerante 310ml", nomeFull: "Refrigerante 310ml", qty: 2, precoUni: 5, emoji: "🥤" }], total: 50, status: "preparando", hora: "19:45", data: "14/03/2026", nota: null },
  { id: "#003", cliente: "Pedro Alves", tel: "(61)97777-0003", endereco: "Lago Norte, QI 20", regiao: "Lago Norte", itens: [{ nome: "COMBO FAMÍLIA", nomeFull: "COMBO FAMÍLIA", qty: 1, precoUni: 120, emoji: "👨‍👩‍👧‍👦" }], total: 120, status: "novo", hora: "19:52", data: "14/03/2026", nota: null },
  { id: "#004", cliente: "Ana Lima", tel: "(61)96666-0004", endereco: "Sudoeste, CLSW 302", regiao: "Sudoeste", itens: [{ nome: "DGUSTE DUPLO", nomeFull: "DGUSTE DUPLO (Trio)", qty: 1, precoUni: 35, emoji: "🍔" }, { nome: "Molho verde", nomeFull: "Molho verde", qty: 2, precoUni: 2, emoji: "🫙" }], total: 39, status: "pronto", hora: "19:28", data: "14/03/2026", nota: 5.0 },
  { id: "#005", cliente: "Lucas Mendes", tel: "(61)95555-0005", endereco: "Taguatinga Sul, QS 4", regiao: "Taguatinga", itens: [{ nome: "DGUSTE EMPANADO", nomeFull: "DGUSTE EMPANADO", qty: 2, precoUni: 25, emoji: "🍗" }], total: 50, status: "entregue", hora: "17:10", data: "14/03/2026", nota: 4.5 },
  { id: "#006", cliente: "Fernanda Reis", tel: "(61)94444-0006", endereco: "Guará II, QE 38", regiao: "Guará", itens: [{ nome: "COMBO DGUSTE", nomeFull: "COMBO DGUSTE", qty: 1, precoUni: 65, emoji: "🍟" }], total: 65, status: "entregue", hora: "16:40", data: "13/03/2026", nota: 5.0 },
  { id: "#007", cliente: "Roberto Nunes", tel: "(61)93333-0007", endereco: "Ceilândia Norte, QNM 40", regiao: "Ceilândia", itens: [{ nome: "DGUSTE TUDO", nomeFull: "DGUSTE TUDO", qty: 1, precoUni: 30, emoji: "🤯" }, { nome: "DOG BACON", nomeFull: "DOG BACON", qty: 1, precoUni: 15, emoji: "🌭" }], total: 45, status: "cancelado", hora: "15:20", data: "13/03/2026", nota: null },
  { id: "#008", cliente: "Camila Torres", tel: "(61)92222-0008", endereco: "Noroeste, SQNW 311", regiao: "Noroeste", itens: [{ nome: "DGUSTE CARAMELIZADO", nomeFull: "DGUSTE CARAMELIZADO", qty: 1, precoUni: 22, emoji: "🧅" }, { nome: "Anéis de Cebola", nomeFull: "Anéis de Cebola", qty: 1, precoUni: 25, emoji: "🧅" }], total: 47, status: "entregue", hora: "20:10", data: "13/03/2026", nota: 4.9 },
];

const CONFIG = {
  wpp: "556192895069",
  nomeRestaurante: "DGUSTE",
  subtitulo: "HAMBURGUERIA",
  ano: "2026",
  cidade: "Brasília – DF",
  telefone: "(61) 9 2895-0069",
  horarios: "Seg–Sex: 18h–23h | Sáb–Dom: 12h–00h",
};

/**
 * Popula o Firebase com todos os dados iniciais.
 * Só executa se o banco estiver vazio (checa se "cardapio" existe).
 */
export async function seedDatabase() {
  const r = ref(db, "cardapio");
  const snap = await get(r);

  if (snap.exists()) {
    console.log("🔵 Banco já contém dados. Seed ignorado.");
    return false;
  }

  console.log("🟡 Populando banco de dados...");

  // Cardápio — transforma array em objetos com chave = id
  const cardapioObj = {};
  Object.entries(CARDAPIO).forEach(([cat, items]) => {
    cardapioObj[cat] = {};
    items.forEach((item) => {
      cardapioObj[cat][`item_${item.id}`] = item;
    });
  });

  // Regiões — transforma array em objetos com chave = id
  const regioesObj = {};
  REGIOES.forEach((r) => {
    regioesObj[`reg_${r.id}`] = r;
  });

  // Pedidos demo com timestamps
  const pedidosObj = {};
  PEDIDOS_DEMO.forEach((p, i) => {
    pedidosObj[`demo_${i + 1}`] = {
      ...p,
      timestamp: Date.now() - (PEDIDOS_DEMO.length - i) * 600000, // escalonados 10min cada
    };
  });

  // Grava tudo no Firebase
  await set(ref(db, "cardapio"), cardapioObj);
  await set(ref(db, "regioes"), regioesObj);
  await set(ref(db, "cupons"), CUPONS);
  await set(ref(db, "pedidos"), pedidosObj);
  await set(ref(db, "config"), CONFIG);

  console.log("✅ Banco de dados populado com sucesso!");
  return true;
}
