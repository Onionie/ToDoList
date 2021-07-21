const express = require("express");
const bodyParser = require("body-parser");
const app = express();

var items = ["Beer", "Soda"];

//using express
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

app.get("/", function(req, res){
  var today  = new Date();
  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  var day = today.toLocaleDateString("en-US", options);

  //EJS render looks for list file in views folder
  //kindOfDay is a variable in our list.EJS
  // day is a variable in our node app.js
  res.render("list", {
    kindOfDay: day,
    //We're sending our "items" array to our EJS "newListItems"
    newListItems: items
  });

  //When we submit data we need a POST method to take action
  app.post("/", function(req, res){
    //parse data that was an input from our html with a name "item"
    newItem = req.body.item;
    //push parsed "newItem" into our "items" array
    items.push(newItem);
    //redirect that info
    res.redirect("/");
  });
});

app.listen(3000, function(){
    console.log("listening to port 3000");
});
