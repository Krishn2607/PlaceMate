import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ArrowRight,
  BarChart3,
  Check,
  Code2,
  FolderKanban,
  Rocket,
  Sparkles,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

import "./Register.css";


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
    <div className="register-page">

      {/* Background effects */}

      <div className="register-grid" />

      <div className="register-glow register-glow-top" />

      <div className="register-glow register-glow-bottom" />


      <main className="register-container">


        {/* =================================================
            LEFT — PLACEMATE INTRO
        ================================================= */}

        <section className="register-product">


          {/* Brand */}

          <div className="register-brand">

            <div className="register-brand-mark">
              <Sparkles size={19} />
            </div>

            <div>

              <div className="register-brand-name">
                PlaceMate
              </div>

              <div className="register-brand-subtitle">
                Your placement OS
              </div>

            </div>

          </div>


          {/* Eyebrow */}

          <div className="register-product-eyebrow">

            <span className="register-product-dot" />

            BUILT FOR PLACEMENT PREPARATION

          </div>


          {/* Main heading */}

          <h1 className="register-product-title">

            Your placement journey,
            <br />

            <span>all in one place.</span>

          </h1>


          {/* Description */}

          <p className="register-product-description">

            PlaceMate brings your coding practice,
            projects, skills, resume, certifications
            and preparation progress into one focused
            workspace.

          </p>


          {/* Feature cards */}

          <div className="register-product-features">


            <div className="register-product-feature">

              <div className="register-feature-icon">
                <Code2 size={15} />
              </div>

              <div>

                <strong>
                  Practice
                </strong>

                <span>
                  Track your coding progress
                </span>

              </div>

            </div>


            <div className="register-product-feature">

              <div className="register-feature-icon">
                <FolderKanban size={15} />
              </div>

              <div>

                <strong>
                  Build
                </strong>

                <span>
                  Organize projects & skills
                </span>

              </div>

            </div>


            <div className="register-product-feature">

              <div className="register-feature-icon">
                <BarChart3 size={15} />
              </div>

              <div>

                <strong>
                  Improve
                </strong>

                <span>
                  Understand your readiness
                </span>

              </div>

            </div>


          </div>


          {/* Small product statement */}

          <div className="register-product-note">

            <Rocket size={14} />

            <span>
              Prepare smarter. Track everything.
              Know where you stand.
            </span>

          </div>


        </section>



        {/* =================================================
            RIGHT — REGISTER CARD
        ================================================= */}

        <section className="register-card">


          {/* Header */}

          <div className="register-card-header">

            <div className="register-eyebrow">

              <span className="register-eyebrow-dot" />

              CREATE YOUR ACCOUNT

            </div>


            <h2>

              Start building your
              <span> placement journey.</span>

            </h2>


            <p>

              Create your PlaceMate account and
              bring your placement preparation
              into one workspace.

            </p>

          </div>



          {/* Form */}

          <form
            className="register-form"
            onSubmit={handleSubmit}
          >


            {/* Name */}

            <div className="register-field">

              <label htmlFor="register-name">
                Full name
              </label>

              <input
                id="register-name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
                placeholder="Enter your full name"
                autoComplete="name"
                required
              />

            </div>



            {/* Email */}

            <div className="register-field">

              <label htmlFor="register-email">
                Email address
              </label>

              <input
                id="register-email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                placeholder="you@example.com"
                autoComplete="email"
                required
              />

            </div>



            {/* Password */}

            <div className="register-field">

              <label htmlFor="register-password">
                Password
              </label>

              <input
                id="register-password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                placeholder="Create a password"
                autoComplete="new-password"
                required
              />

              <small>
                Use at least 6 characters.
              </small>

            </div>



            {/* Error */}

            {error && (

              <div className="register-error">

                <span>
                  !
                </span>

                {error}

              </div>

            )}



            {/* Submit */}

            <button
              type="submit"
              className="register-submit"
              disabled={loading}
            >

              {loading ? (

                "Creating account..."

              ) : (

                <>
                  Create account

                  <ArrowRight size={16} />

                </>

              )}

            </button>


          </form>



          {/* Benefits */}

          <div className="register-benefits">


            <div className="register-benefit">

              <span className="register-check">
                <Check size={11} />
              </span>

              <span>
                Track preparation
              </span>

            </div>


            <div className="register-benefit">

              <span className="register-check">
                <Check size={11} />
              </span>

              <span>
                Organize your journey
              </span>

            </div>


            <div className="register-benefit">

              <span className="register-check">
                <Check size={11} />
              </span>

              <span>
                Know your readiness
              </span>

            </div>


          </div>



          {/* Login */}

          <div className="register-footer">

            <span>
              Already have an account?
            </span>

            <Link to="/login">

              Sign in

              <ArrowRight size={13} />

            </Link>

          </div>


        </section>


      </main>


      {/* Bottom branding */}

      <div className="register-page-footer">

        <span>
          PLACEMATE
        </span>

        <span>
          •
        </span>

        <span>
          PREPARE
        </span>

        <span>
          •
        </span>

        <span>
          TRACK
        </span>

        <span>
          •
        </span>

        <span>
          IMPROVE
        </span>

      </div>


    </div>
  );
}


export default Register;