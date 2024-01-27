// This file should set up the express server as shown in the lecture code
import express from 'express';
const app = express();
import configRoutes from './routes/index.js';
import cookieParser from 'cookie-parser';
// import exphbs from 'express-handlebars';

// import {fileURLToPath} from 'url';
// import {dirname} from 'path';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

import session from 'express-session'
app.use(session({
    name: 'AuthState',
    secret: 'some secret string!',
    resave: false,
    saveUninitialized: false
  }))

  
// const handlebarsInstance = exphbs.create({
//     defaultLayout: 'main',
//   });


// const staticDir = express.static(__dirname + '/public');

// app.use('/public', staticDir);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/sitblog/:id/comments', async (req, res, next) => {
    if(req.session.user){
        if(req.method === 'POST'){
            next()
        }
        // if((req.method === 'DELETE' && req.session.user) CHECK IF USER MATCHES IN MIDDLEWARE?
    }else{
        return res.status(401).json({error: 'Must be logged in to write a comment'});
    }
    next()
})
app.use('/sitblog/:blogId/:commentId', async (req, res, next) => {
    if(req.session.user){
        if(req.method === 'DELETE'){
            next()
        }
        // if((req.method === 'DELETE' && req.session.user) CHECK IF USER MATCHES IN MIDDLEWARE?
    }else{
        return res.status(401).json({error: 'Must be logged in to delete comment'});
    }
    next()
})

app.use('/sitblog', async (req, res, next) => {
    if(req.session.user){
        if(req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH'){
            next()
        }
        // if((req.method === 'PUT' || req.method === 'PATCH') && req.session.user) CHECK IF USER MATCHES IN MIDDLEWARE?
    }else{
        return res.status(401).json({error: 'Must be logged in to create or edit blog'});
    }
    next()
})
// app.engine('handlebars', handlebarsInstance.engine);
// app.set('view engine', 'handlebars');
app.use(express.json());

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
