import { useState } from "react";
import { CARDAPIO, CATS, CAT_ICONS, fmt, TAG_STYLE } from "../lib/data";
import { ModalProduto } from "./Hero";

// ── Card do produto ──
export const CardProduto = ({ item, onAbrir, delay=0 }) => {
  const temTrio = item.trio !== null && item.trio !== undefined;
  return (
    <div className="card up" style={{animationDelay:`${delay}ms`,overflow:"hidden",cursor:"pointer",transition:"all .25s"}}
      onClick={()=>onAbrir(item)}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 12px 36px rgba(255,107,0,.15)"}}
      onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="var(--sh)"}}>
      {/* Imagem */}
      <div style={{height:150,background:"linear-gradient(135deg,var(--pt),#1a0000)",position:"relative",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
        {item.img ? (
          <img src={item.img} alt={item.nome} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
        ) : (
          <span style={{fontSize:58,animation:"flt 3s ease-in-out infinite",display:"block"}}>{item.emoji}</span>
        )}
        {item.tag && <span className={`tag ${TAG_STYLE[item.tag]||"tag-lj"}`} style={{position:"absolute",top:10,left:10}}>{item.tag}</span>}
        {temTrio && <span className="tag tag-gn" style={{position:"absolute",top:10,right:10}}>+ Trio</span>}
      </div>
      {/* Info */}
      <div style={{padding:14}}>
        <h3 style={{fontFamily:"var(--font-bold)",fontWeight:800,fontSize:15,marginBottom:4,letterSpacing:.3}}>{item.nome}</h3>
        <p style={{fontSize:12,color:"var(--muted)",lineHeight:1.45,marginBottom:12,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{item.desc}</p>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontFamily:"var(--font-bold)",fontWeight:900,fontSize:20,color:"var(--lj)"}}>{fmt(item.preco)}</div>
            {temTrio && <div style={{fontSize:11,color:"var(--dim)"}}>Trio: {fmt(item.trio)}</div>}
          </div>
          <div style={{width:38,height:38,borderRadius:11,background:"var(--lj)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:20,boxShadow:"0 4px 14px var(--ljg)",transition:"transform .15s"}}
            onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"}
            onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
            +
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Seção cardápio ──
export const Cardapio = ({ onAdicionar }) => {
  const [cat, setCat] = useState("Hambúrguer Artesanal");
  const [modal, setModal] = useState(null);

  // No modo SAAS, os itens e imagens vão vir do banco depois, por enquanto usamos os mocks
  const itemsDaCategoria = CARDAPIO[cat] || [];

  const handleAdd = (item, qty) => {
    for(let i=0;i<qty;i++) onAdicionar(item);
  };

  return (
    <section id="cardapio" style={{background:"var(--bg)",paddingBottom:80}}>
      {/* Cabeçalho escuro */}
      <div style={{background:"var(--pt)"}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"0 20px"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"28px 0 0"}}>
            <div style={{width:4,height:36,background:"var(--lj)",borderRadius:2}}/>
            <h2 style={{fontFamily:"var(--font-title)",fontSize:40,color:"#fff",letterSpacing:3}}>CARDÁPIO</h2>
          </div>
        </div>
        {/* tabs */}
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
      {/* grid */}
      <div style={{maxWidth:1200,margin:"0 auto",padding:"28px 20px 0"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:16}}>
          {itemsDaCategoria.map((item,i)=>(
            <CardProduto key={item.id} item={item} onAbrir={setModal} delay={i*45}/>
          ))}
        </div>
      </div>
      {modal && <ModalProduto item={modal} onFechar={()=>setModal(null)} onAdicionar={handleAdd}/>}
    </section>
  );
};
