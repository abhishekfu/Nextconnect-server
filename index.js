const errorHandler = require('./handlers/error');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const commentsRoutes = require('./routes/comments');
const postsRoutes = require('./routes/posts');
const { loginRequired, ensureCorrectUser } = require('./middleware/auth');
const db = require('./models');

app.use(cors());
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/users/:id/posts', loginRequired, ensureCorrectUser, postsRoutes);

app.use('/api/users/:id/posts/:post_id/comments/', loginRequired, ensureCorrectUser, commentsRoutes);

app.get('/api/posts', loginRequired, async function(req, res, next) {
	try {
		let posts = await db.Post
			.find()
			.sort({ createdAt: 'desc' })
			.populate('postedBy', {
				_id: true,
				username: true,
				profileImageUrl: true
			})
			.populate('comments', {
				text: true,
				commentedBy: true,
				createdAt: true
			});
		return res.status(200).json({ posts });
	} catch (e) {
		return next(e);
	}
});
app.get('/api/users', async function(req, res, next) {
	try {
		let users = await db.User.find();
		return res.status(200).json({ users });
	} catch (e) {
		return next(e);
	}
});

app.get('/api/users/:id', async function(req, res, next) {
	try {
		let user = await db.User.findById(req.params.id).populate('posts', {
			text: true,
			imageUrl: true,
			isImage: true,
			likes: true,
			comments: true
		});

		return res.status(200).json({ user });
	} catch (e) {
		return next(e);
	}
});

app.use(function(req, res, next) {
	let err = new Error('Not Found');
	err.status = 404;
	next(err);
});

app.use(errorHandler);

app.listen(8081, () => {
	console.log('SERVER HAS STARTED');
});
