import { useState, useRef, useCallback, useEffect } from "react";
import { Header } from "../components/Header";
import { Hero, ModalProduto } from "../components/Hero";
import { CardProduto } from "../components/Menu"; // Ajustaremos a exportação
import { Ticker, Footer, PWA } from "../components/UI";
import { Sacola, Checkout } from "../components/Cart";
import { CATS, CAT_ICONS } from "../lib/data";

import { db } from "../services/firebase";
import { ref, onValue, push } from "firebase/database";

// ── Seção cardápio dinâmico ──
const CardapioDinamico = ({ onAdicionar, produtosDb }) => {
  const [cat, setCat] = useState("Hambúrguer Artesanal");
  const [modal, setModal] = useState(null);

  const itemsDaCategoria = produtosDb.filter(p => p.cat === cat);

  const handleAdd = (item, qty) => {
    for(let i=0;i<qty;i++) onAdicionar(item);
  };

  return (
    <section id="cardapio" style={{background:"var(--bg)",paddingBottom:80}}>
      <div style={{background:"var(--pt)"}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"0 20px"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"28px 0 0"}}>
            <div style={{width:4,height:36,background:"var(--lj)",borderRadius:2}}/>
            <h2 style={{fontFamily:"var(--font-title)",fontSize:40,color:"#fff",letterSpacing:3}}>CARDÁPIO</h2>
          </div>
        </div>
        <div style={{overflowX:"auto",scrollbarWidth:"none"}}>
          <div style={{display:"flex",padding:"20px 20px 0",minWidth:"max-content",maxWidth:1200,margin:"0 auto"}}>
            {CATS.map(c=>(
              <button key={c} onClick={()=>setCat(c)} style={{
                padding:"10px 18px",display:"flex",alignItems:"center",gap:7,
                fontFamily:"var(--font-bold)",fontWeight:cat===c?800:600,fontSize:13,
                background:"transparent",cursor:"pointer",border:"none",
                color:cat===c?"var(--lj)":"rgba(255,255,255,.45)",
                borderBottom:cat===c?"3px solid var(--lj)":"3px solid transparent",
                transition:"all .2s",whiteSpace:"nowrap",letterSpacing:.3,
              }}>
                <span>{CAT_ICONS[c]}</span>{c}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"28px 20px 0"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:16}}>
          {itemsDaCategoria.map((item,i)=>(
            <CardProduto key={item.idDb||item.id} item={item} onAbrir={setModal} delay={i*45}/>
          ))}
          {itemsDaCategoria.length === 0 && <div style={{color:"var(--dim)",padding:20}}>Sem produtos nesta categoria.</div>}
        </div>
      </div>
      {modal && <ModalProduto item={modal} onFechar={()=>setModal(null)} onAdicionar={handleAdd}/>}
    </section>
  );
};

export default function Home() {
  const [cart, setCart]         = useState([]);
  const [sacolaOpen, setSacola] = useState(false);
  const [coData, setCoData]     = useState(null);
  
  // Realtime Data
  const [produtosDb, setProdutosDb] = useState([]);
  const [cuponsDb, setCuponsDb] = useState({});

  const menuRef = useRef(null);

  useEffect(() => {
    // Busca produtos
    const unsubP = onValue(ref(db, "produtos"), snap => {
      if(snap.exists()) setProdutosDb(Object.keys(snap.val()).map(k=>({ ...snap.val()[k], idDb:k })));
    });
    // Busca cupons (como dict pra facilitar busca do usuário)
    const unsubC = onValue(ref(db, "cupons"), snap => {
      if(snap.exists()) setCuponsDb(snap.val());
    });
    return () => { unsubP(); unsubC(); };
  }, []);

  const addCart = useCallback((item) => {
    setCart(prev => {
      const uid = `${item.idDb||item.id}-${item.nomeFull||item.nome}`;
      const ex = prev.find(i=>i._uid===uid);
      if(ex) return prev.map(i=>i._uid===uid?{...i,qty:i.qty+1}:i);
      return [...prev, { ...item, _uid:uid, qty:1, precoUni: item.precoUni??item.preco }];
    });
  }, []);

  const updateCart = (uid, qty) => {
    if(qty<=0) setCart(p=>p.filter(i=>i._uid!==uid));
    else setCart(p=>p.map(i=>i._uid===uid?{...i,qty}:i));
  };
  const removeCart = (uid) => setCart(p=>p.filter(i=>i._uid!==uid));

  const finalizar = (total, desc) => { setSacola(false); setCoData({total,desc}); };

  const confirmarPedido = async (dados) => {
    const pId = `#${Math.floor(Math.random() * 900) + 100}`;
    const p = {
      id: pId, cliente: dados.nome, tel: dados.tel,
      itens: cart, total: coData.total, status: "novo",
      hora: new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}),
      endereco: `${dados.rua}, ${dados.num} — ${dados.bairro}`,
      ts: Date.now()
    };
    
    // Grava no Realtime Database!
    await push(ref(db, "pedidos"), p);
    
    setCart([]);
    setCoData(null);
  };

  const cartN = cart.reduce((s,i)=>s+i.qty,0);

  return (
    <>
      <Ticker />
      <Header n={cartN} onCart={()=>setSacola(true)} onAdmin={() => window.location.href = "/admin"} />
      <Hero onMenu={()=>menuRef.current?.scrollIntoView({behavior:"smooth"})} />
      
      <div ref={menuRef}>
        <CardapioDinamico onAdicionar={addCart} produtosDb={produtosDb} />
      </div>

      <Footer />
      <PWA />

      {sacolaOpen && <Sacola itens={cart} onFechar={()=>setSacola(false)} onAtualizar={updateCart} onRemover={removeCart} onFinalizar={finalizar} cuponsDb={cuponsDb} />}
      {coData && <Checkout itens={cart} total={coData.total} desconto={coData.desc} onFechar={()=>setCoData(null)} onConfirmar={confirmarPedido} />}
    </>
  );
}
