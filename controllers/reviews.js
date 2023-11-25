const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
   // console.log(req.params.id);
    let newReview = new Review(req.body.review);

    newReview.author = req.user._id;
   // console.log(req.user._id)
    //console.log(newReview.author)
    //console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New review Created");
    res.redirect(`/listings/${listing._id}`)
    //console.log("new review saved!");
    //res.send("new review saved!");
}


module.exports.destroyReview = async (req, res) => {
    let { id, review } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: review } })
    await Review.findByIdAndDelete(review);
    req.flash("success", "review Deleted");

    // res.send("fine")
    res.redirect(`/listings/${id}`);


};

