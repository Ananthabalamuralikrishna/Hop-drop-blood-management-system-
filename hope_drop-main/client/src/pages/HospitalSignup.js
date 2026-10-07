import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";

function HospitalSignup() {
  const navigate = useNavigate();
  const {
    actions: { hospitalSignup },
  } = useAppContext();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    licenseId: "",
    location: "",
    contact: "",
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Hospital name is required.";
    if (!form.email.trim()) newErrors.email = "Email is required.";
    else if (!form.email.includes("@"))
      newErrors.email = "Enter a valid email.";
    if (!form.password.trim()) newErrors.password = "Password is required.";
    else if (form.password.length < 6)
      newErrors.password = "Minimum 6 characters.";
    if (!form.licenseId.trim())
      newErrors.licenseId = "License ID is required.";
    if (!form.location.trim()) newErrors.location = "Location is required.";
    if (!form.contact.trim()) newErrors.contact = "Contact number is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;
    try {
      await hospitalSignup(form);
      navigate("/hospital/dashboard");
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message || "Failed to sign up. Please try again."
      );
    }
  };

  return (
    <div className="page-wrapper">
      <main className="page-content auth-content">
        <Card title="Register Hospital">
          <form onSubmit={handleSubmit}>
            <Input
              label="Hospital Name"
              name="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Hospital name"
              error={errors.name}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="hospital@example.com"
              error={errors.email}
            />
            <Input
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Minimum 6 characters"
              error={errors.password}
            />
            <Input
              label="License ID"
              name="licenseId"
              value={form.licenseId}
              onChange={(e) =>
                setForm({ ...form, licenseId: e.target.value })
              }
              placeholder="Registered license ID"
              error={errors.licenseId}
            />
            <Input
              label="Location"
              name="location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="City / Area"
              error={errors.location}
            />
            <Input
              label="Contact Number"
              name="contact"
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
              placeholder="Phone number"
              error={errors.contact}
            />
            {submitError && <div className="form-error">{submitError}</div>}
            <Button type="submit" variant="primary">
              Sign Up &amp; Continue
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
}

export default HospitalSignup;

