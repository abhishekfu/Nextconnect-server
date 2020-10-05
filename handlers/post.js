const db = require('../models');
//api/users/:id/posts
exports.createPost = async function(req, res, next) {
	try {
		let post = await db.Post.create({
			text: req.body.text,
			imageUrl: req.body.imageUrl,
			isImage: req.body.isImage,
			postedBy: req.params.id
		});
		let foundUser = await db.User.findById(req.params.id);
		foundUser.posts.push(post.id);
		await foundUser.save();

		let foundPost = await db.Post.findById(post.id).populate('postedBy', {
			username: true,
			profileImageUrl: true
		});
		return res.status(200).json(foundPost);
	} catch (e) {
		return next(e);
	}
};
//api/users/:id/posts
exports.getPostByUser = async function(req, res, next) {
	try {
		let post = await db.Post.find({ postedBy: req.params.id }).populate('comments', {
			text: true,
			commentedBy: true,
			createdAt: true
		});

		return res.status(200).json(post);
	} catch (e) {
		return next(e);
	}
};

//api/users/:id/posts/post_id
exports.getPost = async function(req, res, next) {
	try {
		let post = await db.Post
			.findById(req.params.post_id)
			.populate('postedBy', {
				username: true,
				profileImageUrl: true,
				createdAt: true
			})
			.populate('comments', {
				text: true,
				commentedBy: true,
				createdAt: true
			});

		return res.status(200).json(post);
	} catch (e) {
		return next(e);
	}
};
//api/users/:id/posts/post_id
exports.deletePost = async function(req, res, next) {
	try {
		let foundUser = await db.User.findById(req.params.id);
		let index = foundUser.posts.indexOf(req.params.post_id);
		foundUser.posts.splice(index, 1);
		await foundUser.save();
		let foundPost = await db.Post.findByIdAndDelete(req.params.post_id);

		return res.status(200).json(foundPost);
	} catch (e) {
		return next(e);
	}
};

exports.addLike = async function(req, res, next) {
	try {
		let foundPost = await db.Post
			.findById(req.params.post_id)
			.populate('postedBy', {
				username: true,
				profileImageUrl: true,
				createdAt: true
			})
			.populate('comments', {
				text: true,
				commentedBy: true,
				createdAt: true
			});
		if (foundPost.likes.indexOf(req.params.id) === -1) {
			foundPost.likes.push(req.params.id);
			await foundPost.save();
		}
		return res.status(200).json(foundPost);
	} catch (e) {
		return next(e);
	}
};

exports.removeLike = async function(req, res, next) {
	try {
		let foundPost = await db.Post
			.findById(req.params.post_id)
			.populate('postedBy', {
				username: true,
				profileImageUrl: true,
				createdAt: true
			})
			.populate('comments', {
				text: true,
				commentedBy: true,
				createdAt: true
			});
		let index = foundPost.likes.indexOf(req.params.id);
		foundPost.likes.splice(index, 1);
		await foundPost.save();
		return res.status(200).json(foundPost);
	} catch (e) {
		return next(e);
	}
};
