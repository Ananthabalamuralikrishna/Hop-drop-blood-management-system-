import Request from "../models/requestModel.js";
import Inventory from "../models/inventoryModel.js";
import User from "../models/userModel.js";
import Hospital from "../models/hospitalModel.js";
import { sendEmail } from "../services/emailService.js";

export const createRequest = async (req, res, next) => {
  try {
    if (req.user.role !== "user") {
      const err = new Error("Access denied");
      err.statusCode = 403;
      throw err;
    }

    const { bloodGroup, units, urgency } = req.body;

    if (!bloodGroup || !units) {
      const err = new Error("Blood group and units are required!");
      err.statusCode = 400;
      throw err;
    }

    const newRequest = new Request({
      userId: req.user._id,
      bloodGroup,
      units,
      urgency,
      status: "pending",
      isActive: true,
      rejectedBy: []
    });

    const savedRequest = await newRequest.save();

    res.status(201).json({
      message: "Blood request created successfully",
      request: savedRequest
    });
  } catch (err) {
    next(err);
  }
};

export const getActiveRequests = async (req, res, next) => {
  try {
    if (req.user.role !== "hospital") {
      const err = new Error("Access denied");
      err.statusCode = 403;
      throw err;
    }

    const requests = await Request.find({
      isActive: true,
      status: "pending",
      rejectedBy: { $ne: req.user._id }
    })
      .populate("userId", "name bloodGroup contactNumber")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    next(err);
  }
};

export const acceptRequest = async (req, res, next) => {
  try {
    if (req.user.role !== "hospital") {
      const err = new Error("Access denied");
      err.statusCode = 403;
      throw err;
    }

    const { requestId } = req.params;
    console.log("🔍 Accept request - ID:", requestId);

    const request = await Request.findById(requestId);
    if (!request || !request.isActive) {
      const err = new Error("Request not found or already processed");
      err.statusCode = 404;
      throw err;
    }

    const inventory = await Inventory.findOne({
      hospitalId: req.user._id,
      bloodGroup: request.bloodGroup
    });

    console.log("📦 Inventory check:", inventory ? `${inventory.units} units of ${request.bloodGroup}` : "No inventory record found");

    if (!inventory || inventory.units < request.units) {
      const err = new Error(`Insufficient blood units in inventory. You have ${inventory ? inventory.units : 0} units of ${request.bloodGroup}, but ${request.units} are needed.`);
      err.statusCode = 400;
      throw err;
    }

    // reduce inventory
    inventory.units -= request.units;
    await inventory.save();

    // update request
    request.status = "approved";
    request.acceptedHospital = req.user._id;
    request.isActive = false;

    await request.save();

    // notify user via email
    const user = await User.findById(request.userId);
    const hospital = await Hospital.findById(req.user._id);

    console.log("📧 Sending email to user:", user?.email, "from hospital:", hospital?.hospitalName);

    await sendEmail(
      user.email,
      "Blood Request Approved – Immediate Action Required",
      `Dear ${user.name},

       We are pleased to inform you that your blood request for ${request.units} unit(s) of ${request.bloodGroup} has been approved by ${hospital.hospitalName}.

       Please contact the hospital at the earliest to proceed further.

       Regards,
       HOPE DROP Team`
    );

    res.json({
      message: `Request approved successfully by ${hospital.hospitalName}. Email notification sent to ${user.name}.`,
      hospitalName: hospital.hospitalName,
      request
    });
  } catch (err) {
    console.error("❌ Accept request error:", err.message);
    next(err);
  }
};

export const rejectRequest = async (req, res, next) => {
  try {
    if (req.user.role !== "hospital") {
      const err = new Error("Access denied");
      err.statusCode = 403;
      throw err;
    }

    const { requestId } = req.params;

    const request = await Request.findById(requestId);
    if (!request || !request.isActive) {
      const err = new Error("Request not found or already processed");
      err.statusCode = 404;
      throw err;
    }

    // prevent duplicate rejection
    if (request.rejectedBy.includes(req.user._id)) {
      const err = new Error("You already rejected this request");
      err.statusCode = 400;
      throw err;
    }

    request.rejectedBy.push(req.user._id);
    await request.save();

    res.json({
      message: "Request rejected. Still available for other hospitals."
    });
  } catch (err) {
    next(err);
  }
};

