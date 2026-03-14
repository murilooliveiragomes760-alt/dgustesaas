import { useState, useEffect } from "react";
import { fmt, CATS } from "../lib/data";
import { db, storage } from "../services/firebase";
import { ref, onValue, set, push, remove, update } from "firebase/database";
import { ref as sRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

// ════════════════════════════════════════════════════════════════
//  PAINEL ADMIN (FIREBASE REALTIME DATABASE)
// ════════════════════════════════════════════════════════════════
export default function Admin() {
  const [pedidos, setPedidos]   = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [cupons, setCupons] = useState([]);
  
  const [aba, setAba] = useState("pedidos");
  const [imgMap, setImgMap] = useState({});
  const [novo, setNovo] = useState({nome:"",desc:"",preco:"",trio:"",cat:"Hambúrguer Artesanal",emoji:"🍔"});
  const [novoCupom, setNovoCupom] = useState({code:"",tipo:"pct",desconto:"",validade:"",limite:""});
  const [uploading, setUploading] = useState(false);

  // 1. Ouvir o banco de dados em tempo real
  useEffect(() => {
    // Escuta Pedidos
    const unsubP = onValue(ref(db, "pedidos"), (snap) => {
      if(snap.exists()) {
        const d = snap.val();
        setPedidos(Object.keys(d).map(k=>({ ...d[k], idDb:k })).sort((a,b)=>b.ts-a.ts));
      } else setPedidos([]);
    });
    // Escuta Produtos
    const unsubPr = onValue(ref(db, "produtos"), (snap) => {
      if(snap.exists()){
        const d = snap.val();
        setProdutos(Object.keys(d).map(k=>({ ...d[k], idDb:k })));
      } else setProdutos([]);
    });
    // Escuta Cupons
    const unsubC = onValue(ref(db, "cupons"), (snap) => {
      if(snap.exists()){
        const d = snap.val();
        setCupons(Object.keys(d).map(k=>({ ...d[k], idDb:k })));
      } else setCupons([]);
    });

    return () => { unsubP(); unsubPr(); unsubC(); };
  }, []);

  const receita = pedidos.reduce((s,p)=>s+p.total,0);
  const abertos = pedidos.filter(p=>["novo","preparando"].includes(p.status)).length;
  const SL = { novo:{c:"#FF6B00",bg:"rgba(255,107,0,.12)",l:"Novo"}, preparando:{c:"#EAB308",bg:"rgba(234,179,8,.12)",l:"Preparando"}, pronto:{c:"#16a34a",bg:"rgba(22,163,74,.12)",l:"Pronto"}, entregue:{c:"#888",bg:"rgba(136,136,136,.12)",l:"Entregue"}, cancelado:{c:"#ef4444",bg:"rgba(239,68,68,.12)",l:"Cancelado"} };

  // Status Pedido
  const onStatus = async (idDb, s) => {
    await update(ref(db, `pedidos/${idDb}`), { status: s });
  };

  // Produtos
  const addProduto = async () => {
    if(!novo.nome||!novo.preco) return;
    const item = {
      id: Date.now(), nome: novo.nome, desc: novo.desc, 
      preco: Number(novo.preco), trio: novo.trio ? Number(novo.trio) : null,
      img: null, emoji: novo.emoji||"🍔", tag: null, ingredientes: [], cat: novo.cat
    };
    await push(ref(db, "produtos"), item);
    setNovo({nome:"",desc:"",preco:"",trio:"",cat:"Hambúrguer Artesanal",emoji:"🍔"});
  };
  const removerProd = async (idDb, imgUrl) => {
    if(imgUrl) {
      try { await deleteObject(sRef(storage, imgUrl)); }catch(e){console.log(e);}
    }
    await remove(ref(db, `produtos/${idDb}`));
  };

  // Imagens
  const handleImg = async (prod, e) => {
    const file = e.target.files[0];
    if(!file) return;
    setUploading(true);
    // Preview local
    const reader = new FileReader();
    reader.onload = ev => setImgMap(m=>({...m,[prod.idDb]:ev.target.result}));
    reader.readAsDataURL(file);
    // Upload de fato
    try {
      if(prod.img) await deleteObject(sRef(storage, prod.img)).catch(()=>null);
      const ext = file.name.split('.').pop();
      const nRef = sRef(storage, `produtos/${prod.idDb}_${Date.now()}.${ext}`);
      await uploadBytes(nRef, file);
      const url = await getDownloadURL(nRef);
      await update(ref(db, `produtos/${prod.idDb}`), { img: url });
      setImgMap(m=>{const n={...m};delete n[prod.idDb];return n});
    } catch(err) {
      alert("Erro ao subir imagem.");
    }
    setUploading(false);
  };
  const removerImg = async (prod) => {
    if(prod.img) {
      await deleteObject(sRef(storage, prod.img)).catch(()=>null);
      await update(ref(db, `produtos/${prod.idDb}`), { img: null });
    }
  };

  // Cupons
  const addCupom = async () => {
    if(!novoCupom.code) return;
    await set(ref(db, `cupons/${novoCupom.code.toUpperCase()}`), {
      code: novoCupom.code.toUpperCase(),
      tipo: novoCupom.tipo,
      desconto: Number(novoCupom.desconto)||0,
      validade: novoCupom.validade,
      limite: Number(novoCupom.limite)||100,
      uso: 0, ativo: true
    });
    setNovoCupom({code:"",tipo:"pct",desconto:"",validade:"",limite:""});
  };
  const toggleCupom = async (c) => await update(ref(db, `cupons/${c.idDb}`), { ativo: !c.ativo });
  const removerCupom = async (idDb) => await remove(ref(db, `cupons/${idDb}`));

  const ABAS = [
    {id:"pedidos",ico:"📋",l:"Pedidos"},
    {id:"cozinha",ico:"🍳",l:"Cozinha"},
    {id:"cardapio",ico:"🍔",l:"Cardápio"},
    {id:"imagens",ico:"📸",l:"Imagens"},
    {id:"cupons",ico:"🏷",l:"Cupons"},
    {id:"relatorios",ico:"📊",l:"Relatórios"},
  ];

  return (
    <div style={{position:"fixed",inset:0,zIndex:300,background:"var(--bg)",display:"flex",overflow:"hidden"}}>
      {/* sidebar */}
      <div style={{width:220,background:"var(--pt)",display:"flex",flexDirection:"column",flexShrink:0}}>
        <div style={{padding:"22px 18px 18px",borderBottom:"1px solid rgba(255,255,255,.05)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:34,height:34,background:"linear-gradient(135deg,var(--vm),var(--lj))",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🍔</div>
            <div>
              <div style={{fontFamily:"var(--font-title)",fontSize:20,color:"#fff",letterSpacing:1,lineHeight:1}}>DGUSTE</div>
              <div style={{fontSize:9,color:"var(--lj)",fontFamily:"var(--font-bold)",letterSpacing:2,fontWeight:700}}>ADMIN</div>
            </div>
          </div>
        </div>
        <nav style={{flex:1,padding:"14px 10px",display:"flex",flexDirection:"column",gap:3}}>
          {ABAS.map(a=>(
            <button key={a.id} className={`nav-item${aba===a.id?" active":""}`} onClick={()=>setAba(a.id)}>
              <span>{a.ico}</span>{a.l}
              {a.id==="pedidos"&&abertos>0&&<span style={{marginLeft:"auto",background:"var(--lj)",color:"#fff",borderRadius:"50%",width:18,height:18,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:900}}>{abertos}</span>}
            </button>
          ))}
        </nav>
        <div style={{padding:"14px 10px",borderTop:"1px solid rgba(255,255,255,.05)"}}>
          <button className="nav-item" onClick={() => window.location.href = "/"} style={{color:"rgba(255,255,255,.35)"}}
            onMouseEnter={e=>e.currentTarget.style.color="#ef4444"}
            onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.35)"}>
            ← Loja Vitrine
          </button>
        </div>
      </div>

      {/* conteúdo */}
      <div style={{flex:1,overflowY:"auto",padding:"28px 28px"}}>

        {/* ── PEDIDOS ── */}
        {aba==="pedidos" && (
          <div style={{animation:"up .4s ease"}}>
            {/* kpis */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:14,marginBottom:28}}>
              {[
                {l:"Receita",v:fmt(receita),ico:"💰",c:"#15803d"},
                {l:"Total Pedidos",v:pedidos.length,ico:"📋",c:"var(--lj)"},
                {l:"Em Aberto",v:abertos,ico:"🔥",c:"var(--vm)"},
                {l:"Entregues",v:pedidos.filter(p=>p.status==="entregue").length,ico:"✅",c:"#15803d"},
              ].map(k=>(
                <div key={k.l} className="card" style={{padding:20}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                    <span style={{fontSize:11,fontFamily:"var(--font-bold)",fontWeight:700,letterSpacing:.5,color:"var(--muted)",textTransform:"uppercase"}}>{k.l}</span>
                    <span style={{fontSize:20}}>{k.ico}</span>
                  </div>
                  <div style={{fontFamily:"var(--font-title)",fontSize:32,color:k.c,letterSpacing:1}}>{k.v}</div>
                </div>
              ))}
            </div>
            <h2 style={{fontFamily:"var(--font-bold)",fontWeight:800,fontSize:20,marginBottom:16,letterSpacing:.5}}>Pedidos em Tempo Real</h2>
            {pedidos.length===0 && (
              <div style={{textAlign:"center",padding:"50px 0",color:"var(--dim)"}}>
                <div style={{fontSize:40}}>📭</div>
                <p style={{marginTop:12,fontFamily:"var(--font-bold)",fontWeight:700}}>Nenhum pedido ainda</p>
              </div>
            )}
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {pedidos.map(p=>(
                <div key={p.id} className="card" style={{padding:20}}>
                  <div style={{display:"flex",flexWrap:"wrap",gap:16,alignItems:"flex-start"}}>
                    <div style={{flex:1,minWidth:200}}>
                      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8,flexWrap:"wrap"}}>
                        <span style={{fontFamily:"var(--font-bold)",fontWeight:800,fontSize:16}}>{p.id}</span>
                        <span style={{background:SL[p.status].bg,color:SL[p.status].c,border:`1px solid ${SL[p.status].c}44`,padding:"2px 10px",borderRadius:20,fontSize:11,fontFamily:"var(--font-bold)",fontWeight:700}}>{SL[p.status].l}</span>
                        <span style={{fontSize:12,color:"var(--dim)"}}>⏱ {p.hora}</span>
                      </div>
                      <div style={{fontFamily:"var(--font-bold)",fontWeight:800,fontSize:16,marginBottom:4}}>{p.cliente||"—"}</div>
                      <div style={{fontSize:13,color:"var(--muted)"}}>{(p.itens||[]).map(i=>`${i.qty}x ${i.nomeFull||i.nome}`).join(" · ")}</div>
                      {p.endereco&&<div style={{fontSize:11,color:"var(--dim)",marginTop:4}}>📍 {p.endereco}</div>}
                    </div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:10}}>
                      <div style={{fontFamily:"var(--font-title)",fontSize:26,color:"var(--lj)",letterSpacing:1}}>{fmt(p.total)}</div>
                      <div style={{display:"flex",gap:5,flexWrap:"wrap",justifyContent:"flex-end"}}>
                        {["novo","preparando","pronto","entregue","cancelado"].map(s=>(
                          <button key={s} onClick={()=>onStatus(p.idDb, s)} style={{
                            padding:"5px 11px",borderRadius:20,fontSize:11,fontFamily:"var(--font-bold)",fontWeight:700,cursor:"pointer",
                            background:p.status===s?SL[s].c:"var(--bg)",
                            color:p.status===s?"#fff":"var(--muted)",
                            border:`1px solid ${p.status===s?SL[s].c:"transparent"}`,
                            transition:"all .15s",
                          }}>{SL[s].l}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── COZINHA ── */}
        {aba==="cozinha" && (
          <div style={{animation:"up .4s ease"}}>
            <h1 style={{fontFamily:"var(--font-title)",fontSize:36,letterSpacing:3,marginBottom:24}}>TELA DA COZINHA</h1>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
              {pedidos.filter(p=>["novo","preparando"].includes(p.status)).length===0 && (
                <div style={{gridColumn:"1/-1",textAlign:"center",padding:"60px 0",color:"var(--dim)"}}>
                  <div style={{fontSize:48,marginBottom:14}}>✅</div>
                  <p style={{fontFamily:"var(--font-bold)",fontWeight:700,fontSize:16}}>Cozinha limpa!</p>
                </div>
              )}
              {pedidos.filter(p=>["novo","preparando"].includes(p.status)).map(p=>{
                const sc=SL[p.status];
                return (
                  <div key={p.id} className="card" style={{padding:20,border:`2px solid ${sc.c}44`,background:sc.bg}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                      <div>
                        <div style={{fontFamily:"var(--font-title)",fontSize:24,letterSpacing:1}}>{p.id}</div>
                        <div style={{fontSize:12,color:"var(--muted)"}}>⏱ {p.hora}</div>
                      </div>
                      <span style={{background:sc.bg,color:sc.c,border:`1px solid ${sc.c}66`,padding:"4px 12px",borderRadius:20,fontSize:11,fontFamily:"var(--font-bold)",fontWeight:700}}>{sc.l}</span>
                    </div>
                    <div style={{fontFamily:"var(--font-bold)",fontWeight:700,fontSize:15,marginBottom:12}}>{p.cliente||"Cliente"}</div>
                    <div style={{display:"flex",flexDirection:"column",gap:7}}>
                      {(p.itens||[]).map((item,i)=>(
                        <div key={i} style={{display:"flex",gap:10,alignItems:"center",background:"rgba(255,255,255,.5)",padding:"8px 12px",borderRadius:10}}>
                          <span style={{fontFamily:"var(--font-title)",fontSize:24,color:sc.c,letterSpacing:1}}>{item.qty}x</span>
                          <span style={{fontFamily:"var(--font-bold)",fontWeight:700,fontSize:14}}>{item.nomeFull||item.nome}</span>
                        </div>
                      ))}
                    </div>
                    <button className="btn btn-lj" onClick={()=>onStatus(p.idDb, p.status==="novo"?"preparando":"pronto")} style={{width:"100%",marginTop:16,padding:"11px",fontSize:14}}>
                      {p.status==="novo"?"Iniciar Preparo →":"Marcar como Pronto ✓"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── CARDÁPIO ── */}
        {aba==="cardapio" && (
          <div style={{animation:"up .4s ease"}}>
            <h1 style={{fontFamily:"var(--font-title)",fontSize:36,letterSpacing:3,marginBottom:24}}>GERENCIAR CARDÁPIO</h1>
            {/* form */}
            <div className="card" style={{padding:24,marginBottom:24}}>
              <h2 style={{fontFamily:"var(--font-bold)",fontWeight:800,fontSize:18,marginBottom:18,letterSpacing:.5}}>+ Adicionar Produto</h2>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:14}}>
                {[["nome","Nome","DGUSTE Special"],["preco","Preço (R$)","22.00"],["trio","Trio (R$, opcional)","27.00"],["emoji","Emoji","🍔"]].map(([k,l,ph])=>(
                  <div key={k}><label style={{fontSize:11,fontFamily:"var(--font-bold)",fontWeight:700,letterSpacing:.5,color:"var(--dim)",display:"block",marginBottom:7,textTransform:"uppercase"}}>{l}</label><input className="inp" value={novo[k]} onChange={e=>setNovo(x=>({...x,[k]:e.target.value}))} placeholder={ph}/></div>
                ))}
                <div><label style={{fontSize:11,fontFamily:"var(--font-bold)",fontWeight:700,letterSpacing:.5,color:"var(--dim)",display:"block",marginBottom:7,textTransform:"uppercase"}}>Categoria</label>
                  <select className="inp" value={novo.cat} onChange={e=>setNovo(x=>({...x,cat:e.target.value}))}>
                    {CATS.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div style={{marginTop:14}}>
                <label style={{fontSize:11,fontFamily:"var(--font-bold)",fontWeight:700,letterSpacing:.5,color:"var(--dim)",display:"block",marginBottom:7,textTransform:"uppercase"}}>Descrição</label>
                <textarea className="inp" value={novo.desc} onChange={e=>setNovo(x=>({...x,desc:e.target.value}))} rows={2} placeholder="Descreva o produto..." style={{resize:"vertical"}}/>
              </div>
              <div style={{marginTop:16}}>
                <button className="btn btn-lj" onClick={addProduto}>Adicionar Produto</button>
              </div>
            </div>
            {/* lista */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:12}}>
              {produtos.map(p=>(
                <div key={p.idDb} className="card" style={{padding:14,display:"flex",gap:12,alignItems:"center"}}>
                  <div style={{width:48,height:48,background:"linear-gradient(135deg,var(--pt),#1a0000)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:p.img?"0":"24",overflow:"hidden",flexShrink:0}}>
                    {p.img ? <img src={p.img} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/> : p.emoji}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:"var(--font-bold)",fontWeight:800,fontSize:14,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.nome} <span style={{fontSize:10,color:"var(--dim)"}}>({p.cat})</span></div>
                    <div style={{fontFamily:"var(--font-bold)",fontWeight:700,fontSize:14,color:"var(--lj)"}}>{fmt(p.preco)}{p.trio?` / Trio: ${fmt(p.trio)}`:""}</div>
                  </div>
                  <button onClick={()=>removerProd(p.idDb, p.img)} style={{width:32,height:32,borderRadius:9,background:"rgba(139,0,0,.08)",color:"var(--vm)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>🗑</button>
                </div>
              ))}
              {produtos.length===0 && <div style={{color:"var(--dim)",padding:20}}>Nenhum produto cadastrado.</div>}
            </div>
          </div>
        )}

        {/* ── IMAGENS ── */}
        {aba==="imagens" && (
          <div style={{animation:"up .4s ease"}}>
            <h1 style={{fontFamily:"var(--font-title)",fontSize:36,letterSpacing:3,marginBottom:8}}>UPLOAD DE IMAGENS</h1>
            <p style={{color:"var(--muted)",marginBottom:28,fontFamily:"var(--font-body)",fontSize:14}}>Adicione fotos reais. Aparecem automaticamente no cardápio.</p>
            {uploading && <div style={{color:"var(--lj)",marginBottom:14,fontWeight:"bold"}}>Fazendo upload de imagem... aguarde.</div>}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:16}}>
              {produtos.map(p=>(
                <div key={p.idDb} className="card" style={{overflow:"hidden"}}>
                  <div style={{height:140,background:"linear-gradient(135deg,var(--pt),#1a0000)",position:"relative",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
                    {imgMap[p.idDb] || p.img ? (
                      <img src={imgMap[p.idDb] || p.img} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                    ) : (
                      <span style={{fontSize:48,opacity:.6}}>{p.emoji}</span>
                    )}
                    {p.img && (
                      <button onClick={()=>removerImg(p)} style={{position:"absolute",top:8,right:8,width:28,height:28,borderRadius:"50%",background:"rgba(0,0,0,.6)",color:"#fff",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
                    )}
                  </div>
                  <div style={{padding:"12px 14px"}}>
                    <div style={{fontFamily:"var(--font-bold)",fontWeight:800,fontSize:13,marginBottom:10,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.nome}</div>
                    <label style={{
                      display:"flex",alignItems:"center",justifyContent:"center",gap:8,
                      padding:"9px 14px",borderRadius:10,cursor:"pointer",fontSize:13,
                      background:p.img?"var(--ljl)":"var(--bg)",
                      border:`1px dashed ${p.img?"var(--lj)":"var(--brd2)"}`,
                      color:p.img?"var(--lj)":"var(--muted)",
                      fontFamily:"var(--font-bold)",fontWeight:700,transition:"all .2s",
                    }}>
                      📸 {p.img?"Trocar foto":"Adicionar foto"}
                      <input type="file" accept="image/*" disabled={uploading} onChange={e=>handleImg(p,e)} style={{display:"none"}}/>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CUPONS ── */}
        {aba==="cupons" && (
          <div style={{animation:"up .4s ease"}}>
            <h1 style={{fontFamily:"var(--font-title)",fontSize:36,letterSpacing:3,marginBottom:24}}>CUPONS</h1>
            <div className="card" style={{padding:24,marginBottom:24}}>
              <h2 style={{fontFamily:"var(--font-bold)",fontWeight:800,fontSize:18,marginBottom:18,letterSpacing:.5}}>Criar Cupom</h2>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:14}}>
                {[["code","Código","DGUSTE10"],["desconto","Desconto (%)","10"],["validade","Validade",""],["limite","Limite de uso","100"]].map(([k,l,ph])=>(
                  <div key={k}><label style={{fontSize:11,fontFamily:"var(--font-bold)",fontWeight:700,letterSpacing:.5,color:"var(--dim)",display:"block",marginBottom:7,textTransform:"uppercase"}}>{l}</label><input className="inp" type={k==="validade"?"date":k==="desconto"||k==="limite"?"number":"text"} value={novoCupom[k]} onChange={e=>setNovoCupom(x=>({...x,[k]:e.target.value}))} placeholder={ph}/></div>
                ))}
                <div><label style={{fontSize:11,fontFamily:"var(--font-bold)",fontWeight:700,letterSpacing:.5,color:"var(--dim)",display:"block",marginBottom:7,textTransform:"uppercase"}}>Tipo</label>
                  <select className="inp" value={novoCupom.tipo} onChange={e=>setNovoCupom(x=>({...x,tipo:e.target.value}))}>
                    <option value="pct">Percentual</option>
                    <option value="frete">Frete grátis</option>
                  </select>
                </div>
              </div>
              <button className="btn btn-lj" style={{marginTop:16}} onClick={addCupom}>Criar Cupom</button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {cupons.map(c=>(
                <div key={c.idDb} className="card" style={{padding:20,display:"flex",gap:16,alignItems:"center",flexWrap:"wrap"}}>
                  <div style={{background:"linear-gradient(135deg,var(--vm),var(--lj))",borderRadius:12,padding:"10px 20px",flexShrink:0}}>
                    <span style={{fontFamily:"var(--font-title)",fontSize:24,color:"#fff",letterSpacing:2}}>{c.code}</span>
                  </div>
                  <div style={{flex:1,minWidth:150}}>
                    <div style={{fontFamily:"var(--font-bold)",fontWeight:800,fontSize:16}}>{c.tipo==="pct"?`${c.desconto}% de desconto`:"Frete grátis"}</div>
                    <div style={{fontSize:12,color:"var(--muted)",marginTop:4}}>Validade: {c.validade||"Sem vencimento"} · Uso: {c.uso||0}/{c.limite}</div>
                    <div style={{marginTop:8,background:"var(--bg2)",borderRadius:4,height:5}}>
                      <div style={{width:`${Math.min(100,(c.uso||0)/c.limite*100)}%`,background:"var(--lj)",height:"100%",borderRadius:4}}/>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <span className={`tag ${c.ativo?"tag-gn":"tag-vm"}`}>{c.ativo?"Ativo":"Inativo"}</span>
                    <button onClick={()=>toggleCupom(c)} style={{padding:"6px 12px",borderRadius:10,background:"var(--bg)",border:"1px solid var(--brd)",fontSize:12,fontFamily:"var(--font-bold)",fontWeight:700,color:"var(--muted)",cursor:"pointer"}}>
                      {c.ativo?"Desativar":"Ativar"}
                    </button>
                    <button onClick={()=>removerCupom(c.idDb)} style={{width:32,height:32,borderRadius:9,background:"rgba(139,0,0,.08)",color:"var(--vm)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,cursor:"pointer"}}>🗑</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
