const Listing = require("../model/listing.js");
const passport = require('passport-local-mongoose');
const Review = require("../model/reviews.js");
const ExpressError = require("../utils/ExpressError.js");
const listingSchema = require('../schema.js');

//landing page----------------------------------------------------------------------------------------------------------------------------------------------------------------                      

module.exports.getLandingPage = async function (req, res) {

    let data = await Listing.find();
    res.render("listings/index.ejs", { data });
}

//show and new route----------------------------------------------------------------------------------------------------------------------------------------------------------------

module.exports.getShowAndNew = async function (req, res, next) {
    if (req.params.id === 'new') {
        if (!req.isAuthenticated()) {
            req.flash('error', "please login");
            return res.redirect('/login');
        }
        else {
            res.render("listings/new.ejs");
        }
    } else {
        let data = await Listing.findById(req.params.id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
        if (!data) {
            req.flash("error", "requested listing not found");
            res.redirect("/listings")
        }
        res.render("listings/show.ejs", { data });
    }
}

//post listings route------------------------------------------------------------------------------------------------------------------------------------------------

module.exports.postListings = async function (req, res, next) {
    let result = listingSchema.validate(req.body);
    if (result.error) {
        return next(new ExpressError(400, result));
    }

    else {
        let file=req.file.filename
        let cloudinaryPath=req.file.path
        let title = req.body.title
        let des = req.body.description
        let price = req.body.price
        let location = req.body.location
        let country = req.body.country
        // let image = req.body.image.url
        let data = new Listing({
            title: title,
            description: des,
            price: price,
            location: location,
            country: country,
            image: { url: cloudinaryPath, filename:file},
        })
        data.owner = req.user._id;
        await data.save();
        req.flash("success", "new listing created successfully");
        res.redirect('/listings');
    }
}

//get edit------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

module.exports.getEditListing = async function (req, res) {
    let data = await Listing.findById(req.params.id);
    res.render("listings/edit.ejs", { data });
}

//put edit------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

module.exports.putEditListing = async function (req, res) {
    let file
    let cloudinaryPath
    let id = req.params.id;
    let title = req.body.title
    let des = req.body.description
    let price = req.body.price
    let location = req.body.location
    let country = req.body.country
    //let image = req.body.image
    if(req.file){
        file=req.file.filename
        cloudinaryPath=req.file.path
    }
    else{
        let data = await Listing.findById(id);
        file=data.image.filename
        cloudinaryPath=data.image.url;
    }


    let entry = await Listing.findByIdAndUpdate(id, {
        title: title,
        description: des,
        price: price,
        location: location,
        country: country,
        image: { url: cloudinaryPath, filename:file},
    });
    entry.save();
    res.redirect('/listings');

}

//delete listings----------------------------------------------------------------------------------------------------------------------------------------------------------

module.exports.deleteListings = async function (req, res) {
    let id = req.params.id;
    let data = await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
    console.log(data);
}