const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use('view engine', 'ejs');

app.get("/", function(req, res){
  res.send("Hello");
});

app.listen(3000, function(){
    console.log("listening to port 3000");
});
