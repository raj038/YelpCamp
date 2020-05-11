var express       =require("express");
var bodyparser    =require("body-parser");
var mongoose      =require("mongoose");
var passport      =require("passport");
var localstrategy =require("passport-local");
var methodoverride=require("method-override");
var flash         =require("connect-flash");
var user          =require("./models/user");
var camp          =require("./models/campground");
var comment       =require("./models/comments");
var app           =express();
var seed          =require("./seed");
var port          =process.env.PORT || 3000;
//requiring  routes 
var commentroutes   =require("./routes/comment");
var campgroundroutes=require("./routes/campground");
var indexroutes     =require("./routes/index");

mongoose.connect("mongodb://localhost/yelpdb");
mongoose.connect("mongodb+srv://raj038:saitama033@cluster0-brmnz.mongodb.net/test?retryWrites=true&w=majority")
//seed();
app.set("view engine","ejs");
app.use(flash());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodoverride("_method"));

//passport Configuration
app.use(require("express-session")({
    secret:"This is the best",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentuser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
})

//Routes
app.use(campgroundroutes);
app.use(indexroutes);
app.use(commentroutes);

app.listen(port, () => console.log('http://localhost:'+port))