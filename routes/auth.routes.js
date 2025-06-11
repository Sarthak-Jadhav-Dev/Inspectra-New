const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/auth.models");
const bcrypt = require("bcrypt");
const Joi = require("joi");

// ✅ Login input validation schema
const validateLogin = (data) => {
	const schema = Joi.object({
		email: Joi.string().required().label("Email"),
		password: Joi.string().required().label("Password"),
	});
	return schema.validate(data);
};

// ✅ POST /auth/login
router.post("/login", async (req, res) => {
	try {
		const { error } = validateLogin(req.body);
		if (error) {
			return res.status(400).send({ message: error.details[0].message });
		}

		const user = await User.findOne({ email: req.body.email });
		if (!user) {
			return res.status(400).send({ message: "Invalid Email or Password" });
		}

		const validPassword = await bcrypt.compare(req.body.password, user.password);
		if (!validPassword) {
			return res.status(401).send({ message: "Invalid Email or Password" });
		}

		const token = user.generateAuthToken();
		res.status(200).send({ data: token, message: "Logged In Successfully" });
		console.log("User Logged in: ",user)
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).send({ message: "Internal Server Error" });
	}
});

// ✅ POST /auth/register
router.post("/register", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error) {
			return res.status(400).send({ message: error.details[0].message });
		}

		const userExists = await User.findOne({ email: req.body.email });
		if (userExists) {
			return res.status(409).send({ message: "User Already Exists" });
		}

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashedPassword = await bcrypt.hash(req.body.password, salt);

		const newUser = new User({
			...req.body,
			password: hashedPassword,
		});
		await newUser.save();

		res.status(201).send({ message: "User Created Successfully" });
	} catch (error) {
		console.error("Register error:", error);
		res.status(500).send({ message: "Internal Server Error" });
		console.log(error)
	}
});

// ✅ POST /auth/logout (placeholder)
router.post("/logout", (req, res) => {
	res.send("Logout route is working. Implementation pending.");
});

module.exports = router;
