const express = require("express");
const bodyParser = require("body-parser");
const app = express();

let items = ["Beer", "Soda"];
let workItems = [];

//using express
app.use(bodyParser.urlencoded({extended: true}));
//To use our css, images, sounds, etc.. we use a public folder
app.use(express.static("public"));
//To use EJS --npm i EJS
app.set('view engine', 'ejs');

app.get("/", function(req, res){
  let today  = new Date();
  let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  let day = today.toLocaleDateString("en-US", options);

  //Express render looks for list.ejs file in views folder
  //kindOfDay is a variable in our list.EJS
  // day is a variable in our node app.js
  res.render("list", {
    listTitle: day,
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


app.listen(3000, function(){
    console.log("listening to port 3000");
});
