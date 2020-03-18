var express=require("express");
var router =express.Router({mergeParams:true})
var Campground=require("../models/campground")
var Comment=require("../models/comment")

router.get("/new",IsLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err)
		}
		else{
			
			res.render("comment/new",{campground:campground})
		}
	})
	
})
router.post("/",IsLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err)
			res.redirect("/campground")
		}
		else{
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					console.log(err)
				}
				else{
					comment.author.id=req.user._id
					comment.author.username=req.user.username
					comment.save()
					campground.comments.push(comment);
					campground.save();
					req.flash("success","seccessfully added comment")
					res.redirect("/campground/"+campground._id);
				}
			})
		}
	})
})
//edit and update
router.get("/:comment_id/edit",checkCommnentOwnership,function(req,res){
	Comment.findById(req.params.comment_id,function(err,foundcomment){
		if(err){
			res.redirect("back")
		}
		else{
		   res.render("comment/edit",{campground_id:req.params.id,comment:foundcomment})	
		}
	})
	
})
router.put("/:comment_id",checkCommnentOwnership,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedcomment){
		if(err){
			res.redirect("back")
		}
		else{
			res.redirect("/campground/"+req.params.id)
		}
	})
})
	
router.delete("/:comment_id",checkCommnentOwnership,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			res.redirect("back")
		}
		else{
			req.flash("success","comment deleted")
			res.redirect("/campground/"+req.params.id)
		}
	})
})
  function checkCommnentOwnership(req,res,next){
	 if(req.isAuthenticated()){

       Comment.findById(req.params.comment_id,function(err,foundComment){
		if(err){
			req.flash("error","something went wrong")
			res.redirect("back")
		}
		else{
			if(foundComment.author.id.equals(req.user._id)){
				next()
			}
			else{
				req.flash("error","you dont have permission to do that")
               res.redirect("back")
			} 
			
		}

			
		
		})
   }
		else{
			req.flash("error","you need to be logged in to do that")
		res.redirect("back")
	   }
	   }	
	
    function IsLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next()
	}
     req.flash("error","you need to be login to do that");;
	res.redirect("/login")
    }    


module.exports=router