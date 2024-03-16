const passport = require("passport");
const User = require("../models/User");

const register = (req, res, next) => {
	const { username, name, password } = req.body;
	const phone = req.body.phone ? req.body.phone : '';
	const admin = false;
	const payment = false;
	if (username === "" || name === "" || password === "") {
		res.statusCode = 401;
		res.setHeader("Content-Type", "application/json");
		res.json({
			success: false,
			status: "Registration not Successful! Fill all fields",
		});
	} else {
		User.register(
			new User({
				username: username,
				name: name,
				admin: admin,
				phone: phone,
				payment: payment,
			}),
			password,
			(err, user) => {
				if (err) {
					res.statusCode = 401;
					res.setHeader("Content-Type", "application/json");
					res.json({
						success: false,
						status: "Registration not Successful!",
					});
				} else {
					passport.authenticate("local")(req, res, () => {
						const token = user.generateAccessToken();
						res.statusCode = 200;
						res.setHeader("Content-Type", "application/json");
						res.json({
							success: true,
							token: token,
							status: "Registration Successful!",
						});
					});
				}
			}
		);
	}
};

const login = (req, res, next) => {
	const { username, password } = req.body;
	if (username === "" || password === "") {
		res.statusCode = 401;
		res.setHeader("Content-Type", "application/json");
		res.json({
			success: false,
			status: "Login not Successful! Fill all fields",
		});
	} else {
		passport.authenticate("local")(req, res, async () => {
			const user = await User.findOne({username: username}).exec();
			const token = user.generateAccessToken();
			res.statusCode = 200;
			res.setHeader("Content-Type", "application/json");
			res.json({
				success: true,
				token: token,
				status: "Login Successful!",
			});
		});
	}
};

module.exports = {
	register, 
	login
};
