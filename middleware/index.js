var middlewareobj={};
var camp=require("../models/campground");
var comment=require("../models/comments");

middlewareobj.campgroundownership=function (req,res,next){
    if(req.isAuthenticated()){
        camp.findById(req.params.id,function(err,campground){
            if(err){
                req.flash("error","Campground Not Found");
                res.redirect("back");
            }
            else{
                if(campground.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    req.flash("error","You Don't Have Permission To Do That");
                    res.redirect("back");
                }
            }
        });
    }
    else{
        req.flash("error","You Need To Be LoggedIn To Do That");
        res.redirect("back");
    }
}

middlewareobj.commentownership=function(req,res,next){
    if(req.isAuthenticated()){
        comment.findById(req.params.comment_id,function(err,found){
            if(err){
                res.redirect("back");
            }
            else{
                if(found.author.id.equals(req.user._id)){
                    next();
                }   
                else{
                    req.flash("error","You Don't Have Permission To Do That");
                    res.redirect("back");
                }  
            }
        });
    }
    else{
        req.flash("error","You Need To Be LoggedIn To Do That");
        res.redirect("back");
    }
}

middlewareobj.isloggedin=function (req,res,next)
{
    if(req.isAuthenticated()){
        return  next();
    }
    req.flash("error","You Need To Be LoggedIn To Do That");
    res.redirect("/login");
}

module.exports=middlewareobj;