import { useState } from "react";
import { fmt, TAG_STYLE, WHATSAPP } from "../lib/data";

// ── Hero ──
export const Hero = ({ onMenu }) => (
  <section style={{
    minHeight:"100vh",position:"relative",overflow:"hidden",
    display:"flex",alignItems:"center",justifyContent:"center",
    padding:"80px 24px 60px",
    background:"linear-gradient(150deg,#0e0000 0%,#1a0800 55%,#0d0000 100%)",
  }}>
    {/* textura */}
    <div style={{position:"absolute",inset:0,opacity:.035,backgroundImage:"repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 0,transparent 40px),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 0,transparent 40px)",pointerEvents:"none"}}/>
    {/* brilho */}
    <div style={{position:"absolute",top:"20%",right:"-5%",width:520,height:520,background:"radial-gradient(circle,rgba(255,107,0,.18) 0%,transparent 70%)",pointerEvents:"none"}}/>
    <div style={{position:"absolute",bottom:"5%",left:"-8%",width:400,height:400,background:"radial-gradient(circle,rgba(139,0,0,.22) 0%,transparent 70%)",pointerEvents:"none"}}/>

    <div style={{textAlign:"center",position:"relative",zIndex:1,maxWidth:680}}>
      <div className="tag tag-lj up" style={{marginBottom:22,animationDelay:"0ms",fontSize:11}}>🔴 Aberto Agora · Pedido Direto pelo Site</div>

      <h1 className="up" style={{fontFamily:"var(--font-title)",fontSize:"clamp(80px,16vw,150px)",color:"#fff",lineHeight:.88,letterSpacing:2,animationDelay:"70ms"}}>
        DGUSTE
      </h1>
      <div className="up" style={{fontFamily:"var(--font-bold)",fontSize:"clamp(20px,4vw,38px)",color:"var(--lj)",fontWeight:900,letterSpacing:6,marginBottom:24,animationDelay:"130ms",textTransform:"uppercase"}}>
        Hamburgueria
      </div>
      <p className="up" style={{fontSize:15,color:"rgba(255,255,255,.55)",maxWidth:420,margin:"0 auto 38px",lineHeight:1.7,animationDelay:"190ms",fontFamily:"var(--font-body)"}}>
        Blends artesanais, ingredientes frescos, sabor de verdade. Peça agora e receba em casa.
      </p>
      <div className="up" style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",animationDelay:"240ms"}}>
        <button className="btn btn-lj" onClick={onMenu} style={{padding:"14px 36px",fontSize:15}}>Ver Cardápio 🍔</button>
        <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" className="btn" style={{
          padding:"14px 26px",fontSize:14,
          background:"rgba(37,211,102,.1)",border:"1px solid rgba(37,211,102,.3)",
          color:"#25D366",textDecoration:"none",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          WhatsApp
        </a>
      </div>

      <div className="up" style={{display:"flex",gap:36,justifyContent:"center",marginTop:52,flexWrap:"wrap",animationDelay:"300ms"}}>
        {[["⭐ 4.9","Avaliação"],["~30min","Entrega"],["Artesanal","100%"]].map(([v,l])=>(
          <div key={l} style={{textAlign:"center"}}>
            <div style={{fontFamily:"var(--font-title)",fontSize:28,color:"var(--lj)",letterSpacing:1}}>{v}</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,.35)",letterSpacing:3,textTransform:"uppercase",fontFamily:"var(--font-bold)",marginTop:3}}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── Modal de produto com opção TRIO ──
export const ModalProduto = ({ item, onFechar, onAdicionar }) => {
  const [comTrio, setComTrio] = useState(false);
  const [qty, setQty] = useState(1);
  const preco = comTrio ? item.trio : item.preco;
  const temTrio = item.trio !== null && item.trio !== undefined;

  const adicionar = () => {
    onAdicionar({
      ...item,
      comTrio,
      nomeFull: comTrio ? `${item.nome} (Trio)` : item.nome,
      precoUni: preco,
    }, qty);
    onFechar();
  };

  return (
    <div style={{position:"fixed",inset:0,zIndex:500,display:"flex",alignItems:"flex-end",justifyContent:"center",padding:"0"}} onClick={onFechar}>
      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.7)",backdropFilter:"blur(6px)",animation:"fin .2s"}}/>
      <div className="card" onClick={e=>e.stopPropagation()} style={{
        position:"relative",width:"min(520px,100%)",maxHeight:"90vh",overflow:"auto",
        borderRadius:"24px 24px 0 0",animation:"mod .3s ease",
        background:"#fff",
      }}>
        {/* img area */}
        <div style={{height:200,background:"linear-gradient(135deg,var(--pt),#2d0800)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",flexShrink:0}}>
          {item.img ? (
            <img src={item.img} alt={item.nome} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          ) : (
            <span style={{fontSize:80,animation:"flt 3s ease-in-out infinite",display:"block"}}>{item.emoji}</span>
          )}
          <button onClick={onFechar} style={{position:"absolute",top:14,right:14,width:34,height:34,borderRadius:"50%",background:"rgba(0,0,0,.5)",color:"#fff",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
          {item.tag && <span className={`tag ${TAG_STYLE[item.tag]||"tag-lj"}`} style={{position:"absolute",top:14,left:14}}>{item.tag}</span>}
        </div>

        <div style={{padding:24}}>
          <h2 style={{fontFamily:"var(--font-bold)",fontWeight:900,fontSize:24,marginBottom:6,letterSpacing:.5}}>{item.nome}</h2>
          <p style={{fontSize:14,color:"var(--muted)",lineHeight:1.6,marginBottom:18}}>{item.desc}</p>

          {/* ingredientes */}
          {item.ingredientes && item.ingredientes.length > 0 && (
            <div style={{marginBottom:20}}>
              <div style={{fontSize:12,fontFamily:"var(--font-bold)",fontWeight:700,letterSpacing:1,color:"var(--dim)",marginBottom:10,textTransform:"uppercase"}}>Ingredientes</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {item.ingredientes.map(ing=>(
                  <span key={ing} style={{fontSize:12,background:"var(--bg)",color:"var(--muted)",padding:"4px 10px",borderRadius:20,fontFamily:"var(--font-body)"}}>{ing}</span>
                ))}
              </div>
            </div>
          )}

          {/* opção trio */}
          {temTrio && (
            <div style={{marginBottom:20}}>
              <div style={{fontSize:12,fontFamily:"var(--font-bold)",fontWeight:700,letterSpacing:1,color:"var(--dim)",marginBottom:10,textTransform:"uppercase"}}>Opções</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {[
                  {label:"Só o burger",sub:"Apenas o hambúrguer",preco:item.preco,val:false},
                  {label:"Trio Completo",sub:"+ Fritas + Refrigerante",preco:item.trio,val:true},
                ].map(op=>(
                  <button key={op.label} onClick={()=>setComTrio(op.val)} style={{
                    padding:"12px 14px",borderRadius:14,textAlign:"left",
                    background: comTrio===op.val ? (op.val?"var(--ljl)":"var(--vml)") : "var(--bg)",
                    border: `2px solid ${comTrio===op.val ? (op.val?"var(--lj)":"var(--vm)") : "transparent"}`,
                    transition:"all .2s",cursor:"pointer",
                  }}>
                    <div style={{fontFamily:"var(--font-bold)",fontWeight:800,fontSize:14,color:comTrio===op.val?(op.val?"var(--lj)":"var(--vm)"):"var(--txt)"}}>{op.label}</div>
                    <div style={{fontSize:11,color:"var(--muted)",marginTop:3}}>{op.sub}</div>
                    <div style={{fontFamily:"var(--font-bold)",fontWeight:900,fontSize:16,color:comTrio===op.val?(op.val?"var(--lj)":"var(--vm)"):"var(--txt)",marginTop:6}}>{fmt(op.preco)}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* qty + add */}
          <div style={{display:"flex",gap:12,alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,background:"var(--bg)",borderRadius:50,padding:"6px 14px"}}>
              <button onClick={()=>setQty(q=>Math.max(1,q-1))} style={{width:28,height:28,borderRadius:"50%",background:"#fff",border:"1px solid var(--brd)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:"var(--muted)"}}>−</button>
              <span style={{fontFamily:"var(--font-bold)",fontWeight:900,fontSize:18,minWidth:20,textAlign:"center"}}>{qty}</span>
              <button onClick={()=>setQty(q=>q+1)} style={{width:28,height:28,borderRadius:"50%",background:"var(--lj)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:"#fff"}}>+</button>
            </div>
            <button className="btn btn-lj" onClick={adicionar} style={{flex:1,padding:"13px",fontSize:15}}>
              Adicionar · {fmt(preco*qty)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
