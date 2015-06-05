var express = require('express');
var http = require('http');
var request = require('request');
var cheerio = require('cheerio');
var open = require('open');
var mongo = require('mongodb');
var monk = require('monk');
var bodyParser = require('body-parser');

var urlencode = require('urlencode');

var app = express();
//var db = monk('localhost:27017/tagtest');
var db = monk('localhost:27017/tagit');

app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: false}));

app.use(function(req, res, next) {
    if (req.headers.origin) {
        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization')
        res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE')
        if (req.method === 'OPTIONS') return res.send(200)
    }
    next()
});

app.use(express.static(__dirname));
 
app.get('/', function (req, res) {  
  res.render('index.html');
});

app.post('/tag', function(req, res) {

	var db = req.db;    
    var collection = db.get('tags');

    var title = req.body.title;
    var url = req.body.url;
    var description = req.body.description;
    var logo = req.body.logo;

	collection.insert({
        "title" : title,
        "url" : url,
        "description" : description,        
        "logo" : logo
    });

	collection.find({},{},function(e,docs){
    	res.jsonp(docs);        
    });
});

app.get('/tags', function (req, res) {  

    var db = req.db;    
    var collection = db.get('tags');
    collection.find({},{},function(e,docs){
        res.jsonp(docs);        
    }); 
});

app.post('/category', function(req, res) {
    var db = req.db;    
    var collection = db.get('categories');

    var name = req.body.name;

    collection.insert({
        "name": name
    });

    collection.find({},{},function(e,docs){
        res.jsonp(docs);        
    });
});

app.get('/categories', function (req, res) {  

    var db = req.db;    
    var collection = db.get('categories');
    collection.find({},{},function(e,docs){
        res.jsonp(docs);        
    }); 
});


http.createServer(app).listen(3030, function () {
  console.log('Server listening on port 3030');
});
