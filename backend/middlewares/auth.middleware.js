const passport = require("passport");
const User = require("../models/User");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.ACCESS_TOKEN_SECRET;

exports.jwtPassport = passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
        User.findOne({ _id: jwt_payload._id })
        .exec()
        .then((user) => {
            if (user) return done(null, user);
            else return done(null, false);
        })
        .catch((err) => done(err, false));
    })
);

exports.checkAdmin = (req, res, done) => {
    const admin = req.user ? req.user.admin : null;
    if (admin) {
        done();
    } else {
        res.status(403).json({ message: 'Access forbidden' });
    }
};

exports.verifyUser = passport.authenticate("jwt", { session: false });
