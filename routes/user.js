const express= require('express');
const router= express.Router({mergeParams:true});
const listingsRoute=require('./listings');
const User=require('../model/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const {postLogin}=require('../middleware/loginMiddleWare.js');

router.get('/signup', function(req, res){
    res.render("users/signup.ejs");
});

router.post('/signup', wrapAsync(async function(req, res){
    try{
        let {Username,Email,Password} = req.body;

        let fakeuser=new User({
            email:Email,
            username:Username,
        })
        let newuser=await User.register(fakeuser,Password);
        
        
        req.login (newuser,function(err){
            if(err){
                return next(err);
            }
            req.flash('success',"registered successfully");
            res.redirect("/listings");
        });
    }
    catch (err) {
        let msg="A user with the given username is already registered";
        if(err.message===msg){
            req.flash('error','Username already is in use');
            res.redirect("/signup");
        }
        else{
            req.flash('error',err.message);
            res.redirect("/signup");
        }
       
    }
}));

router.get('/login', function(req, res){
    res.render("users/login.ejs");
})

const loginPassport=passport.authenticate("local",{
    failureFlash:true,
    failureRedirect:"/login",
})

router.post('/login',postLogin,loginPassport, wrapAsync(async function(req, res){
    
        req.flash('success',"welcome to wanderLust");
        const url=res.locals.redirectUrl || "/listings";
        console.log(url);
        res.redirect(url);
}));

router.get('/logout', function(req, res){
    req.logout((err)=>{
        if(err){
            return err;
        }
        req.flash('success',"You Logged Out successfully");
        res.redirect("/listings");
    })
});

module.exports = router;