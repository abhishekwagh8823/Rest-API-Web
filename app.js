const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//TODO
mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true});
const articleSchema = {
  title:String,
  content : String
}

const Article = mongoose.model("Article",articleSchema);







//***************************Normal Routing ***************************//

app.route("/articles")
.get(function(req,res){
  Article.find(function(err,foundArticle)
{
  if(!err)
  {
    res.send(foundArticle);
  }
  else
  {
    res.send(err);
  }

});
})

.post(function(req,res)
{
  console.log(req.body.title);
  console.log(req.body.content);

  //adding to database wikiDB
  const newArticle=new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save(function(err)
{
  if(!err)
  {
    res.send("Successfully added to database");
  }
  else
  {
    res.send("Opps! There is some error .");
  }
});
})

.delete(function(req,res)
{
  Article.deleteMany(function(err)
{
  if(!err)
  {
    res.send("Successfully deleted all");
  }
  else
  {
    res.send("There is some error in deleting");
  }
});
});

//****************************single routing*************************--//


app.route("/articles/:articleTitle")
.get(function(req,res)
{

  Article.findOne({title:req.params.articleTitle},function(err,foundArticle)
  {
    if(foundArticle)
    {
      res.send(foundArticle);
    }
    else
    {
      res.send("There is error.");
    }
  });

})

.put(function(req,res)
{
  Article.replaceOne(
    {title:req.params.articleTitle},  //finding in file
    { title:req.body.title , content : req.body.content},  //updating with post values
    {overwrite:true},             //overwrite authority
    function(err)
    {
      if(!err)
      {
        res.send("Successfully Updated");
      }
      // else
      // {
      //   res.send("There is error in updating");
      // }
    }
  );
})

.patch(function(req,res)
{
  Article.replaceOne(
    {title:req.params.articleTitle},
    {$set:req.body},
    function(err)
    {
      if(!err)
      {
        res.send("Successfully update");
      }
      else{
        res.send("There is problem in updating ");
      }
    }
  );
})

.delete(function(req,res)
{
  Article.deleteOne(
    {title:req.params.articleTitle},
    function(err)
    {
      if(!err)
      {
        res.send("Successfully deleted");
      }
      else
      {
        res.send("There is some error in making req");
      }
    }
  );
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
