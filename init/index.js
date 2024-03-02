const mongoose = require('mongoose');
const data=require('./data.js');
const Listing = require("../model/listing.js");

main()
.then(function(res){
    console.log("connected bro have rest");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};
``
const initdata= async function(){
    await Listing.deleteMany({});
    let sahil=data.map((obj)=>({
      ...obj,
      owner:'65ccf9b70b8c071a1ce2a2e4',
    }))
    await Listing.insertMany(sahil);
    console.log("data is added");

}

initdata();