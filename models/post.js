const mongoose = require('mongoose');
const User = require('./users');
const Comment = require('./comment');
const postSchema = new mongoose.Schema(
	{
		text: {
			type: String,
			required: true,
			maxlength: 400
		},
		imageUrl: {
			type: String
		},
		isImage: {
			type: Boolean,
			required: true
		},
		postedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User'
			}
		],
		comments: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Comment'
			}
		]
	},
	{
		timestamps: true
	}
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
