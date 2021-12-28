const express = require("express");
const userRoutes = new express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");
const sendEmail = require("../utilities/sendEmail")

userRoutes.get("/", (req, res) => {
  res.json("Hello world ! welcome").send();
});

//user register
userRoutes.post("/register", async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).send({ error: "Email already in use !" });
    }
    const user = await new User(req.body).save();
    const token = await user.generateToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});
//login processing route
userRoutes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredientials(email, password);
    const token = await user.generateToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send({ error });
  }
});
//logout user
userRoutes.get("/logout", auth, async (req, res) => {
  try {
    const index = req.user.tokens.indexOf(req.token);
    req.user.tokens.splice(index, 1);
    await req.user.save();
    res.send("logout sucessfully");
  } catch (error) {
    console.log("error", error);
    res.status(400).send({ error });
  }
});
userRoutes.post("/reset-password", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)    return res.status(400).send("user with given email doesn't exist");
    const token = await user.generateToken();
    const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token}`;
    await sendEmail(user.email, "Password reset", link);
    res.send("password reset link sent to your email account");
  } catch (error) {
    console.log("error",error)
    res.status(400).send(error);
  }
});
userRoutes.post("/:userId/:token", async (req, res) => {
  try {
        // const {password} = req.body;
       
        const user = await  User.findOne({ _id: req.params.userId, "tokens.token":req.params.token });
        user.password = req.body.password;
        await user.save();
        //optimization
        const index = user.tokens.indexOf(req.params.token);
        user.tokens.splice(index, 1);
        await user.save();
        res.send("password reset sucessfully.");
      } catch (error) {
    console.log("error",error)
    res.status(400).send(error);
  }

});

module.exports = userRoutes;
