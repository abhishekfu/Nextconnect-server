const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Post = require('./post');

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	profileImageUrl: {
		type: String,
		default:
			'https://images.unsplash.com/photo-1600223526249-089911749a98?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60'
	},
	posts: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: Post
		}
	],
	followers: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: [ this ]
		}
	],
	following: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: [ this ]
		}
	]
});

userSchema.pre('save', async function(next) {
	try {
		if (!this.isModified('password')) {
			return next();
		}
		let hashedPassword = await bcrypt.hash(this.password, 10);
		this.password = hashedPassword;
		return next();
	} catch (err) {
		return next(err);
	}
});

userSchema.methods.comparePassword = async function(candidatePassword, next) {
	try {
		let isMatch = await bcrypt.compare(candidatePassword, this.password);
		return isMatch;
	} catch (err) {
		return next(err);
	}
};

const User = mongoose.model('User', userSchema);

module.exports = User;
