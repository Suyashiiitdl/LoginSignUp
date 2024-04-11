const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const collection = require("./config");

const app = express();

//covert to json

app.use(express.json());

app.use(express.urlencoded({exptended: false}));

app.set('view engine', 'ejs');

//static file

app.use(express.static("public")); 

app.get("/", (req, res) =>{
    res.render("login");
});

app.get("/signup",(req, res) =>{
    res.render("signup");
});

// Register User

app.post("/signup", async(req, res) =>{
    const data = {
        name: req.body.username, 
        password: req.body.password
    }

    //user already exist
    const existingUser = await collection.findOne({name: data.name});

    if(existingUser){
        res.send("User already exists. Please choose a different username.");
    }
    else{
        const userdata = await collection.insertMany(data);
        // res.render("/login");
        console.log(userdata);
    }
});

//Login user

app.post("/login", async(req,res) => {
    try{
        const check = await collection.findOne({name: req.body.username});
        if(!check) {
            res.send("User name is not Registered");
        }

        //compare password from database

        // const isPasswordMatch= await compare(req.body.password, check.password);
        if(req.body.password === check.password){
            res.render("home");
        }
        else{
            req.send("Wrong password");
        } 

    }catch{
        res.send("Wrong Details");
    }
});



const port = 5000;
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
})