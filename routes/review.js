const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
//const {  reviewSchema } = require("../schema.js")
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isReviewAuthor, isLoggedIn } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");



//reviews route
//post route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//delete route for reviews
router.delete("/:review", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));


module.exports = router;

