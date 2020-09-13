var express= require("express");
var override = require("method-override")
var app = express();
var bodyParser = require("body-parser")
var mongoose = require("mongoose");
var expresSanitizer=require("express-sanitizer")
// app configaration
mongoose.connect("mongodb://localhost:27017/blog_app",{useNewUrlParser: true, useUnifiedTopology: true});
app.set("view engine","ejs");
mongoose.set('useFindAndModify', false);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expresSanitizer());
app.use(override("_method"));


//mongoose/model/schema configaration
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: { type:Date, default:Date.now}
});
 var Blog = mongoose.model("Blog",blogSchema);
/*Blog.create({
	title:"Hello World",
	image: "https://www.thesprucepets.com/thmb/Mn97CATmMX-N5qkl1aHC0ZbWhu8=/960x0/filters:no_upscale():max_bytes(150000):strip_icc()/19933184_104417643500613_5541725731421159424_n-5ba0548546e0fb0050edecc0.jpg",
	body :"This is the cutest corgi ever",
	
});*/


//resful routes configaration
app.get("/",function(req,res){
	res.redirect("/blogs");
});

//index route
app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs)
	{
		if(err)
			console.log(err);
		else{
			res.render("index",{blogs:blogs});
			}
	});
	
});


//new route
app.get("/blogs/new",function(req,res){
	res.render("new");
});


//create
app.post("/blogs",function(req,res){
	
	// create
	//redirect it to index page
	req.body.blog.body = req.sanitize(req.body.blog.body)
	Blog.create(req.body.blog,function(err,newBlog){
		if(err){
			res.render("new");
		}
		else{
			res.redirect("/blogs");
		}
	});
	
});


//show route
app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err)
			{
				res.redirect("/blogs");
			}
		else{
			res.render("show",{blog:foundBlog})
		}
	})
})


//edit route
app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			res.redirect("/blogs")
		}
		else{
			res.render("edit",{blog:foundBlog});
		}
	})
	
});


//update route
app.put("/blogs/:id",function(req,res){
	Blog.findByIdAndUpdate(req.params.id,req.body.blog, function(err,updatedBlog){
		if(err)
			{
				res.redirect("/blogs");
			}
		else{
			res.redirect("/blogs/" + req.params.id)
		}
	})
})

//delete route 

app.delete("/blogs/:id",function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err)
			{
				res.redirect("/blogs");
			}
		else{
			res.redirect("/blogs");
		}
	})
})

























app.listen(3000,function(){
	console.log("server has started");
})