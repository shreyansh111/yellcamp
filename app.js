var express=require("express")
var app=express();
var bodyParse=require("body-parser")
var mongoose =require("mongoose")
var passport =require("passport")
var flash=require("connect-flash")
var localStrategy=require("passport-local")
var User=require("./models/user")
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb+srv://shreyansh___1:subbujiya@cluster0-0omil.mongodb.net/test?retryWrites=true&w=majority")
app.use(bodyParse.urlencoded({extended:true}))
app.set("view engine","ejs")
var Campground=require("./models/campground")
var Comment=require("./models/comment")
var seedDB=require("./seeds")
var mehodOverride=require("method-override")
app.use(express.static(__dirname + "/public"))
var campgroundRoutes=require("./routes/campground")
var commentRoutes=require("./routes/comments")
var reviewRoutes=require("./routes/reviews")
var indexRoutes=require("./routes/index")
app.use(mehodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');
//seedDB();
//passport conifguration
app.use(require("express-session")({
	secret:"ronaldo is bae",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next()

})
app.use(indexRoutes);
app.use("/campground",campgroundRoutes);
app.use("/campground/:id/comments",commentRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

app.listen(3000,function(){
	console.log("yellcamp has started")
})
