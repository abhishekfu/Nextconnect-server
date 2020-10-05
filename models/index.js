const mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.set('useUnifiedTopology', true);
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost:27017/nextconnect', {
	//mongoose.connect('mongodb+srv://abhishekfu:Abhi@2019@cluster0.jnz9x.mongodb.net/<dbname>?retryWrites=true&w=majority',{
	keepAlive: true,
	useNewUrlParser: true,
	useCreateIndex: true
});
module.exports.Comment = require('./comment');
module.exports.Post = require('./post');
module.exports.User = require('./users');
