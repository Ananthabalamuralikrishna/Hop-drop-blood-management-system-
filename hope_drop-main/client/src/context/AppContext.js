import React, { createContext, useContext, useReducer } from "react";
import api from "../server/api";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const AppContext = createContext(null);

const initialState = {
  auth: {
    isAuthenticated: false,
    role: null, // "user" | "hospital"
    userId: null,
  },
  users: [],
  hospitals: [],
  requests: [],
  notifications: [],
};

let idCounter = 1;
const nextId = () => String(idCounter++);

const createEmptyInventory = () => {
  const inventory = {};
  BLOOD_GROUPS.forEach((g) => {
    inventory[g] = 0;
  });
  return inventory;
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_REQUESTS":
      return {
        ...state,
        requests: action.payload,
    };
    case "SET_AUTH": {
      return {
        ...state,
        auth: action.payload,
      };
    }
    case "USER_SIGNUP": {
      const newUser = {
        id: nextId(),
        ...action.payload,
      };
      return {
        ...state,
        users: [...state.users, newUser],
        auth: {
          isAuthenticated: true,
          role: "user",
          userId: newUser.id,
        },
      };
    }
    case "HOSPITAL_SIGNUP": {
      const newHospital = {
        id: nextId(),
        ...action.payload,
        inventory: createEmptyInventory(),
      };
      return {
        ...state,
        hospitals: [...state.hospitals, newHospital],
        auth: {
          isAuthenticated: true,
          role: "hospital",
          userId: newHospital.id,
        },
      };
    }
    case "USER_LOGIN": {
      const { email, password } = action.payload;
      const user = state.users.find(
        (u) => u.email === email && u.password === password
      );
      if (!user) return state;
      return {
        ...state,
        auth: { isAuthenticated: true, role: "user", userId: user.id },
      };
    }
    case "HOSPITAL_LOGIN": {
      const { email, password } = action.payload;
      const hospital = state.hospitals.find(
        (h) => h.email === email && h.password === password
      );
      if (!hospital) return state;
      return {
        ...state,
        auth: { isAuthenticated: true, role: "hospital", userId: hospital.id },
      };
    }
    case "LOGOUT": {
      return {
        ...state,
        auth: { isAuthenticated: false, role: null, userId: null },
      };
    }
    case "CREATE_REQUEST": {
      const newRequest = {
        id: nextId(),
        userId: action.payload.userId,
        bloodGroup: action.payload.bloodGroup,
        units: action.payload.units,
        urgency: action.payload.urgency,
        status: "Pending",
        hospitalId: null,
      };
      return {
        ...state,
        requests: [newRequest, ...state.requests],
      };
    }
    case "UPDATE_REQUEST_STATUS": {
      const { requestId, status, hospitalId } = action.payload;
      const targetRequest = state.requests.find((req) => req.id === requestId);
      const newNotification =
        targetRequest && (status === "Accepted" || status === "Rejected")
          ? {
            id: nextId(),
            userId: targetRequest.userId,
            status,
            message: `Your blood request for ${targetRequest.units} unit(s) of ${targetRequest.bloodGroup} was ${status}.`,
          }
          : null;

      return {
        ...state,
        requests: state.requests.map((req) =>
          req.id === requestId ? { ...req, status, hospitalId } : req
        ),
        notifications: newNotification
          ? [newNotification, ...state.notifications]
          : state.notifications,
      };
    }
    case "UPDATE_HOSPITAL_INVENTORY": {
      const { hospitalId, bloodGroup, delta } = action.payload;
      return {
        ...state,
        hospitals: state.hospitals.map((h) => {
          if (h.id !== hospitalId) return h;
          const currentUnits = h.inventory[bloodGroup] || 0;
          let nextUnits = currentUnits + delta;
          if (nextUnits < 0) nextUnits = 0;
          return {
            ...h,
            inventory: {
              ...h.inventory,
              [bloodGroup]: nextUnits,
            },
          };
        }),
      };
    }
    case "SET_HOSPITAL_DATA": {
      const hospital = action.payload;
      const exists = state.hospitals.some((h) => h.id === hospital.id);
      if (exists) {
        return {
          ...state,
          hospitals: state.hospitals.map((h) => (h.id === hospital.id ? hospital : h)),
        };
      }
      return {
        ...state,
        hospitals: [...state.hospitals, hospital],
      };
    }
    default:
      return state;
  }
}

