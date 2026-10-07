import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import ToggleTabs from "../components/ToggleTabs";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const {
    actions: { userLogin, hospitalLogin },
  } = useAppContext();

  const [loginRole, setLoginRole] = useState("user");
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
  setForm({ email: "", password: "" });}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = form.email.trim();

    if (!trimmedEmail || !form.password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      if (loginRole === "user") {
        const success = await userLogin(trimmedEmail, form.password);
        if (!success) {
          setError("Invalid email or password for user.");
          return;
        }
        navigate("/user/dashboard");
      } else {
        const success = await hospitalLogin(trimmedEmail, form.password);
        if (!success) {
          setError("Invalid email or password for hospital.");
          return;
        }
        navigate("/hospital/dashboard");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="page-wrapper">
      <main className="page-content home-content">
        <div className="home-layout">

          {/* Left Video Section */}
          <div className="home-left">
            <video autoPlay muted loop>
              <source src="/bg.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Right Login Section */}
          <div className="home-right">
            <Card className="login-card">
              <h2 className="home-title">Welcome back</h2>

              <ToggleTabs
                options={[
                  { value: "user", label: "User" },
                  { value: "hospital", label: "Hospital" },
                ]}
                active={loginRole}
                onChange={setLoginRole}
              />

              <form onSubmit={handleSubmit}>
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  placeholder={
                    loginRole === "user"
                      ? "user@example.com"
                      : "hospital@example.com"
                  }
                />

                <div className="password-row">
                  <Input
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    placeholder="Enter your password"
                  />

                  <button
                    type="button"
                    className="show-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {error && <div className="form-error">{error}</div>}

                <Button type="submit" variant="primary">
                  {loginRole === "user"
                    ? "Login as User"
                    : "Login as Hospital"}
                </Button>

                <div className="form-footer-text">
                  {loginRole === "user" ? (
                    <>
                      New here?{" "}
                      <Link to="/user/signup">Create a user account</Link>
                    </>
                  ) : (
                    <>
                      New hospital?{" "}
                      <Link to="/hospital/signup">
                        Register your hospital
                      </Link>
                    </>
                  )}
                </div>
              </form>
            </Card>
          </div>
        </div>
        <br></br>
        {/* ===== DONATE BLOOD CTA ===== */}
        <section className="donate-cta-section">
          <div className="donate-cta-inner">
            <div className="donate-cta-text">
              <h2>Ready to Save a Life?</h2>
              <p>
                Donating blood is simple, safe, and vital. Register as a donor
                today — a hospital near you will reach out to schedule your
                donation at your convenience.
              </p>
            </div>
            <button
              className="donate-cta-btn"
              onClick={() => navigate("/donate")}
            >
              🩸 Donate Blood Now
            </button>
          </div>
        </section>

        {/* Blog Section */}
        <section className="blog-section">
          <div className="blood-section">
            <h4 className="small-title">What is BLOOD?</h4>

            <h1 className="big-title">
              BLOOD is to save life by facilitating a seamless connection
              between <span className="highlight-text">
                recipients and donors
              </span>{" "}
              when utmost needed during emergency, ensuring timely support and hope in critical moments.
            </h1>

            <div className="city-image-container">
              <img
                src="/city.png"
                alt="city skyline"
                className="city-image"
              />
            </div>
          </div>
          <br></br>
          <div className="blog-cards">
            <div className="blog-card">
              <img src="/blog1.png" alt="Blood Donation Benefits" />
              <h3>Why Donating Blood Matters</h3>
              <p>
                If you are thinking, "What good would it do to donate my blood?"
                Many people hesitate to donate blood thinking it is tedious.
              </p>
              {/*<a href="/readmore">Read more →</a>*/}
            </div>

            <div className="blog-card">
              <img src="/blog2.png" alt="Blood Crisis" />
              <h3>A Small Donation, A Big Difference</h3>
              <p>
                All it takes is 350 ml blood to save a life. Whether it is red
                blood cells or platelets, blood is life-saving.
              </p>
              {/*<a href="/readmore">Read more →</a>*/}
            </div>

            <div className="blog-card">
              <img
                src="/blog3.png"
                alt="Technology and Blood Donation"
              />
              <h3>Every Drop Counts</h3>
              <p>
                Blood donation may sound overstated, but shortages prove every drop truly saves lives.
              </p>
              {/*<a href="/readmore">Read more →</a>*/}
            </div>
          </div>
        </section>

        {/* Tips Section */}
        <section className="tips-section">
          <h2 className="section-title">Tips</h2>
          <p className="section-description">
            Here are some tips to put your mind at ease during blood donation
          </p>
          <br></br>

          <div className="tips-cards">
            <div className="tips-card">
              <h3>The day before</h3>
              <ul>
                <li>Eat iron-rich foods.</li>
                <li>Sleep at least 8 hours.</li>
                <li>Drink more liquids.</li>
              </ul>
            </div>

            <div className="tips-card">
              <h3>On the Donation Day</h3>
              <ul>
                <li>Carry valid ID.</li>
                <li>Drink water before donating.</li>
                <li>Wear half sleeve shirt.</li>
              </ul>
            </div>

            <div className="tips-card">
              <h3>After Donation</h3>
              <ul>
                <li>Have a snack.</li>
                <li>Drink fluids for 24 hours.</li>
                <li>Take proper rest.</li>
              </ul>
            </div>
          </div>
        </section>
        <br></br>
        {/* YouTube Section */}
        {/*<div className="video-section">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/Q55LrC7vijM"
            title="YouTube video"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>*/}

      </main>
    </div>
  );
}

export default Home;
