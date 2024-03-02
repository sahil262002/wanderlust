
const Listing=require("../model/listing.js");


module.exports.isOwner=async function(req,res,next){
    let id = req.params.id;
    let list= await Listing.findById(id);
    if(!list.owner._id.equals(res.locals.currUser._id)){
        req.flash('error',"you do not have right to edit");
        return res.redirect(`/listings/${id}`);
    }
    next();
}