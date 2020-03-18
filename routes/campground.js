var express=require("express");
var router =express.Router()
var Campground=require("../models/campground")
var Review =require("../models/review");
var Comment=require("../models/comment")


router.get("/",function(req,res){
	Campground.find({},function(err,allCampground){

		if(err){
			console.log(err)
		}
		else{
			res.render("campground/index",{campgrounds:allCampground,});
		}
	})
	//res.render("campground",{campgrounds:campgrounds})
})
router.post("/",IsLoggedIn,function(req,res){
        var name=req.body.name
        var image =req.body.image
        var desc =req.body.descprition;
        var price =req.body.price
        var author={
        	id:req.user._id,
        	username:req.user.username
        }
        var newCampground={name:name,image:image,price:price,description:desc,author:author}
        Campground.create(newCampground,function(err,newlyCreated){
        	if(err){
        		console.log(err);
        	}
        	else{
        		res.redirect("/campground")
        	}
        })
        
})
router.get("/new",IsLoggedIn,function(req,res){
	res.render("campground/new")
})
router.get("/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").populate({
		path:"reviews",
		options:{sort:{createAt:-1}}
	}).exec(function(err,foundCampground){
		if(err){
			console.log(err);
		}
		else{
			
			res.render("campground/show",{campground:foundCampground});
		}
	})
    
})
//edit route
router.get("/:id/edit",checkCampgroundOwnership,function(req,res){
	

       Campground.findById(req.params.id,function(err,foundCampground){
				res.render("campground/edit",{campground:foundCampground})
		
		})
	
	
	
	
})
router.put("/:id",checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updateCampground){
    	if(err){
    	    redirect("/campground")
    	}
    	else{
    		res.redirect("/campground/"+req.params.id)
    	}
    }) 
})
//destroy
router.delete("/:id",checkCampgroundOwnership,function(req,res){
	Campground.findById(req.params.id,function(err){
		if(err){
			res.redirect("/campground")
		}
		else{
			Comment.remove({"_id":{$in:campground.comments}},function(err){
				if(err){
					console.log(err)
					return res.redirect("/campground");
				}
				Review.remove({"_id":{$in:campground.reviews}},function(err){
					 if (err) {
                        console.log(err);
                        return res.redirect("/campgrounds");
                    }
                   campground.remove();
                    req.flash("success", "Campground deleted successfully!");
                    res.redirect("/campgrounds"); 
				})
			})
			
		}
	})
})

function checkCampgroundOwnership(req,res,next){
   if(req.isAuthenticated()){

       Campground.findById(req.params.id,function(err,foundCampground){
		if(err){
			req.flash("error","campground not found")
			res.redirect("back")
		}
		else{
			if(foundCampground.author.id.equals(req.user._id)){
				next()
			}
			else{
				req.flash("error","you dont have the perission to do that")
               res.redirect("back")
			} 
			
		}

			
		
		})
   }
   else{
   	req.flash("error","you need to be logged i  for that")
   	res.redirect("back")
   }
}
 function IsLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next()
	}
	req.flash("error","you need to be login to do that");
	res.redirect("/login")
    }    

module.exports=router;