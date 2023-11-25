const User = require("../models/user.js");



module.exports.renderSignupForm = (req, res) => {
    res.render("./users/signup.ejs")
}


module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username })
        let registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        // for automatic login after signup
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to WanderaLust!")
            res.redirect("/listings");
        })

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }

}


module.exports.renderloginForm = (req, res) => {
    res.render("./users/login.ejs")
}

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome to WanderLust you are logged in!");
    //res.send("ok")
    //console.log(res.locals.redirectUrl)
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Loggged out You!");
        res.redirect("/listings");

    });
}