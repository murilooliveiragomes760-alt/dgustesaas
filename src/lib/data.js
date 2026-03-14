export const WHATSAPP = "5561995654440";

export const fmt = (n) => `R$ ${Number(n).toFixed(2).replace(".", ",")}`;

export const CARDAPIO = {
  "Hambúrguer Artesanal": [
    {
      id: 1, nome: "DGUSTE TRIPLO", preco: 40, trio: 45, img: null, emoji: "🍔",
      tag: "TOP", cal: null,
      ingredientes: ["Pão brioche", "3 blends", "4 fatias bacon", "3 fatias cheddar", "Molho especial", "Alface", "Tomate"],
      desc: "Três blends artesanais, bacon crocante em camadas e cheddar derretido. Pra quem não brinca.",
    },
    {
      id: 2, nome: "DGUSTE DUPLO", preco: 30, trio: 35, img: null, emoji: "🍔",
      tag: "MAIS PEDIDO",
      ingredientes: ["Pão brioche", "2 blends", "2 fatias bacon", "2 fatias cheddar", "Molho especial", "Alface", "Tomate"],
      desc: "Duplo blend, duplo cheddar, duplo sabor. O equilíbrio perfeito.",
    },
    {
      id: 3, nome: "DGUSTE TUDO", preco: 30, trio: 35, img: null, emoji: "🤯",
      tag: "ESPECIAL",
      ingredientes: ["Pão brioche", "Blend 120g", "Bacon", "Cheddar", "Salsicha", "Ovo", "Milho", "Batata palha", "Molho especial", "Alface", "Tomate"],
      desc: "Tudo que tem de bom, em um só burger. Completo como tem que ser.",
    },
    {
      id: 4, nome: "DGUSTE BACON", preco: 22, trio: 27, img: null, emoji: "🥓",
      tag: null,
      ingredientes: ["Pão brioche", "Blend 120g", "Bacon", "Cheddar", "Molho especial", "Alface", "Tomate"],
      desc: "Blend artesanal com bacon confitado e cheddar cremoso.",
    },
    {
      id: 5, nome: "DGUSTE CARAMELIZADO", preco: 22, trio: 27, img: null, emoji: "🧅",
      tag: null,
      ingredientes: ["Pão brioche", "Blend 120g", "Cebola caramelizada", "Cheddar", "Molho especial", "Alface", "Tomate"],
      desc: "Cebola caramelizada artesanalmente. Um toque adocicado irresistível.",
    },
    {
      id: 6, nome: "DGUSTE CALABRESA", preco: 22, trio: 27, img: null, emoji: "🌶️",
      tag: null,
      ingredientes: ["Pão brioche", "Blend 120g", "Calabresa", "Cheddar", "Molho especial", "Alface", "Tomate"],
      desc: "Calabresa defumada com blend artesanal e cheddar.",
    },
    {
      id: 7, nome: "DGUSTE SALADA", preco: 22, trio: 27, img: null, emoji: "🥗",
      tag: null,
      ingredientes: ["Pão brioche", "Blend 120g", "Cheddar", "Molho especial", "Alface", "Tomate"],
      desc: "O clássico. Simples, equilibrado, sempre gostoso.",
    },
    {
      id: 8, nome: "DGUSTE FRANGO", preco: 22, trio: 27, img: null, emoji: "🍗",
      tag: null,
      ingredientes: ["Pão brioche", "Filé de frango", "Cheddar", "Bacon", "Molho especial", "Alface", "Tomate"],
      desc: "Filé de frango suculento com bacon e cheddar.",
    },
    {
      id: 9, nome: "DGUSTE EMPANADO", preco: 25, trio: 30, img: null, emoji: "🍗",
      tag: "CROCANTE",
      ingredientes: ["Pão brioche", "Filé de frango empanado", "Cheddar", "Bacon", "Molho especial", "Alface", "Tomate"],
      desc: "Frango empanado extra crocante, bacon e cheddar no pão brioche.",
    },
  ],
  "Hot Dog": [
    {
      id: 10, nome: "DOG DGUSTE", preco: 15, trio: 20, img: null, emoji: "🌭",
      tag: null,
      ingredientes: ["Pão", "Salsicha", "Creme cheddar", "Molho especial", "Milho", "Batata palha"],
      desc: "O dog artesanal da casa. Cremoso e saboroso.",
    },
    {
      id: 11, nome: "DOG DGUSTE BACON", preco: 15, trio: 20, img: null, emoji: "🌭",
      tag: null,
      ingredientes: ["Pão", "Salsicha", "Bacon", "Creme cheddar", "Molho especial", "Milho", "Batata palha"],
      desc: "Dog com bacon crocante por cima.",
    },
    {
      id: 12, nome: "DOG DGUSTE FRANGO", preco: 15, trio: 20, img: null, emoji: "🌭",
      tag: null,
      ingredientes: ["Pão", "Salsicha", "Filé de frango", "Creme cheddar", "Molho especial", "Milho", "Batata palha"],
      desc: "Dog com filé de frango temperado.",
    },
    {
      id: 13, nome: "DOG DGUSTE CALABRESA", preco: 15, trio: 20, img: null, emoji: "🌭",
      tag: null,
      ingredientes: ["Pão", "Salsicha", "Calabresa", "Creme cheddar", "Molho especial", "Milho", "Batata palha"],
      desc: "Dog com calabresa defumada.",
    },
  ],
  "Combos": [
    {
      id: 14, nome: "COMBO INDIVIDUAL", preco: 45, trio: null, img: null, emoji: "🍔",
      tag: "ECONÔMICO",
      ingredientes: ["1 DGUSTE SALADA", "Fritas cheddar bacon", "Anéis de cebola", "Coxinhas de frango", "Molho à escolha"],
      desc: "1 Dguste Salada + fritas cheddar bacon + anéis de cebola + coxinhas de frango + molho.",
    },
    {
      id: 15, nome: "COMBO DGUSTE", preco: 65, trio: null, img: null, emoji: "🍟",
      tag: "POPULAR",
      ingredientes: ["2 DGUSTE SALADA", "Fritas cheddar bacon", "Anéis de cebola", "Coxinhas de frango", "Molho à escolha"],
      desc: "2 Dguste Salada + fritas cheddar bacon + anéis de cebola + coxinhas de frango + molho.",
    },
    {
      id: 16, nome: "COMBO DGUSTE TRIPLO", preco: 80, trio: null, img: null, emoji: "🍟",
      tag: null,
      ingredientes: ["3 DGUSTE SALADA", "Fritas cheddar bacon", "Anéis de cebola", "Coxinhas de frango", "Molho à escolha"],
      desc: "3 Dguste Salada + fritas cheddar bacon + anéis de cebola + coxinhas de frango + molho.",
    },
    {
      id: 17, nome: "COMBO TETRA", preco: 95, trio: null, img: null, emoji: "🍟",
      tag: "GRUPO",
      ingredientes: ["2 DGUSTE SALADA", "Fritas cheddar bacon", "Anéis de cebola", "Coxinhas de frango", "Molho à escolha"],
      desc: "Combo especial Tetra + fritas cheddar bacon + anéis de cebola + coxinhas + molho.",
    },
    {
      id: 18, nome: "COMBO FAMÍLIA", preco: 120, trio: null, img: null, emoji: "👨‍👩‍👧‍👦",
      tag: "MELHOR VALOR",
      ingredientes: ["5 DGUSTE SALADA", "Fritas cheddar bacon", "Anéis de cebola", "Coxinhas de frango", "Molho à escolha"],
      desc: "5 Dguste Salada + fritas cheddar bacon + anéis de cebola + coxinhas + molho. Pra família toda!",
    },
  ],
  "Porções": [
    { id: 19, nome: "Fritas Cheddar e Bacon", preco: 25, trio: null, img: null, emoji: "🍟", tag: "FAVORITA", ingredientes: ["Batata frita crocante", "Cheddar cremoso", "Bacon crocante"], desc: "Fritas cobertas de cheddar e bacon. Difícil resistir." },
    { id: 20, nome: "Anéis de Cebola", preco: 25, trio: null, img: null, emoji: "🧅", tag: null, ingredientes: ["Anéis de cebola empanados"], desc: "Anéis de cebola empanados e crocantes." },
    { id: 21, nome: "Fritas Simples", preco: 20, trio: null, img: null, emoji: "🍟", tag: null, ingredientes: ["Batata frita temperada"], desc: "Fritas temperadas no ponto certo." },
    { id: 22, nome: "Fritas + Anéis de Cebola", preco: 25, trio: null, img: null, emoji: "🍟", tag: null, ingredientes: ["Batata frita", "Anéis de cebola"], desc: "Mix de fritas e anéis de cebola." },
  ],
  "Acréscimos": [
    { id: 23, nome: "Blend 120g", preco: 7, trio: null, img: null, emoji: "🥩", tag: null, ingredientes: [], desc: "Blend artesanal extra." },
    { id: 24, nome: "Bacon fatiado", preco: 4, trio: null, img: null, emoji: "🥓", tag: null, ingredientes: [], desc: "Fatias de bacon crocante." },
    { id: 25, nome: "Cebola caramelizada", preco: 4, trio: null, img: null, emoji: "🧅", tag: null, ingredientes: [], desc: "Cebola caramelizada artesanal." },
    { id: 26, nome: "Cheddar fatiado", preco: 5, trio: null, img: null, emoji: "🧀", tag: null, ingredientes: [], desc: "Fatias de cheddar cremoso." },
    { id: 27, nome: "Mussarela", preco: 5, trio: null, img: null, emoji: "🧀", tag: null, ingredientes: [], desc: "Fatias de mussarela." },
    { id: 28, nome: "Calabresa", preco: 4, trio: null, img: null, emoji: "🌶️", tag: null, ingredientes: [], desc: "Calabresa defumada." },
    { id: 29, nome: "Bacon cheddar fritas trio", preco: 4, trio: null, img: null, emoji: "🍟", tag: null, ingredientes: [], desc: "Adicional especial." },
    { id: 30, nome: "Ovo", preco: 2, trio: null, img: null, emoji: "🍳", tag: null, ingredientes: [], desc: "Ovo frito ou mexido." },
  ],
  "Bebidas": [
    { id: 31, nome: "Refrigerante lata 310ml", preco: 5, trio: null, img: null, emoji: "🥤", tag: null, ingredientes: [], desc: "Lata gelada 310ml." },
    { id: 32, nome: "Refrigerante lata 220ml", preco: 4, trio: null, img: null, emoji: "🥤", tag: null, ingredientes: [], desc: "Lata gelada 220ml." },
    { id: 33, nome: "Refrigerante 1.5L", preco: 10, trio: null, img: null, emoji: "🍾", tag: null, ingredientes: [], desc: "Garrafa 1,5L para a mesa." },
    { id: 34, nome: "Suco caixinha 200ml", preco: 3, trio: null, img: null, emoji: "🧃", tag: null, ingredientes: [], desc: "Suco de caixinha 200ml." },
  ],
  "Molhos": [
    { id: 35, nome: "Molho verde", preco: 2, trio: null, img: null, emoji: "🫙", tag: null, ingredientes: [], desc: "Molho verde artesanal da casa." },
    { id: 36, nome: "Pasta de alho", preco: 2, trio: null, img: null, emoji: "🫙", tag: null, ingredientes: [], desc: "Pasta de alho cremosa." },
    { id: 37, nome: "Maionese picante", preco: 2, trio: null, img: null, emoji: "🌶️", tag: null, ingredientes: [], desc: "Maionese com toque picante." },
    { id: 38, nome: "Baconese", preco: 2, trio: null, img: null, emoji: "🥓", tag: null, ingredientes: [], desc: "Maionese especial de bacon." },
    { id: 39, nome: "Barbecue", preco: 2, trio: null, img: null, emoji: "🫙", tag: null, ingredientes: [], desc: "Barbecue defumado artesanal." },
  ],
};

export const CATS = Object.keys(CARDAPIO);
export const CAT_ICONS = { "Hambúrguer Artesanal":"🍔", "Hot Dog":"🌭", "Combos":"🍟", "Porções":"🥔", "Acréscimos":"➕", "Bebidas":"🥤", "Molhos":"🫙" };

export const CUPONS_INICIAIS = {
  "DGUSTE10":   { desconto: 10, tipo: "pct",   desc: "10% de desconto",  ativo: true },
  "FRETEGRATIS":{ desconto: 0,  tipo: "frete", desc: "Frete grátis",     ativo: true },
  "CLIENTEVIP": { desconto: 15, tipo: "pct",   desc: "15% VIP",          ativo: true },
};

export const TAG_STYLE = { "TOP":"tag-vm","MAIS PEDIDO":"tag-lj","ESPECIAL":"tag-lj","CROCANTE":"tag-lj","POPULAR":"tag-lj","MELHOR VALOR":"tag-gn","ECONÔMICO":"tag-gn","GRUPO":"tag-az","FAVORITA":"tag-lj" };
