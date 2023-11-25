if (process.env.NODE_ENV != "Pproduction") {
    require('dotenv').config()

}



const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js")
const Review = require("./models/review.js");

//routess
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


const session = require("express-session");
//for online store session 
const MongoStore = require('connect-mongo');

const flash = require("connect-flash");
//for user login        
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


app.set('view engine', 'ejs');
const ejsMate = require("ejs-mate")
port = 8080;
//console.log(Listing);
//const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderLust'

const dbUrl = process.env.ATLASDB_URL;



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate)


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
})

store.on("error", () => {
    console.log("Error in Mongo Session Store!", err);
})

const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expire: Date.now() + 7 * 1000 * 24 * 60 * 60,
        maxAge: 7 * 1000 * 24 * 60 * 60,
        httpOnly: true,
    }
};








app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// app.get("/demoUser", async (req, res) => {
//     let fakeUser = new User({
//         email: "Student@gmail.com",
//         username: "delta-student2",
//     });
//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// });



app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    //console.log(res.locals.success);
    next();
})

app.get("/", (req, res) => {
    res.redirect("/listings")
})



app.use("/listings", listingRouter);
app.use("/listings/:id/reviews/", reviewRouter);
app.use("/", userRouter);

// to use static files 
app.use(express.static(path.join(__dirname, "/public")))

main().then((res) => {
    //console.log("Connected to DB")
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
}

// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title:"My new Villa",
//         description:"By the beach",
//         price:1200,
//         location:"Delhi",
//         Country:"India",
//     });
//     await sampleListing.save().then((req,res)=>{
//         console.log("saved");
//     });
//     console.log("sample was Saved!");
//     res.send("Successful");
// })



//if page not found 
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
})
//handling error
// app.use((err, req, res, next) => {

//     let { statusCode = 500, message = "somthing went wrong" } = err;
//     res.status(statusCode).render("error.ejs", { message });
//     //res.status(statusCode).send(message);
//     //res.send("something went wrong");
// })
app.listen(port, (res, req) => {
    console.log("app is listning");
});



