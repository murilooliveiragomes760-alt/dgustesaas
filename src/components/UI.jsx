import { useState, useEffect } from "react";
import { WHATSAPP } from "../lib/data";

// ── Ticker de pedidos ao vivo ──
export const Ticker = () => {
  const msgs = ["🔥 Novo pedido recebido agora","⭐ João avaliou com 5 estrelas","🛵 Entregue em 28 minutos","🍔 DGUSTE TRIPLO esgotando hoje"];
  const [i, setI] = useState(0);
  const [vis, setVis] = useState(true);
  useEffect(()=>{ const t = setInterval(()=>setI(x=>(x+1)%msgs.length),3500); return ()=>clearInterval(t); },[msgs.length]);
  if(!vis) return null;
  return (
    <div style={{background:"var(--pt)",padding:"9px 20px",display:"flex",alignItems:"center",justifyContent:"center",gap:10,position:"relative"}}>
      <span style={{width:7,height:7,background:"#22c55e",borderRadius:"50%",flexShrink:0,animation:"pulse 2s infinite"}}/>
      <span key={i} style={{fontSize:12,color:"rgba(255,255,255,.65)",fontFamily:"var(--font-body)",animation:"ticket .35s ease"}}>{msgs[i]}</span>
      <button onClick={()=>setVis(false)} style={{position:"absolute",right:14,background:"none",color:"rgba(255,255,255,.35)",fontSize:16,lineHeight:1}}>×</button>
    </div>
  );
};

// ── Banner PWA ──
export const PWA = () => {
  const [show,setShow]=useState(true);
  if(!show) return null;
  return (
    <div style={{position:"fixed",bottom:20,left:"50%",transform:"translateX(-50%)",zIndex:150,animation:"up .5s .8s ease both",width:"min(420px,calc(100vw - 32px))"}}>
      <div style={{background:"var(--pt)",borderRadius:20,padding:"14px 18px",display:"flex",alignItems:"center",gap:12,boxShadow:"0 10px 40px rgba(0,0,0,.5)",border:"1px solid rgba(255,255,255,.05)"}}>
        <div style={{width:44,height:44,background:"linear-gradient(135deg,var(--vm),var(--lj))",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>🍔</div>
        <div style={{flex:1}}>
          <div style={{fontFamily:"var(--font-bold)",fontWeight:700,fontSize:14,color:"#fff"}}>Instalar App DGUSTE</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,.45)",marginTop:2}}>Acesse direto da tela inicial</div>
        </div>
        <button onClick={()=>setShow(false)} style={{background:"rgba(255,255,255,.08)",color:"rgba(255,255,255,.5)",borderRadius:8,padding:"5px 10px",fontSize:12,fontFamily:"var(--font-body)",cursor:"pointer",border:"none"}}>Depois</button>
        <button className="btn btn-lj" style={{padding:"8px 16px",fontSize:12,whiteSpace:"nowrap"}}>Instalar</button>
      </div>
    </div>
  );
};

// ── Footer ──
export const Footer = () => (
  <footer style={{background:"var(--pt)",padding:"48px 24px 32px"}}>
    <div style={{maxWidth:1200,margin:"0 auto"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:40,marginBottom:40}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
            <div style={{width:40,height:40,background:"linear-gradient(135deg,var(--vm),var(--lj))",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🍔</div>
            <div>
              <div style={{fontFamily:"var(--font-title)",fontSize:22,color:"#fff",letterSpacing:2}}>DGUSTE</div>
              <div style={{fontSize:9,color:"var(--lj)",fontFamily:"var(--font-bold)",letterSpacing:3,fontWeight:700}}>HAMBURGUERIA</div>
            </div>
          </div>
          <p style={{fontSize:13,color:"rgba(255,255,255,.4)",lineHeight:1.7}}>Blends artesanais, ingredientes frescos, sabor de verdade.</p>
        </div>
        <div>
          <div style={{fontFamily:"var(--font-bold)",fontWeight:700,fontSize:12,color:"rgba(255,255,255,.3)",letterSpacing:2,marginBottom:16,textTransform:"uppercase"}}>Cardápio</div>
          {["Hambúrguer Artesanal","Hot Dog","Combos","Porções","Bebidas"].map(c=>(
            <div key={c} style={{fontSize:13,color:"rgba(255,255,255,.45)",marginBottom:8,cursor:"pointer",transition:"color .2s"}}
              onMouseEnter={e=>e.target.style.color="var(--lj)"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,.45)"}>{c}</div>
          ))}
        </div>
        <div>
          <div style={{fontFamily:"var(--font-bold)",fontWeight:700,fontSize:12,color:"rgba(255,255,255,.3)",letterSpacing:2,marginBottom:16,textTransform:"uppercase"}}>Contato</div>
          <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" style={{display:"flex",alignItems:"center",gap:8,color:"#25D366",fontSize:14,textDecoration:"none",marginBottom:10}}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            (61) 9 9565-4440
          </a>
          <div style={{fontSize:13,color:"rgba(255,255,255,.4)"}}>Brasília – DF</div>
        </div>
        <div>
          <div style={{fontFamily:"var(--font-bold)",fontWeight:700,fontSize:12,color:"rgba(255,255,255,.3)",letterSpacing:2,marginBottom:16,textTransform:"uppercase"}}>Horários</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,.4)",lineHeight:2}}>Seg–Sex: 18h–23h<br/>Sáb–Dom: 12h–00h</div>
        </div>
      </div>
      <div style={{borderTop:"1px solid rgba(255,255,255,.05)",paddingTop:24,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
        <p style={{fontSize:12,color:"rgba(255,255,255,.25)"}}>© 2024 DGUSTE Hamburgueria. Todos os direitos reservados.</p>
        <p style={{fontSize:12,color:"rgba(255,255,255,.25)"}}>Brasília, DF — (61) 9 9565-4440</p>
      </div>
    </div>
  </footer>
);
