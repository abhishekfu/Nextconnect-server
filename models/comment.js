const mongoose = require('mongoose');
const User = require('./users');
const Post = require('./post');

const commentSchema = new mongoose.Schema(
	{
		text: {
			type: String,
			required: true,
			maxlength: 400
		},
		commentedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: User
		},
		commentedOn: {
			type: mongoose.Schema.Types.ObjectId,
			ref: Post
		}
	},
	{
		timestamps: true
	}
);

commentSchema.pre('remove', async function(next) {
	try {
		let post = await Post.findById(this.commentedOn);
		post.comments.remove(this.id);
		await post.save();
		return next();
	} catch (err) {
		return next(err);
	}
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
