const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require("gridfs-stream");
const mongoose = require('mongoose');
const crypto = require('crypto');
const path = require('path');
mongoose.set('debug', true);
mongoose.set('useUnifiedTopology', true);
mongoose.Promise = Promise;
const mongoURI='mongodb://localhost:27017/imageupload';
mongoose.connect('mongodb://localhost:27017/nextconnect', {
	//mongoose.connect('mongodb+srv://abhishekfu:Abhi@2019@cluster0.jnz9x.mongodb.net/<dbname>?retryWrites=true&w=majority',{
	keepAlive: true,
	useNewUrlParser: true,
	useCreateIndex: true
});
const conn = mongoose.createConnection(mongoURI,{keepAlive:true,useNewUrlParser: true,useCreateIndex:true});
let gfs;
conn.once('open',  ()=> {
    //init stream
     gfs = Grid(conn.db, mongoose.mongo);
     gfs.collection('uploads');
  })
//create storage engine
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
  });
  const upload = multer({ storage });

const getImage = (req,res)=>{
  gfs.files.findOne({filename:req.params.filename},(err,file)=>{
      //Check if files
      if(!file || file.length===0){
          return res.status(404).json({
              err:'No file exist'
          })
      }
      //check if image
      if(file.contentType === 'image/jpeg' || file.contentType === 'image/png'){
          //Read output to browser
          const readstream = gfs.createReadStream(file.filename);
          readstream.pipe(res);
      }
      else{
          return res.status(404).json({
              err:'Not an image'
          })
      }
  })
}

const deleteImage = (req,res)=>{
  gfs.remove({filename:req.params.filename,root:'uploads'}, function (err, gridStore) {
      if (err){
          return res.status(404).json({err:err})
      }
      res.status(200).json({msg:'success'});
    });
}
module.exports.Comment = require('./comment');
module.exports.Post = require('./post');
module.exports.User = require('./users');
module.exports.Grid={upload,getImage,deleteImage};
