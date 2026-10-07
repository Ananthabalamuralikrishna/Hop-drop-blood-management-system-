import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import ToggleTabs from "../components/ToggleTabs";
import StatusBadge from "../components/StatusBadge";
import "./Dashboard.css";

function UserDashboard() {
  const { auth, users, hospitals, requests, notifications, bloodGroups, actions } =
    useAppContext();
  const currentUser = auth.userData;

  useEffect(() => {
  if (auth?.isAuthenticated && actions.getUserRequests) {
    actions.getUserRequests();
  }
  }, []);

  const [activeTab, setActiveTab] = useState("request");

  // ---- Request form ----
  const [requestForm, setRequestForm] = useState({
    bloodGroup: "",
    units: "",
    urgency: "",
  });
  const [requestErrors, setRequestErrors] = useState({});
  const [requestSuccess, setRequestSuccess] = useState("");
  const [requestError, setRequestError] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [attachmentPreviewUrl, setAttachmentPreviewUrl] = useState("");

  // ---- Donate form ----
  const [donateForm, setDonateForm] = useState({
    fullName: currentUser?.name || "",
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
  });
  const [donateErrors, setDonateErrors] = useState({});
  const [donateSuccess, setDonateSuccess] = useState("");
  const [donateError, setDonateError] = useState("");

  // ---- Donation history ----
  const [myDonations, setMyDonations] = useState([]);
  const [fetchingHistory, setFetchingHistory] = useState(false);

  useEffect(() => {
    if (activeTab === "donate" && actions.fetchMyDonations) {
      setFetchingHistory(true);
      actions.fetchMyDonations().then((data) => {
        setMyDonations(data || []);
        setFetchingHistory(false);
      });
    }
  }, [activeTab, donateSuccess]);

  const userRequests = requests.filter((r) => r.userId === auth.userId);

  /* ---- Request Validation ---- */
  const validateRequest = () => {
    const errs = {};
    if (!requestForm.bloodGroup)
      errs.bloodGroup = "Please select a blood group.";
    if (!requestForm.units) errs.units = "Units required.";
    else if (Number(requestForm.units) <= 0)
      errs.units = "Units must be greater than 0.";
    if (!requestForm.urgency) errs.urgency = "Select urgency level.";
    if (attachment) {
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
      if (!allowedTypes.includes(attachment.type))
        errs.attachment = "Only JPG, PNG, or PDF files are allowed.";
    }
    setRequestErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setRequestSuccess("");
    setRequestError("");
    if (!validateRequest()) return;
    const result = await actions.createRequest({
      userId: auth.userId,
      bloodGroup: requestForm.bloodGroup,
      units: Number(requestForm.units),
      urgency: requestForm.urgency,
    });
    if (!result.ok) {
      setRequestError(result.message);
      return;
    }
    setRequestForm({ bloodGroup: "", units: "", urgency: "" });
    setAttachment(null);
    if (attachmentPreviewUrl) {
      URL.revokeObjectURL(attachmentPreviewUrl);
      setAttachmentPreviewUrl("");
    }
    setRequestErrors({});
    setRequestSuccess("Blood request submitted and marked as Pending.");
  };

  /* ---- Donate Validation ---- */
  const validateDonate = () => {
    const errs = {};
    if (!donateForm.fullName.trim()) errs.fullName = "Full name is required.";
    if (!donateForm.age) errs.age = "Age is required.";
    else if (Number(donateForm.age) < 18 || Number(donateForm.age) > 65)
      errs.age = "Age must be between 18 and 65.";
    if (!donateForm.weight) errs.weight = "Weight is required.";
    else if (Number(donateForm.weight) < 45)
      errs.weight = "Minimum weight to donate is 45 kg.";
    if (!donateForm.bloodGroup) errs.bloodGroup = "Please select a blood group.";
    if (!donateForm.city.trim()) errs.city = "City is required.";
    if (!donateForm.contactNumber.trim())
      errs.contactNumber = "Contact number is required.";
    if (!donateForm.availabilityDate)
      errs.availabilityDate = "Availability date is required.";
    else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(donateForm.availabilityDate) < today)
        errs.availabilityDate = "Choose a future date.";
    }
    // ---- Last Donation Date (MANDATORY) ----
    if (!donateForm.lastDonationDate) {
      errs.lastDonationDate = "Last donation date is required.";
    } else {
      const lastDate = new Date(donateForm.lastDonationDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // ❌ Future date
      if (lastDate > today) {
         errs.lastDonationDate = "Last donation date cannot be in the future.";
        } else {
        const diffInMs = today - lastDate;
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

      // ❌ Less than 3 months (≈ 90 days)
        if (diffInDays < 90) {
            errs.lastDonationDate = "At least 3 months gap is required since last donation.";
        }}}

    if (!donateForm.smokes) errs.smokes = "Please answer the smoking question.";
    if (!donateForm.alcohol) errs.alcohol = "Please answer the alcohol question.";
    setDonateErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleDonateSubmit = async (e) => {
    e.preventDefault();
    setDonateSuccess("");
    setDonateError("");
    if (!validateDonate()) return;
    setDonateErrors({});

    const result = await actions.createDonation({
      fullName: donateForm.fullName,
      age: donateForm.age,
      weight: donateForm.weight,
      bloodGroup: donateForm.bloodGroup,
      city: donateForm.city,
      address: donateForm.address,
      contactNumber: donateForm.contactNumber,
      availabilityDate: donateForm.availabilityDate,
      lastDonationDate: donateForm.lastDonationDate,
      healthConditions: donateForm.healthConditions,
      isSmoker: donateForm.smokes === "Yes",
      consumesAlcohol: donateForm.alcohol === "Yes",
    });

    if (!result.ok) {
      setDonateError(result.message);
      return;
    }

    setDonateSuccess(result.message);
    setDonateForm({
      fullName: currentUser?.name || "",
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
    });
  };

  const getHospitalName = (hospitalId) => {
    const h = hospitals.find((x) => x.id === hospitalId);
    return h ? h.name : "";
  };

  const handleDonateFieldChange = (e) => {
    setDonateForm({ ...donateForm, [e.target.name]: e.target.value });
    if (donateErrors[e.target.name])
      setDonateErrors({ ...donateErrors, [e.target.name]: "" });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });
  };

  return (
    <div className="page-wrapper">
      <main className="page-content dashboard-content">
        {currentUser && (
          <div className="page-header-sub" style={{ marginBottom: 12 }}>
            Welcome, <strong>{currentUser.name}</strong>
          </div>
        )}

        {notifications && notifications.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <Card title="Notifications">
              <ul className="notification-list">
                {notifications
                  .filter((n) => n.userId === auth.userId)
                  .map((n) => (
                    <li key={n.id} className="notification-item">
                      <StatusBadge status={n.status} /> {n.message}
                    </li>
                  ))}
                {notifications.filter((n) => n.userId === auth.userId).length ===
                  0 && (
                    <li className="notification-item muted-text">
                      No notifications yet.
                    </li>
                  )}
              </ul>
            </Card>
          </div>
        )}

        <Card>
          <ToggleTabs
            options={[
              { value: "request", label: "Request Blood" },
              { value: "donate", label: "Donate Blood" },
            ]}
            active={activeTab}
            onChange={setActiveTab}
          />

          {/* ========= REQUEST TAB ========= */}
          {activeTab === "request" && (
            <div>
              <h3 className="section-title">Request Blood</h3>
              <form onSubmit={handleRequestSubmit}>
                <div className="input-group">
                  <label className="input-label" htmlFor="reqBloodGroup">
                    Blood Group
                  </label>
                  <select
                    id="reqBloodGroup"
                    name="reqBloodGroup"
                    className={
                      requestErrors.bloodGroup
                        ? "input-field input-error"
                        : "input-field"
                    }
                    value={requestForm.bloodGroup}
                    onChange={(e) =>
                      setRequestForm({ ...requestForm, bloodGroup: e.target.value })
                    }
                  >
                    <option value="">Select blood group</option>
                    {bloodGroups.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                  {requestErrors.bloodGroup && (
                    <div className="input-error-text">{requestErrors.bloodGroup}</div>
                  )}
                </div>

                <div className="input-group">
                  <label className="input-label" htmlFor="attachment">
                    Supporting Document (optional)
                  </label>
                  <input
                    id="attachment"
                    name="attachment"
                    type="file"
                    className="input-field"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setAttachment(file);
                      if (attachmentPreviewUrl) {
                        URL.revokeObjectURL(attachmentPreviewUrl);
                        setAttachmentPreviewUrl("");
                      }
                      if (file && file.type.startsWith("image/")) {
                        setAttachmentPreviewUrl(URL.createObjectURL(file));
                      }
                    }}
                  />
                  {requestErrors.attachment && (
                    <div className="input-error-text">{requestErrors.attachment}</div>
                  )}
                  {attachment && (
                    <div className="muted-text" style={{ marginTop: 4 }}>
                      Selected file: {attachment.name}
                    </div>
                  )}
                  {attachmentPreviewUrl && (
                    <div style={{ marginTop: 8, maxWidth: 260, borderRadius: 6, overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)" }}>
                      <img src={attachmentPreviewUrl} alt="Attachment preview" style={{ width: "100%", display: "block" }} />
                    </div>
                  )}
                </div>

                <Input
                  label="Units Required"
                  name="units"
                  type="number"
                  value={requestForm.units}
                  onChange={(e) => setRequestForm({ ...requestForm, units: e.target.value })}
                  placeholder="Number of units"
                  error={requestErrors.units}
                  min={1}
                />

                <div className="input-group">
                  <label className="input-label" htmlFor="urgency">
                    Urgency Level
                  </label>
                  <select
                    id="urgency"
                    name="urgency"
                    className={requestErrors.urgency ? "input-field input-error" : "input-field"}
                    value={requestForm.urgency}
                    onChange={(e) => setRequestForm({ ...requestForm, urgency: e.target.value })}
                  >
                    <option value="">Select urgency</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                  {requestErrors.urgency && (
                    <div className="input-error-text">{requestErrors.urgency}</div>
                  )}
                </div>

                {requestError && <div className="form-error">{requestError}</div>}
                {requestSuccess && <div className="form-success">{requestSuccess}</div>}

                <Button type="submit" variant="primary">
                  Submit Request
                </Button>
              </form>

              <h4 className="section-subtitle">Your Requests</h4>
              {userRequests.length === 0 ? (
                <div className="muted-text">You have not made any requests yet.</div>
              ) : (
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Blood Group</th>
                        <th>Units</th>
                        <th>Urgency</th>
                        <th>Status</th>
                        <th>Hospital</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userRequests.map((req) => (
                        <tr key={req._id}>
                          <td>{req.bloodGroup}</td>
                          <td>{req.units}</td>
                          <td>{req.urgency}</td>
                          <td><StatusBadge status={req.status} /></td>
                          <td>{req.acceptedHospital?.hospitalName || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ========= DONATE TAB — open to ALL logged-in users ========= */}
          {activeTab === "donate" && (
            <div>
              <h3 className="section-title">Donate Blood</h3>
              <p className="muted-text" style={{ marginBottom: 16 }}>
                Register your availability as a blood donor. A hospital will
                contact you to schedule the donation.
              </p>

              {donateSuccess && (
                <div className="form-success" style={{ marginBottom: 16 }}>
                  ✅ {donateSuccess}
                </div>
              )}
              {donateError && (
                <div className="form-error" style={{ marginBottom: 16 }}>
                  {donateError}
                </div>
              )}

              <form onSubmit={handleDonateSubmit}>
                {/* Personal Info */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className="input-group">
                    <label className="input-label" htmlFor="dn-fullName">
                      Full Name *
                    </label>
                    <input
                      id="dn-fullName"
                      name="fullName"
                      type="text"
                      className={donateErrors.fullName ? "input-field input-error" : "input-field"}
                      placeholder="Your full name"
                      value={donateForm.fullName}
                      onChange={handleDonateFieldChange}
                    />
                    {donateErrors.fullName && <div className="input-error-text">{donateErrors.fullName}</div>}
                  </div>

                  <div className="input-group">
                    <label className="input-label" htmlFor="dn-bloodGroup">
                      Blood Group *
                    </label>
                    <select
                      id="dn-bloodGroup"
                      name="bloodGroup"
                      className={donateErrors.bloodGroup ? "input-field input-error" : "input-field"}
                      value={donateForm.bloodGroup}
                      onChange={handleDonateFieldChange}
                    >
                      <option value="">Select blood group</option>
                      {bloodGroups.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                    {donateErrors.bloodGroup && <div className="input-error-text">{donateErrors.bloodGroup}</div>}
                  </div>

                  <div className="input-group">
                    <label className="input-label" htmlFor="dn-age">Age * (18–65)</label>
                    <input
                      id="dn-age"
                      name="age"
                      type="number"
                      className={donateErrors.age ? "input-field input-error" : "input-field"}
                      placeholder="e.g. 25"
                      value={donateForm.age}
                      onChange={handleDonateFieldChange}
                      min={18} max={65}
                    />
                    {donateErrors.age && <div className="input-error-text">{donateErrors.age}</div>}
                  </div>

                  <div className="input-group">
                    <label className="input-label" htmlFor="dn-weight">Weight kg * (min 45)</label>
                    <input
                      id="dn-weight"
                      name="weight"
                      type="number"
                      className={donateErrors.weight ? "input-field input-error" : "input-field"}
                      placeholder="e.g. 65"
                      value={donateForm.weight}
                      onChange={handleDonateFieldChange}
                      min={45}
                    />
                    {donateErrors.weight && <div className="input-error-text">{donateErrors.weight}</div>}
                  </div>

                  <div className="input-group">
                    <label className="input-label" htmlFor="dn-contact">Contact Number *</label>
                    <input
                      id="dn-contact"
                      name="contactNumber"
                      type="tel"
                      className={donateErrors.contactNumber ? "input-field input-error" : "input-field"}
                      placeholder="+91 9876543210"
                      value={donateForm.contactNumber}
                      onChange={handleDonateFieldChange}
                    />
                    {donateErrors.contactNumber && <div className="input-error-text">{donateErrors.contactNumber}</div>}
                  </div>

                  <div className="input-group">
                    <label className="input-label" htmlFor="dn-city">City *</label>
                    <input
                      id="dn-city"
                      name="city"
                      type="text"
                      className={donateErrors.city ? "input-field input-error" : "input-field"}
                      placeholder="e.g. Hyderabad"
                      value={donateForm.city}
                      onChange={handleDonateFieldChange}
                    />
                    {donateErrors.city && <div className="input-error-text">{donateErrors.city}</div>}
                  </div>

                  <div className="input-group" style={{ gridColumn: "1 / -1" }}>
                    <label className="input-label" htmlFor="dn-address">Address (optional)</label>
                    <input
                      id="dn-address"
                      name="address"
                      type="text"
                      className="input-field"
                      placeholder="Street, Area, Landmark"
                      value={donateForm.address}
                      onChange={handleDonateFieldChange}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label" htmlFor="dn-avail">Availability Date *</label>
                    <input
                      id="dn-avail"
                      name="availabilityDate"
                      type="date"
                      className={donateErrors.availabilityDate ? "input-field input-error" : "input-field"}
                      value={donateForm.availabilityDate}
                      onChange={handleDonateFieldChange}
                    />
                    {donateErrors.availabilityDate && <div className="input-error-text">{donateErrors.availabilityDate}</div>}
                  </div>

                  <div className="input-group">
                    <label className="input-label" htmlFor="dn-lastDate"> Last Donation Date * </label>

                    <input
                      id="dn-lastDate"
                      name="lastDonationDate"
                      type="date"
                      className={donateErrors.lastDonationDate ? "input-field input-error" : "input-field"}
                      value={donateForm.lastDonationDate}
                      onChange={handleDonateFieldChange}
                    />

                    {donateErrors.lastDonationDate && (<div className="input-error-text">{donateErrors.lastDonationDate}</div>)}
                  </div>

                  <div className="input-group" style={{ gridColumn: "1 / -1" }}>
                    <label className="input-label" htmlFor="dn-health">Health Conditions / Medications (optional)</label>
                    <textarea
                      id="dn-health"
                      name="healthConditions"
                      rows={2}
                      className="input-field"
                      style={{ resize: "vertical", fontFamily: "inherit" }}
                      placeholder="Mention any chronic illness, allergies, or ongoing medication (leave blank if none)"
                      value={donateForm.healthConditions}
                      onChange={handleDonateFieldChange}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label" htmlFor="dn-smokes">Do you smoke? *</label>
                    <select
                      id="dn-smokes"
                      name="smokes"
                      className={donateErrors.smokes ? "input-field input-error" : "input-field"}
                      value={donateForm.smokes}
                      onChange={handleDonateFieldChange}
                    >
                      <option value="">Select option</option>
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                    {donateErrors.smokes && <div className="input-error-text">{donateErrors.smokes}</div>}
                  </div>

                  <div className="input-group">
                    <label className="input-label" htmlFor="dn-alcohol">Do you consume alcohol? *</label>
                    <select
                      id="dn-alcohol"
                      name="alcohol"
                      className={donateErrors.alcohol ? "input-field input-error" : "input-field"}
                      value={donateForm.alcohol}
                      onChange={handleDonateFieldChange}
                    >
                      <option value="">Select option</option>
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                    {donateErrors.alcohol && <div className="input-error-text">{donateErrors.alcohol}</div>}
                  </div>
                </div>

                <div className="muted-text" style={{ marginTop: 10, marginBottom: 14, fontSize: 12 }}>
                  ℹ️ Eligibility: Age 18–65, weight ≥ 45 kg, no recent illness, ≥ 3 months since last donation.
                </div>

                <Button type="submit" variant="primary">
                  🩸 Submit Donation Registration
                </Button>
              </form>

              {/* Donation History */}
              <h4 className="section-subtitle" style={{ marginTop: 28 }}>Your Donation Registrations</h4>
              {fetchingHistory ? (
                <div className="muted-text">Loading…</div>
              ) : myDonations.length === 0 ? (
                <div className="muted-text">No registrations yet.</div>
              ) : (
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Blood Group</th>
                        <th>City</th>
                        <th>Availability</th>
                        <th>Contact</th>
                        <th>Status</th>
                        <th>Submitted</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myDonations.map((d) => (
                        <tr key={d._id}>
                          <td><strong>{d.bloodGroup}</strong></td>
                          <td>{d.city}</td>
                          <td>{formatDate(d.availabilityDate)}</td>
                          <td>{d.contactNumber}</td>
                          <td>
                            <StatusBadge status={d.status} />
                          </td>
                          <td>{formatDate(d.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}

export default UserDashboard;

