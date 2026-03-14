import { useState } from "react";
import { fmt, WHATSAPP } from "../lib/data";

// ── Sacola ──
export const Sacola = ({ itens, onFechar, onAtualizar, onRemover, onFinalizar, cuponsDb }) => {
  const [cupom, setCupom] = useState("");
  const [desc, setDesc] = useState(null);
  const [msgC, setMsgC] = useState(null);

  const sub = itens.reduce((s,i)=>s+i.precoUni*i.qty,0);
  const dscAmt = desc?.tipo==="pct" ? sub*desc.desconto/100 : 0;
  const total = sub - dscAmt;

  const aplicar = () => {
    // Ler os cupons vindos do Realtime Database em vez dos mockados
    const cuponsMap = cuponsDb || {};
    const c = cuponsMap[cupom.toUpperCase()];
    if(c&&c.ativo){ setDesc(c); setMsgC({ok:true,txt:`✅ ${c.desconto}% aplicado!`}); }
    else { setDesc(null); setMsgC({ok:false,txt:"❌ Cupom inválido ou expirado"}); }
  };

  return (
    <div style={{position:"fixed",inset:0,zIndex:400}}>
      <div onClick={onFechar} style={{position:"absolute",inset:0,background:"rgba(0,0,0,.65)",backdropFilter:"blur(5px)",animation:"fin .2s"}}/>
      <div style={{
        position:"absolute",top:0,right:0,bottom:0,width:"min(440px,100vw)",
        background:"#fff",boxShadow:"-10px 0 50px rgba(0,0,0,.25)",
        display:"flex",flexDirection:"column",animation:"sid .3s cubic-bezier(.16,1,.3,1)",
      }}>
        {/* header */}
        <div style={{padding:"20px 22px",background:"var(--pt)",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div>
            <h2 style={{fontFamily:"var(--font-title)",fontSize:30,color:"#fff",letterSpacing:2,lineHeight:1}}>SUA SACOLA</h2>
            <p style={{fontSize:12,color:"rgba(255,255,255,.45)",marginTop:3,fontFamily:"var(--font-body)"}}>
              {itens.reduce((s,i)=>s+i.qty,0)} item(s)
            </p>
          </div>
          <button onClick={onFechar} style={{width:34,height:34,borderRadius:10,background:"rgba(255,255,255,.08)",color:"#fff",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>

        {/* itens */}
        <div style={{flex:1,overflowY:"auto",padding:16,display:"flex",flexDirection:"column",gap:10}}>
          {itens.length===0 ? (
            <div style={{textAlign:"center",padding:"60px 0",color:"var(--dim)"}}>
              <div style={{fontSize:52,animation:"flt 2s ease-in-out infinite",marginBottom:14}}>🛒</div>
              <p style={{fontFamily:"var(--font-bold)",fontWeight:700,fontSize:16}}>Sacola vazia</p>
              <p style={{fontSize:13,marginTop:6,fontFamily:"var(--font-body)"}}>Escolha algo delicioso! 😋</p>
            </div>
          ) : itens.map(item=>(
            <div key={item._uid} style={{display:"flex",gap:12,background:"var(--bg)",borderRadius:14,padding:12,alignItems:"center"}}>
              <div style={{width:48,height:48,background:"linear-gradient(135deg,var(--pt),#1a0000)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:item.img?"0":"24",overflow:"hidden",flexShrink:0}}>
                {item.img ? <img src={item.img} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/> : item.emoji}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:"var(--font-bold)",fontWeight:800,fontSize:14,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.nomeFull||item.nome}</div>
                <div style={{fontFamily:"var(--font-bold)",fontWeight:900,fontSize:15,color:"var(--lj)",marginTop:3}}>{fmt(item.precoUni*item.qty)}</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <button onClick={()=>onAtualizar(item._uid,item.qty-1)} style={{width:28,height:28,borderRadius:8,background:"#fff",border:"1px solid var(--brd)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:"var(--muted)"}}>−</button>
                <span style={{fontFamily:"var(--font-bold)",fontWeight:800,minWidth:18,textAlign:"center"}}>{item.qty}</span>
                <button onClick={()=>onAtualizar(item._uid,item.qty+1)} style={{width:28,height:28,borderRadius:8,background:"var(--lj)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>+</button>
                <button onClick={()=>onRemover(item._uid)} style={{width:28,height:28,borderRadius:8,background:"rgba(139,0,0,.08)",color:"var(--vm)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,marginLeft:3}}>🗑</button>
              </div>
            </div>
          ))}
        </div>

        {/* footer */}
        {itens.length>0 && (
          <div style={{padding:18,borderTop:"1px solid var(--brd)",flexShrink:0}}>
            {/* cupom */}
            <div style={{marginBottom:14}}>
              <div style={{display:"flex",gap:8}}>
                <input className="inp" placeholder="Código do cupom" value={cupom} onChange={e=>setCupom(e.target.value)} onKeyDown={e=>e.key==="Enter"&&aplicar()} style={{fontSize:13}}/>
                <button className="btn btn-out" onClick={aplicar} style={{padding:"10px 14px",fontSize:12,whiteSpace:"nowrap"}}>Aplicar</button>
              </div>
              {msgC && <p style={{fontSize:12,marginTop:6,color:msgC.ok?"#15803d":"var(--vm)"}}>{msgC.txt}</p>}
              <p style={{fontSize:11,color:"var(--dim)",marginTop:5}}>Ex: DGUSTE10 · CLIENTEVIP</p>
            </div>
            {/* totais */}
            <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:14,color:"var(--muted)"}}><span>Subtotal</span><span>{fmt(sub)}</span></div>
              {dscAmt>0 && <div style={{display:"flex",justifyContent:"space-between",fontSize:14,color:"#15803d"}}><span>Desconto ({desc.desconto}%)</span><span>−{fmt(dscAmt)}</span></div>}
              {desc?.tipo==="frete" && <div style={{display:"flex",justifyContent:"space-between",fontSize:14,color:"#15803d"}}><span>Frete</span><span>Grátis 🎉</span></div>}
              <div style={{display:"flex",justifyContent:"space-between",paddingTop:10,borderTop:"1px dashed var(--brd2)"}}>
                <span style={{fontFamily:"var(--font-bold)",fontWeight:800,fontSize:18}}>TOTAL</span>
                <span style={{fontFamily:"var(--font-bold)",fontWeight:900,fontSize:20,color:"var(--lj)"}}>{fmt(total)}</span>
              </div>
            </div>
            <button className="btn btn-lj" onClick={()=>onFinalizar(total,desc)} style={{width:"100%",padding:14,fontSize:15}}>
              Finalizar Pedido 🚀
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Checkout → WhatsApp ──
export const Checkout = ({ itens, total, desconto, onFechar, onConfirmar }) => {
  const [f, setF] = useState({nome:"",tel:"",rua:"",num:"",bairro:"",obs:""});
  const [etapa, setEtapa] = useState("form");
  const set=(k,v)=>setF(x=>({...x,[k]:v}));
  const ok = f.nome&&f.tel&&f.rua&&f.bairro;

  const gerarMsg = () => {
    const itensLinha = itens.map(i=>`${i.qty}x ${i.nomeFull||i.nome} — ${fmt(i.precoUni*i.qty)}`).join("%0A");
    const msg =
      `🍔 *NOVO PEDIDO — DGUSTE*%0A%0A` +
      `👤 *Cliente:* ${f.nome}%0A` +
      `📱 *Telefone:* ${f.tel}%0A%0A` +
      `📋 *Itens:%0A*${itensLinha}%0A%0A` +
      `💰 *Total: ${fmt(total)}*${desconto?`%0A🏷 Cupom: ${desconto.code} (${desconto.desconto}%)`:""}%0A%0A` +
      `📍 *Endereço:%0A*${f.rua}, ${f.num} — ${f.bairro}` +
      (f.obs?`%0A%0A📝 *Obs:* ${f.obs}`:"");
    return msg;
  };

  const enviar = async () => {
    if(!ok) return;
    // Opcional: só abre o wpp depois de gravar, 
    // mas a gente grava no onConfirmar
    await onConfirmar({ ...f, itens, total });
    window.open(`https://wa.me/${WHATSAPP}?text=${gerarMsg()}`,"_blank");
    setEtapa("ok");
  };

  return (
    <div style={{position:"fixed",inset:0,zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div onClick={onFechar} style={{position:"absolute",inset:0,background:"rgba(0,0,0,.75)",backdropFilter:"blur(8px)",animation:"fin .2s"}}/>
      <div className="card" onClick={e=>e.stopPropagation()} style={{position:"relative",width:"min(500px,100%)",maxHeight:"92vh",overflowY:"auto",zIndex:1,animation:"mod .3s ease"}}>
        {etapa==="form" ? (
          <div style={{padding:28}}>
            {/* logo */}
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
              <div style={{width:46,height:46,background:"linear-gradient(135deg,var(--vm),var(--lj))",borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,boxShadow:"0 6px 20px var(--ljg)"}}>🍔</div>
              <div>
                <h2 style={{fontFamily:"var(--font-title)",fontSize:28,letterSpacing:2,lineHeight:1}}>FINALIZAR PEDIDO</h2>
                <p style={{fontSize:12,color:"var(--muted)"}}>Preencha seus dados de entrega</p>
              </div>
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:13}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div><label style={{fontSize:12,fontWeight:700,color:"var(--dim)",display:"block",marginBottom:6,fontFamily:"var(--font-bold)",letterSpacing:.5}}>Nome *</label><input className="inp" value={f.nome} onChange={e=>set("nome",e.target.value)} placeholder="Seu nome"/></div>
                <div><label style={{fontSize:12,fontWeight:700,color:"var(--dim)",display:"block",marginBottom:6,fontFamily:"var(--font-bold)",letterSpacing:.5}}>Telefone *</label><input className="inp" value={f.tel} onChange={e=>set("tel",e.target.value)} placeholder="(61) 9xxxx-xxxx"/></div>
              </div>
              <div><label style={{fontSize:12,fontWeight:700,color:"var(--dim)",display:"block",marginBottom:6,fontFamily:"var(--font-bold)",letterSpacing:.5}}>Rua / Avenida *</label><input className="inp" value={f.rua} onChange={e=>set("rua",e.target.value)} placeholder="Rua das Flores"/></div>
              <div style={{display:"grid",gridTemplateColumns:"100px 1fr",gap:12}}>
                <div><label style={{fontSize:12,fontWeight:700,color:"var(--dim)",display:"block",marginBottom:6,fontFamily:"var(--font-bold)",letterSpacing:.5}}>Nº *</label><input className="inp" value={f.num} onChange={e=>set("num",e.target.value)} placeholder="123"/></div>
                <div><label style={{fontSize:12,fontWeight:700,color:"var(--dim)",display:"block",marginBottom:6,fontFamily:"var(--font-bold)",letterSpacing:.5}}>Bairro *</label><input className="inp" value={f.bairro} onChange={e=>set("bairro",e.target.value)} placeholder="Asa Norte"/></div>
              </div>
              <div><label style={{fontSize:12,fontWeight:700,color:"var(--dim)",display:"block",marginBottom:6,fontFamily:"var(--font-bold)",letterSpacing:.5}}>Observações</label><textarea className="inp" value={f.obs} onChange={e=>set("obs",e.target.value)} placeholder="Sem cebola, capricha no molho..." rows={2} style={{resize:"vertical"}}/></div>
            </div>

            {/* resumo */}
            <div style={{background:"var(--bg)",borderRadius:16,padding:16,marginTop:20}}>
              <div style={{fontSize:11,fontFamily:"var(--font-bold)",fontWeight:700,letterSpacing:1,color:"var(--dim)",marginBottom:10,textTransform:"uppercase"}}>Resumo</div>
              {itens.map(i=>(
                <div key={i._uid} style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"3px 0",color:"var(--muted)"}}>
                  <span>{i.qty}x {i.nomeFull||i.nome}</span>
                  <span style={{fontWeight:700}}>{fmt(i.precoUni*i.qty)}</span>
                </div>
              ))}
              {desconto && <div style={{fontSize:12,color:"#15803d",marginTop:8}}>🏷 Desconto de cupom aplicado</div>}
              <div style={{display:"flex",justifyContent:"space-between",fontFamily:"var(--font-bold)",fontWeight:900,fontSize:17,marginTop:10,paddingTop:10,borderTop:"1px dashed var(--brd2)",color:"var(--lj)"}}>
                <span>TOTAL</span><span>{fmt(total)}</span>
              </div>
            </div>

            {/* info wpp */}
            <div style={{display:"flex",gap:10,alignItems:"center",background:"rgba(37,211,102,.07)",border:"1px solid rgba(37,211,102,.2)",borderRadius:12,padding:"11px 14px",marginTop:16}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              <div>
                <div style={{fontSize:13,fontFamily:"var(--font-bold)",fontWeight:700}}>Pedido via WhatsApp</div>
                <div style={{fontSize:11,color:"var(--muted)"}}>(61) 9 9565-4440</div>
              </div>
            </div>

            <div style={{display:"flex",gap:10,marginTop:20}}>
              <button className="btn btn-out" onClick={onFechar} style={{flex:1,padding:"12px"}}>Voltar</button>
              <button className="btn btn-lj" onClick={enviar} disabled={!ok} style={{flex:2,padding:"12px 16px",fontSize:14,opacity:ok?1:.55}}>
                Enviar via WhatsApp 🚀
              </button>
            </div>
            {!ok && <p style={{fontSize:11,color:"var(--dim)",textAlign:"center",marginTop:8}}>* Preencha os campos obrigatórios</p>}
          </div>
        ) : (
          <div style={{padding:40,textAlign:"center"}}>
            <div style={{fontSize:64,marginBottom:20,animation:"flt 2s ease-in-out infinite"}}>🎉</div>
            <h2 style={{fontFamily:"var(--font-title)",fontSize:40,letterSpacing:3,marginBottom:10}}>PEDIDO ENVIADO!</h2>
            <p style={{color:"var(--muted)",lineHeight:1.7,marginBottom:8}}>Seu pedido foi registrado e enviado no WhatsApp da DGUSTE! Em breve eles confirmam.</p>
            <div className="tag tag-gn" style={{display:"inline-flex",marginBottom:28,padding:"6px 18px",fontSize:12}}>⏱ Previsão: ~30 minutos</div>
            <div style={{background:"rgba(37,211,102,.07)",border:"1px solid rgba(37,211,102,.2)",borderRadius:14,padding:16,marginBottom:24,display:"flex",alignItems:"center",gap:12}}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              <div style={{textAlign:"left"}}>
                <div style={{fontFamily:"var(--font-bold)",fontWeight:700,fontSize:14}}>WhatsApp DGUSTE</div>
                <div style={{fontSize:12,color:"var(--muted)"}}>(61) 9 9565-4440</div>
              </div>
            </div>
            <button className="btn btn-lj" onClick={onFechar} style={{width:"100%",padding:14,fontSize:15}}>Voltar à loja 🍔</button>
          </div>
        )}
      </div>
    </div>
  );
};
