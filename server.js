// packege import 
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const sequlize = require("./config/connection");
const routes = require("./route");

// express application initialize
const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));

const PORT = process.env.PORT || 3001;

const rebulid = process.argv[2]=== "--rebuild";

// public directory 
app.use(express.static(path.join(__dirname,"public")));

//GET request at the root route

app.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

//add routes
app.use(routes);

// syncronize database 

sequlize.sync({force: rebulid}).then(()=>{
    app.listen(PORT,()=> console.log(`Now listening in http://localhost:${PORT}`));
});