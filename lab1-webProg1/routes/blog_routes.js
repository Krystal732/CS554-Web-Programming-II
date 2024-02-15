//import express, express router as shown in lecture code
import {Router} from 'express';
const router = Router();
import {showBlogs, createBlog, getBlog, putBlog, patchBlog, postComment, deleteComment, registerUser, signinUser, checkAndTrimString} from '../data/blogs.js'
import {ObjectId} from 'mongodb';
import {users} from '../config/mongoCollections.js'



router.route('/sitblog/:id/comments').post(async (req, res) => {
  let comment = req.body.comment
  let user = undefined
  let blogId = req.params.id

  try{
    comment = checkAndTrimString(comment)

    blogId = checkAndTrimString(blogId, 'blogId');
    if (!ObjectId.isValid(blogId)) throw `blogId is invalid object ID`;

    user = req.session.user
    if (!user){
      return res.status(401).json({error: 'Must be logged in to comment on blog'});
    }      

    let complete = await postComment(
      blogId, 
      comment, 
      user._id,
      user.username
    )
    if (complete){
      res.status(200).json(complete)
    }
    else{
      res.status(500).json({error: "Internal Server Error"})
    }
  }catch(e){
    res.status(400).json({error:e})
  }
  
});

router.route('/sitblog/:blogId/:commentId').delete(async (req, res) => {
  let user = undefined
  let blogId = req.params.blogId
  let commentId = req.params.commentId

  try{
    commentId = checkAndTrimString(commentId, 'commentId')
    if (!ObjectId.isValid(commentId)) throw `commentId is invalid object ID`;

    blogId = checkAndTrimString(blogId, 'blogId');
    if (!ObjectId.isValid(blogId)) throw `blogId is invalid object ID`;

    user = req.session.user
    if (!user){
      return res.status(401).json({error: 'Must be logged in to delete comment on blog'});
    }
    
    let blog = await getBlog(blogId)
    let matchingComment = blog.comments.find(comment => comment._id.toString() === commentId);
    if(!matchingComment){
      throw `Comment does not exist`
    }
    if(matchingComment.userThatPostedComment._id.toString() !== user._id || matchingComment.userThatPostedComment.username !== user.username){
      return res.status(403).json({error: 'Must be logged in the correct account to delete comment'})
    }

    let complete = await deleteComment(
      blogId, 
      commentId
    )
    if (complete){
      res.status(200).json(complete)
    }
    else{
      res.status(500).json({error: "Internal Server Error"})
    }
  }catch(e){
    res.status(400).json({error:e})
  }
  
});

router.route('/sitblog/register').post(async (req, res) => {
  let user = req.body
  try{
    user.name = checkAndTrimString(user.name, "user's name")
    user.username = checkAndTrimString(user.username, "username")
    user.password = checkAndTrimString(user.password, "password")
    if (user.password.length < 6){
      throw `Password must be at least 6 characters`
    }
    const userCollection = await users()
    const matchingUser = await userCollection.findOne({ username: user.username });
    if(matchingUser){
      throw `User already exists`
    }
    let complete = await registerUser(
      user.name,  
      user.username, 
      user.password
    )
    if (complete){
      res.status(200).json(complete)
    }
    else{
      res.status(500).json({error: "Internal Server Error"})
    }
  }catch(e){
    res.status(400).json({error:e})
  }
});

router.route('/sitblog/signin').post(async (req, res) => {
  let user = req.body
  try{
    user.username = checkAndTrimString(user.username, "username")
    user.password = checkAndTrimString(user.password, "password")
    if (user.password.length < 6){
      throw `Password must be at least 6 characters`
    }
    let complete = await signinUser(
      user.username, 
      user.password
    )
    if (complete){
      req.session.user = complete
      res.status(200).json(complete)
    }
    else{
      res.status(500).json({error: "Internal Server Error"})
    }
  }catch(e){
    res.status(400).json({error:e})
  }
});

router.route('/sitblog/logout').get(async (req, res) => {
  try{
    req.session.destroy();
    return res.status(200).json("Logged out")
  }catch(e){
    res.status(500).json({error:e})
  }
});

