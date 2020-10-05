require('dotenv').config();
const jwt = require('jsonwebtoken');
//Authorisatiom
exports.loginRequired = function(req, res, next) {
	try {
		const token = req.headers.authorization.split(' ')[1];
		jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
			console.log(decoded, token);
			if (decoded) {
				return next();
			} else {
				return next({
					status: 401,
					message: 'Please login first'
				});
			}
		});
	} catch (e) {
		return next({
			status: 401,
			message: 'Please login first'
		});
	}
};
//Authentication
//api/users/:id/messages
exports.ensureCorrectUser = function(req, res, next) {
	try {
		const token = req.headers.authorization.split(' ')[1];
		jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
			if (decoded && req.params.id === decoded.id) {
				return next();
			} else {
				return next({
					status: 401,
					message: 'Unauthorized'
				});
			}
		});
	} catch (e) {
		return next({
			status: 401,
			message: 'Unauthorized'
		});
	}
};
