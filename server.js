// var express = require('express');
// var app = express();

// // set the port of our application
// // process.env.PORT lets the port be set by Heroku
// var port = process.env.PORT || 8080;

// // set the view engine to ejs
// app.set('view engine', 'ejs');

// // make express look in the public directory for assets (css/js/img)
// app.use(express.static(__dirname + '/public'));

// // set the home page route
// app.get('/', function(req, res) {

// 	// ejs render automatically looks in the views folder
// 	res.render('index');
// });

// app.listen(port, function() {
// 	console.log('Our app is running on http://localhost:' + port);
// });

// const product = require('./db')

// app.get('/Product', (req, res) => {
//   res.json(product)
// })


// app.get('/Product/:id', (req, res) => {
//     res.json(product.find(product => product.item_code === req.params.id))
//   })

const express = require('express')
var cors = require('cors')
const bodyParser = require('body-parser')
const db = require('./queries')

var multer = require('multer')
var multerAzure = require('multer-azure')

//book
const SCB = require('./library/scb')


var app = express()
var port = process.env.PORT || 3000



app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const issue2options = {
  origin: true,
  methods: ["POST"],
  credentials: true,
  maxAge: 3600
};



app.get('/', cors(issue2options), db.getProd);
app.get('/product3/:id', cors(issue2options), db.getProdById3);
app.get('/product2/:id', cors(issue2options), db.getProdById2);
app.get('/product4/', cors(issue2options),db.getProdById4);
app.get('/product/:id', cors(issue2options), db.getProdById3);
app.get('/getoffer/:id/:gender', cors(issue2options), db.getOfferbyId);
app.get('/getbasket/:id', cors(issue2options), db.getBuskets);
app.post('/insertbasket/', cors(issue2options), db.insertBusket);
app.get('/getpicture/', cors(issue2options), db.getPic);
app.post('/register/', cors(issue2options),db.register);
app.post('/insertbasketoffer/', cors(issue2options), db.insertBusketOffer);
app.get('/productoffer/:id', cors(issue2options), db.getProdById3offer);
app.get('/getgraph/:id', cors(issue2options), db.getGraph);
app.get('/alluser', cors(issue2options), db.getUser);
app.get('/getround500/', cors(issue2options), db.getMonthBook);
app.post('/getname/', cors(issue2options), db.getName);
app.get('/getprice/', cors(issue2options), db.getPrice);

// book

app.post('/signup', cors(issue2options) ,SCB.signup);
app.get('/getdiscount/:price/:cluster', cors(issue2options), db.getDiscount);






//blob
var blobPath = 'name';

var upload = multer({ 
  storage: multerAzure({
    connectionString: 'DefaultEndpointsProtocol=https;AccountName=oneteamblob;AccountKey=qcv7bSwg5vFNZRt1gY9XLPcv6OWKdKakKCj5znpUQRNQTPAOkLbhnCuZpt/1m4Gc9f5tV55x0CEzcVWjCubTaQ==;EndpointSuffix=core.windows.net', //Connection String for azure storage account, this one is prefered if you specified, fallback to account and key if not.
    account: 'oneteamblob', //The name of the Azure storage account
    key: 'qcv7bSwg5vFNZRt1gY9XLPcv6OWKdKakKCj5znpUQRNQTPAOkLbhnCuZpt/1m4Gc9f5tV55x0CEzcVWjCubTaQ==', //A key listed under Access keys in the storage account pane
    container: 'profilepicture',  //Any container name, it will be created if it doesn't exist
    blobPathResolver: function(req, file, callback){
    blobPath = Date.now().toString() + '.png'; //Calculate blobPath in your own way.
   //blobPath = 'vision.png'
      callback(null, blobPath);
    }
  })
})
 
app.post('/upload', cors(issue2options) , upload.any(), function (req, res, next) {
  console.log(req.files);
  res.json('{"Uploaded":"'+blobPath+'"}');
})







  
app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  })


