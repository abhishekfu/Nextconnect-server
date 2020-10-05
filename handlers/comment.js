const db = require('../models');
//api/users/:id/posts/:post_id/comments
exports.createComment = async function(req, res, next) {
	try {
		let comment = await db.Comment.create({
			text: req.body.text,
			commentedBy: req.params.id,
			commentedOn: req.params.post_id
		});
		let foundPost = await db.Post.findById(req.params.post_id);
		foundPost.comments.push(comment.id);
		await foundPost.save();

		let foundComment = await db.Comment.findById(comment.id).populate('commentedBy', {
			username: true,
			profileImageUrl: true
		});

		return res.status(200).json(foundComment);
	} catch (e) {
		return next(e);
	}
};
exports.deleteComment = async function(req, res, next) {
	try {
		let foundComment = await db.Comment.findById(req.params.comment_id);
		await foundComment.remove();
		return res.status(200).json(foundComment);
	} catch (e) {
		return next(e);
	}
};

exports.getComment = async function(req, res, next) {
	try {
		let foundComment = await db.Comment.findById(req.params.comment_id).populate('commentedBy', {
			username: true,
			profileImageUrl: true,
			createdAt: true
		});
		return res.status(200).json(foundComment);
	} catch (e) {
		return next(e);
	}
};
