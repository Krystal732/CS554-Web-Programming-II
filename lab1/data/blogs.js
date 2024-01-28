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
  if (limit > 100){ //limit 100
    limit = 100
  }
  const blogsCollection = await blogs()
  const blogList = await blogsCollection.find().skip(skip).limit(limit).toArray();
  return blogList
};

export const getBlog = async (blogId) =>{
  let id = checkAndTrimString(blogId, "blog")
  if (!ObjectId.isValid(id)) throw `invalid object ID`;
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
    throw 'Could not add review';
  }
  const newId = insertInfo.insertedId.toString();
  const blog = await reviewCollection.findOne({_id: new ObjectId(newId)});
  return blog
};

export const putBlog = async () =>{

};

export const patchBlog = async() =>{

};

export const postComment = async(id) =>{

};

export const deleteComment = async(blogId) => {

};


export const registerUser = async (
  username,
  password
) => {

};

export const signinUser = async (username, password) => {

};

