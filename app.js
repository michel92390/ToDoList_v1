//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const getDate = require('./date');
const mongoose = require('mongoose');
const _ = require('lodash');
const app = express();
const date = require(__dirname + "/date.js");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


mongoose.connect("mongodb+srv://michel92:zidane92@todolist.rmvqn.mongodb.net/myFirstDatabase?retryWrites=true/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name:"Welcome to todolist!"
});
const defaultItems = [item1];

const listSchema = {
    name: String, 
    items: [itemsSchema]
};
const List = mongoose.model('List', listSchema);


app.get('/', function(req, res) {
 
    Item.find({}, function(err, foundItems) {
        if(foundItems.length === 0) {
            Item.insertMany(defaultItems, function(error, docs) {
                if(error) {
                    console.log(error);
                } else {
                    console.log("Successfully saved default to the DB");
                }
            });
            res.redirect('/');
        } else {
            // let day = date.getDate();
            res.render('index', {listTitle:"Today", newListItems:foundItems});
        }
    });
});

app.get("/:customListName", function(req, res) {
    const customListName = _.capitalize(req.params.customListName);
    List.findOne({name: customListName}, function(err, foundList) {
        if(!err) {
            if(!foundList) {
                //create a new listTitle
                const list = new List({
                    name: customListName,
                    items:defaultItems
                });
                list.save();
                res.redirect("/" + customListName);
            } else {
                // show existing list
                res.render('index', {listTitle:foundList.name, newListItems:foundList.items});
            }
        }
    });
});


app.post('/', function(req, res) {
    const itemName = req.body.newItem;
    const listName = req.body.index;
    const item = new Item({
        name: itemName
    });

    if(listName === "Today") {
        item.save();
        res.redirect('/');
    } else {
        List.findOne({name: listName}, function(err, foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        });
    }
});

app.post("/delete", function(req, res) {
    const checkedItemBody = req.body.checkBox;
    const listName = req.body.listName;

    if(listName === "Today") {
        Item.findByIdAndRemove(checkedItemBody, function(err) {
            if (!err) {
                console.log("Successfully deleted checked item");
                setTimeout(function() {
                    res.redirect('/');
                  }, 2000); 
            }
        });
    } else {
        List.findOneAndUpdate({name:listName}, {$pull:{items:{_id:checkedItemBody}}}, function(err, foundList) {
            if(!err) {
                setTimeout(function() {
                    res.redirect('/' + listName);
                  }, 2000); 
            }
        });
    }
});




let port = process.env.PORT;
if (port == null || port =="") {
    port = 3000;
}

app.listen(port, function() {
    console.log('Server has started successfully');
});