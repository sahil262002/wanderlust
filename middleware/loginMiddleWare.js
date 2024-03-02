const passport = require('passport-local-mongoose');

module.exports.login= function(req, res,next){
    if(!req.isAuthenticated()){
        // console.log(req);
        req.session.redirectUrl=req.originalUrl;
        req.flash('error',"please login");
        
        return res.redirect('/login');
    }
    next();
}

module.exports.postLogin= function(req, res, next){
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
    
   
}