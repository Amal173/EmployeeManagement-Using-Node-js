const asyncHandler = require("express-async-handler");
const userModels = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const MailSender = require("../service/emailSender");
const otpGenerator = require("../service/otpGenerator");

//get user
const currentUser = asyncHandler(async (req, res) => {
  const userModel = await userModels.find();
  res.status(200).json({ userModel });
});
var Email;
var HashPassword;
var Otp;
var token;
var ExpirationTime;
//post user
const createUser = asyncHandler(async (req, res) => {
  console.log("the request body is:", req.body);
  const { email, password } = req.body;
  let user = await userModels.findOne({ email });
  if (user) {
    console.log("the user already exist");

    return res.redirect("/signup");
  }
  try {
    Email = email;

    const otp = otpGenerator;
    const expirationTime = new Date().getTime() + 5 * 60 * 1000; // 5 minutes expiration
    ExpirationTime = expirationTime;
    console.log("the ex time is", ExpirationTime);
    const secretKey = process.env.JWT_TOKEN + otp;
    const payload = {
      password,
      Email,
    };
    token = jwt.sign(payload, secretKey, { expiresIn: "5m" });
    const html = `please enter the below otp to veryfy your email::${otp}`;
    const title = "for email varification";
    MailSender(Email, html, title);
    console.log(otp, " is the otp");
    const hashPassword = await bcrypt.hash(password, 10);
    console.log(Email);
    HashPassword = hashPassword;
    Otp = otp;
    res.render("otpVarification", { Email, err: "", ExpirationTime });

    //  res.status(201).json({ userModels: newUser });
  } catch (error) {
    // Handle any potential errors that may occur during the creation process
    res.status(400).json({ userModelserror: error.message });
  }
});

//varifyOTP
const varifyUserEmail = asyncHandler(async (req, res) => {
  const otpInput = req.body;

  console.log("req body is:", req.body);
  console.log("password:", HashPassword);
  console.log("otp", Otp);
  console.log("email", Email);
  const otpValue = otpInput.otpInput[0];
  console.log("otpinput", otpValue);
  // Assuming Otp is the previously generated OTP
  // if (Otp == otpValue) {
  // console.log("OTP is correct");
  const secretKey = process.env.JWT_TOKEN + otpValue;
  try {
    const varify = jwt.verify(token, secretKey);

    const newUser = await userModels.create({
      email: Email,
      password: HashPassword,
    });

    console.log("User created successfully");
    res.redirect("/");
  } catch (error) {
    res.render("otpVarification", {
      Email,
      err: "the OTP is invalid",
      ExpirationTime,
    });
    console.error("Error creating user:", error.message);
  }
  // } else {
  //   console.log("Invalid OTP");
  //   res.status(400).json({ error: "Invalid OTP" });
  // }
});

//login user
const loginUser = asyncHandler(async (req, res) => {
  console.log("the request body is:", req.body);
  const { email, password } = req.body;
  const user = await userModels.findOne({ email });

  console.log(user);

  let validation = true;
  if (!user) {
    console.log("the user not found");
    validation = false;
    return res.redirect("/signup");
  }
  const userIsMatch = await bcrypt.compare(password, user.password);
  if (!userIsMatch) {
    validation = false;
    console.log("the password is not match");
    return res.redirect("/signup");
  }
  if ((validation = true)) {
    console.log("validation succes");
    req.session.isAuth = true;
    return res.redirect("/home");
  } else {
    res.status(401);
  }
});

//logout user
const logout = asyncHandler(async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      throw err;
    } else {
      res.redirect("/");
    }
  });
});

//Forgot Password
const forgotPassword = asyncHandler(async (req, res) => {
  console.log("the request body is:", req.body);
  const { email } = req.body;
  const user = await userModels.findOne({ email });
  console.log("user:", user);
  const mailId = user.email;
  console.log(mailId);
  if (!user) {
    console.log("the email not found");
    return res.redirect("/");
  }
  const secret = process.env.JWT_TOKEN_RESETPASSWORD + user.password;
  const payload = {
    email: user.email,
    id: user.id,
  };
  const token = jwt.sign(payload, secret, { expiresIn: "10m" });
  const link = `http://localhost:5001/register/resetPassword/${user.id}/${token}`;
  console.log(link);
  const html = `please click the below linlk to reset your password::
  ${link}`;
  const title = "for reset your password";
  MailSender(mailId, html, title);
  res.redirect("/");
});

//reset password
const resetPassword = asyncHandler(async (req, res, next) => {
  const { id, token } = req.params;
  console.log("the token is", token);
  const user = await userModels.findOne({ _id: id });

  if (!user) {
    console.log("invalid user id");
    return;
  }
  const secret = process.env.JWT_TOKEN_RESETPASSWORD + user.password;
  console.log("secret:", secret);
  try {
    const varify = jwt.verify(token, secret);
    res.render("resetPassword");
  } catch (error) {
    console.log(error.message);
  }
});

//confirm reset Password
const confirmPassword = asyncHandler(async (req, res) => {
  const { id, token } = req.params;
  console.log(token, "token");
  const { Password1, Password2 } = req.body;
  console.log(req.body);

  if (!(Password1 === Password2)) {
    console.log("the password is not same");
    return;
  }

  const user = await userModels.findById({ _id: id });
  // const comparePassword = await bcrypt.compare(Password1, user.Password);
  // console.log("password:",user.password);
  // if (comparePassword) {
  //   console.log("the password is already in use in the same user");
  //   return;
  // }
  if (!user) {
    console.log("invalid user id");
    return;
  }
  const secret = process.env.JWT_TOKEN_RESETPASSWORD + user.password;
  try {
    const varify = jwt.verify(token, secret);
    const hashedPassword = await bcrypt.hash(Password1, 10);
    const newPassword = hashedPassword;
    const editedPassword = await userModels.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        password: newPassword,
      },
      { new: true }
    );
    console.log("password updated");
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
    console.log("password not updated");
  }

  // res.send(user);
});

module.exports = {
  currentUser,
  createUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  confirmPassword,
  varifyUserEmail,
};
