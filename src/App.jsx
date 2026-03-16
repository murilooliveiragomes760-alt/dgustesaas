import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import { LoginAdmin } from "./components/LoginAdmin";
import { auth } from "./services/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { seedDatabase } from "./services/seed";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Seed no primeiro load (só popula se banco estiver vazio)
    seedDatabase().catch(console.error);

    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleLogin = async (email, senha) => {
    await signInWithEmailAndPassword(auth, email, senha);
  };

  const AdminRoute = () => {
    if (loading)
      return (
        <div
          style={{
            height: "100vh",
            background: "#F5E6D3",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#6b5b4e",
            fontFamily: "'Nunito', sans-serif",
            fontSize: 16,
          }}
        >
          ⏳ Carregando Painel...
        </div>
      );
    if (!user)
      return (
        <LoginAdmin
          onLogin={handleLogin}
          onFechar={() => (window.location.href = "/")}
        />
      );
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
