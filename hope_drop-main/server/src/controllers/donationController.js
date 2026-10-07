import Donation from "../models/donationInterestModel.js";

/* USER SUBMITS DONATION INTEREST */
export const createDonation = async (req, res, next) => {
  try {
    const {
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
      consumesAlcohol
    } = req.body;

    if (!fullName || !age || !weight || !bloodGroup || !city || !contactNumber || !availabilityDate ||  !lastDonationDate || isSmoker === undefined || consumesAlcohol === undefined) {
      const err = new Error("Required fields are missing!");
      err.statusCode = 400;
      throw err;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastDonation = new Date(lastDonationDate);

    // ❌ Future date not allowed
    if (lastDonation > today) {
      const err = new Error("Last donation date cannot be in the future.");
      err.statusCode = 400;
      throw err;}

    // ❌ Must be at least 3 months gap
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    if (lastDonation > threeMonthsAgo) {
      const err = new Error("You must wait at least 3 months between blood donations.");
      err.statusCode = 400;
      throw err;}

    const donation = new Donation({
      userId: req.user._id,
      fullName,
      age: Number(age),
      weight: Number(weight),
      bloodGroup,
      city,
      address: address || "",
      contactNumber,
      availabilityDate,
      lastDonationDate: lastDonationDate,
      healthConditions: healthConditions || "",
      isSmoker: isSmoker === true || isSmoker === "Yes",
      consumesAlcohol: consumesAlcohol === true || consumesAlcohol === "Yes"
    });

    const savedDonation = await donation.save();

    res.status(201).json({
      message: "Thank you for volunteering to donate blood! A hospital will contact you soon.",
      donation: savedDonation
    });
  } catch (err) {
    next(err);
  }
};

/* USER VIEWS THEIR OWN DONATIONS */
export const getMyDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (err) {
    next(err);
  }
};

/* HOSPITAL VIEW ALL AVAILABLE DONATIONS */
export const getDonationsForHospital = async (req, res, next) => {
  try {
    if (req.user.role !== "hospital") {
      const err = new Error("Access denied");
      err.statusCode = 403;
      throw err;
    }

    const donations = await Donation.find({ status: "available" })
      .populate("userId", "name bloodGroup contactNumber")
      .sort({ availabilityDate: 1 });

    res.json(donations);
  } catch (err) {
    next(err);
  }
};