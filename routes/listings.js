const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require("../utils/ExpressError.js");
const listingSchema = require('../schema.js');
const reviewSchema = require("../schemaReview.js");
const { postLogin } = require('../middleware/loginMiddleWare.js');
const Review = require('../model/reviews.js');
const Listing = require('../model/listing.js');
const User = require('../model/user.js');
const passport = require('passport-local-mongoose');
const { login } = require('../middleware/loginMiddleWare.js');
const { isOwner } = require('../middleware/authorization.js');
const loginMiddleware = login;
const controllerListings = require('../controller/listings.js');
const controllerReviews = require('../controller/review.js');
const multer  = require('multer')
const {storage,cloudinary} = require("../cloudConfig.js")
const upload = multer({ storage})



const reviewValidator = (req, res, next) => {
    let result = reviewSchema.validate(req.body);
    //console.log(result);
    if (result.error) {
        return next(new ExpressError(400, result));
    }
    else {
        next();
    }

}

router
    .route('/')
    .get(wrapAsync(controllerListings.getLandingPage))
    .post(upload.single('image'),wrapAsync(controllerListings.postListings));

router
    .route("/:id")
    .get(wrapAsync(controllerListings.getShowAndNew))
    .put(loginMiddleware, isOwner, upload.single('image'),wrapAsync(controllerListings.putEditListing))
    .delete(loginMiddleware, isOwner, wrapAsync(controllerListings.deleteListings))


router.get('/:id/edit', loginMiddleware, isOwner, wrapAsync(controllerListings.getEditListing));



router
    .route("/:id/review")
    .post(loginMiddleware, reviewValidator, wrapAsync(controllerReviews.postReview))
    .get(wrapAsync(controllerReviews.getReview));

router
    .route("/:id/review/:rId")
    .get(wrapAsync(controllerReviews.getReviewId))
    .delete(loginMiddleware, wrapAsync(controllerReviews.deleteReviewId))

router.get("*", (req, res, next) => {
    next(new ExpressError(404, "Not Found"))
});

module.exports = router;






















// router.get('/listings/new', async function (req, res){
//     res.render("listings/new.ejs")
// })

// router.get('/listings/:id', async function (req, res){
//     let data = await Listing.findById(req.params.id);
//     res.render("listings/show.ejs",{data});
// })