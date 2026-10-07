import Inventory from "../models/inventoryModel.js";

/* ---------- GET HOSPITAL INVENTORY ---------- */
export const getInventory = async (req, res, next) => {
  try {
    if (req.user.role !== "hospital") {
      const err = new Error("Access denied");
      err.statusCode = 403;
      throw err;
    }

    const inventory = await Inventory.find({ hospitalId: req.user._id }).sort({ bloodGroup: 1 });
    res.json(inventory);
  } catch (err) {
    next(err);
  }
};

/* ---------- INCREMENT INVENTORY ---------- */
export const incrementInventory = async (req, res, next) => {
  try {
    if (req.user.role !== "hospital") {
      const err = new Error("Access denied");
      err.statusCode = 403;
      throw err;
    }

    const { bloodGroup, units } = req.body;
    const parsedUnits = Number(units);

    if (!bloodGroup || isNaN(parsedUnits) || parsedUnits <= 0) {
      const err = new Error("Blood group and positive units are required!");
      err.statusCode = 400;
      throw err;
    }

    let inventory = await Inventory.findOne({ hospitalId: req.user._id, bloodGroup });

    if (!inventory) {
      inventory = new Inventory({
        hospitalId: req.user._id,
        bloodGroup,
        units: parsedUnits
      });
    } else {
      inventory.units += parsedUnits;
    }

    const savedInventory = await inventory.save();
    res.json({ message: "Inventory updated successfully", inventory: savedInventory });
  } catch (err) {
    next(err);
  }
};

/* ---------- DECREMENT INVENTORY ---------- */
export const decrementInventory = async (req, res, next) => {
  try {
    if (req.user.role !== "hospital") {
      const err = new Error("Access denied");
      err.statusCode = 403;
      throw err;
    }

    const { bloodGroup, units } = req.body;
    const parsedUnits = Number(units);

    if (!bloodGroup || isNaN(parsedUnits) || parsedUnits <= 0) {
      const err = new Error("Blood group and positive units are required!");
      err.statusCode = 400;
      throw err;
    }

    const inventory = await Inventory.findOne({ hospitalId: req.user._id, bloodGroup });
    if (!inventory) {
      const err = new Error("Blood group not found in inventory!");
      err.statusCode = 404;
      throw err;
    }

    if (inventory.units < parsedUnits) {
      const err = new Error("Insufficient units in inventory!");
      err.statusCode = 400;
      throw err;
    }

    inventory.units -= parsedUnits;
    const updatedInventory = await inventory.save();

    res.json({ message: "Inventory updated successfully", inventory: updatedInventory });
  } catch (err) {
    next(err);
  }
};
