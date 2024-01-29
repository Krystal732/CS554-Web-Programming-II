//import mongo collections, bcrypt and implement the following data functions
import {users, blogs} from '../config/mongoCollections.js'
import bcrypt from 'bcryptjs';
import {ObjectId} from 'mongodb';

 export function checkAndTrimString(s, varName) {
  if (typeof s !== "string") {
    throw `${varName || 'provided variable'} is not a string`;
  }
  s = s.trim()
  if(s.length === 0){
      throw `String must not be empty`
  }
  return s
}


export const showBlogs = async(skip = 0, limit = 20) =>{
  if(typeof skip !== 'number' || typeof limit !== 'number'){
    throw `skip and limit must be type number`
  }
  if(!Number.isInteger(skip) || !Number.isInteger(limit)){
    throw `skip and limit must be integers`
  }
  if(skip < 0 || limit < 0){
    throw 'Skip and limit must be non-negative numbers'
  }
  if (limit > 100){ //limit 100
    limit = 100
  }
  
  const blogsCollection = await blogs()
  const blogList = await blogsCollection.find().skip(skip).limit(limit).toArray();
  return blogList
};

export const getBlog = async (blogId) =>{
  let id = checkAndTrimString(blogId, "blog")
  if (!ObjectId.isValid(id)) throw `blogid is invalid object ID`;
  const blogsCollection = await blogs()
  const blog = await blogsCollection.findOne({_id: new ObjectId(id)})
  if (blog === null) throw `No blog with that id`;
  blog._id = blog._id.toString();
  return blog;
};

export const createBlog = async (
  blogTitle,
  blogBody,
  username,
  id
) => {
  blogTitle = checkAndTrimString(blogTitle, "blog title")
  blogBody = checkAndTrimString(blogBody, "blog body")
  username = checkAndTrimString(username, "username")
  id = checkAndTrimString(id, "user id")
  if (!ObjectId.isValid(id)) throw `invalid object ID for user`;

  let newBlog = {
    blogTitle: blogTitle,
    blogBody: blogBody,
    userThatPosted: {_id: new ObjectId(id), username: username},
    comments: []
  }

  const blogsCollection = await blogs()
  const insertInfo = await blogsCollection.insertOne(newBlog);
	if (!insertInfo.acknowledged || !insertInfo.insertedId){
    throw 'Could not add blog';
  }
  const newId = insertInfo.insertedId.toString();
  const blog = await blogsCollection.findOne({_id: new ObjectId(newId)});
  return blog
};

export const putBlog = async (newBlogTitle, newBlogBody, blogId) =>{
  newBlogTitle = checkAndTrimString(newBlogTitle)
  newBlogBody = checkAndTrimString(newBlogBody)
  blogId = checkAndTrimString(req.params.id, 'blogId');
  if (!ObjectId.isValid(blogId)) throw `blogid is invalid object ID`;

  const newBlog = {
    blogTitle: newBlogTitle,
    blogBody: newBlogBody
  }

  const blogsCollection = await blogs()
  const updatedInfo = await blogsCollection.findOneAndUpdate(
    {_id: new ObjectId(blogId)},
    {$set: newBlog},
    {returnDocument: 'after'}
  );
  
  if (!updatedInfo) {
    throw `could not update blog successfully`;
  }
  updatedInfo._id = updatedInfo._id.toString();
  return updatedInfo;

};

export const patchBlog = async(newBlogTitle, newBlogBody, blogId) =>{
  blogId = checkAndTrimString(req.params.id, 'blogId');
  if (!ObjectId.isValid(blogId)) throw `blogid is invalid object ID`;

  const newBlog = {}
  if (newBlogTitle !== undefined) {
    newBlogTitle = checkAndTrimString(newBlogTitle)
    newBlog.blogTitle = newBlogTitle
  }
  if (newBlogBody !== undefined) {
    newBlogBody = checkAndTrimString(newBlogBody)
    newBlog.blogBody = newBlogBody
  }

  const blogsCollection = await blogs()
  const updatedInfo = await blogsCollection.findOneAndUpdate(
    {_id: new ObjectId(blogId)},
    {$set: newBlog},
    {returnDocument: 'after'}
  );
  
  if (!updatedInfo) {
    throw `could not update blog successfully`;
  }
  updatedInfo._id = updatedInfo._id.toString();
  return updatedInfo;

};

export const postComment = async(blogId, 
  comment, 
  userID, 
  username) =>{
  blogId = checkAndTrimString(req.params.id, 'blogId');
  if (!ObjectId.isValid(blogId)) throw `blogId is invalid object ID`;

  comment = checkAndTrimString(comment)
  username = checkAndTrimString(username)

  userID = checkAndTrimString(userID)
  if (!ObjectId.isValid(userID)) throw `userId is invalid object ID`;

  const newComment = {
    _id: new ObjectId(),
    userThatPostedComment: {_id: new ObjectId(userID), username: string},
    comment: comment
  }

  const blogsCollection = await blogs()
  const updatedInfo = await blogsCollection.findOneAndUpdate(
    {_id: new ObjectId(blogId)},
    {$push: {comments: newComment}},
    {returnDocument: 'after'}
  );
  
  if (!updatedInfo) {
    throw `could not update blog successfully`;
  }
  updatedInfo._id = updatedInfo._id.toString();
  return updatedInfo;
  
};

export const deleteComment = async(blogId, commentId) => {
  blogId = checkAndTrimString(req.params.id, 'blogId');
  if (!ObjectId.isValid(blogId)) throw `blogId is invalid object ID`;

  commentId = checkAndTrimString(req.params.id, 'commentId');
  if (!ObjectId.isValid(commentId)) throw `commentId is invalid object ID`;

  const blogsCollection = await blogs()

  const updatedInfo = await blogsCollection.findOneAndUpdate(
    { _id: new ObjectId(blogId) },
    { $pull: { comments: { _id: commentId } } },
    { returnDocument: 'after' }
  );

  if (!updatedInfo) {
    throw `Could not find the blog with ID ${blogId}`
  }

  updatedInfo._id = updatedInfo._id.toString()
  return updatedInfo
};


export const registerUser = async (
  name,
  username,
  password
) => {
  name = checkAndTrimString(name, "name")
  username = checkAndTrimString(username, "username")
  password = checkAndTrimString(password, "password")
  if (password.length < 6){
    throw `Password must be at least 6 characters`
  }

  let saltRounds = 16
  const hash = await bcrypt.hash(password, saltRounds);

  const newUser = {
    name: name,
    username: username,
    password: hash
  }
  
  const userCollection = await users()
  const insertInfo = await userCollection.insertOne(newUser);
	if (!insertInfo.acknowledged || !insertInfo.insertedId){
    throw 'Could not add user';
  }
  const newId = insertInfo.insertedId.toString();
  const user = await userCollection.findOne({_id: new ObjectId(newId)});
  const userSansPassword = {
    _id: user._id,
    name: user.name,
    username: user.username,
  };
  
  return userSansPassword;
};

export const signinUser = async (username, password) => {
  username = checkAndTrimString(username)
  password = checkAndTrimString(password)
  if (password.length < 6){
    throw `Password must be at least 6 characters`
  }
  //find username
  const userCollection = await users()
  const user = await userCollection.findOne({username: username});
  if(user === null){
    throw `Either the user or password is invalid`
  }

  //check hashed passowrd
  if(!(await bcrypt.compare(password, user.password))){
    throw `Either the username or password is invalid`
  }

  const userSansPassword = {
    _id: user._id,
    name: user.name,
    username: user.username,
  };
  
  return userSansPassword;
};

