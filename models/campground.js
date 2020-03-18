var mongoose =require("mongoose")
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);

var campgroundSchema=new mongoose.Schema({
	name:String,
	image:String,
	price:Number,
	description:String,
	createdAt :{type:Date,default:Date.now},
	author :{
		id:{
			type:mongoose.Schema.Types.ObjectId,
		    ref:"User"
		},
		username:String
	},
	comments:[
	{
		type:mongoose.Schema.Types.ObjectId,
		ref:"Comment"
	}],
	reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    rating: {
        type: Number,
        default: 0
    }

});
module.exports=mongoose.model("campground",campgroundSchema);