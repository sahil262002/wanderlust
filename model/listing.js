const mongoose= require('mongoose');
const Review = require('./reviews.js');
const Schema= mongoose.Schema;

const listingSchema= new Schema(
    {
        title: String,
        description : String,
        image: {
            url: {
                type : String,
                default : "https://images.pexels.com/photos/1287550/pexels-photo-1287550.jpeg?cs=srgb&dl=sunset-1287550.jpg&fm=jpg"
            },
            filename: String,
            
        },
        price: Number,
        location: String,
        country: String,
        reviews:[{
            type: Schema.Types.ObjectId,
            ref:"Review",
        }],
        owner:{
            type: Schema.Types.ObjectId,
            ref:"user",
        }
    }
    
) 
listingSchema.post("findOneAndDelete",async function(listing){
    let res= await Review.deleteMany({_id:{$in:listing.reviews}});

})
const Listing =mongoose.model('Listing',listingSchema);

module.exports = Listing;