router
  .route('/sitblog/:id')
  .get(async (req, res) => {
    //code here for GET
    let blogId = undefined
    try { //check id 
      blogId = checkAndTrimString(req.params.id, 'blogId');
      if (!ObjectId.isValid(blogId)) throw `blogid is invalid object ID`;
    } catch (e) {
      return res.status(400).json({error: e});
    }
    try{
      const blog = await getBlog(blogId)
      return res.status(200).json({blog})
    }catch(e){
      res.status(404).json({error: e});
    }

  })
  .put(async (req, res) => {
    let updates = req.body
    let blogId = req.params.id
    let user = undefined
    try{ 
      //check req.body
      if(!updates.blogTitle || !updates.blogBody){
        throw `Must provide an update to blog`
      }
      updates.blogTitle = checkAndTrimString(updates.blogTitle, "updated blog title")
      updates.blogBody = checkAndTrimString(updates.blogBody, "updated blog body")
      //check id
      blogId = checkAndTrimString(req.params.id, 'blogId');
      if (!ObjectId.isValid(blogId)) throw `blogid is invalid object ID`;

      //check user
      user = req.session.user
      if (!user){
        return res.status(401).json({error: 'Must be logged in to update a blog'});
      }
      let blog = await getBlog(blogId)
      if (user._id !== blog.userThatPosted._id.toString() || user.username !== blog.userThatPosted.username){
        return res.status(403).json({error: 'Must be logged in the correct account to update'})
      }
    }catch(e){
      return res.status(400).json({error:e})
    }
    try{
      let complete = await putBlog(
        updates.blogTitle,
        updates.blogBody,
        blogId
      )
      if (complete){
        res.status(200).json(complete)
      }
      else{
        res.status(500).json({error: "Internal Server Error"})
      }
    }catch(e){
      res.status(400).json({error:e})
    }
    
  })
  .patch(async (req, res) => {
    let updates = req.body
    let blogId = req.params.id
    let user = undefined
    try{ 
      //check req.body
      if(updates.blogTitle){
        updates.blogTitle = checkAndTrimString(updates.blogTitle, "updated blog title")
      }
      if(updates.blogBody){
        updates.blogBody = checkAndTrimString(updates.blogBody, "updated blog body")
      }
      if(!updates.blogBody && !updates.blogTitle){
        throw `Must update either blogBody or blogTitle`
      }
      //check id
      blogId = checkAndTrimString(req.params.id, 'blogId');
      if (!ObjectId.isValid(blogId)) throw `blogid is invalid object ID`;

      //check user
      user = req.session.user
      if (!user){
        return res.status(401).json({error: 'Must be logged in to update a blog'});
      }
      let blog = await getBlog(blogId)
      if (user._id !== blog.userThatPosted._id.toString() || user.username !== blog.userThatPosted.username){
        return res.status(403).json({error: 'Must be logged in the correct account to update'})
      }
    }catch(e){
      return res.status(400).json({error:e})
    }
    try{
      let complete = await patchBlog(
        updates.blogTitle,
        updates.blogBody,
        blogId
      )
      if (complete){
        res.status(200).json(complete)
      }
      else{
        res.status(500).json({error: "Internal Server Error"})
      }
    }catch(e){
      res.status(400).json({error:e})
    }
    
  });

router
  .route('/sitblog')
  .get(async (req, res) => {
    try{
      let skip = undefined
      let limit = undefined
      if(req.query.skip){
        if(/^\d+$/.test(req.query.skip)){//if string rep of int
          skip = parseInt(req.query.skip)
        }else{
          throw `skip must be a non-negative int`
        }
      }else{
        skip = 0
      }
      if(req.query.limit){
        if(/^\d+$/.test(req.query.limit)){//if string rep of int
          limit = parseInt(req.query.limit)
        }else{
          throw `limit must be a non-negative int`
        }
      }else{
        limit = 20
      }

      //limit 100
      if (limit > 100) {
        limit = 100
      }
      
      const blogList = await showBlogs(skip, limit);
      return res.status(200).json(blogList);

    }catch(e){
      return res.status(400).json({error: e});
    }
  })
  .post(async (req, res) => {
    let blog = req.body
    let user = undefined
    try{ //check req.body
      if(!blog.blogTitle || !blog.blogBody){
        throw `Missing parameters`
      }
      user = req.session.user
      if (!user){
        return res.status(401).json({error: 'Must be logged in to create blog'});
      }      
    }catch(e){
      return res.status(400).json({error:e})
    }
    try{
      let complete = await createBlog(
        blog.blogTitle,
        blog.blogBody,
        user.username,
        user._id
      )
      if (complete){
        res.status(200).json(complete)
      }
      else{
        res.status(500).json({error: "Internal Server Error"})
      }
    }catch(e){
      res.status(400).json({error:e})
    }
  });

export default router;
