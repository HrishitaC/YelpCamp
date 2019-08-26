var express = require("express");
var router = express.Router({mergeParams: true}); //argument ensures that the id of the campgrounds can be accessed
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware/index");

//comments new
router.get("/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

//comments create
router.post("/", middleware.isLoggedIn, function(req, res){ 
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
            req.flash("error", "Oops something went wrong!");
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, addedComment){
                if(err){
                    console.log(err);
                    req.flash("error", "Oops something went wrong!");
                    res.redirect("/campgrounds");
                } else {
                    addedComment.author.id = req.user._id;
                    addedComment.author.username = req.user.username;
                    addedComment.save();
                    foundCampground.comments.push(addedComment);
                    foundCampground.save();
                    req.flash("success", "Added new comment!");
                    res.redirect("/campgrounds/"+foundCampground._id);
                }
            }); 
        }
    });
});

//comment edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            req.flash("error", "Oops something went wrong!");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                console.log(err);
                req.flash("error", "Oops something went wrong!");
                res.redirect("back");
            } else {
                res.render("comments/edit", {comment: foundComment, campground
                : foundCampground});
            }
        });
    });
});

//comment update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            console.log("Error");
            req.flash("error", "Oops something went wrong!");
            res.redirect("back");
        } else {
            req.flash("success", "Comment successfully edited!");
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});

//comment destroy
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            console.log(err);
            req.flash("error", "Oops something went wrong!");
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted!");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});


module.exports = router;