const Review = require('../model/reviews.js');
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../model/listing.js");

//get review------------------------------------------------------------------------------------------------------------------------------------------

module.exports.getReview = async function (req, res) {
 let id = req.params.id;
 res.redirect(`/listings/${id}`);
}

//post review------------------------------------------------------------------------------------------------------------------------------------------

module.exports.postReview = async function (req, res, next) {
 let id = req.params.id;
 let data = await Listing.findById(id);

 if (!data) {
  return next(new ExpressError(404, "Listing not found"));
 }

 let comment = req.body.comment;
 let rating = req.body.rating;

 let review = new Review({
  rating: rating,
  comment: comment,
 })

 review.author = req.user._id;
 data.reviews.push(review._id);
 review.populate("author");
 await review.save();
 await data.save();
 console.log(review);
 console.log("work has been done");
 res.redirect(`/listings/${id}`);
}

//get review id ---------------------------------------------------------------------------------------------------------------------------------------

module.exports.getReviewId = async function (req, res) {
 let id = req.params.id;
 res.redirect(`/listings/${id}`);
}

//delete review id --------------------------------------------------------------------------------------------------------------------------------

module.exports.deleteReviewId = async function (req, res) {
 let id = req.params.id;
 let rId = req.params.rId;
 console.log(res.locals.redirectUrl);
 await Listing.findByIdAndUpdate(id, { $pull: { reviews: rId } });
 await Review.findByIdAndDelete(rId);
 res.redirect(`/listings/${id}`);
}