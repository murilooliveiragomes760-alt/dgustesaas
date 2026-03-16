import { useState, useEffect } from "react";
import { onPedidos, onCupons, onCardapio, onRegioes, onImagens, updatePedidoStatus, setCupom, toggleCupom, deleteCupom, addProduto, deleteProduto, uploadImagem, setImagemUrl, deleteImagem } from "../services/database";
import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";

const fmt = (n) => `R$ ${Number(n).toFixed(2).replace(".", ",")}`;
const dataAgora = () => new Date().toLocaleDateString("pt-BR");
const SC = {
  novo:{c:"#FF6B00",bg:"rgba(255,107,0,.12)",l:"Novo"},
  preparando:{c:"#EAB308",bg:"rgba(234,179,8,.12)",l:"Preparo"},
  pronto:{c:"#22c55e",bg:"rgba(34,197,94,.12)",l:"Pronto"},
  entregue:{c:"#64748b",bg:"rgba(100,116,139,.12)",l:"Entregue"},
  cancelado:{c:"#ef4444",bg:"rgba(239,68,68,.12)",l:"Cancelado"},
};
const CATS_ORDER = ["Hambúrguer","Hot Dog","Combos","Porções","Acréscimos","Bebidas","Molhos"];

// ─── PDF GENERATOR ──────────────
const gerarPDF = (tipo, dados) => {
  const css = `body{font-family:'Segoe UI',sans-serif;color:#111;margin:0;padding:20px;font-size:13px}h1{font-size:22px;color:#8B0000;margin:0 0 3px}h2{font-size:15px;color:#FF6B00;margin:14px 0 8px}.logo{display:flex;align-items:center;gap:10px;margin-bottom:18px;padding-bottom:14px;border-bottom:2px solid #FF6B00}.lb{width:42px;height:42px;background:linear-gradient(135deg,#8B0000,#FF6B00);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}table{width:100%;border-collapse:collapse;margin-bottom:14px}th{background:#111;color:#fff;padding:7px 9px;text-align:left;font-size:11px}td{padding:6px 9px;border-bottom:1px solid #eee;font-size:12px}tr:nth-child(even) td{background:#faf5ee}.tb{background:#f5e6d3;border:1px solid #FF6B00;border-radius:9px;padding:12px 16px;display:inline-block;margin:6px 0}.tb strong{color:#FF6B00;font-size:17px}.bk{background:#dcfce7;color:#16a34a;border-radius:8px;padding:2px 7px;font-size:10px;font-weight:700}.bp{background:#fef3c7;color:#b45309;border-radius:8px;padding:2px 7px;font-size:10px;font-weight:700}.be{background:#fee2e2;color:#b91c1c;border-radius:8px;padding:2px 7px;font-size:10px;font-weight:700}footer{margin-top:28px;padding-top:10px;border-top:1px solid #eee;font-size:10px;color:#aaa;text-align:center}`;
  const dt = new Date().toLocaleDateString("pt-BR",{weekday:"long",year:"numeric",month:"long",day:"numeric"});
  const hd = `<div class="logo"><div class="lb">🍔</div><div><h1>DGUSTE</h1><div style="font-size:10px;color:#FF6B00;letter-spacing:2px;font-weight:700">HAMBURGUERIA — 2026</div></div></div>`;
  const ft = `<footer>DGUSTE Hamburgueria · Brasília–DF · Gerado em ${dt}</footer>`;
  const receita = dados.filter(p=>p.status!=="cancelado").reduce((s,p)=>s+p.total,0);
  let body = "";
  if(tipo==="vendas"){
    body=`${hd}<h2>📊 Relatório de Vendas</h2><table><thead><tr><th>#</th><th>Cliente</th><th>Região</th><th>Total</th><th>Status</th><th>Hora</th></tr></thead><tbody>${dados.map(p=>`<tr><td><strong>${p.id}</strong></td><td>${p.cliente}</td><td>${p.regiao||"—"}</td><td><strong>${fmt(p.total)}</strong></td><td><span class="${p.status==="entregue"?"bk":p.status==="cancelado"?"be":"bp"}">${SC[p.status]?.l||p.status}</span></td><td>${p.hora}</td></tr>`).join("")}</tbody></table><div class="tb"><strong>${fmt(receita)}</strong></div>${ft}`;
  } else if(tipo==="produtos"){
    const mp={};dados.forEach(p=>p.itens.forEach(i=>{if(!mp[i.nome])mp[i.nome]={nome:i.nome,qty:0,rec:0};mp[i.nome].qty+=i.qty;mp[i.nome].rec+=i.precoUni*i.qty;}));
    const ps=Object.values(mp).sort((a,b)=>b.qty-a.qty);
    body=`${hd}<h2>🍔 Top Produtos</h2><table><thead><tr><th>Rank</th><th>Produto</th><th>Qtd</th><th>Receita</th></tr></thead><tbody>${ps.map((p,i)=>`<tr><td>#${i+1}</td><td>${p.nome}</td><td><strong>${p.qty}</strong></td><td>${fmt(p.rec)}</td></tr>`).join("")}</tbody></table>${ft}`;
  }
  const w=window.open("","_blank","width=920,height=700");
  if(!w){alert("Permita pop-ups para exportar PDF.");return;}
  w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>DGUSTE – Relatório</title><style>${css}</style></head><body>${body}</body></html>`);
  w.document.close();setTimeout(()=>w.print(),600);
};

// ─── ADMIN PANEL ─────────────────
export default function Admin() {
  const [aba, setAba] = useState("dashboard");
  const [pedidos, setPedidos] = useState([]);
  const [cardapio, setCardapio] = useState({});
  const [cupons, setCuponsState] = useState({});
  const [regioes, setRegioes] = useState([]);
  const [imgMap, setImgMap] = useState({});
  const [loading, setLoading] = useState(true);

  const [novoProd, setNovoProd] = useState({nome:"",desc:"",preco:"",trio:"",cat:"Hambúrguer",emoji:"🍔"});
  const [novoCupom, setNovoCupom] = useState({code:"",tipo:"pct",desc:"",val:"2026-12-31",limite:""});
  const [fStatus, setFStatus] = useState("todos");
  const [busca, setBusca] = useState("");
  const [mobMenu, setMobMenu] = useState(false);

  useEffect(() => {
    const unsubs = [];
    unsubs.push(onPedidos((data) => { setPedidos(data); setLoading(false); }));
    unsubs.push(onCardapio(setCardapio));
    unsubs.push(onCupons(setCuponsState));
    unsubs.push(onRegioes(setRegioes));
    unsubs.push(onImagens(setImgMap));
    return () => unsubs.forEach(u => u && u());
  }, []);

  const produtos = Object.entries(cardapio).flatMap(([cat, items]) => items.map(i => ({ ...i, _cat: cat })));
  const receita = pedidos.filter(p=>p.status!=="cancelado").reduce((s,p)=>s+p.total,0);
  const abertos = pedidos.filter(p=>["novo","preparando"].includes(p.status)).length;
  const filtrados = pedidos.filter(p=>{
    const okS=fStatus==="todos"||p.status===fStatus;
    const okC=!busca||p.cliente?.toLowerCase().includes(busca.toLowerCase());
    return okS&&okC;
  });

  // Clientes
  const cMap={};
  pedidos.forEach(p=>{if(!cMap[p.tel]){cMap[p.tel]={nome:p.cliente,tel:p.tel,ped:0,gasto:0,reg:p.regiao,ult:p.data,ns:[]}}cMap[p.tel].ped++;cMap[p.tel].gasto+=p.total;if(p.nota)cMap[p.tel].ns.push(p.nota);cMap[p.tel].ult=p.data;});
  const clientes=Object.values(cMap).sort((a,b)=>b.gasto-a.gasto);

  // Regiões stats
  const rMap={};
  pedidos.forEach(p=>{const r=p.regiao||"Outros";if(!rMap[r])rMap[r]={nome:r,ped:0,rec:0};rMap[r].ped++;if(p.status!=="cancelado")rMap[r].rec+=p.total;});
  const regStats=Object.values(rMap).sort((a,b)=>b.rec-a.rec);

  // Top produtos
  const pMap={};
  pedidos.forEach(p=>p.itens?.forEach(i=>{if(!pMap[i.nome])pMap[i.nome]={nome:i.nome,qty:0,rec:0};pMap[i.nome].qty+=i.qty;pMap[i.nome].rec+=i.precoUni*i.qty;}));
  const topProds=Object.values(pMap).sort((a,b)=>b.qty-a.qty);
  const maxQty=topProds[0]?.qty||1;

  const handleImg = async (id, e) => {
    const file=e.target.files[0];if(!file)return;
    try{const url=await uploadImagem(id,file);await setImagemUrl(id,url);}catch(err){
      // Fallback: use FileReader for local preview
      const r=new FileReader();r.onload=ev=>setImagemUrl(id,ev.target.result);r.readAsDataURL(file);
    }
  };

  const handleSair = async () => { await signOut(auth); window.location.href="/"; };

  const ABAS=[
    {id:"dashboard",ico:"📊",l:"Dashboard"},{id:"pedidos",ico:"📋",l:"Pedidos"},
    {id:"cozinha",ico:"🍳",l:"Cozinha"},{id:"clientes",ico:"👥",l:"Clientes"},
    {id:"regioes",ico:"📍",l:"Regiões"},{id:"cardapio",ico:"🍔",l:"Cardápio"},
    {id:"imagens",ico:"📸",l:"Imagens"},{id:"cupons",ico:"🏷",l:"Cupons"},
    {id:"relat",ico:"📄",l:"Relatórios"},
  ];

  const LBL=({children})=><label style={{fontSize:10,fontFamily:"var(--TB)",fontWeight:700,letterSpacing:.5,color:"var(--di)",display:"block",marginBottom:5,textTransform:"uppercase"}}>{children}</label>;

  const SB=()=>(
    <>
      <div style={{padding:"18px 15px 14px",borderBottom:"1px solid rgba(255,255,255,.05)"}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <div style={{width:32,height:32,background:"linear-gradient(135deg,var(--vm),var(--lj))",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>🍔</div>
          <div><div style={{fontFamily:"var(--TH)",fontSize:18,color:"#fff",letterSpacing:1,lineHeight:1}}>DGUSTE</div><div style={{fontSize:8,color:"var(--lj)",fontFamily:"var(--TB)",letterSpacing:2,fontWeight:700}}>ADMIN 2026</div></div>
        </div>
      </div>
      <nav style={{flex:1,padding:"10px 8px",display:"flex",flexDirection:"column",gap:2,overflowY:"auto"}}>
        {ABAS.map(a=>(
          <button key={a.id} className={`ni${aba===a.id?" on":""}`} onClick={()=>{setAba(a.id);setMobMenu(false);}}>
            <span style={{fontSize:15}}>{a.ico}</span>{a.l}
            {a.id==="pedidos"&&abertos>0&&<span style={{marginLeft:"auto",background:"var(--lj)",color:"#fff",borderRadius:"50%",width:18,height:18,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:900}}>{abertos}</span>}
          </button>
        ))}
      </nav>
      <div style={{padding:"12px 8px",borderTop:"1px solid rgba(255,255,255,.05)"}}>
        <button className="ni" onClick={handleSair} style={{color:"rgba(255,255,255,.4)"}}>← Sair</button>
      </div>
    </>
  );

  if(loading) return <div style={{height:"100vh",background:"var(--bg)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--TN)",color:"var(--mu)"}}>⏳ Carregando painel...</div>;

  return (
    <div style={{position:"fixed",inset:0,zIndex:300,background:"var(--bg)",display:"flex",overflow:"hidden"}}>
      <div className="dsm" style={{width:210,background:"var(--pt)",display:"flex",flexDirection:"column",flexShrink:0,overflowY:"auto"}}><SB/></div>
      {mobMenu&&(<div style={{position:"absolute",inset:0,zIndex:500}}><div onClick={()=>setMobMenu(false)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,.6)"}}/><div style={{position:"absolute",top:0,left:0,bottom:0,width:220,background:"var(--pt)",display:"flex",flexDirection:"column",animation:"sl .28s ease"}}><SB/></div></div>)}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div className="dlg" style={{background:"var(--pt2)",padding:"11px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid rgba(255,255,255,.05)",flexShrink:0}}>
          <button onClick={()=>setMobMenu(true)} style={{width:36,height:36,borderRadius:9,background:"rgba(255,255,255,.06)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,cursor:"pointer",border:"none"}}>☰</button>
          <div style={{fontFamily:"var(--TH)",fontSize:20,color:"#fff",letterSpacing:2}}>{ABAS.find(a=>a.id===aba)?.ico} {ABAS.find(a=>a.id===aba)?.l}</div>
          <button onClick={handleSair} style={{background:"rgba(255,255,255,.06)",color:"rgba(255,255,255,.5)",borderRadius:8,padding:"6px 12px",fontSize:12,cursor:"pointer",border:"none"}}>Sair</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"clamp(16px,4vw,28px)"}}>

          {/* DASHBOARD */}
          {aba==="dashboard"&&(
            <div style={{animation:"up .4s ease"}}>
              <h1 style={{fontFamily:"var(--TH)",fontSize:"clamp(24px,6vw,34px)",letterSpacing:2,marginBottom:6}}>DASHBOARD</h1>
              <p style={{color:"var(--mu)",fontSize:13,marginBottom:22}}>Hoje — {dataAgora()} · DGUSTE</p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(clamp(140px,40vw,180px),1fr))",gap:"clamp(10px,3vw,14px)",marginBottom:22}}>
                {[{l:"Receita Total",v:fmt(receita),ico:"💰",c:"#15803d"},{l:"Total Pedidos",v:pedidos.length,ico:"📋",c:"var(--lj)"},{l:"Em Aberto",v:abertos,ico:"🔥",c:"var(--vm)"},{l:"Entregues",v:pedidos.filter(p=>p.status==="entregue").length,ico:"✅",c:"#15803d"},{l:"Ticket Médio",v:fmt(receita/(pedidos.filter(p=>p.status!=="cancelado").length||1)),ico:"🎯",c:"#1d4ed8"},{l:"Clientes",v:clientes.length,ico:"👥",c:"#7c3aed"}].map(k=>(
                  <div key={k.l} className="card" style={{padding:"16px 18px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><span style={{fontSize:10,fontFamily:"var(--TB)",fontWeight:700,letterSpacing:.5,color:"var(--mu)",textTransform:"uppercase"}}>{k.l}</span><span style={{fontSize:18}}>{k.ico}</span></div>
                    <div style={{fontFamily:"var(--TH)",fontSize:"clamp(22px,5vw,30px)",color:k.c,letterSpacing:1}}>{k.v}</div>
                  </div>
                ))}
              </div>
              <div className="card" style={{padding:"clamp(16px,4vw,22px)",marginBottom:16}}>
                <h3 style={{fontFamily:"var(--TB)",fontWeight:800,fontSize:16,marginBottom:16,letterSpacing:.5}}>🍔 Top Produtos</h3>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {topProds.slice(0,6).map((p,i)=>(
                    <div key={p.nome}><div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:5}}><span style={{fontFamily:"var(--TB)",fontWeight:700}}>{p.nome}</span><span style={{color:"var(--mu)"}}>{p.qty} un · {fmt(p.rec)}</span></div><div style={{background:"var(--bg2)",borderRadius:4,height:7}}><div style={{width:`${(p.qty/maxQty)*100}%`,background:i===0?"var(--lj)":i===1?"var(--vm)":"var(--bg3)",height:"100%",borderRadius:4,transition:"width .8s ease"}}/></div></div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PEDIDOS */}
          {aba==="pedidos"&&(
            <div style={{animation:"up .4s ease"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
                <h1 style={{fontFamily:"var(--TH)",fontSize:"clamp(22px,6vw,32px)",letterSpacing:2}}>PEDIDOS</h1>
                <button className="btn btn-lj" onClick={()=>gerarPDF("vendas",filtrados)} style={{padding:"8px 16px",fontSize:13}}>📄 Exportar PDF</button>
              </div>
              <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
                <input className="inp" placeholder="🔍 Buscar cliente..." value={busca} onChange={e=>setBusca(e.target.value)} style={{flex:1,minWidth:160,padding:"9px 12px",fontSize:14}}/>
                <select className="inp" value={fStatus} onChange={e=>setFStatus(e.target.value)} style={{width:"auto",padding:"9px 12px",fontSize:13}}>
                  <option value="todos">Todos</option>
                  {Object.entries(SC).map(([k,v])=><option key={k} value={k}>{v.l}</option>)}
                </select>
              </div>
              <p style={{fontSize:12,color:"var(--di)",marginBottom:12}}>{filtrados.length} pedido(s)</p>
              <div style={{display:"flex",flexDirection:"column",gap:11}}>
                {filtrados.length===0&&<div style={{textAlign:"center",padding:"40px 0",color:"var(--di)"}}>📭 Nenhum pedido</div>}
                {filtrados.map(p=>(
                  <div key={p._fbKey||p.id} className="card" style={{padding:"clamp(14px,4vw,20px)"}}>
                    <div style={{display:"flex",flexWrap:"wrap",gap:14,alignItems:"flex-start"}}>
                      <div style={{flex:1,minWidth:"clamp(160px,50vw,200px)"}}>
                        <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:7,flexWrap:"wrap"}}>
                          <span style={{fontFamily:"var(--TB)",fontWeight:800,fontSize:15}}>{p.id}</span>
                          <span style={{background:SC[p.status]?.bg,color:SC[p.status]?.c,border:`1px solid ${SC[p.status]?.c}44`,padding:"2px 9px",borderRadius:20,fontSize:11,fontFamily:"var(--TB)",fontWeight:700}}>{SC[p.status]?.l}</span>
                          <span style={{fontSize:11,color:"var(--di)"}}>⏱ {p.hora} · {p.data}</span>
                        </div>
                        <div style={{fontFamily:"var(--TB)",fontWeight:800,fontSize:15,marginBottom:3}}>{p.cliente}</div>
                        <div style={{fontSize:12,color:"var(--mu)",marginBottom:3}}>{p.itens?.map(i=>`${i.qty}x ${i.nome}`).join(" · ")}</div>
                        <div style={{fontSize:11,color:"var(--di)",display:"flex",gap:12,flexWrap:"wrap"}}>
                          {p.regiao&&<span>📍 {p.regiao}</span>}{p.tel&&<span>📱 {p.tel}</span>}{p.nota&&<span>⭐ {p.nota}</span>}
                        </div>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:9,flexShrink:0}}>
                        <div style={{fontFamily:"var(--TH)",fontSize:"clamp(20px,5vw,26px)",color:"var(--lj)",letterSpacing:1}}>{fmt(p.total)}</div>
                        <div style={{display:"flex",gap:5,flexWrap:"wrap",justifyContent:"flex-end"}}>
                          {["novo","preparando","pronto","entregue","cancelado"].map(s=>(
                            <button key={s} onClick={()=>p._fbKey&&updatePedidoStatus(p._fbKey,s)}
                              style={{padding:"5px 10px",borderRadius:20,fontSize:10,fontFamily:"var(--TB)",fontWeight:700,cursor:"pointer",background:p.status===s?SC[s].c:"var(--bg)",color:p.status===s?"#fff":"var(--mu)",border:`1px solid ${p.status===s?SC[s].c:"transparent"}`,transition:"all .15s"}}>{SC[s].l}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* COZINHA */}
          {aba==="cozinha"&&(
            <div style={{animation:"up .4s ease"}}>
              <h1 style={{fontFamily:"var(--TH)",fontSize:"clamp(24px,6vw,34px)",letterSpacing:3,marginBottom:22}}>COZINHA</h1>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(clamp(260px,80vw,300px),1fr))",gap:14}}>
                {pedidos.filter(p=>["novo","preparando"].includes(p.status)).length===0&&<div style={{gridColumn:"1/-1",textAlign:"center",padding:"50px 0",color:"var(--di)"}}><div style={{fontSize:44,marginBottom:12}}>✅</div><p style={{fontFamily:"var(--TB)",fontWeight:700,fontSize:16}}>Cozinha limpa!</p></div>}
                {pedidos.filter(p=>["novo","preparando"].includes(p.status)).map(p=>{
                  const s=SC[p.status];
                  return(
                    <div key={p._fbKey||p.id} className="card" style={{padding:18,border:`2px solid ${s.c}44`,background:s.bg}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                        <div><div style={{fontFamily:"var(--TH)",fontSize:22,letterSpacing:1}}>{p.id}</div><div style={{fontSize:12,color:"var(--mu)"}}>⏱ {p.hora} · {p.regiao}</div></div>
                        <span style={{background:s.bg,color:s.c,border:`1px solid ${s.c}55`,padding:"4px 11px",borderRadius:20,fontSize:11,fontFamily:"var(--TB)",fontWeight:700}}>{s.l}</span>
                      </div>
                      <div style={{fontFamily:"var(--TB)",fontWeight:700,fontSize:15,marginBottom:10}}>{p.cliente}</div>
                      <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:14}}>
                        {p.itens?.map((item,i)=>(<div key={i} style={{display:"flex",gap:10,alignItems:"center",background:"rgba(255,255,255,.55)",padding:"8px 12px",borderRadius:10}}><span style={{fontFamily:"var(--TH)",fontSize:22,color:s.c,letterSpacing:1}}>{item.qty}x</span><span style={{fontFamily:"var(--TB)",fontWeight:700,fontSize:14}}>{item.nomeFull||item.nome}</span></div>))}
                      </div>
                      <button className="btn btn-lj" onClick={()=>p._fbKey&&updatePedidoStatus(p._fbKey,p.status==="novo"?"preparando":"pronto")} style={{width:"100%",padding:"11px",fontSize:14}}>
                        {p.status==="novo"?"Iniciar Preparo →":"Marcar como Pronto ✓"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CLIENTES */}
          {aba==="clientes"&&(
            <div style={{animation:"up .4s ease"}}>
              <h1 style={{fontFamily:"var(--TH)",fontSize:"clamp(22px,6vw,32px)",letterSpacing:2,marginBottom:16}}>CLIENTES</h1>
              <p style={{color:"var(--mu)",fontSize:13,marginBottom:16}}>{clientes.length} clientes</p>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {clientes.map((c,i)=>(
                  <div key={c.tel} className="card" style={{padding:"clamp(14px,4vw,18px)",display:"flex",gap:14,alignItems:"center",flexWrap:"wrap"}}>
                    <div style={{width:42,height:42,background:`linear-gradient(135deg,hsl(${i*47},60%,40%),hsl(${i*47+30},70%,55%))`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontFamily:"var(--TB)",fontWeight:900,fontSize:16,flexShrink:0}}>{c.nome?.charAt(0).toUpperCase()}</div>
                    <div style={{flex:1,minWidth:"clamp(140px,40vw,180px)"}}>
                      <div style={{fontFamily:"var(--TB)",fontWeight:800,fontSize:15}}>{c.nome}</div>
                      <div style={{fontSize:12,color:"var(--mu)",marginTop:2}}>{c.tel}</div>
                      <div style={{fontSize:11,color:"var(--di)",marginTop:2}}>📍 {c.reg||"—"} · Último: {c.ult}</div>
                    </div>
                    <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                      <div style={{textAlign:"center"}}><div style={{fontFamily:"var(--TB)",fontWeight:900,fontSize:16,color:"var(--lj)"}}>{fmt(c.gasto)}</div><div style={{fontSize:10,color:"var(--di)"}}>total</div></div>
                      <div style={{textAlign:"center"}}><div style={{fontFamily:"var(--TB)",fontWeight:900,fontSize:16}}>{c.ped}</div><div style={{fontSize:10,color:"var(--di)"}}>pedidos</div></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REGIÕES */}
          {aba==="regioes"&&(
            <div style={{animation:"up .4s ease"}}>
              <h1 style={{fontFamily:"var(--TH)",fontSize:"clamp(22px,6vw,32px)",letterSpacing:2,marginBottom:16}}>REGIÕES</h1>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(clamp(160px,44vw,200px),1fr))",gap:12,marginBottom:22}}>
                {regStats.map(r=>{const tot=regStats.reduce((s,x)=>s+x.rec,0);const pct=tot>0?((r.rec/tot)*100).toFixed(1):0;return(
                  <div key={r.nome} className="card" style={{padding:"16px 18px"}}>
                    <div style={{fontFamily:"var(--TB)",fontWeight:800,fontSize:14,marginBottom:8}}>{r.nome}</div>
                    <div style={{fontFamily:"var(--TH)",fontSize:"clamp(20px,5vw,24px)",color:"var(--lj)",letterSpacing:1}}>{fmt(r.rec)}</div>
                    <div style={{fontSize:12,color:"var(--mu)",marginTop:3}}>{r.ped} pedido(s) · {pct}%</div>
                  </div>
                );})}
              </div>
              <div className="card" style={{padding:"clamp(16px,4vw,22px)"}}>
                <h3 style={{fontFamily:"var(--TB)",fontWeight:800,fontSize:16,marginBottom:14}}>Taxas de entrega</h3>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(clamp(140px,42vw,180px),1fr))",gap:8}}>
                  {regioes.map(r=>(<div key={r.id} style={{background:"var(--bg)",borderRadius:10,padding:"10px 13px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:13,fontFamily:"var(--TB)",fontWeight:700}}>{r.nome}</span><span className={`tag ${r.taxa===0?"tg":"tl"}`}>{r.taxa===0?"Grátis":`+${fmt(r.taxa)}`}</span></div>))}
                </div>
              </div>
            </div>
          )}

          {/* CARDÁPIO ADMIN */}
          {aba==="cardapio"&&(
            <div style={{animation:"up .4s ease"}}>
              <h1 style={{fontFamily:"var(--TH)",fontSize:"clamp(22px,6vw,32px)",letterSpacing:2,marginBottom:18}}>CARDÁPIO</h1>
              <div className="card" style={{padding:"clamp(16px,4vw,22px)",marginBottom:18}}>
                <h3 style={{fontFamily:"var(--TB)",fontWeight:800,fontSize:16,marginBottom:14}}>+ Adicionar Produto</h3>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(clamp(130px,40vw,165px),1fr))",gap:12}}>
                  {[["nome","Nome","DGUSTE Special"],["preco","Preço","22.00"],["trio","Trio (opcional)","27.00"],["emoji","Emoji","🍔"]].map(([k,l,ph])=>(
                    <div key={k}><LBL>{l}</LBL><input className="inp" value={novoProd[k]} onChange={e=>setNovoProd(x=>({...x,[k]:e.target.value}))} placeholder={ph}/></div>
                  ))}
                  <div><LBL>Categoria</LBL><select className="inp" value={novoProd.cat} onChange={e=>setNovoProd(x=>({...x,cat:e.target.value}))}>{CATS_ORDER.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
                </div>
                <div style={{marginTop:12}}><LBL>Descrição</LBL><textarea className="inp" value={novoProd.desc} onChange={e=>setNovoProd(x=>({...x,desc:e.target.value}))} rows={2} placeholder="Descreva o produto..." style={{resize:"vertical"}}/></div>
                <button className="btn btn-lj" style={{marginTop:14,padding:"11px 20px",fontSize:14}} onClick={async()=>{
                  if(!novoProd.nome||!novoProd.preco)return;
                  await addProduto(novoProd.cat,{id:Date.now(),nome:novoProd.nome,desc:novoProd.desc,preco:Number(novoProd.preco),trio:novoProd.trio?Number(novoProd.trio):null,emoji:novoProd.emoji||"🍔",tag:null,ing:[]});
                  setNovoProd({nome:"",desc:"",preco:"",trio:"",cat:"Hambúrguer",emoji:"🍔"});
                }}>Adicionar Produto</button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(clamp(200px,80vw,260px),1fr))",gap:10}}>
                {produtos.map(p=>(
                  <div key={p._fbKey||p.id} className="card" style={{padding:13,display:"flex",gap:11,alignItems:"center"}}>
                    <div style={{width:44,height:44,background:"linear-gradient(135deg,var(--pt),#1a0000)",borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",fontSize:imgMap[p.id]?"0":"22",overflow:"hidden",flexShrink:0}}>
                      {imgMap[p.id]?<img src={imgMap[p.id]} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:p.emoji}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontFamily:"var(--TB)",fontWeight:800,fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.nome}</div>
                      <div style={{fontFamily:"var(--TB)",fontWeight:700,fontSize:13,color:"var(--lj)"}}>{fmt(p.preco)}{p.trio?` / Trio: ${fmt(p.trio)}`:""}</div>
                    </div>
                    <button onClick={()=>p._fbKey&&deleteProduto(p._cat,p._fbKey)} style={{width:30,height:30,borderRadius:8,background:"var(--vml)",color:"var(--vm)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,cursor:"pointer",flexShrink:0,border:"none"}}>🗑</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* IMAGENS */}
          {aba==="imagens"&&(
            <div style={{animation:"up .4s ease"}}>
              <h1 style={{fontFamily:"var(--TH)",fontSize:"clamp(22px,6vw,32px)",letterSpacing:2,marginBottom:8}}>IMAGENS</h1>
              <p style={{color:"var(--mu)",marginBottom:18,fontSize:13}}>Adicione fotos dos produtos.</p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(clamp(140px,40vw,200px),1fr))",gap:12}}>
                {produtos.map(p=>(
                  <div key={p._fbKey||p.id} className="card" style={{overflow:"hidden"}}>
                    <div style={{height:"clamp(100px,25vw,130px)",background:"linear-gradient(135deg,var(--pt),#1a0000)",position:"relative",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
                      {imgMap[p.id]?<img src={imgMap[p.id]} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:"clamp(36px,10vw,46px)",opacity:.6}}>{p.emoji}</span>}
                      {imgMap[p.id]&&<button onClick={()=>deleteImagem(p.id)} style={{position:"absolute",top:7,right:7,width:26,height:26,borderRadius:"50%",background:"rgba(0,0,0,.6)",color:"#fff",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",border:"none"}}>×</button>}
                    </div>
                    <div style={{padding:"10px 12px"}}>
                      <div style={{fontFamily:"var(--TB)",fontWeight:800,fontSize:12,marginBottom:8,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.nome}</div>
                      <label style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"8px 10px",borderRadius:9,cursor:"pointer",fontSize:12,background:imgMap[p.id]?"var(--ljl)":"var(--bg)",border:`1px dashed ${imgMap[p.id]?"var(--lj)":"var(--bd2)"}`,color:imgMap[p.id]?"var(--lj)":"var(--mu)",fontFamily:"var(--TB)",fontWeight:700}}>
                        📸 {imgMap[p.id]?"Trocar":"Adicionar"}
                        <input type="file" accept="image/*" onChange={e=>handleImg(p.id,e)} style={{display:"none"}}/>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CUPONS */}
          {aba==="cupons"&&(
            <div style={{animation:"up .4s ease"}}>
              <h1 style={{fontFamily:"var(--TH)",fontSize:"clamp(22px,6vw,32px)",letterSpacing:2,marginBottom:18}}>CUPONS</h1>
              <div className="card" style={{padding:"clamp(16px,4vw,22px)",marginBottom:18}}>
                <h3 style={{fontFamily:"var(--TB)",fontWeight:800,fontSize:16,marginBottom:14}}>Criar Cupom</h3>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(clamp(130px,40vw,150px),1fr))",gap:12}}>
                  {[["code","Código","DGUSTE10"],["desc","Desconto (%)","10"],["val","Validade",""],["limite","Limite","100"]].map(([k,l,ph])=>(
                    <div key={k}><LBL>{l}</LBL><input className="inp" type={k==="val"?"date":k==="desc"||k==="limite"?"number":"text"} value={novoCupom[k]} onChange={e=>setNovoCupom(x=>({...x,[k]:e.target.value}))} placeholder={ph}/></div>
                  ))}
                  <div><LBL>Tipo</LBL><select className="inp" value={novoCupom.tipo} onChange={e=>setNovoCupom(x=>({...x,tipo:e.target.value}))}><option value="pct">Percentual</option><option value="frete">Frete grátis</option></select></div>
                </div>
                <button className="btn btn-lj" style={{marginTop:14,padding:"11px 20px",fontSize:14}} onClick={async()=>{
                  if(!novoCupom.code)return;
                  const key=novoCupom.code.toUpperCase();
                  await setCupom(key,{desc:Number(novoCupom.desc),tipo:novoCupom.tipo,label:novoCupom.tipo==="pct"?`${novoCupom.desc}% de desconto`:"Frete grátis",ativo:true,limite:Number(novoCupom.limite)||100,uso:0,val:novoCupom.val});
                  setNovoCupom({code:"",tipo:"pct",desc:"",val:"2026-12-31",limite:""});
                }}>Criar Cupom</button>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {Object.entries(cupons).map(([code,c])=>(
                  <div key={code} className="card" style={{padding:"clamp(14px,4vw,18px)",display:"flex",gap:14,alignItems:"center",flexWrap:"wrap"}}>
                    <div style={{background:"linear-gradient(135deg,var(--vm),var(--lj))",borderRadius:11,padding:"9px 18px",flexShrink:0}}><span style={{fontFamily:"var(--TH)",fontSize:"clamp(18px,5vw,22px)",color:"#fff",letterSpacing:2}}>{code}</span></div>
                    <div style={{flex:1,minWidth:130}}>
                      <div style={{fontFamily:"var(--TB)",fontWeight:800,fontSize:15}}>{c.tipo==="pct"?`${c.desc}% de desconto`:"Frete grátis"}</div>
                      <div style={{fontSize:11,color:"var(--di)",marginTop:3}}>Val: {c.val||"Sem vencimento"} · {c.uso||0}/{c.limite} usos</div>
                    </div>
                    <div style={{display:"flex",gap:7,alignItems:"center",flexShrink:0}}>
                      <span className={`tag ${c.ativo?"tg":"tr"}`}>{c.ativo?"Ativo":"Inativo"}</span>
                      <button onClick={()=>toggleCupom(code,!c.ativo)} style={{padding:"6px 11px",borderRadius:9,background:"var(--bg)",border:"1px solid var(--bd2)",fontSize:11,fontFamily:"var(--TB)",fontWeight:700,color:"var(--mu)",cursor:"pointer"}}>{c.ativo?"Pausar":"Ativar"}</button>
                      <button onClick={()=>deleteCupom(code)} style={{width:30,height:30,borderRadius:8,background:"var(--vml)",color:"var(--vm)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,cursor:"pointer",border:"none"}}>🗑</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RELATÓRIOS */}
          {aba==="relat"&&(
            <div style={{animation:"up .4s ease"}}>
              <h1 style={{fontFamily:"var(--TH)",fontSize:"clamp(22px,6vw,32px)",letterSpacing:2,marginBottom:20}}>RELATÓRIOS</h1>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(clamp(200px,80vw,240px),1fr))",gap:14}}>
                {[{ico:"📊",t:"Vendas",d:"Todos os pedidos e receita",fn:()=>gerarPDF("vendas",pedidos)},{ico:"🍔",t:"Top Produtos",d:"Ranking dos mais vendidos",fn:()=>gerarPDF("produtos",pedidos)}].map(r=>(
                  <button key={r.t} onClick={r.fn} style={{padding:"clamp(16px,4vw,20px)",background:"var(--bg)",border:"2px solid transparent",borderRadius:15,textAlign:"left",cursor:"pointer",transition:"all .2s"}}>
                    <div style={{fontSize:"clamp(24px,6vw,28px)",marginBottom:10}}>{r.ico}</div>
                    <div style={{fontFamily:"var(--TB)",fontWeight:800,fontSize:"clamp(14px,3.5vw,15px)",marginBottom:5}}>{r.t}</div>
                    <div style={{fontSize:12,color:"var(--mu)",lineHeight:1.5}}>{r.d}</div>
                    <div style={{marginTop:12,color:"var(--lj)",fontFamily:"var(--TB)",fontWeight:700,fontSize:13}}>Gerar PDF →</div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
