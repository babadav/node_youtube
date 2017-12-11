const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

app.use(bodyParser.urlencoded({extended: true}))

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	next();
});

mongoose.connect('mongodb://localhost/test', { useMongoClient: true });
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
var db = mongoose.connection;


var videosSchema = new mongoose.Schema({
	title:  String,
	url: 	String,
	coords: {
		lat: Number,
		lng:  Number
	},
});
var Videos = mongoose.model('Videos', videosSchema);




app.get(`/videos/:lat/:lng`, function(req,res) {

	console.log("request for videos at location", req.params.lat, req.params.lng)

	Videos.find({
		coords:{
			lat: req.params.lat,
			lng: req.params.lng
		}
	},function(err, videos) {
		// console.log(markers)

		res.json(videos);
	})
})

app.post('/newVideo', function(req,res) {
	video = new Videos({
		title:  req.body.title,
		url: 	req.body.url,
		coords: req.body.coords,
	});
	video.save(function (err) {
		if (err) {
			console.log(err, "shit");
			res.json(err)
		} else {
			console.log('video.title');
			res.send('success');
			
		}
	});
})











app.listen(5559, function () {
	console.log('Example app listening on port 5559!')
})