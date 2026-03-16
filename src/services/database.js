import { db, storage } from "./firebase";
import {
  ref,
  set,
  get,
  push,
  update,
  remove,
  onValue,
  query,
  orderByChild,
} from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

// ═══════════════════════════════════════════════════════════
// CARDÁPIO (Produtos)
// ═══════════════════════════════════════════════════════════

/** Listener em tempo real para o cardápio completo */
export function onCardapio(callback) {
  const r = ref(db, "cardapio");
  return onValue(r, (snap) => {
    const data = snap.val();
    if (!data) {
      callback({});
      return;
    }
    // data = { "Hambúrguer": { "-id1": {...}, "-id2": {...} }, "Hot Dog": {...} }
    const result = {};
    Object.entries(data).forEach(([cat, items]) => {
      result[cat] = Object.entries(items).map(([fbKey, item]) => ({
        ...item,
        _fbKey: fbKey,
      }));
    });
    callback(result);
  });
}

/** Adicionar produto ao cardápio */
export async function addProduto(categoria, produto) {
  const r = ref(db, `cardapio/${categoria}`);
  const newRef = push(r);
  await set(newRef, produto);
  return newRef.key;
}

/** Remover produto do cardápio */
export async function deleteProduto(categoria, fbKey) {
  const r = ref(db, `cardapio/${categoria}/${fbKey}`);
  await remove(r);
}

// ═══════════════════════════════════════════════════════════
// PEDIDOS
// ═══════════════════════════════════════════════════════════

/** Listener em tempo real para pedidos */
export function onPedidos(callback) {
  const r = ref(db, "pedidos");
  return onValue(r, (snap) => {
    const data = snap.val();
    if (!data) {
      callback([]);
      return;
    }
    const arr = Object.entries(data)
      .map(([fbKey, p]) => ({ ...p, _fbKey: fbKey }))
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    callback(arr);
  });
}

/** Criar novo pedido */
export async function addPedido(pedido) {
  const r = ref(db, "pedidos");
  const newRef = push(r);
  await set(newRef, {
    ...pedido,
    timestamp: Date.now(),
  });
  return newRef.key;
}

/** Atualizar status de um pedido */
export async function updatePedidoStatus(fbKey, status) {
  const r = ref(db, `pedidos/${fbKey}`);
  await update(r, { status });
}

/** Contar pedidos para gerar próximo ID sequencial */
export async function getProximoIdPedido() {
  const r = ref(db, "pedidos");
  const snap = await get(r);
  const count = snap.exists() ? Object.keys(snap.val()).length : 0;
  return `#${String(count + 1).padStart(3, "0")}`;
}

// ═══════════════════════════════════════════════════════════
// CUPONS
// ═══════════════════════════════════════════════════════════

/** Listener em tempo real para cupons */
export function onCupons(callback) {
  const r = ref(db, "cupons");
  return onValue(r, (snap) => {
    callback(snap.val() || {});
  });
}

/** Criar/atualizar cupom */
export async function setCupom(code, cupomData) {
  const r = ref(db, `cupons/${code}`);
  await set(r, cupomData);
}

/** Alternar ativo/inativo de um cupom */
export async function toggleCupom(code, ativo) {
  const r = ref(db, `cupons/${code}`);
  await update(r, { ativo });
}

/** Deletar cupom */
export async function deleteCupom(code) {
  const r = ref(db, `cupons/${code}`);
  await remove(r);
}

/** Incrementar uso do cupom */
export async function incrementarUsoCupom(code) {
  const r = ref(db, `cupons/${code}`);
  const snap = await get(r);
  if (snap.exists()) {
    const data = snap.val();
    await update(r, { uso: (data.uso || 0) + 1 });
  }
}

// ═══════════════════════════════════════════════════════════
// REGIÕES
// ═══════════════════════════════════════════════════════════

/** Listener em tempo real para regiões */
export function onRegioes(callback) {
  const r = ref(db, "regioes");
  return onValue(r, (snap) => {
    const data = snap.val();
    if (!data) {
      callback([]);
      return;
    }
    callback(Object.values(data));
  });
}

// ═══════════════════════════════════════════════════════════
// IMAGENS (Storage)
// ═══════════════════════════════════════════════════════════

/** Upload de imagem de produto */
export async function uploadImagem(produtoId, file) {
  const sRef = storageRef(storage, `produtos/${produtoId}`);
  await uploadBytes(sRef, file);
  const url = await getDownloadURL(sRef);
  return url;
}

/** Salvar URL da imagem no banco */
export async function setImagemUrl(produtoId, url) {
  const r = ref(db, `imagens/${produtoId}`);
  await set(r, url);
}

/** Listener para mapa de imagens */
export function onImagens(callback) {
  const r = ref(db, "imagens");
  return onValue(r, (snap) => {
    callback(snap.val() || {});
  });
}

/** Deletar imagem */
export async function deleteImagem(produtoId) {
  const r = ref(db, `imagens/${produtoId}`);
  await remove(r);
}

// ═══════════════════════════════════════════════════════════
// CONFIG (horário, whatsapp, etc)
// ═══════════════════════════════════════════════════════════

export function onConfig(callback) {
  const r = ref(db, "config");
  return onValue(r, (snap) => {
    callback(snap.val() || { wpp: "556192895069" });
  });
}
