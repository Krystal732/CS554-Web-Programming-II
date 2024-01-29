// This file should set up the express server as shown in the lecture code
import express from 'express';
const app = express();
import configRoutes from './routes/index.js';
import cookieParser from 'cookie-parser';

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
    }else{
        return res.status(404).json({error: 'req method must be post for this route'})
    }
    next()
})
app.use('/sitblog/:blogId/:commentId', async (req, res, next) => {
    if(req.method === 'DELETE'){
        if(!req.session.user){
            return res.status(401).json({error: 'Must be logged in to delete comment'});
        }
    }else{
        return res.status(404).json({error: 'req method must be delete for this path'})
    }
    next()
})
app.use('/sitblog/register', async (req, res, next) => {
    if(req.method !== 'POST'){
        return res.status(404).json({error: 'req method must be post for this route'})
    }
    next()
})

app.use('/sitblog/signin', async (req, res, next) => {
    if(req.method !== 'POST'){
        return res.status(404).json({error: 'req method must be post for this route'})
    }
    next()
})

app.use('/sitblog/logout', async (req, res, next) => {
    if(req.method !== 'GET'){
        return res.status(404).json({error: 'req method must be GET for this route'})
    }
    next()
})

app.use('/sitblog/:id', async (req, res, next) => {
    if(req.originalUrl !== '/sitblog/logout' && req.originalUrl !== '/sitblog/signin' && req.originalUrl !== '/sitblog/register'){ //trigger ony if not register, login, or logout

        if(req.method === 'GET' || req.method === 'PUT' || req.method === 'PATCH'){
            if(!req.session.user){
                return res.status(401).json({error: 'Must be logged in to get or edit blog'});
            }    
        }else{
            return res.status(404).json({error: 'req method must be get, put, or patch for this path'})
        }
    }
    next()
})

app.use('/sitblog', async (req, res, next) => {
    if(req.originalUrl === '/sitblog'){ //trigger ony if /sitblog is the endpoint (not subpath)
        if(req.method === 'POST'){
            if(!req.session.user){
                return res.status(401).json({error: 'Must be logged in to create blog'});
            }
        
        }else{
            return res.status(404).json({error: 'req method must be get or post for this path'})
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
