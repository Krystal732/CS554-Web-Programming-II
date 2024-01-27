//import express, express router as shown in lecture code
import {Router} from 'express';
const router = Router();
import {createBlog} from '../data/blogs.js'


router
  .route('/sitblog')
  .get(async (req, res) => {
    //code here for GET
    try{

    }catch(e){
      res.status(500).json({error: e});
    }

  })
  .post(async (req, res) => {
    //code here for POST
    let blog = req.body
    let user = undefined
    // console.log(user)
    try{ //check req.body
      if(!blog.blogTitle || !blog.blogBody){
        throw `Missing parameters`
      }
      user = req.session.user
      
    }catch(e){
      // console.log("error:",e)
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
    try{

    }catch(e){
      res.status(500).json({error: e});
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
