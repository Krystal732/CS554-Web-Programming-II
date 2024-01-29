// This file should set up the express server as shown in the lecture code
import express from 'express';
const app = express();
import configRoutes from './routes/index.js';
import cookieParser from 'cookie-parser';

import { getBlog, checkAndTrimString} from './data/blogs.js';
import {ObjectId} from 'mongodb';


import session from 'express-session'
app.use(session({
    name: 'AuthState',
    secret: 'some secret string!',
    resave: false,
    saveUninitialized: false
  }))


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/sitblog/:id/comments', async (req, res, next) => {
    if(req.method === 'POST'){
        if(!req.session.user){
            return res.status(401).json({error: 'Must be logged in to write a comment'});
        }
    }
    next()
})
app.use('/sitblog/:blogId/:commentId', async (req, res, next) => {
    if(req.method === 'DELETE'){
        if(!req.session.user){
            return res.status(401).json({error: 'Must be logged in to delete comment'});
        }
        // let blogId = req.params.id
        // let commentId = req.params.commentId

        // commentId = checkAndTrimString(commentId)
        // if (!ObjectId.isValid(commentId)) throw `commentId is invalid object ID`;

        // blogId = checkAndTrimString(req.params.id, 'blogId');
        // if (!ObjectId.isValid(blogId)) throw `blogId is invalid object ID`;

        // let blog = await getBlog(blogId)
        // let matchingComment = blog.comments.find(comment => comment._id === commentId);
        // if(!matchingComment){
        //     throw `Comment does not exist`
        // }
        // if(matchingComment.userThatPostedComment._id !== new ObjectId(user._id) || matchingComment.userThatPostedComment.username !== user.username){
        //     return res.status(403).json({error: 'Must be logged in the correct account to delete comment'})
        // }
    }
    next()
})

app.use('/sitblog', async (req, res, next) => {
    if(req.url === '/sitblog'){ //trigger ony if /sitblog is the endpoint (not subpath)
        if(req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH'){
            if(!req.session.user){
                return res.status(401).json({error: 'Must be logged in to create or edit blog'});
            }
        
        }
    }
    next()
})

app.use(express.json());

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
