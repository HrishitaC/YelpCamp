var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index");

//INDEX - SHOWS ALL CAMPGROUNDS
router.get("/",function(req, res){
    //get all campgrounds from db thn render the page
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    })
});

//NEW - SHOWS FORM TO ADD NEW CAMPGROUND
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//CREATE - ADD NEW CAMPGROUND
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc= req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description: desc, author: author};
    //Create a new campground and save it to the db
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            req.flash("error", "Oops, something went wrong!");
            res.redirect("back");
        } else {
            req.flash("success", "Added a new campground: "+name);
            res.redirect("/campgrounds");
        }
    });
});

//SHOW - Show all details of a particular campground
//put this after campgrounds/new route otherwise campgrounds/new will also be considered as campgrounds/:id because id is expecting any word
router.get("/:id", function(req, res){ 
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            res.redirect("back");
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

//UPDATE CAMPGROUND ROUTE

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            req.flash("error", "Oops, something went wrong!");
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground edited!");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground deleted!");
            res.redirect("/campgrounds");
        }
    });
});


module.exports = router;