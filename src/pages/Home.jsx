import { useState, useEffect, useRef, useCallback } from "react";
import { onCardapio, onRegioes, onCupons, onImagens, onConfig, addPedido, getProximoIdPedido, incrementarUsoCupom } from "../services/database";

const fmt = (n) => `R$ ${Number(n).toFixed(2).replace(".", ",")}`;
const horaAgora = () => new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
const dataAgora = () => new Date().toLocaleDateString("pt-BR");
const CICONS = {"Hambúrguer":"🍔","Hot Dog":"🌭","Combos":"🍟","Porções":"🥔","Acréscimos":"➕","Bebidas":"🥤","Molhos":"🫙"};
const TM = {"TOP":"tv","+ PEDIDO":"tl","ESPECIAL":"tl","CROCANTE":"tl","POPULAR":"tl","MELHOR VALOR":"tg","ECONÔMICO":"tg","GRUPO":"ta","FAVORITA":"tl"};

const WppIcon = ({size=16,color="#25D366"}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// ─── TICKER ───
const Ticker = () => {
  const msgs = ["🔥 Novo pedido agora mesmo!","⭐ João avaliou com 5 estrelas!","🛵 Entregue em 26 min na Asa Norte","🍔 DGUSTE TRIPLO: o favorito do dia"];
  const [i, setI] = useState(0);
  const [vis, setVis] = useState(true);
  useEffect(()=>{const t=setInterval(()=>setI(x=>(x+1)%msgs.length),3800);return()=>clearInterval(t);},[]);
  if(!vis) return null;
  return (
    <div style={{background:"var(--pt)",padding:"8px 16px",display:"flex",alignItems:"center",justifyContent:"center",gap:10,position:"relative",minHeight:36}}>
      <span style={{width:7,height:7,background:"#22c55e",borderRadius:"50%",flexShrink:0,animation:"ps 2s infinite"}}/>
      <span key={i} style={{fontSize:12,color:"rgba(255,255,255,.6)",fontFamily:"var(--TN)",animation:"fi .3s ease",textAlign:"center"}}>{msgs[i]}</span>
      <button onClick={()=>setVis(false)} style={{position:"absolute",right:12,background:"none",color:"rgba(255,255,255,.3)",fontSize:20,lineHeight:1,padding:"0 4px",cursor:"pointer",border:"none"}}>×</button>
    </div>
  );
};

// ─── HEADER ───
const Header = ({n, onCart, onAdmin}) => {
  const [sc, setSc] = useState(false);
  useEffect(()=>{const h=()=>setSc(window.scrollY>30);window.addEventListener("scroll",h,{passive:true});return()=>window.removeEventListener("scroll",h);},[]);
  return (
    <header style={{position:"fixed",top:0,left:0,right:0,zIndex:200,height:58,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 16px",transition:"all .3s",
      background:sc?"rgba(18,18,18,.97)":"transparent",backdropFilter:sc?"blur(16px)":"none",borderBottom:sc?"1px solid rgba(255,255,255,.05)":"none"}}>
      <div style={{display:"flex",alignItems:"center",gap:9}}>
        <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,var(--vm),var(--lj))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,boxShadow:"0 4px 12px var(--ljg)",flexShrink:0}}>🍔</div>
        <div>
          <div style={{fontFamily:"var(--TH)",fontSize:20,color:"#fff",lineHeight:.9,letterSpacing:1}}>DGUSTE</div>
          <div style={{fontSize:8,color:"var(--lj)",fontFamily:"var(--TB)",letterSpacing:3,fontWeight:700}}>HAMBURGUERIA</div>
        </div>
      </div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <button className="btn btn-dk dsm" onClick={onAdmin} style={{padding:"7px 14px",fontSize:12}}>Admin</button>
        <button className="btn btn-lj" onClick={onCart} style={{padding:"9px 16px",fontSize:13,position:"relative"}}>
          🛒<span className="dsm"> Sacola</span>
          {n>0&&<span style={{position:"absolute",top:-7,right:-7,background:"var(--vm)",color:"#fff",width:20,height:20,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:900,fontFamily:"var(--TB)",animation:"pp .3s ease"}}>{n}</span>}
        </button>
      </div>
    </header>
  );
};

