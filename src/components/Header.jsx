import { useState, useEffect } from "react";

// ── Header ──
export const Header = ({ n, onCart, onAdmin }) => {
  const [sc, setSc] = useState(false);
  useEffect(()=>{ const h=()=>setSc(window.scrollY>30); window.addEventListener("scroll",h); return()=>window.removeEventListener("scroll",h); },[]);
  return (
    <header style={{
      position:"fixed",top:0,left:0,right:0,zIndex:200,height:62,
      display:"flex",alignItems:"center",justifyContent:"space-between",
      padding:"0 20px",transition:"all .3s",
      background: sc ? "rgba(18,18,18,.97)" : "transparent",
      backdropFilter: sc ? "blur(18px)" : "none",
      borderBottom: sc ? "1px solid rgba(255,255,255,.05)" : "none",
    }}>
      {/* Logo */}
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{
          width:38,height:38,borderRadius:11,
          background:"linear-gradient(135deg,var(--vm),var(--lj))",
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,
          boxShadow:"0 4px 14px var(--ljg)",
        }}>🍔</div>
        <div>
          <div style={{fontFamily:"var(--font-title)",fontSize:22,color:"#fff",lineHeight:.95,letterSpacing:1}}>DGUSTE</div>
          <div style={{fontSize:9,color:"var(--lj)",fontFamily:"var(--font-bold)",letterSpacing:3,fontWeight:700}}>HAMBURGUERIA</div>
        </div>
      </div>
      {/* Ações */}
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <button className="btn btn-ghost" onClick={onAdmin} style={{padding:"7px 14px",fontSize:12}}>Admin</button>
        <button className="btn btn-lj" onClick={onCart} style={{padding:"9px 18px",fontSize:13,position:"relative"}}>
          🛒 Sacola
          {n>0 && <span style={{position:"absolute",top:-7,right:-7,background:"var(--vm)",color:"#fff",width:20,height:20,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:900,fontFamily:"var(--font-bold)",animation:"pop .3s ease"}}>{n}</span>}
        </button>
      </div>
    </header>
  );
};
