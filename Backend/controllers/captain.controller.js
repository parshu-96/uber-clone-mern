const captainModel = require("../models/captain.model");
const captainService = require("../services/captain.service");
const validationResult = require("express-validator").validationResult;
const blacklistTokenModel = require("../models/blacklisttoken.model");

module.exports.registerCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, email, password, vehicle } = req.body;

  const isCaptainAlreadyExist = await captainModel.findOne({ email });

  if (isCaptainAlreadyExist) {
    return res.status(400).json({ message: "Captain already exist" });
  }

  const hashedPassword = await captainModel.hashPassword(password);

  const captain = await captainService.createCaptain({
    firstName: fullName.firstName,
    lastName: fullName.lastName,
    email,
    password: hashedPassword,
    color: vehicle.color,
    plate: vehicle.plate,
    capacity: vehicle.capacity,
    vehicleType: vehicle.vehicleType,
  });

  const token = captain.generateAuthToken();

  res.status(201).json({ token, captain });
};

module.exports.loginCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  const captain = await captainModel.findOne({ email }).select("+password");

  if (!captain) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isPasswordMatched = await captain.comparePassword(password);

  if (!isPasswordMatched) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = captain.generateAuthToken();

  res.cookie("token", token, {
    httpOnly: true,
  });

  res.status(200).json({ token, captain });
};

module.exports.getCaptainProfile = async (req, res, next) => {
  const captain = req.captain;

  if (!captain) {
    return res.status(404).json({ message: "Captain not found" });
  }

  res.status(200).json({ captain });
};

module.exports.logoutCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  await blacklistTokenModel.create({ token });
  //await captainModel.findByIdAndUpdate(req.captain._id, { status: "inactive" });

  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};
