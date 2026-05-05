import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [activeRole, setActiveRole] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("activeRole");
    const storedRoles = localStorage.getItem("userRoles");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setActiveRole(storedRole);
      setUserRoles(JSON.parse(storedRoles || "[]"));
    }

    setLoading(false);
  }, []);

  const login = (data) => {
    const { token, user, activeRole, roles } = data;

    const normalizedUser = {
      ...user,
      name: user.full_name || user.name || "",
    };

    setUser(normalizedUser);
    setActiveRole(activeRole);
    setUserRoles(roles);

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
    localStorage.setItem("activeRole", activeRole);
    localStorage.setItem("userRoles", JSON.stringify(roles));
  };

  const logout = () => {
    setUser(null);
    setActiveRole(null);
    setUserRoles([]);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("activeRole");
    localStorage.removeItem("userRoles");
  };

  const switchRole = async (newRole) => {
    try {
      await api.put("/user/switch-role", { role: newRole });
      setActiveRole(newRole);
      localStorage.setItem("activeRole", newRole);
    } catch (error) {
      console.error("Role switch failed:", error);
      alert("Could not switch role. Please try again.");
    }
  };

  const addRole = (newRole) => {
    if (!userRoles.includes(newRole)) {
      const updated = [...userRoles, newRole];
      setUserRoles(updated);
      localStorage.setItem("userRoles", JSON.stringify(updated));
    }
  };

  const isLoggedIn = !!user;
  const isPhotographer = userRoles.includes("photographer");
  const isAdmin = userRoles.includes("admin");
  const isClient = userRoles.includes("client");

  const value = {
    user,
    activeRole,
    userRoles,
    loading,
    login,
    logout,
    switchRole,
    addRole,
    isLoggedIn,
    isPhotographer,
    isAdmin,
    isClient,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}

export default AuthContext;