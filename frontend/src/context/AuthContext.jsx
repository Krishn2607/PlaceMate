import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    const fetchStudent = async () => {

      try {

        const response = await api.get("/auth/me");

        setStudent(
          response.data.student
        );

      } catch (error) {

        localStorage.removeItem("token");
        setStudent(null);

      } finally {

        setLoading(false);

      }
    };

    fetchStudent();

  }, []);

  const login = async (
    email,
    password
  ) => {

    const response = await api.post(
      "/auth/login",
      {
        email,
        password,
      }
    );

    localStorage.setItem(
      "token",
      response.data.token
    );

    setStudent(
      response.data.student
    );

    return response.data;
  };

  const register = async (
    name,
    email,
    password
  ) => {

    const response = await api.post(
      "/auth/register",
      {
        name,
        email,
        password,
      }
    );

    return response.data;
  };

  const logout = () => {

    localStorage.removeItem("token");

    setStudent(null);
  };

  return (
    <AuthContext.Provider
      value={{
        student,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}