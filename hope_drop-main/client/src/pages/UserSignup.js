import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";

function UserSignup() {
  const navigate = useNavigate();
  const {
    bloodGroups,
    actions: { userSignup },
  } = useAppContext();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    bloodGroup: "",
    location: "",
    contact: "",
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.email.trim()) newErrors.email = "Email is required.";
    else if (!form.email.includes("@"))
      newErrors.email = "Enter a valid email.";
    if (!form.password.trim()) newErrors.password = "Password is required.";
    else if (form.password.length < 6)
      newErrors.password = "Minimum 6 characters.";
    if (!form.bloodGroup) newErrors.bloodGroup = "Select a blood group.";
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
      await userSignup(form);
      navigate("/user/dashboard");
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message || "Failed to sign up. Please try again."
      );
    }
  };

  return (
    <div className="page-wrapper">
      <main className="page-content auth-content">
        <Card title="Create User Account">
          <form onSubmit={handleSubmit}>
            <Input
              label="Name"
              name="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Full name"
              error={errors.name}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="user@example.com"
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
            <div className="input-group">
              <label className="input-label" htmlFor="bloodGroup">
                Blood Group
              </label>
              <select
                id="bloodGroup"
                name="bloodGroup"
                className={
                  errors.bloodGroup
                    ? "input-field input-error"
                    : "input-field"
                }
                value={form.bloodGroup}
                onChange={(e) =>
                  setForm({ ...form, bloodGroup: e.target.value })
                }
              >
                <option value="">Select blood group</option>
                {bloodGroups.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              {errors.bloodGroup && (
                <div className="input-error-text">{errors.bloodGroup}</div>
              )}
            </div>
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
    </div >
  );
}

export default UserSignup;

