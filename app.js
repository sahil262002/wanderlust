require('dotenv').config()


const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 8080;
const path = require('path');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const listingsRoute=require("./routes/listings.js");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const passportLocalMongoose= require('passport-local-mongoose');
const User=require('./model/user.js');
const userRoute=require("./routes/user.js");


const dburl=process.env.ATLASDB_URL


main()
.then(function(res){
    console.log("connected bro have rest");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dburl);
};


app.listen(port,function () {
    console.log('listening on port');
});

app.engine('ejs', engine);
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));

const store=MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
})
app.use(session({
    store,
    secret:process.env.SECRET,
    resave:false, 
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
}
));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 

app.use((req, res, next) => {
    res.locals.msg=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    //console.log(res.locals.msg);
    next();
})




app.use("/listings",listingsRoute)
app.use('/',userRoute);

app.use((err, req, res, next) => {
    let {status=500,message="something went wrong"} = err;
    console.log(message);
    res.status(status).send(message);
});

