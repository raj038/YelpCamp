var express=require("express");
var router=express.Router();
var camp=require("../models/campground");
var middleware=require("../middleware");

router.get("/campgrounds",function(req,res)
{
    camp.find({},function(err,camps)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("camps/campgrounds",{campgrounds:camps});
        }
    })
})

router.post("/campgrounds",middleware.isloggedin,function(req,res)
{
    var name=req.body.name;
    var url=req.body.url;
    var desc=req.body.description;
    var price=req.body.price;
    var author={
        username:req.user.username,
        id:req.user._id
    }
    var campground={name:name ,price:price, image:url, description:desc,author:author};
    camp.create(campground,function(err,data)
    {
        if(err )
        {
            res.redirect("/login");
        }
        else
        {    
            res.redirect("/campgrounds");
        }
    });
});

router.get("/campgrounds/new",middleware.isloggedin,function(req,res)
{
    res.render('camps/new');
})

router.get("/campgrounds/:id",function(req,res)
{
    camp.findById(req.params.id).populate("comments").exec(function(err,data)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("camps/show",{campground:data});
        }
    });
});

//Edit Routes
router.get("/campgrounds/:id/edit",middleware.campgroundownership,function(req,res){
    camp.findById(req.params.id,function(err,campground){
            res.render("camps/edit",{campground:campground});
    });
})
router.put("/campgrounds/:id",middleware.campgroundownership,function(req,res){
    var data={
        name:req.body.name,
        image:req.body.url,
        description:req.body.description,
        price:req.body.price
    }
    camp.findByIdAndUpdate(req.params.id,data,function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})
// Delete Routes
router.delete("/campgrounds/:id",middleware.campgroundownership,function(req,res){
    camp.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds");
        }
    })
})

module.exports=router;
