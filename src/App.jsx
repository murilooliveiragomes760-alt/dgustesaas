import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import { LoginAdmin } from "./components/LoginAdmin";
import { auth } from "./services/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

// Rotas do nosso SaaS
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escuta se o usuário está logado no Firebase Auth
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleLogin = async (email, senha) => {
    // Usa o Firebase para logar
    await signInWithEmailAndPassword(auth, email, senha);
  };

  // Se a rota for admin e não tiver logado, mostra o modal de login
  const AdminRoute = () => {
    if (loading) return <div style={{height: "100vh", background: "var(--bg)", display: "flex", justifyContent: "center", alignItems: "center", color: "var(--dim)"}}>Carregando Painel...</div>;
    if (!user) return <LoginAdmin onLogin={handleLogin} onFechar={() => window.location.href = "/"} />;
    return <Admin />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminRoute />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