export const AppProvider = ({ children }) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");

  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    auth:
      storedUser && storedToken
        ? {
            isAuthenticated: true,
            role: "user",
            userId: storedUser._id,
            userData: storedUser,
          }
        : initialState.auth,
  });

  const auth = state.auth;

  const userSignup = async (data) => {
    const eligibilityStatus = "Unknown";

    // Map form fields to API payload expected by backend
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      bloodGroup: data.bloodGroup,
      location: data.location,
      contactNumber: data.contact,
    };

    // Create account in backend (with hashed password + JWT)
    const response = await api.post("/auth/users/register", payload);

    const { token, user } = response.data;
    if (token) {
      localStorage.setItem("token", token);
    }

    // Keep existing in-memory behaviour for dashboards
    dispatch({
      type: "USER_SIGNUP",
      payload: {
        ...data,
        eligibilityStatus,
        backendId: user?._id || null,
      },
    });
  };

  const hospitalSignup = async (data) => {
    // Create account in backend
    const response = await api.post("/auth/hospitals/signup", {
      hospitalName: data.name,
      email: data.email,
      password: data.password,
      licenseID: data.licenseId,
      location: data.location,
      contactNumber: data.contact,
    });

    const { token, hospital } = response.data;
    if (token) {
      localStorage.setItem("token", token);
    }

    // Preserve existing in-memory behaviour
    dispatch({
      type: "HOSPITAL_SIGNUP",
      payload: { ...data, backendId: hospital?._id || null },
    });
  };

  const userLogin = async (email, password) => {
    try {
      const response = await api.post("/auth/users/login", {
        email,
        password,
      });

      const { token, user } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      }

      dispatch({
        type: "SET_AUTH",
        payload: {
          isAuthenticated: true,
          role: "user",
          userId: user?._id || null,
          userData: user,
        },
      });

      return true;
    } catch (err) {
      return false;
    }
  };

  const hospitalLogin = async (email, password) => {
    try {
      const response = await api.post("/auth/hospitals/login", {
        email,
        password,
      });

      const { token, hospital } = response.data;
      if (token) {
        localStorage.setItem("token", token);
      }

      // Fetch inventory immediately
      const inventoryRes = await api.get("/auth/inventory/");
      const inventoryData = inventoryRes.data; // Array of {bloodGroup, units}
      const inventoryMap = createEmptyInventory();
      inventoryData.forEach((item) => {
        inventoryMap[item.bloodGroup] = item.units;
      });

      const fullHospital = {
        id: hospital._id,
        name: hospital.hospitalName,
        email: hospital.email,
        inventory: inventoryMap,
      };

      dispatch({
        type: "SET_HOSPITAL_DATA",
        payload: fullHospital,
      });

      dispatch({
        type: "SET_AUTH",
        payload: {
          isAuthenticated: true,
          role: "hospital",
          userId: hospital?._id || null,
        },
      });

      return true;
    } catch (err) {
      return false;
    }
  };

  const fetchHospitalInventory = async (hospitalId) => {
    try {
      const response = await api.get("/auth/inventory/");
      const inventoryData = response.data;
      const inventoryMap = createEmptyInventory();
      inventoryData.forEach((item) => {
        inventoryMap[item.bloodGroup] = item.units;
      });

      // We need the rest of hospital info if not present
      // For now, just update inventory in the state if hospital exists
      const hospital = state.hospitals.find(h => h.id === hospitalId);
      if (hospital) {
        dispatch({
          type: "SET_HOSPITAL_DATA",
          payload: { ...hospital, inventory: inventoryMap }
        });
      }
      return inventoryMap;
    } catch (err) {
      console.error("Failed to fetch inventory", err);
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
  };

  const createDonation = async ({
    fullName,
    age,
    weight,
    bloodGroup,
    city,
    address,
    contactNumber,
    availabilityDate,
    lastDonationDate,
    healthConditions,
    isSmoker,
    consumesAlcohol,
    // legacy fields kept for UserDashboard compatibility
    date,
    contact,
  }) => {
    const payload = {
      fullName: fullName || "",
      age: age || "",
      weight: weight || "",
      bloodGroup,
      city: city || "",
      address: address || "",
      contactNumber: contactNumber || contact || "",
      availabilityDate: availabilityDate || date,
      lastDonationDate: lastDonationDate || null,
      healthConditions: healthConditions || "",
      isSmoker: isSmoker || false,
      consumesAlcohol: consumesAlcohol || false,
    };

    try {
      const response = await api.post("/auth/donations/create", payload);
      const message =
        response?.data?.message ||
        "Thank you for volunteering to donate blood! A hospital will contact you soon.";
      return { ok: true, message };
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Failed to submit donation interest. Please try again.";
      return { ok: false, message };
    }
  };

  const fetchMyDonations = async () => {
    try {
      const response = await api.get("/auth/donations/my");
      return response.data || [];
    } catch {
      return [];
    }
  };

  const createRequest = async ({ userId, bloodGroup, units, urgency }) => {
    // Backend expects lowercase urgency enum: "low" | "medium" | "high"
    const normalizedUrgency =
      typeof urgency === "string" ? urgency.toLowerCase() : urgency;
    const payload = { bloodGroup, units, urgency: normalizedUrgency };

    try {
      await api.post("/auth/requests/add", payload);
      await getUserRequests();

      return { ok: true };
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to submit request. Please try again.";
      return { ok: false, message };
    }
  };
  
  const getUserRequests = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await api.get("/auth/users/requests", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch({
      type: "SET_REQUESTS",
      payload: res.data,
    });
  } catch (err) {
    console.error("Error fetching user requests:", err);
  }
  };

  const fetchActiveRequests = async () => {
    try {
      const response = await api.get("/auth/requests/active");
      return response.data || [];
    } catch (err) {
      console.error("Failed to fetch active requests", err);
      return [];
    }
  };

  const fetchDonationsForHospital = async () => {
    try {
      const response = await api.get("/auth/donations/hospital");
      return response.data || [];
    } catch (err) {
      console.error("Failed to fetch donations", err);
      return [];
    }
  };

  const updateRequestStatus = async ({ requestId, status }) => {
    const action = status === "Accepted" ? "accept" : "reject";
    try {
      const response = await api.patch(`/auth/requests/${action}/${requestId}`);
      await getUserRequests();
      return { ok: true, message: response.data?.message || "Success", hospitalName: response.data?.hospitalName };
    } catch (err) {
      console.error(`Failed to ${action} request`, err);
      return { ok: false, message: err?.response?.data?.message || `Failed to ${action} request` };
    }
  };

  const updateHospitalInventory = async ({ hospitalId, bloodGroup, delta }) => {
    try {
      const units = Math.abs(delta);
      const endpoint = delta > 0 ? "/auth/inventory/increment" : "/auth/inventory/decrement";

      await api.patch(endpoint, { bloodGroup, units });

      dispatch({
        type: "UPDATE_HOSPITAL_INVENTORY",
        payload: { hospitalId, bloodGroup, delta },
      });
      return { ok: true };
    } catch (err) {
      console.error("Failed to update inventory", err);
      return { ok: false, message: err?.response?.data?.message || "Failed to update inventory" };
    }
  };

  const value = {
    auth,
    users: state.users,
    hospitals: state.hospitals,
    requests: state.requests,
    notifications: state.notifications,
    bloodGroups: BLOOD_GROUPS,
    actions: {
      userSignup,
      hospitalSignup,
      userLogin,
      hospitalLogin,
      logout,
      createRequest,
      updateRequestStatus,
      updateHospitalInventory,
      createDonation,
      fetchMyDonations,
      fetchHospitalInventory,
      fetchActiveRequests,
      fetchDonationsForHospital,
      getUserRequests,
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return ctx;
};

