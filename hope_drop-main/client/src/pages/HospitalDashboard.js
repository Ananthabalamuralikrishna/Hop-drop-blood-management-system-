import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import Card from "../components/Card";
import Button from "../components/Button";
import ToggleTabs from "../components/ToggleTabs";
import StatusBadge from "../components/StatusBadge";
import "./Dashboard.css";

function HospitalDashboard() {
  const { auth, hospitals, bloodGroups, actions } = useAppContext();
  const currentHospital = hospitals.find((h) => h.id === auth.userId);

  const [activeTab, setActiveTab] = useState("requests");
  const [actionError, setActionError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Real data from backend
  const [realRequests, setRealRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === "inventory" && auth.userId && actions.fetchHospitalInventory) {
      actions.fetchHospitalInventory(auth.userId);
    }
  }, [activeTab, auth.userId, actions]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (activeTab === "requests") {
        const reqs = await actions.fetchActiveRequests();
        setRealRequests(reqs);
      } else if (activeTab === "donations") {
        const dons = await actions.fetchDonationsForHospital();
        setDonations(dons);
      }
      setLoading(false);
    };
    fetchData();
  }, [activeTab, actions]);

  const handleAccept = async (request) => {
    if (!currentHospital) return;
    setActionError("");
    setSuccessMsg("");

    // Call real backend (backend handles inventory check + email)
    const result = await actions.updateRequestStatus({
      requestId: request._id,
      status: "Accepted",
    });

    if (result.ok) {
      setSuccessMsg(result.message || "Request accepted successfully! Email notification sent.");
      // Refresh inventory and requests
      actions.fetchHospitalInventory(auth.userId);
      const reqs = await actions.fetchActiveRequests();
      setRealRequests(reqs);
    } else {
      setActionError(result.message || "Failed to accept request.");
    }
  };

  const handleReject = async (request) => {
    if (!currentHospital) return;
    setActionError("");
    setSuccessMsg("");
    const result = await actions.updateRequestStatus({
      requestId: request._id,
      status: "Rejected",
    });

    if (result.ok) {
      setSuccessMsg("Request rejected successfully.");
      const reqs = await actions.fetchActiveRequests();
      setRealRequests(reqs);
    } else {
      setActionError(result.message || "Failed to reject request.");
    }
  };

  const handleInventoryChange = (group, delta) => {
    if (!currentHospital) return;
    actions.updateHospitalInventory({
      hospitalId: currentHospital.id,
      bloodGroup: group,
      delta,
    });
  };

  return (
    <div className="page-wrapper">
      <main className="page-content dashboard-content">
        {currentHospital && (
          <div className="page-header-sub" style={{ marginBottom: 12 }}>
            Welcome, <strong>{currentHospital.name}</strong>
          </div>
        )}
        <Card>
          <ToggleTabs
            options={[
              { value: "requests", label: "Requests" },
              { value: "inventory", label: "Stock Inventory" },
              { value: "donations", label: "Community Donations" },
            ]}
            active={activeTab}
            onChange={setActiveTab}
          />

          {/* Success / Error Messages */}
          {successMsg && (
            <div style={{
              background: "#e8f5e9", color: "#2e7d32", padding: "12px 16px",
              borderRadius: "8px", margin: "12px 0", fontWeight: 500, border: "1px solid #a5d6a7"
            }}>
              ✅ {successMsg}
            </div>
          )}
          {actionError && (
            <div className="form-error" style={{ marginBottom: 12 }}>
              ❌ {actionError}
            </div>
          )}

          {loading ? (
            <div className="muted-text" style={{ padding: "20px", textAlign: "center" }}>Loading...</div>
          ) : (
            <>
              {activeTab === "requests" && (
                <div>
                  <h3 className="section-title">Active Requests</h3>
                  {realRequests.length === 0 ? (
                    <div className="muted-text">No active requests at the moment.</div>
                  ) : (
                    <div className="table-wrapper">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>User</th>
                            <th>Contact</th>
                            <th>Blood Group</th>
                            <th>Units</th>
                            <th>Urgency</th>
                            <th>Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {realRequests.map((req) => {
                            const isPending = req.status === "pending";
                            const disableActions = !isPending;
                            return (
                              <tr key={req._id}>
                                <td>{req.userId?.name || "Unknown"}</td>
                                <td>{req.userId?.contactNumber || "N/A"}</td>
                                <td>{req.bloodGroup}</td>
                                <td>{req.units}</td>
                                <td>
                                  <span style={{
                                    color: req.urgency === 'high' ? 'red' : req.urgency === 'medium' ? 'orange' : 'inherit',
                                    fontWeight: req.urgency === 'high' ? 'bold' : 'normal'
                                  }}>
                                    {req.urgency?.toUpperCase() || "N/A"}
                                  </span>
                                </td>
                                <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                                <td>
                                  <div className="actions-inline">
                                    <Button
                                      variant="primary"
                                      disabled={disableActions}
                                      onClick={() => handleAccept(req)}
                                    >
                                      Accept
                                    </Button>
                                    <Button
                                      variant="secondary"
                                      disabled={disableActions}
                                      onClick={() => handleReject(req)}
                                    >
                                      Reject
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "donations" && (
                <div>
                  <h3 className="section-title">Community Blood Donations</h3>
                  {donations.length === 0 ? (
                    <div className="muted-text">No community donations available.</div>
                  ) : (
                    <div className="table-wrapper">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Donor Name</th>
                            <th>Blood Group</th>
                            <th>City / Area</th>
                            <th>Contact</th>
                            <th>Age/Weight</th>
                            <th>Availability Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {donations.map((don) => (
                            <tr key={don._id}>
                              <td>{don.fullName}</td>
                              <td><strong>{don.bloodGroup}</strong></td>
                              <td>{don.city}</td>
                              <td>{don.contactNumber}</td>
                              <td>{don.age} yrs / {don.weight} kg</td>
                              <td>{new Date(don.availabilityDate).toLocaleDateString()}</td>
                              <td>
                                <a href={`tel:${don.contactNumber}`} style={{ textDecoration: 'none' }}>
                                  <Button variant="primary" style={{ padding: '6px 12px', fontSize: '12px' }}>Call</Button>
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "inventory" && currentHospital && (
                <div>
                  <h3 className="section-title">Stock Inventory</h3>
                  <div className="table-wrapper">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Blood Group</th>
                          <th>Available Units</th>
                          <th>Adjust</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bloodGroups.map((g) => {
                          const units = currentHospital.inventory[g] || 0;
                          return (
                            <tr key={g}>
                              <td>{g}</td>
                              <td>{units}</td>
                              <td>
                                <div className="actions-inline">
                                  <Button
                                    variant="secondary"
                                    onClick={() => handleInventoryChange(g, -1)}
                                    disabled={units <= 0}
                                  >
                                    −
                                  </Button>
                                  <Button
                                    variant="primary"
                                    onClick={() => handleInventoryChange(g, 1)}
                                  >
                                    +
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
      </main>
    </div>
  );
}

export default HospitalDashboard;
