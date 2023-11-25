const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render('listings/index.ejs', { allListings });
};


module.exports.renderNewForm = (req, res) => {
    //console.log(req.user);
    res.render('listings/new.ejs');
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            },
        })
        .populate("owner");
    //console.log(listing.owner.username)
    if (!listing) {
        req.flash("error", "Listing you Requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;

    console.log(url, "....", filename);
    const newListing = new Listing(req.body.listing);
    // console.log(req.body)
    // let { title, description, image, price, location, country } = req.body;
    // const newListing = new Listing({
    //     title: title,
    //     description: description,
    //     image: image,
    //     price: price,
    //     location: location,
    //     country: country,
    // })
    newListing.owner = req.user._id;
    newListing.image = { url, filename }
    await newListing.save();
    req.flash("success", "New Listing Created");
    //console.log(newListing);
    res.redirect('/listings');

    // if(!req.body){
    //     throw new ExpressError(400, "NO data inseted in form ");
    // }
    // if(!title){
    //     throw new ExpressError(400, "title is not found ");
    // }
    // if(!description){
    //     throw new ExpressError(400, "description is not found ");
    // }
    // if(!price){
    //     throw new ExpressError(400, "price is not found ");
    // }
    // if(!country){
    //     throw new ExpressError(400, "country is not found ");
    // }
    // if(!location){
    //     throw new ExpressError(400, "location is not found ");
    // }
};


module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you Requested for does not exist!");
        res.redirect("/listings");
    }

    let orginalImageurl = listing.image.url;
    orginalImageurl = orginalImageurl.replace("/upload", "/upload/w_250")
    //console.log(listing);
    res.render("listings/edit.ejs", { listing, orginalImageurl });
};


module.exports.updateListing = async (req, res) => {



    if (!req.body.listing) {
        throw new ExpressError(400, "send valid data for listing");
    }
    let { id } = req.params;
    // let { title, description, image, price, location, country } = req.body;
    // const newListing = new Listing({
    //     title: title,
    //     description: description,
    //     image: image,
    //     price: price,
    //     location: location,
    //     country: country,
    // });
    //console.log(newListing);

    // below code moved to middleware.js
    // let listing = await Listing.findById(id);
    // if (!listing.owner.equals(res.locals.currUser._id)) {
    //     req.flash("error", "you don't have permission to edit")
    //     res.redirect(`/listings/${id}`);
    // }
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing Updated");

    //console.log("-------------------------")
    res.redirect(`/listings/${id}`);
};


module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
};