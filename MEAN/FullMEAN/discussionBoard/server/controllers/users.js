var mongoose = require("mongoose");
var User = mongoose.model("User");
var Topic = mongoose.model("Topic");
var Comment = mongoose.model("Comment");

module.exports.home = function (request, response) {
  //find
  Topic.find({}).populate("_user").then(function (topics) {
    Comment.find({}).populate("_user _topic").then(function (comments) {
      response.json({ topics: topics, comments: comments });
    }).catch(function (err) {
      console.log(err);
    });
  }).catch(function (err) {
    console.log("LOGIN ERROR", err);// if the server fails then log the error in the console
    response.json({});// but do not propagate it to the browser
  });
};

module.exports.login = function (request, response) {
  var promise = User.findOne({ email: request.body.email });
  promise.then(function (user) {
    if (user) {
      var validPassword = user.comparePassword(request.body.password);
      if (validPassword) {
        console.log("LOGIN SUCCESS", user.email);
        response.json({ user: { id: user._id, username: user.username } });
      }
      else {
        console.log("INCORRECT PASSWORD", user.email);
        response.json({ error: { message: "Incorrect password" } });
      }
    }
    else {
      console.log("EMAIL NOT FOUND", user.email);
      response.json({ error: { message: "Email not found, please register" } })
    }
  }).catch(function (err) {
    console.log("LOGIN ERROR", err);// if the server fails then log the error in the console
    response.json({});//  but do not propagate it to the browser
  });
};

module.exports.register = function (request, response) {
  //findOne
  var promise = User.findOne({ email: request.body.email });
  promise.then(function (user) {
    if (user) {
      console.log("EMAIL ALREADY EXISTS", user.email);
      response.json({ error: { message: "Email already exists, please login" } })
    }
    else {
      var user = new User(request.body);
      var promise = user.save();
      promise.then(function (user) {
        console.log("USER.SAVE.SUCCESS");
        response.json({ message: "Successfully saved user", user: user });
      }).catch(function (err) {
        console.log("USER.SAVE.ERROR", err);// if the server fails then log the error in the console
        response.json({});// but do not propagate it to the browser
      });
    }
  }).catch(function (err) {
    console.log("LOGIN ERROR", err);// if the server fails then log the error in the console
    response.json({});// but do not propagate it to the browser
  });
};

module.exports.addNewTopic = function (request, response) {
  var topic = new Topic(request.body);
  var promise = topic.save();
  promise.then(function (topic) {
    console.log("topic.SAVE.SUCCESS");
    response.json({ message: "Successfully saved topic", topic: topic });
  }).catch(function (err) {
    console.log("topic.SAVE.ERROR", err);// if the server fails then log the error in the console
    response.json({});// but do not propagate it to the browser
  });
};

module.exports.addcomment = function (request, response) {
  var comment = new Comment(request.body);
  var promise = comment.save();
  promise.then(function (comment) {
    console.log("comment.SAVE.SUCCESS");
    response.json({ message: "Successfully saved comment", comment: comment });
  }).catch(function (err) {
    console.log("comment.SAVE.ERROR", err);// if the server fails then log the error in the console
    response.json({});// but do not propagate it to the browser
  });
};

module.exports.Like = function (request, response) {
  Post.findOne({ _id: request.body.post }, function (err, post) { // creates likes
    if (err) {
      response.json({ err: err })
    }
    else {
      post.like.push(request.body.user);
      post.save((err) => { console.log(err); })
      response.json({ post: post })
    }
  })
},
  module.exports.Dislike = function (request, response) { //creates dislikes
    Post.findOne({ _id: request.body.post }, function (err, post) {
      console.log(post)
      if (err) {
        response.json({ err: err })
      }
      else {
        post.dislike.push(request.body.user);
        post.save((err) => { console.log(err); })
        response.json({ post: post })
      }
    });
  },
  module.exports.addPost = function (request, response) {
    User.findOne({ _id: request.body.user }, function (err, user) {
      if (err) {
        response.json({ err: err }) //adds the post to the selected topic from a user unless there are errrors.
      }
      else {
        Topic.findOne({ _id: request.body.topic }, function (err, topic) {
          if (err) {
            response.json({ err: err })
          }
          else {
            var post = new Post({ content: request.body.content, user: request.body.username, user_id: request.body.user })
            post.save(function (err, post) { //saves the post from the user to the topic, unless there are errors.
              if (err) {
                response.json({ err: err })
              }
              else {
                user.posts += 1; //increments the user posts by 1 for each post successfully saved.
                user.save((err) => { console.log(err); })
                topic.posts.push(post)
                topic.save((err) => { console.log(err); })
                response.json({ post: post })
              }
            })
          }
        })
      }
    })
  }