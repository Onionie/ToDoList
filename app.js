const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const _ = require("lodash");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;


const items = ["Beer", "Soda"];
const workItems = [];

//using express
app.use(bodyParser.urlencoded({extended: true}));

//To use our css, images, sounds, etc.. we use a public folder
app.use(express.static("public"));

//To use EJS --npm i EJS
app.set('view engine', 'ejs');

const usern = process.env.DB_usern;
const pass = process.env.DB_pass;

//To connect to mongoose for mongoDB creating db name "todoListDB"
mongoose.connect("mongodb+srv://" + usern + ":" + pass + "@todo.gkkvw.mongodb.net/todoListDB", {useNewUrlParser: true});

//Make a schema for our items DB
const itemsSchema = {
  name: String
};

//Mongoose Model will create our collection of item, pluralized from "Item"
//Variable = mongoose.model(<"Singular Collection Name">, <Schema>)
const Item = mongoose.model("Item", itemsSchema);

//Created Default items 1-3
const item1 = new Item({
  name: "Welcome to your to-do list!"
});

const item2 = new Item({
  name: "Hit the + button to add a new item."
});

const item3 = new Item({
  name: "<-- Hit this to delete an item."
});

//Created an array of items
const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

//Home Page
app.get("/", function(req,res){
  Item.find({}, function(err, foundItems){
    if(foundItems.length === 0){
      //Pushing the array consisting of items to our database
      Item.insertMany(defaultItems, function(err){
        if (err){
          console.log(err);
        }
        else{
          console.log("insert Many complete");
        }
      });
      res.redirect("/");
    }
    else{
      //Express render looks for list.ejs file in views folder
      //kindOfDay is a variable in our list.EJS
      // day is a variable in our node app.js
      res.render("list", {
        listTitle: "Today",
        //We're sending our founditems to newListItems Front-End
        newListItems: foundItems
      });
    }
  });
});

//User's Custom route todo list
app.get("/:customListName", function (req, res){
  const CustomListName = _.capitalize(req.params.customListName);

  // check to see if user created custom list already exists
  List.findOne({ name: CustomListName }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        // create a new list
        const list = new List({
          name: CustomListName,
          items: defaultItems
          });
          // save list and redirect to webpage of custom list name
          list.save();
          res.redirect("/" + CustomListName);
      }
      else {
        // show an existing list
        res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
      }
    }
  });
});

//When we submit data we need a POST method to take action
app.post("/", function(req, res){
  const itemName = req.body.item;
  const listName = req.body.list;

  const item = new Item ({
    name: itemName
  });

  // if user is on home page, save list to home page
  if (listName === "Today"){
    item.save();
    res.redirect("/");
  }
  // otherwise find the name of the list that the user is on
  // and save the item to the user created custom made list
  else{
    List.findOne({name: listName}, function(err, foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", function(req,res){
  const checkedItemId = req.body.checkbox;

  // check the value of list name
  const listName = req.body.listName;

  if (listName === "Today") {

    Item.findByIdAndRemove(checkedItemId, function (err) {
      if (err) {
        console.log(err)
      } else {
        console.log("Successfully deleted checked item.")
        res.redirect("/");
      }
    });

  }
  else {
    // find list name that corresponds to custom created list
    // pull from the items array that has an id that corresponds to the checked items id
    List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }, function (err, foundList) {
        if (!err) {
            res.redirect("/" + listName);
        }
    });
  }
});

app.listen(port, () =>{
  console.log("Listening on Port 3000");
});
