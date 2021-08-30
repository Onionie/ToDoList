const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();


const items = ["Beer", "Soda"];
const workItems = [];

//using express
app.use(bodyParser.urlencoded({extended: true}));

//To use our css, images, sounds, etc.. we use a public folder
app.use(express.static("public"));

//To use EJS --npm i EJS
app.set('view engine', 'ejs');

//To connect to mongoose for mongoDB
mongoose.connect("mongodb://localhost:27017/todoListDB", {useNewUrlParser: true});

//Make a schema for our items DB
const itemsSchema = {
  name: String
};

//Mongoose Model
//Variable = mongoose.model(<"Singular Collection Name">, <Schema>)
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "This is Defaule item1"
});

const item2 = new Item({
  name: "This is Defaule item2"
});

const item3 = new Item({
  name: "This is Defaule item3"
});

const defaultItems = [item1, item2, item3]

Item.insertMany(defaultItems, function(err){
  if (err){
    console.log(err);
  }
  else{
    console.log("insert Many complete");
  }
});

app.get("/", function(req,res){
  //Express render looks for list.ejs file in views folder
  //kindOfDay is a variable in our list.EJS
  // day is a variable in our node app.js
  res.render("list", {
    listTitle: "Today",
    //We're sending our "items" array to our EJS "newListItems"
    newListItems: items
  });
});



//When we submit data we need a POST method to take action
app.post("/", function(req, res){
  //parse data that was an input from our html with a name "item"
  let newItem = req.body.item;

  if (req.body.list === "Work"){
    workItems.push(newItem);
    res.redirect("/work");
  }
  else{
    //push parsed "newItem" into our "items" array
    items.push(newItem);
    //redirect that info
    res.redirect("/");
  }

});

app.get("/work", function(req, res){
  res.render("list", {
    listTitle: "Work List",
    newListItems: workItems,
  })
});

app.get("/about", function(req,res){
  res.render("about");
})


app.listen(3000, function(){
    console.log("listening to port 3000");
});
