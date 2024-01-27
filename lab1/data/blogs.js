//import mongo collections, bcrypt and implement the following data functions
import {users, blogs} from '../config/mongoCollections.js'
import bcrypt from 'bcryptjs';

export const showBlogs = async(skip, limit = 20) =>{
  const blogsCollection = await blogs()
  
};

export const getBlog = async (id) =>{

};

export const createBlog = async (
  blogTitle,
  blogBody,
  username,
  id
) => {

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

