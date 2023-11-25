const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema ,reviewSchema} = require("./schema.js");
module.exports.isLoggedIn = (req, res, next) => {
  //console.log(req.originalUrl);
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be Logged in to create Listings!");
    return res.redirect("/login");
  }
  next();
};
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  //console.log(res.locals.redirectUrl);
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "you are not the owner of the Listing");
    res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};



module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else {
        next();
    }
}


module.exports.isReviewAuthor = async (req, res, next) => {
    let { id,review } = req.params;
    let review1 = await Review.findById(review);
    console.log("---------------------")
    console.log(review1)
    if (!review1.author.equals(res.locals.currUser._id)) {
      req.flash("error", "you are not the author of this review");
      return res.redirect(`/listings/${id}`);
    }
    next();
  };