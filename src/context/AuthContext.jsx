import { createContext, useState, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { config } from "../config/config";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem(config.TOKEN_KEY);
    if (token) {
      return jwtDecode(token);
    }
    return null;
  });

  const login = (token) => {
    localStorage.setItem(config.TOKEN_KEY, token);
    setUser(jwtDecode(token));
  };

  const logout = () => {
    localStorage.removeItem(config.TOKEN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
