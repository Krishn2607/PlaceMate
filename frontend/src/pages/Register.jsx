import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { Sparkles } from "lucide-react";

import { useAuth } from "../context/AuthContext";

function Register() {
  const { register } = useAuth();

  const navigate = useNavigate();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await register(
        name,
        email,
        password
      );

      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          <Sparkles size={22} />
        </div>

        <div className="eyebrow">
          PLACEMENT OS
        </div>

        <h1>
          Build your PlaceMate profile.
        </h1>

        <p>
          Start organizing your placement preparation.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <label>Name</label>

            <input
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
              required
            />
          </div>

          <div className="input-group">
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              required
            />
          </div>

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <button
            className="primary-button full-width"
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create account"}
          </button>

        </form>

        <div className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">
            Sign in
          </Link>
        </div>

      </div>

    </div>
  );
}

export default Register;