import { useState } from "react";
// Por enquanto vamos fazer um auth fake antes de plugar o Firebase Auth de verdade
// Ou ja plugá-lo direto. Vamos primeiro montar a casca
export const LoginAdmin = ({ onLogin, onFechar }) => {
  const [u,setU]=useState("admin@dguste.com");
  const [p,setP]=useState("dguste2024");
  const [err,setErr]=useState(false);
  
  const tentar = () => {
    // Simularemos o login via callback (App.jsx cuidará da auth de verdade)
    onLogin(u, p).catch(() => {
      setErr(true); 
      setTimeout(()=>setErr(false),2000); 
    });
  };

  return (
    <div style={{position:"fixed",inset:0,zIndex:600,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div onClick={onFechar} style={{position:"absolute",inset:0,background:"rgba(0,0,0,.8)",backdropFilter:"blur(10px)"}}/>
      <div className="card" style={{position:"relative",width:"min(400px,100%)",padding:36,zIndex:1,animation:"mod .3s ease"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{width:56,height:56,background:"linear-gradient(135deg,var(--vm),var(--lj))",borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,margin:"0 auto 14px",boxShadow:"0 8px 24px var(--ljg)"}}>🍔</div>
          <h2 style={{fontFamily:"var(--font-title)",fontSize:30,letterSpacing:3}}>ADMIN DGUSTE</h2>
          <p style={{fontSize:12,color:"var(--muted)",marginTop:6}}>Painel de gestão da hamburgueria</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div><label style={{fontSize:12,fontWeight:700,color:"var(--dim)",display:"block",marginBottom:7,fontFamily:"var(--font-bold)",letterSpacing:.5}}>E-mail</label><input className="inp" value={u} onChange={e=>setU(e.target.value)} placeholder="admin@dguste.com"/></div>
          <div><label style={{fontSize:12,fontWeight:700,color:"var(--dim)",display:"block",marginBottom:7,fontFamily:"var(--font-bold)",letterSpacing:.5}}>Senha</label><input className="inp" type="password" value={p} onChange={e=>setP(e.target.value)} onKeyDown={e=>e.key==="Enter"&&tentar()}/></div>
        </div>
        {err && <p style={{color:"var(--vm)",fontSize:13,textAlign:"center",marginTop:10}}>❌ Credenciais inválidas</p>}
        {/* Removeremos a msg de Demo pois no SaaS não tem Demo mockada
        <div style={{background:"var(--bg)",borderRadius:10,padding:10,textAlign:"center",fontSize:11,color:"var(--muted)",margin:"14px 0",fontFamily:"var(--font-body)"}}>
          Demo: <strong>admin@dguste.com</strong> / <strong>dguste2024</strong>
        </div>
        */}
        <button className="btn btn-lj" onClick={tentar} style={{width:"100%",padding:13,fontSize:15,marginTop:16}}>Entrar no Painel</button>
      </div>
    </div>
  );
};