// ─── HERO ───
const Hero = ({onMenu, wpp}) => (
  <section style={{minHeight:"100svh",position:"relative",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",padding:"70px 20px 80px",background:"linear-gradient(150deg,#0e0000 0%,#1a0800 55%,#0d0000 100%)"}}>
    <div style={{position:"absolute",inset:0,opacity:.04,backgroundImage:"repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 0,transparent 44px),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 0,transparent 44px)",pointerEvents:"none"}}/>
    <div style={{position:"absolute",top:"18%",right:"-8%",width:"min(480px,90vw)",height:"min(480px,90vw)",background:"radial-gradient(circle,rgba(255,107,0,.16) 0%,transparent 70%)",pointerEvents:"none"}}/>
    <div style={{position:"absolute",bottom:"5%",left:"-10%",width:"min(360px,80vw)",height:"min(360px,80vw)",background:"radial-gradient(circle,rgba(139,0,0,.2) 0%,transparent 70%)",pointerEvents:"none"}}/>
    <div style={{textAlign:"center",position:"relative",zIndex:1,maxWidth:620,width:"100%"}}>
      <div className="tag tl up" style={{marginBottom:20,fontSize:11}}>🔴 Aberto Agora · Pedido Direto pelo Site</div>
      <h1 className="up" style={{fontFamily:"var(--TH)",fontSize:"clamp(72px,18vw,140px)",color:"#fff",lineHeight:.88,letterSpacing:2,animationDelay:"70ms"}}>DGUSTE</h1>
      <div className="up" style={{fontFamily:"var(--TB)",fontSize:"clamp(18px,5vw,34px)",color:"var(--lj)",fontWeight:900,letterSpacing:5,marginBottom:22,animationDelay:"130ms",textTransform:"uppercase"}}>Hamburgueria</div>
      <p className="up" style={{fontSize:15,color:"rgba(255,255,255,.55)",maxWidth:400,margin:"0 auto 36px",lineHeight:1.7,animationDelay:"190ms"}}>
        Blends artesanais, ingredientes frescos, sabor de verdade. Peça agora e receba em casa.
      </p>
      <div className="up" style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",animationDelay:"240ms"}}>
        <button className="btn btn-lj" onClick={onMenu} style={{padding:"13px 32px",fontSize:15}}>Ver Cardápio 🍔</button>
        <a href={`https://wa.me/${wpp}`} target="_blank" rel="noreferrer" className="btn"
          style={{padding:"13px 22px",fontSize:14,background:"rgba(37,211,102,.1)",border:"1px solid rgba(37,211,102,.28)",color:"#25D366"}}>
          <WppIcon size={16}/> WhatsApp
        </a>
      </div>
      <div className="up" style={{display:"flex",gap:"clamp(24px,6vw,44px)",justifyContent:"center",marginTop:44,flexWrap:"wrap",animationDelay:"300ms"}}>
        {[["⭐ 4.9","Avaliação"],["~30min","Entrega"],["100%","Artesanal"]].map(([v,l])=>(
          <div key={l} style={{textAlign:"center"}}>
            <div style={{fontFamily:"var(--TH)",fontSize:26,color:"var(--lj)",letterSpacing:1}}>{v}</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,.35)",letterSpacing:3,textTransform:"uppercase",fontFamily:"var(--TB)",marginTop:2}}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── MODAL PRODUTO ───
const ModalProd = ({item, onClose, onAdd}) => {
  const [trio, setTrio] = useState(false);
  const [qty, setQty] = useState(1);
  const preco = trio ? (item.trio ?? item.preco) : item.preco;
  const temTrio = item.trio !== null && item.trio !== undefined;
  return (
    <div style={{position:"fixed",inset:0,zIndex:600,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.72)",backdropFilter:"blur(6px)",animation:"fi .2s"}}/>
      <div className="card" onClick={e=>e.stopPropagation()} style={{position:"relative",width:"min(520px,100%)",maxHeight:"92svh",overflowY:"auto",borderRadius:"22px 22px 0 0",animation:"su .3s cubic-bezier(.16,1,.3,1)"}}>
        <div style={{height:"clamp(160px,40vw,200px)",background:"linear-gradient(135deg,var(--pt),#2d0800)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
          {item.imgUrl ? <img src={item.imgUrl} alt={item.nome} style={{width:"100%",height:"100%",objectFit:"cover"}}/> : <span style={{fontSize:"clamp(56px,14vw,80px)",animation:"fl 3s ease-in-out infinite"}}>{item.emoji}</span>}
          <button onClick={onClose} style={{position:"absolute",top:12,right:12,width:32,height:32,borderRadius:"50%",background:"rgba(0,0,0,.55)",color:"#fff",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",border:"none"}}>×</button>
          {item.tag && <span className={`tag ${TM[item.tag]||"tl"}`} style={{position:"absolute",top:12,left:12}}>{item.tag}</span>}
        </div>
        <div style={{padding:"20px 20px 28px"}}>
          <h2 style={{fontFamily:"var(--TB)",fontWeight:900,fontSize:"clamp(18px,5vw,22px)",marginBottom:6}}>{item.nome}</h2>
          <p style={{fontSize:14,color:"var(--mu)",lineHeight:1.6,marginBottom:16}}>{item.desc}</p>
          {item.ing && item.ing.length > 0 && (
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,fontFamily:"var(--TB)",fontWeight:700,letterSpacing:1,color:"var(--di)",marginBottom:8,textTransform:"uppercase"}}>Ingredientes</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                {item.ing.map(g=><span key={g} style={{fontSize:12,background:"var(--bg)",color:"var(--mu)",padding:"3px 9px",borderRadius:20}}>{g}</span>)}
              </div>
            </div>
          )}
          {temTrio && (
            <div style={{marginBottom:18}}>
              <div style={{fontSize:11,fontFamily:"var(--TB)",fontWeight:700,letterSpacing:1,color:"var(--di)",marginBottom:9,textTransform:"uppercase"}}>Opções</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {[{l:"Só o Burger",s:"Apenas o hambúrguer",p:item.preco,v:false},{l:"Trio Completo",s:"+ Fritas + Refrigerante",p:item.trio,v:true}].map(op=>(
                  <button key={op.l} onClick={()=>setTrio(op.v)} style={{padding:"12px",borderRadius:13,textAlign:"left",background:trio===op.v?(op.v?"var(--ljl)":"var(--vml)"):"var(--bg)",border:`2px solid ${trio===op.v?(op.v?"var(--lj)":"var(--vm)"):"transparent"}`,cursor:"pointer",transition:"all .2s"}}>
                    <div style={{fontFamily:"var(--TB)",fontWeight:800,fontSize:14,color:trio===op.v?(op.v?"var(--lj)":"var(--vm)"):"var(--tx)"}}>{op.l}</div>
                    <div style={{fontSize:11,color:"var(--mu)",marginTop:2}}>{op.s}</div>
                    <div style={{fontFamily:"var(--TB)",fontWeight:900,fontSize:16,color:trio===op.v?(op.v?"var(--lj)":"var(--vm)"):"var(--tx)",marginTop:5}}>{fmt(op.p)}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
          <div style={{display:"flex",gap:12,alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:14,background:"var(--bg)",borderRadius:50,padding:"7px 16px",flexShrink:0}}>
              <button onClick={()=>setQty(q=>Math.max(1,q-1))} style={{width:30,height:30,borderRadius:"50%",background:"#fff",border:"1px solid var(--bd2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,color:"var(--mu)",cursor:"pointer"}}>−</button>
              <span style={{fontFamily:"var(--TB)",fontWeight:900,fontSize:20,minWidth:22,textAlign:"center"}}>{qty}</span>
              <button onClick={()=>setQty(q=>q+1)} style={{width:30,height:30,borderRadius:"50%",background:"var(--lj)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,color:"#fff",cursor:"pointer",border:"none"}}>+</button>
            </div>
            <button className="btn btn-lj" onClick={()=>{onAdd({...item,comTrio:trio,nomeFull:trio?`${item.nome} (Trio)`:item.nome,precoUni:preco},qty);onClose();}} style={{flex:1,padding:"13px 16px",fontSize:15}}>
              Adicionar · {fmt(preco*qty)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── CARD PRODUTO ───
const CardProd = ({item, onOpen, delay=0}) => (
  <div className="cp up" style={{animationDelay:`${delay}ms`}} onClick={()=>onOpen(item)}>
    <div style={{height:"clamp(120px,30vw,150px)",background:"linear-gradient(135deg,var(--pt),#1a0000)",position:"relative",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
      {item.imgUrl ? <img src={item.imgUrl} alt={item.nome} style={{width:"100%",height:"100%",objectFit:"cover"}}/> : <span style={{fontSize:"clamp(44px,12vw,56px)",animation:"fl 3s ease-in-out infinite"}}>{item.emoji}</span>}
      {item.tag && <span className={`tag ${TM[item.tag]||"tl"}`} style={{position:"absolute",top:9,left:9}}>{item.tag}</span>}
      {item.trio && <span className="tag tg" style={{position:"absolute",top:9,right:9}}>+Trio</span>}
    </div>
    <div style={{padding:"13px 14px 14px"}}>
      <h3 style={{fontFamily:"var(--TB)",fontWeight:800,fontSize:"clamp(13px,3.5vw,15px)",marginBottom:4,lineHeight:1.2}}>{item.nome}</h3>
      <p style={{fontSize:12,color:"var(--mu)",lineHeight:1.4,marginBottom:11,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{item.desc}</p>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
        <div>
          <div style={{fontFamily:"var(--TB)",fontWeight:900,fontSize:"clamp(17px,4.5vw,20px)",color:"var(--lj)"}}>{fmt(item.preco)}</div>
          {item.trio && <div style={{fontSize:11,color:"var(--di)"}}>Trio: {fmt(item.trio)}</div>}
        </div>
        <div style={{width:36,height:36,borderRadius:10,background:"var(--lj)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:22,boxShadow:"0 4px 12px var(--ljg)",flexShrink:0}}>+</div>
      </div>
    </div>
  </div>
);

// ─── CARDÁPIO ───
const Cardapio = ({cardapio, imgMap, onAdd}) => {
  const cats = Object.keys(cardapio);
  const [cat, setCat] = useState(cats[0] || "Hambúrguer");
  const [modal, setModal] = useState(null);
  const items = cardapio[cat] || [];
  return (
    <section id="cardapio" style={{background:"var(--bg)",paddingBottom:100}}>
      <div style={{background:"var(--pt)"}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"0 16px"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"22px 0 0"}}>
            <div style={{width:4,height:32,background:"var(--lj)",borderRadius:2}}/>
            <h2 style={{fontFamily:"var(--TH)",fontSize:"clamp(26px,7vw,38px)",color:"#fff",letterSpacing:3}}>CARDÁPIO</h2>
          </div>
        </div>
        <div style={{overflowX:"auto",scrollbarWidth:"none"}}>
          <div style={{display:"flex",padding:"16px 16px 0",minWidth:"max-content",maxWidth:1200,margin:"0 auto"}}>
            {cats.map(c=>(
              <button key={c} onClick={()=>setCat(c)} style={{padding:"9px 14px",display:"flex",alignItems:"center",gap:6,fontFamily:"var(--TB)",fontWeight:cat===c?800:600,fontSize:"clamp(12px,3vw,13px)",background:"transparent",cursor:"pointer",border:"none",color:cat===c?"var(--lj)":"rgba(255,255,255,.4)",borderBottom:cat===c?"3px solid var(--lj)":"3px solid transparent",transition:"all .2s",whiteSpace:"nowrap",letterSpacing:.3}}>
                <span style={{fontSize:14}}>{CICONS[c]||"📦"}</span>{c}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"18px 14px 0"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(clamp(148px,42vw,260px),1fr))",gap:"clamp(10px,3vw,16px)"}}>
          {items.map((item,i)=>(
            <CardProd key={item.id||item._fbKey} item={{...item,imgUrl:imgMap[item.id]||null}} onOpen={setModal} delay={i*40}/>
          ))}
        </div>
      </div>
      {modal && <ModalProd item={{...modal,imgUrl:imgMap[modal.id]||null}} onClose={()=>setModal(null)} onAdd={(item,qty)=>{for(let k=0;k<qty;k++)onAdd(item);}}/>}
    </section>
  );
};

// ─── SACOLA ───
const Sacola = ({itens, onClose, onUpdate, onRemove, onFinalizar, cuponsDB}) => {
  const [cupom, setCupom] = useState("");
  const [desc, setDesc] = useState(null);
  const [msgC, setMsgC] = useState(null);
  const sub = itens.reduce((s,i)=>s+i.precoUni*i.qty,0);
  const dsc = desc?.tipo==="pct" ? sub*desc.desc/100 : 0;
  const total = sub - dsc;
  const aplicar = () => {
    const c = cuponsDB[cupom.toUpperCase()];
    if(c&&c.ativo){setDesc(c);setMsgC({ok:true,t:`✅ ${c.label} aplicado!`});}
    else{setDesc(null);setMsgC({ok:false,t:"❌ Cupom inválido ou expirado"});}
  };
  return (
    <div style={{position:"fixed",inset:0,zIndex:400}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(0,0,0,.65)",backdropFilter:"blur(5px)",animation:"fi .2s"}}/>
      <div style={{position:"absolute",top:0,right:0,bottom:0,width:"min(420px,100vw)",background:"#fff",boxShadow:"-8px 0 40px rgba(0,0,0,.22)",display:"flex",flexDirection:"column",animation:"sd .3s cubic-bezier(.16,1,.3,1)"}}>
        <div style={{padding:"15px 18px",background:"var(--pt)",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div>
            <h2 style={{fontFamily:"var(--TH)",fontSize:26,color:"#fff",letterSpacing:2,lineHeight:1}}>SUA SACOLA</h2>
            <p style={{fontSize:11,color:"rgba(255,255,255,.4)",marginTop:2}}>{itens.reduce((s,i)=>s+i.qty,0)} item(s)</p>
          </div>
          <button onClick={onClose} style={{width:32,height:32,borderRadius:9,background:"rgba(255,255,255,.08)",color:"#fff",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",border:"none"}}>×</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:14,display:"flex",flexDirection:"column",gap:9}}>
          {itens.length===0 ? (
            <div style={{textAlign:"center",padding:"50px 0",color:"var(--di)"}}>
              <div style={{fontSize:48,animation:"fl 2s ease-in-out infinite",marginBottom:12}}>🛒</div>
              <p style={{fontFamily:"var(--TB)",fontWeight:700,fontSize:16}}>Sacola vazia</p>
              <p style={{fontSize:13,marginTop:5}}>Escolha algo delicioso! 😋</p>
            </div>
          ) : itens.map(item=>(
            <div key={item._uid} style={{display:"flex",gap:10,background:"var(--bg)",borderRadius:13,padding:"10px 12px",alignItems:"center"}}>
              <div style={{width:44,height:44,background:"linear-gradient(135deg,var(--pt),#1a0000)",borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{item.emoji}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:"var(--TB)",fontWeight:800,fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.nomeFull||item.nome}</div>
                <div style={{fontFamily:"var(--TB)",fontWeight:900,fontSize:14,color:"var(--lj)",marginTop:2}}>{fmt(item.precoUni*item.qty)}</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:7,flexShrink:0}}>
                <button onClick={()=>onUpdate(item._uid,item.qty-1)} style={{width:28,height:28,borderRadius:8,background:"#fff",border:"1px solid var(--bd2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:"var(--mu)",cursor:"pointer"}}>−</button>
                <span style={{fontFamily:"var(--TB)",fontWeight:800,minWidth:17,textAlign:"center",fontSize:15}}>{item.qty}</span>
                <button onClick={()=>onUpdate(item._uid,item.qty+1)} style={{width:28,height:28,borderRadius:8,background:"var(--lj)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,cursor:"pointer",border:"none"}}>+</button>
                <button onClick={()=>onRemove(item._uid)} style={{width:28,height:28,borderRadius:8,background:"var(--vml)",color:"var(--vm)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,cursor:"pointer",marginLeft:2,border:"none"}}>🗑</button>
              </div>
            </div>
          ))}
        </div>
        {itens.length > 0 && (
          <div style={{padding:"14px 16px",borderTop:"1px solid var(--bd)",flexShrink:0,paddingBottom:"calc(14px + var(--sab))"}}>
            <div style={{display:"flex",gap:8,marginBottom:8}}>
              <input className="inp" placeholder="Código do cupom" value={cupom} onChange={e=>setCupom(e.target.value)} onKeyDown={e=>e.key==="Enter"&&aplicar()} style={{flex:1,fontSize:14,padding:"10px 13px"}}/>
              <button className="btn btn-out" onClick={aplicar} style={{padding:"10px 13px",fontSize:12}}>Aplicar</button>
            </div>
            {msgC && <p style={{fontSize:12,marginBottom:6,color:msgC.ok?"#15803d":"var(--vm)"}}>{msgC.t}</p>}
            <p style={{fontSize:11,color:"var(--di)",marginBottom:12}}>Ex: DGUSTE10 · CLIENTEVIP · FRETEGRATIS</p>
            <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:14,color:"var(--mu)"}}><span>Subtotal</span><span>{fmt(sub)}</span></div>
              {dsc>0 && <div style={{display:"flex",justifyContent:"space-between",fontSize:14,color:"#15803d"}}><span>Desconto ({desc.desc}%)</span><span>−{fmt(dsc)}</span></div>}
              {desc?.tipo==="frete" && <div style={{display:"flex",justifyContent:"space-between",fontSize:14,color:"#15803d"}}><span>Frete</span><span>Grátis 🎉</span></div>}
              <div style={{display:"flex",justifyContent:"space-between",paddingTop:9,borderTop:"1px dashed var(--bd2)"}}>
                <span style={{fontFamily:"var(--TB)",fontWeight:800,fontSize:17}}>TOTAL</span>
                <span style={{fontFamily:"var(--TB)",fontWeight:900,fontSize:19,color:"var(--lj)"}}>{fmt(total)}</span>
              </div>
            </div>
            <button className="btn btn-lj" onClick={()=>onFinalizar(total,desc)} style={{width:"100%",padding:"13px",fontSize:15}}>Finalizar Pedido 🚀</button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── CHECKOUT ───
const Checkout = ({itens, total, desc, regioes, wpp, onClose, onConfirm}) => {
  const [f, setF] = useState({nome:"",tel:"",rua:"",num:"",bairro:"",regiao:"",obs:""});
  const [etapa, setEtapa] = useState("form");
  const [taxa, setTaxa] = useState(0);
  const set = (k,v) => setF(x=>({...x,[k]:v}));
  const ok = f.nome && f.tel && f.rua && f.bairro && f.regiao;
  const totalFinal = total + (desc?.tipo==="frete" ? 0 : taxa);
  const selReg = (nome) => { const r=regioes.find(x=>x.nome===nome); setF(x=>({...x,regiao:nome})); setTaxa(r?r.taxa:0); };
  const gerarMsg = () => {
    const il = itens.map(i=>`${i.qty}x ${i.nomeFull||i.nome} — ${fmt(i.precoUni*i.qty)}`).join("%0A");
    return `🍔 *NOVO PEDIDO — DGUSTE*%0A%0A`+`👤 *Cliente:* ${f.nome}%0A`+`📱 *Telefone:* ${f.tel}%0A%0A`+`📋 *Itens:*%0A${il}%0A%0A`+`💰 *Total: ${fmt(totalFinal)}*${desc?`%0A🏷 Cupom: ${desc.label}`:""}${taxa>0&&desc?.tipo!=="frete"?`%0A🛵 Frete (${f.regiao}): ${fmt(taxa)}`:""}%0A%0A`+`📍 *Endereço:*%0A${f.rua}, ${f.num}%0A${f.bairro} — ${f.regiao}`+(f.obs?`%0A%0A📝 *Obs:* ${f.obs}`:"");
  };
  const enviar = () => {
    if(!ok) return;
    window.open(`https://wa.me/${wpp}?text=${gerarMsg()}`,"_blank");
    setEtapa("ok");
    onConfirm({...f,itens,total:totalFinal,regiao:f.regiao});
  };
  return (
    <div style={{position:"fixed",inset:0,zIndex:500,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(0,0,0,.75)",backdropFilter:"blur(8px)",animation:"fi .2s"}}/>
      <div className="card" onClick={e=>e.stopPropagation()} style={{position:"relative",width:"min(500px,100%)",maxHeight:"95svh",overflowY:"auto",zIndex:1,borderRadius:"22px 22px 0 0",animation:"su .3s cubic-bezier(.16,1,.3,1)"}}>
        {etapa==="form" ? (
          <div style={{padding:"22px 20px calc(28px + var(--sab))"}}>
            <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:20}}>
              <div style={{width:44,height:44,background:"linear-gradient(135deg,var(--vm),var(--lj))",borderRadius:13,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,boxShadow:"0 6px 18px var(--ljg)",flexShrink:0}}>🍔</div>
              <div><h2 style={{fontFamily:"var(--TH)",fontSize:26,letterSpacing:2,lineHeight:1}}>FINALIZAR PEDIDO</h2><p style={{fontSize:12,color:"var(--mu)"}}>Dados de entrega</p></div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div><label style={{fontSize:11,fontFamily:"var(--TB)",fontWeight:700,letterSpacing:.5,color:"var(--di)",display:"block",marginBottom:6,textTransform:"uppercase"}}>Nome *</label><input className="inp" value={f.nome} onChange={e=>set("nome",e.target.value)} placeholder="Seu nome"/></div>
                <div><label style={{fontSize:11,fontFamily:"var(--TB)",fontWeight:700,letterSpacing:.5,color:"var(--di)",display:"block",marginBottom:6,textTransform:"uppercase"}}>Telefone *</label><input className="inp" value={f.tel} onChange={e=>set("tel",e.target.value)} placeholder="(61) 9xxxx-xxxx" inputMode="tel"/></div>
              </div>
              <div>
                <label style={{fontSize:11,fontFamily:"var(--TB)",fontWeight:700,letterSpacing:.5,color:"var(--di)",display:"block",marginBottom:6,textTransform:"uppercase"}}>Região de entrega *</label>
                <select className="inp" value={f.regiao} onChange={e=>selReg(e.target.value)}>
                  <option value="">Selecione sua região</option>
                  {regioes.map(r=><option key={r.id} value={r.nome}>{r.nome}{r.taxa>0?` (+${fmt(r.taxa)})`:' (grátis)'}</option>)}
                </select>
              </div>
              <div><label style={{fontSize:11,fontFamily:"var(--TB)",fontWeight:700,letterSpacing:.5,color:"var(--di)",display:"block",marginBottom:6,textTransform:"uppercase"}}>Rua / Avenida *</label><input className="inp" value={f.rua} onChange={e=>set("rua",e.target.value)} placeholder="Rua das Flores"/></div>
              <div style={{display:"grid",gridTemplateColumns:"90px 1fr",gap:10}}>
                <div><label style={{fontSize:11,fontFamily:"var(--TB)",fontWeight:700,letterSpacing:.5,color:"var(--di)",display:"block",marginBottom:6,textTransform:"uppercase"}}>Nº *</label><input className="inp" value={f.num} onChange={e=>set("num",e.target.value)} placeholder="123" inputMode="numeric"/></div>
                <div><label style={{fontSize:11,fontFamily:"var(--TB)",fontWeight:700,letterSpacing:.5,color:"var(--di)",display:"block",marginBottom:6,textTransform:"uppercase"}}>Bairro *</label><input className="inp" value={f.bairro} onChange={e=>set("bairro",e.target.value)} placeholder="Asa Norte"/></div>
              </div>
              <div><label style={{fontSize:11,fontFamily:"var(--TB)",fontWeight:700,letterSpacing:.5,color:"var(--di)",display:"block",marginBottom:6,textTransform:"uppercase"}}>Observações</label><textarea className="inp" value={f.obs} onChange={e=>set("obs",e.target.value)} placeholder="Sem cebola, capricha no molho..." rows={2} style={{resize:"vertical"}}/></div>
            </div>
            <div style={{background:"var(--bg)",borderRadius:14,padding:14,marginTop:16}}>
              <div style={{fontSize:11,fontFamily:"var(--TB)",fontWeight:700,letterSpacing:1,color:"var(--di)",marginBottom:9,textTransform:"uppercase"}}>Resumo</div>
              {itens.map(i=><div key={i._uid} style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"3px 0",color:"var(--mu)"}}><span>{i.qty}x {i.nomeFull||i.nome}</span><span style={{fontWeight:700}}>{fmt(i.precoUni*i.qty)}</span></div>)}
              {taxa>0 && desc?.tipo!=="frete" && <div style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"3px 0",color:"var(--mu)"}}><span>🛵 Frete ({f.regiao})</span><span>{fmt(taxa)}</span></div>}
              {desc && <div style={{fontSize:12,color:"#15803d",marginTop:6}}>🏷 {desc.label}</div>}
              <div style={{display:"flex",justifyContent:"space-between",fontFamily:"var(--TB)",fontWeight:900,fontSize:17,marginTop:9,paddingTop:9,borderTop:"1px dashed var(--bd2)",color:"var(--lj)"}}><span>TOTAL</span><span>{fmt(totalFinal)}</span></div>
            </div>
            <div style={{display:"flex",gap:10,marginTop:16}}>
              <button className="btn btn-out" onClick={onClose} style={{flex:1,padding:"12px"}}>Voltar</button>
              <button className="btn btn-lj" onClick={enviar} style={{flex:2,padding:"12px 16px",fontSize:14,opacity:ok?1:.5}} disabled={!ok}>Enviar via WhatsApp 🚀</button>
            </div>
            {!ok && <p style={{fontSize:11,color:"var(--di)",textAlign:"center",marginTop:8}}>* Preencha todos os campos obrigatórios</p>}
          </div>
        ) : (
          <div style={{padding:"36px 24px calc(40px + var(--sab))",textAlign:"center"}}>
            <div style={{fontSize:60,marginBottom:18,animation:"fl 2s ease-in-out infinite"}}>🎉</div>
            <h2 style={{fontFamily:"var(--TH)",fontSize:36,letterSpacing:3,marginBottom:10}}>PEDIDO ENVIADO!</h2>
            <p style={{color:"var(--mu)",lineHeight:1.7,marginBottom:8,fontSize:14}}>Seu pedido foi enviado pelo WhatsApp da DGUSTE!</p>
            <div className="tag tg" style={{display:"inline-flex",marginBottom:24,padding:"6px 18px",fontSize:12}}>⏱ Previsão: ~30 minutos</div>
            <button className="btn btn-lj" onClick={onClose} style={{width:"100%",padding:14,fontSize:15}}>Fazer Novo Pedido 🍔</button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── FOOTER ───
const Footer = ({wpp}) => (
  <footer style={{background:"var(--pt)",padding:"clamp(32px,8vw,48px) clamp(16px,5vw,28px) clamp(24px,6vw,36px)"}}>
    <div style={{maxWidth:1200,margin:"0 auto"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(clamp(160px,40vw,200px),1fr))",gap:"clamp(28px,6vw,40px)",marginBottom:32}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:14}}>
            <div style={{width:38,height:38,background:"linear-gradient(135deg,var(--vm),var(--lj))",borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🍔</div>
            <div><div style={{fontFamily:"var(--TH)",fontSize:20,color:"#fff",letterSpacing:2}}>DGUSTE</div><div style={{fontSize:8,color:"var(--lj)",fontFamily:"var(--TB)",letterSpacing:3,fontWeight:700}}>HAMBURGUERIA</div></div>
          </div>
          <p style={{fontSize:12,color:"rgba(255,255,255,.38)",lineHeight:1.7}}>Blends artesanais, ingredientes frescos, sabor de verdade. Brasília–DF.</p>
        </div>
        <div>
          <div style={{fontFamily:"var(--TB)",fontWeight:700,fontSize:11,color:"rgba(255,255,255,.25)",letterSpacing:2,marginBottom:13,textTransform:"uppercase"}}>Contato</div>
          <a href={`https://wa.me/${wpp}`} target="_blank" rel="noreferrer" style={{display:"flex",alignItems:"center",gap:8,color:"#25D366",fontSize:14,marginBottom:10}}><WppIcon size={14}/> (61) 9 2895-0069</a>
          <div style={{fontSize:12,color:"rgba(255,255,255,.38)"}}>Brasília – DF</div>
        </div>
        <div>
          <div style={{fontFamily:"var(--TB)",fontWeight:700,fontSize:11,color:"rgba(255,255,255,.25)",letterSpacing:2,marginBottom:13,textTransform:"uppercase"}}>Horários</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,.38)",lineHeight:2}}>Seg–Sex: 18h–23h<br/>Sáb–Dom: 12h–00h</div>
        </div>
      </div>
      <div style={{borderTop:"1px solid rgba(255,255,255,.05)",paddingTop:20,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
        <p style={{fontSize:11,color:"rgba(255,255,255,.2)"}}>© 2026 DGUSTE Hamburgueria · Brasília–DF</p>
      </div>
    </div>
  </footer>
);

// ─── HOME (APP ROOT) ─────────────────────────────────
export default function Home() {
  const [cardapio, setCardapio] = useState({});
  const [regioes, setRegioes] = useState([]);
  const [cupons, setCupons] = useState({});
  const [imgMap, setImgMap] = useState({});
  const [config, setConfig] = useState({ wpp: "556192895069" });
  const [loading, setLoading] = useState(true);

  const [cart, setCart] = useState([]);
  const [sacola, setSacola] = useState(false);
  const [coData, setCoData] = useState(null);
  const menuRef = useRef(null);

  // Firebase listeners
  useEffect(() => {
    const unsubs = [];
    unsubs.push(onCardapio((data) => { setCardapio(data); setLoading(false); }));
    unsubs.push(onRegioes(setRegioes));
    unsubs.push(onCupons(setCupons));
    unsubs.push(onImagens(setImgMap));
    unsubs.push(onConfig(setConfig));
    return () => unsubs.forEach(u => u && u());
  }, []);

  const addCart = useCallback((item) => {
    setCart(prev => {
      const uid = `${item.id}-${item.nomeFull||item.nome}`;
      const ex = prev.find(i=>i._uid===uid);
      if(ex) return prev.map(i=>i._uid===uid?{...i,qty:i.qty+1}:i);
      return [...prev, {...item, _uid:uid, qty:1, precoUni:item.precoUni??item.preco}];
    });
  }, []);

  const updateCart = (uid, qty) => {
    if(qty<=0) setCart(p=>p.filter(i=>i._uid!==uid));
    else setCart(p=>p.map(i=>i._uid===uid?{...i,qty}:i));
  };

  const confirmarPedido = async (dados) => {
    const id = await getProximoIdPedido();
    const pedido = {
      id,
      cliente: dados.nome,
      tel: dados.tel,
      itens: cart.map(i => ({ nome: i.nome, nomeFull: i.nomeFull || i.nome, qty: i.qty, precoUni: i.precoUni, emoji: i.emoji })),
      total: dados.total,
      status: "novo",
      hora: horaAgora(),
      data: dataAgora(),
      endereco: `${dados.rua}, ${dados.num} — ${dados.bairro}`,
      regiao: dados.regiao,
      nota: null,
    };
    await addPedido(pedido);
    setCart([]);
    setCoData(null);
  };

  const n = cart.reduce((s,i)=>s+i.qty, 0);

  if (loading) {
    return (
      <div style={{height:"100vh",background:"#0e0000",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16}}>
        <div style={{width:56,height:56,borderRadius:15,background:"linear-gradient(135deg,#8B0000,#FF6B00)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,animation:"fl 2s ease-in-out infinite"}}>🍔</div>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,color:"#fff",letterSpacing:3}}>DGUSTE</div>
        <div style={{fontSize:12,color:"rgba(255,255,255,.4)"}}>Carregando cardápio...</div>
      </div>
    );
  }

  return (
    <>
      <div style={{minHeight:"100svh",background:"var(--bg)"}}>
        <Ticker/>
        <Header n={n} onCart={()=>setSacola(true)} onAdmin={()=>window.location.href="/admin"}/>
        <Hero onMenu={()=>menuRef.current?.scrollIntoView({behavior:"smooth"})} wpp={config.wpp}/>
        <div ref={menuRef}><Cardapio cardapio={cardapio} imgMap={imgMap} onAdd={addCart}/></div>
        <Footer wpp={config.wpp}/>

        {sacola && <Sacola itens={cart} onClose={()=>setSacola(false)} onUpdate={updateCart} onRemove={(uid)=>setCart(p=>p.filter(i=>i._uid!==uid))} onFinalizar={(total,desc)=>{setSacola(false);setCoData({total,desc});}} cuponsDB={cupons}/>}
        {coData && <Checkout itens={cart} total={coData.total} desc={coData.desc} regioes={regioes} wpp={config.wpp} onClose={()=>setCoData(null)} onConfirm={confirmarPedido}/>}
      </div>
    </>
  );
}
