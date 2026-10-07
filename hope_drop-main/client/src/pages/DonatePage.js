import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import "./DonatePage.css";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const initialForm = {
    fullName: "",
    age: "",
    weight: "",
    bloodGroup: "",
    city: "",
    address: "",
    contactNumber: "",
    availabilityDate: "",
    lastDonationDate: "",
    healthConditions: "",
    smokes: "",
    alcohol: "",
};

function DonatePage() {
    const navigate = useNavigate();
    const { auth, actions } = useAppContext();
    const isLoggedIn = auth.isAuthenticated && auth.role === "user";

    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [myDonations, setMyDonations] = useState([]);
    const [fetchingHistory, setFetchingHistory] = useState(false);

    useEffect(() => {
        if (isLoggedIn && actions.fetchMyDonations) {
            setFetchingHistory(true);
            actions.fetchMyDonations().then((data) => {
                setMyDonations(data || []);
                setFetchingHistory(false);
            });
        }
    }, [isLoggedIn, success]); // re-fetch after each submission

    const validate = () => {
        const errs = {};
        if (!form.fullName.trim()) errs.fullName = "Full name is required.";
        if (!form.age) {
            errs.age = "Age is required.";
        } else if (Number(form.age) < 18 || Number(form.age) > 65) {
            errs.age = "Age must be between 18 and 65.";
        }
        if (!form.weight) {
            errs.weight = "Weight is required.";
        } else if (Number(form.weight) < 45) {
            errs.weight = "Minimum weight to donate is 45 kg.";
        }
        if (!form.bloodGroup) errs.bloodGroup = "Blood group is required.";
        if (!form.city.trim()) errs.city = "City is required.";
        if (!form.contactNumber.trim()) errs.contactNumber = "Contact number is required.";
        else if (!/^\+?[\d\s\-()]{7,15}$/.test(form.contactNumber.trim()))
            errs.contactNumber = "Enter a valid contact number.";
        if (!form.availabilityDate) errs.availabilityDate = "Availability date is required.";
        else {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (new Date(form.availabilityDate) < today)
                errs.availabilityDate = "Please choose a future date.";
        }
        if (!form.smokes) errs.smokes = "Please answer the smoking question.";
        if (!form.alcohol) errs.alcohol = "Please answer the alcohol question.";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess("");
        setErrorMsg("");
        if (!validate()) return;
        setLoading(true);
        const result = await actions.createDonation({
            fullName: form.fullName,
            age: form.age,
            weight: form.weight,
            bloodGroup: form.bloodGroup,
            city: form.city,
            address: form.address,
            contactNumber: form.contactNumber,
            availabilityDate: form.availabilityDate,
            lastDonationDate: form.lastDonationDate || null,
            healthConditions: form.healthConditions,
            isSmoker: form.smokes === "Yes",
            consumesAlcohol: form.alcohol === "Yes",
        });
        setLoading(false);
        if (result.ok) {
            setSuccess(result.message);
            setForm(initialForm);
            setErrors({});
        } else {
            setErrorMsg(result.message);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "2-digit", month: "short", year: "numeric",
        });
    };

    return (
        <div className="donate-page">
            {/* Hero Banner */}
            <div className="donate-hero">
                <div className="donate-hero-overlay" />
                <div className="donate-hero-content">
                    <div className="donate-hero-icon">🩸</div>
                    <h1 className="donate-hero-title">Become a Blood Donor</h1>
                    <p className="donate-hero-subtitle">
                        One donation can save up to 3 lives. Register your interest and a
                        hospital will reach out to schedule your donation.
                    </p>
                    <div className="donate-stats">
                        <div className="donate-stat">
                            <span className="donate-stat-num">4.5M</span>
                            <span className="donate-stat-label">Lives Saved Yearly</span>
                        </div>
                        <div className="donate-stat">
                            <span className="donate-stat-num">Every 2s</span>
                            <span className="donate-stat-label">Someone Needs Blood</span>
                        </div>
                        <div className="donate-stat">
                            <span className="donate-stat-num">1 Pint</span>
                            <span className="donate-stat-label">Can Save 3 Lives</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="donate-body">
                {!isLoggedIn ? (
                    /* ---- NOT LOGGED IN ---- */
                    <div className="donate-auth-prompt">
                        <div className="donate-auth-icon">🔐</div>
                        <h2>Login Required to Donate</h2>
                        <p>
                            You need an account to register as a blood donor so hospitals can
                            contact you.
                        </p>
                        <div className="donate-auth-actions">
                            <button
                                className="donate-btn-primary"
                                onClick={() => navigate("/user/signup")}
                            >
                                Create Account
                            </button>
                            <button
                                className="donate-btn-outline"
                                onClick={() => navigate("/")}
                            >
                                Login
                            </button>
                        </div>
                    </div>
                ) : (
                    /* ---- LOGGED IN FORM ---- */
                    <div className="donate-form-wrapper">
                        <div className="donate-form-card">
                            <div className="donate-form-header">
                                <h2>Donor Registration Form</h2>
                                <p>All fields marked with <span className="req-star">*</span> are required</p>
                            </div>

                            {success && (
                                <div className="donate-alert donate-alert-success">
                                    <span className="donate-alert-icon">✅</span>
                                    <span>{success}</span>
                                </div>
                            )}
                            {errorMsg && (
                                <div className="donate-alert donate-alert-error">
                                    <span className="donate-alert-icon">❌</span>
                                    <span>{errorMsg}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} noValidate>
                                {/* Section: Personal Info */}
                                <div className="form-section">
                                    <h3 className="form-section-title">
                                        <span className="section-icon">👤</span> Personal Information
                                    </h3>
                                    <div className="form-grid-2">
                                        <div className="form-field">
                                            <label htmlFor="fullName">
                                                Full Name <span className="req-star">*</span>
                                            </label>
                                            <input
                                                id="fullName"
                                                name="fullName"
                                                type="text"
                                                placeholder="e.g. Ravi Kumar"
                                                value={form.fullName}
                                                onChange={handleChange}
                                                className={errors.fullName ? "field-error" : ""}
                                            />
                                            {errors.fullName && (
                                                <span className="error-text">{errors.fullName}</span>
                                            )}
                                        </div>

                                        <div className="form-field">
                                            <label htmlFor="bloodGroup">
                                                Blood Group <span className="req-star">*</span>
                                            </label>
                                            <select
                                                id="bloodGroup"
                                                name="bloodGroup"
                                                value={form.bloodGroup}
                                                onChange={handleChange}
                                                className={errors.bloodGroup ? "field-error" : ""}
                                            >
                                                <option value="">— Select —</option>
                                                {BLOOD_GROUPS.map((g) => (
                                                    <option key={g} value={g}>{g}</option>
                                                ))}
                                            </select>
                                            {errors.bloodGroup && (
                                                <span className="error-text">{errors.bloodGroup}</span>
                                            )}
                                        </div>

                                        <div className="form-field">
                                            <label htmlFor="age">
                                                Age <span className="req-star">*</span>
                                                <span className="field-hint"> (18–65)</span>
                                            </label>
                                            <input
                                                id="age"
                                                name="age"
                                                type="number"
                                                placeholder="e.g. 25"
                                                value={form.age}
                                                onChange={handleChange}
                                                min={18}
                                                max={65}
                                                className={errors.age ? "field-error" : ""}
                                            />
                                            {errors.age && (
                                                <span className="error-text">{errors.age}</span>
                                            )}
                                        </div>

                                        <div className="form-field">
                                            <label htmlFor="weight">
                                                Weight (kg) <span className="req-star">*</span>
                                                <span className="field-hint"> (min 45 kg)</span>
                                            </label>
                                            <input
                                                id="weight"
                                                name="weight"
                                                type="number"
                                                placeholder="e.g. 70"
                                                value={form.weight}
                                                onChange={handleChange}
                                                min={45}
                                                className={errors.weight ? "field-error" : ""}
                                            />
                                            {errors.weight && (
                                                <span className="error-text">{errors.weight}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Section: Contact & Location */}
                                <div className="form-section">
                                    <h3 className="form-section-title">
                                        <span className="section-icon">📍</span> Contact & Location
                                    </h3>
                                    <div className="form-grid-2">
                                        <div className="form-field">
                                            <label htmlFor="contactNumber">
                                                Contact Number <span className="req-star">*</span>
                                            </label>
                                            <input
                                                id="contactNumber"
                                                name="contactNumber"
                                                type="tel"
                                                placeholder="e.g. +91 9876543210"
                                                value={form.contactNumber}
                                                onChange={handleChange}
                                                className={errors.contactNumber ? "field-error" : ""}
                                            />
                                            {errors.contactNumber && (
                                                <span className="error-text">{errors.contactNumber}</span>
                                            )}
                                        </div>

                                        <div className="form-field">
                                            <label htmlFor="city">
                                                City <span className="req-star">*</span>
                                            </label>
                                            <input
                                                id="city"
                                                name="city"
                                                type="text"
                                                placeholder="e.g. Hyderabad"
                                                value={form.city}
                                                onChange={handleChange}
                                                className={errors.city ? "field-error" : ""}
                                            />
                                            {errors.city && (
                                                <span className="error-text">{errors.city}</span>
                                            )}
                                        </div>

                                        <div className="form-field form-field-full">
                                            <label htmlFor="address">Address (Optional)</label>
                                            <input
                                                id="address"
                                                name="address"
                                                type="text"
                                                placeholder="Street, Area, Landmark"
                                                value={form.address}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Section: Donation Details */}
                                <div className="form-section">
                                    <h3 className="form-section-title">
                                        <span className="section-icon">📅</span> Donation Details
                                    </h3>
                                    <div className="form-grid-2">
                                        <div className="form-field">
                                            <label htmlFor="availabilityDate">
                                                Availability Date <span className="req-star">*</span>
                                            </label>
                                            <input
                                                id="availabilityDate"
                                                name="availabilityDate"
                                                type="date"
                                                value={form.availabilityDate}
                                                onChange={handleChange}
                                                className={errors.availabilityDate ? "field-error" : ""}
                                            />
                                            {errors.availabilityDate && (
                                                <span className="error-text">{errors.availabilityDate}</span>
                                            )}
                                        </div>

                                        <div className="form-field">
                                            <label htmlFor="lastDonationDate">
                                                Last Donation Date (Optional)
                                            </label>
                                            <input
                                                id="lastDonationDate"
                                                name="lastDonationDate"
                                                type="date"
                                                value={form.lastDonationDate}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="form-field form-field-full">
                                            <label htmlFor="healthConditions">
                                                Health Conditions / Medications (Optional)
                                            </label>
                                            <textarea
                                                id="healthConditions"
                                                name="healthConditions"
                                                rows={3}
                                                placeholder="Mention any chronic illness, allergies, or ongoing medications (leave blank if none)"
                                                value={form.healthConditions}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="form-field">
                                            <label htmlFor="smokes">
                                                Do you smoke? <span className="req-star">*</span>
                                            </label>
                                            <select
                                                id="smokes"
                                                name="smokes"
                                                value={form.smokes}
                                                onChange={handleChange}
                                                className={errors.smokes ? "field-error" : ""}
                                            >
                                                <option value="">— Select —</option>
                                                <option value="No">No</option>
                                                <option value="Yes">Yes</option>
                                            </select>
                                            {errors.smokes && (
                                                <span className="error-text">{errors.smokes}</span>
                                            )}
                                        </div>

                                        <div className="form-field">
                                            <label htmlFor="alcohol">
                                                Do you consume alcohol? <span className="req-star">*</span>
                                            </label>
                                            <select
                                                id="alcohol"
                                                name="alcohol"
                                                value={form.alcohol}
                                                onChange={handleChange}
                                                className={errors.alcohol ? "field-error" : ""}
                                            >
                                                <option value="">— Select —</option>
                                                <option value="No">No</option>
                                                <option value="Yes">Yes</option>
                                            </select>
                                            {errors.alcohol && (
                                                <span className="error-text">{errors.alcohol}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="form-eligibility-info">
                                    <span className="info-icon">ℹ️</span>
                                    <span>
                                        To be eligible: Age 18–65, weight ≥ 45 kg, no recent
                                        illness, and at least 3 months since last donation.
                                    </span>
                                </div>

                                <button
                                    type="submit"
                                    className="donate-submit-btn"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="btn-spinner">⏳ Submitting…</span>
                                    ) : (
                                        <>🩸 Submit Donation Registration</>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Donation History */}
                        <div className="donate-history">
                            <h3 className="history-title">📋 Your Donation Registrations</h3>
                            {fetchingHistory ? (
                                <div className="history-loading">Loading history…</div>
                            ) : myDonations.length === 0 ? (
                                <div className="history-empty">
                                    No registrations yet. Submit the form above to get started.
                                </div>
                            ) : (
                                <div className="history-table-wrapper">
                                    <table className="history-table">
                                        <thead>
                                            <tr>
                                                <th>Blood Group</th>
                                                <th>City</th>
                                                <th>Availability</th>
                                                <th>Contact</th>
                                                <th>Status</th>
                                                <th>Registered On</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {myDonations.map((d) => (
                                                <tr key={d._id}>
                                                    <td>
                                                        <span className="blood-badge">{d.bloodGroup}</span>
                                                    </td>
                                                    <td>{d.city}</td>
                                                    <td>{formatDate(d.availabilityDate)}</td>
                                                    <td>{d.contactNumber}</td>
                                                    <td>
                                                        <span className={`status-pill status-${d.status}`}>
                                                            {d.status}
                                                        </span>
                                                    </td>
                                                    <td>{formatDate(d.createdAt)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DonatePage;

