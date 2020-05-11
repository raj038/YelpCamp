var express = require("express");
var router  = express.Router();
var camp = require("../models/campground");
var comment= require("../models/comments");
var middleware=require("../middleware");


router.get("/campgrounds/:id/comments/new",middleware.isloggedin, function(req, res){
    camp.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {data: campground});
        }
    })
});

router.post("/campgrounds/:id",middleware.isloggedin,function(req, res){
   camp.findById(req.params.id, function(err, campground){
        if(err){
           console.log(err);
           res.redirect("/campgrounds");
        } else {
        comment.create(req.body.content, function(err, comment){
            if(err){
                req.flash("error","Something Went Wrong");
                console.log(err)
            } else {
               comment.author.id=req.user._id;
               comment.author.username=req.user.username;
               comment.save();
               campground.comments.push(comment);
               campground.save();
               req.flash("success","Comment Added Successfully");
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
});

//Edit And Update Routes
router.get("/campgrounds/:id/comments/:comment_id/edit",middleware.commentownership,function(req,res){
    var campid=req.params.id;
    comment.findById(req.params.comment_id,function(err,found){
        if(err){
            res.redirect("back");
        }
        else{
            res.render("comments/edit",{data:found , campid:campid});
        }
    })
});

router.put("/campgrounds/:id/comments/:comment_id",middleware.commentownership,function(req,res){
    comment.findByIdAndUpdate(req.params.comment_id,req.body.content,function(err,newcomment){
        if(err){
            res.redirect("back");
        }
        else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});

//Delete Route
router.delete("/campgrounds/:id/comments/:comment_id",middleware.commentownership,function(req,res){
    comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back");
        }
        else{
            req.flash("success","Comment Deleted");
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});

module.exports=router;
