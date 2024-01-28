//import express, express router as shown in lecture code
import {Router} from 'express';
const router = Router();
import {showBlogs, createBlog, getBlog, putBlog, patchBlog, postComment, deleteComment, registerUser, signinUser, checkAndTrimString} from '../data/blogs.js'
import {ObjectId} from 'mongodb';


router
  .route('/sitblog')
  .get(async (req, res) => {
    try{
      const skip = parseInt(req.query.skip) || 0
      const limit = parseInt(req.query.limit) || 20

      //limit 100
      if (limit > 100) {
        limit = 100
      }
      const blogList = await showBlogs(skip, limit);
      res.status(200).json(blogList);

    }catch(e){
      res.status(500).json({error: e});
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
        res.status(200).json({complete})
      }
      else{
        res.status(500).json({error: "Internal Server Error"})
      }
    }catch(e){
      res.status(400).json({error:e})
    }
  });

router
  .route('/sitblog/:id')
  .get(async (req, res) => {
    //code here for GET
    let blogId = undefined
    try { //check id 
      blogId = checkAndTrimString(req.params.id, 'blogId');
      if (!ObjectId.isValid(blogId)) throw `invalid object ID`;
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
    
  })
  .patch(async (req, res) => {
    
  });


router.route('/sitblog/:id/comments').post(async (req, res) => {
  
});

router.route('/sitblog/:blogId/:commentId').delete(async (req, res) => {
  
});

router.route('/sitblog/register').post(async (req, res) => {
  
});

router.route('/sitblog/signin').post(async (req, res) => {
  
});

router.route('/sitblog/logout').get(async (req, res) => {
  try{
    res.clearCookie('AuthState');
    // req.session('destroy')
  }catch(e){
    res.status(500).json({error:e})
  }
});
export default router;
