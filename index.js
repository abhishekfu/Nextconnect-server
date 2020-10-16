const errorHandler = require('./handlers/error');
const express = require('express');
const app = express();
const cors = require('cors');
const Grid = require("gridfs-stream");
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const commentsRoutes = require('./routes/comments');
const postsRoutes = require('./routes/posts');
const { loginRequired, ensureCorrectUser } = require('./middleware/auth');
const { getPostByUser, getAllPosts } = require('./handlers/post');
const { getAllUsers, getUserById } = require('./handlers/auth');
const db = require('./models');
const {upload,getImage,deleteImage} = db.Grid;


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

app.get('/api/users/:id/post', loginRequired, getPostByUser);

app.get('/api/posts', loginRequired, getAllPosts);
app.get('/api/users', getAllUsers);

app.get('/api/users/:id', loginRequired, getUserById);

//@route POST /upload
//@desc Upload file to db
app.post('/upload',upload.single('file'),(req,res)=>{
    res.status(200).json({file:req.file});
});
//@route DELETE /files/:filename
//@desc Delete file
app.delete('/files/:filename',deleteImage)
//@route GET /image/:filename
//@desc Display image
app.get('/image/:filename',getImage)


app.use(function(req, res, next) {
	let err = new Error('Not Found');
	err.status = 404;
	next(err);
});

app.use(errorHandler);

app.listen(8081, () => {
	console.log('SERVER HAS STARTED');
});
