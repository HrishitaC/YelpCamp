//test data

var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment =  require("./models/comment");

var data = [
    {
        name: "Cloud's Rest",
        image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=60",
        description: "blah blah blah"
    },
    
    {
        name: "Desert Mesa",
        image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=60",
        description: "blah blah blah 2"
    },
    
    {
        name: "Lake Lakey",
        image: "https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=60",
        description: "blah blah blah 3"
    },
];

function seedDB(){
    //Remove all campgrounds
    Campground.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }
        Comment.deleteMany({}, function(err){
            if(err){console.log(err);
            } else {
                console.log("Removed Comments!");
            }
        });
        console.log("removed campgrounds!");

        // //add a few campgrounds
        // data.forEach(function(seed){
        // Campground.create(seed, function(err, addedCampground){
        //     if(err){
        //         return console.log(err);
        //     }else {
        //         console.log("added a campground");
        //         Comment.create({
        //             text: "This place is great but I wish there was internet",
        //             author: "Homer"
        //         } , function(err, comment){
        //             if(err){
        //                 console.log(err);
        //             } else {
        //                 addedCampground.comments.push(comment);
        //                 addedCampground.save();
        //                 console.log("created a comment");
        //             }
        //         });
        //     }
        //     });
        // });
    });
}

module.exports = seedDB;
