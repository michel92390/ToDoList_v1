//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const getDate = require('./date');
const app = express();
const date = require(__dirname + "/date.js");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


// var items = ['Buy Food', 'Cook Food', 'Eat Food'];
var items = [];
var workItems = [];

app.get('/', function(req, res) {
    // let day = date.getDay(); to get the day function only
    let day = date.getDate();
    res.render('index', { listTitle:day, newListItems:items});
});


app.post('/', function(req, res) {
    let item = req.body.newItem;
    if (req.body.index === 'Work') {
        workItems.push(item);
        res.redirect('/work');
    } else {
        items.push(item);
        res.redirect('/');
    }
});

app.get('/work', function(req, res) {
    res.render('index', {listTitle:'Work List', newListItems:workItems});
});




app.listen(3000, function() {
    console.log('listening on port 3000...');
});