import {GraphQLError} from 'graphql';
import redis from 'redis'
const client = redis.createClient();
client.connect().then(() => {});


import {
  artists as artistsCollection,
  albums as albumsCollection,
  recordcompanies as companiesCollection,
} from './config/mongoCollections.js';

import {v4 as uuid} from 'uuid'; //for generating _id's

/* parentValue - References the type def that called it
    so for example when we execute numOfEmployees we can reference
    the parent's properties with the parentValue Paramater
*/

/* args - Used for passing any arguments in from the client
    for example, when we call 
    addEmployee(firstName: String!, lastName: String!, employerId: Int!): Employee
		
*/

export const resolvers = {
  Query: {
    artists: async () => { //array of all artists
      let exists = await client.exists('allArtists'); 
      let allArtists = undefined
      if (exists){
        allArtists = await client.get('allArtists'); //from cache
      }else{
        const artists = await artistsCollection()
        allArtists = await artists.find().toArray();
        if (!allArtists) {
          //Could not get list
          throw new GraphQLError(`Internal Server Error`, {
            extensions: {code: 'INTERNAL_SERVER_ERROR'}
          });
        }
        await client.set('allArtists', allArtists) //add to cache
        await client.expire('allArtists', 3600) //expire in 1 hour
      }
      return allArtists
    },
    albums: async () => {//array of all albums
      let exists = await client.exists('allAlbums'); 
      let allAlbums = undefined
      if (exists){
        allAlbums = await client.get('allAlbums'); //from cache
      }else{
        const albums = await albumsCollection()
        allAlbums = await albums.find().toArray();
        if (!allAlbums) {
          //Could not get list
          throw new GraphQLError(`Internal Server Error`, {
            extensions: {code: 'INTERNAL_SERVER_ERROR'}
          });
        }
        await client.set('allAlbums', allAlbums) //add to cache
        await client.expire('allAlbums', 3600) //expire in 1 hour
      }
      return allAlbums
    },
    recordcompanies: async() => {
      let exists = await client.exists('allCompanies'); 
      let allCompanies = undefined
      if (exists){
        allCompanies = await client.get('allCompanies'); //from cache
      }else{
        const companies = await companiesCollection()
        allCompanies = await companies.find().toArray();
        if (!allCompanies) {
          //Could not get list
          throw new GraphQLError(`Internal Server Error`, {
            extensions: {code: 'INTERNAL_SERVER_ERROR'}
          });
        }
        await client.set('allCompanies', allCompanies) //add to cache
        await client.expire('allCompanies', 3600) //expire in 1 hour
      }
      return allCompanies
    },
    getArtistById: async (_, args) => {
      let exists = await client.exists(args._id); 
      let artist = undefined
      if (exists){
        artist = await client.get(args._id)// from cache
      }else{
        const artists = await artistsCollection();
        artist = await artists.findOne({_id: args._id});
        if (!artist) {
          //can't find the artist
          throw new GraphQLError('Artist Not Found', {
            extensions: {code: 'NOT_FOUND'}
          });
        }
        await client.set(args._id, artist) //add to cache

      }
      return artist;
    },
    getAlbumById: async (_, args) => {
      let exists = await client.exists(args._id); 
      let album = undefined
      if (exists){
        album = await client.get(args._id)// from cache
      }else{
        const albums = await albumsCollection();
        album = await albums.findOne({_id: args._id});
        if (!album) {
          //can't find the album
          throw new GraphQLError('Album Not Found', {
            extensions: {code: 'NOT_FOUND'}
          });
        }
        await client.set(args._id, album) //add to cache

      }
      return album;

    },
    getCompanyById: async (_, args) => {
      let exists = await client.exists(args._id); 
      let company = undefined
      if (exists){
        company = await client.get(args._id)// from cache
      }else{
        const companies = await companiesCollection();
        company = await companies.findOne({_id: args._id});
        if (!company) {
          //can't find the company
          throw new GraphQLError('Company Not Found', {
            extensions: {code: 'NOT_FOUND'}
          });
        }
        await client.set(args._id, company) //add to cache

      }
      return company;

    },
    getSongsByArtistId: async (_, args) => { //get all albums from artist id then return list of all songs

    },
    albumsByGenre: async (_, args) => {

    },
    companyByFoundedYear: async (_, args) => {

    },
    searchArtistByArtistName: async (_, args) => {

    },
  },
  Artist: {
    albums: async (parentValue) => { //get lsit of albums by aritst
      const albums = await albumsCollection();
      const albumsList = await albums.find({
        artistId: parentValue._id
      }).toArray();
      return albumsList;
    }
  },
  Album: {
    artist: async (parentValue) => { //get artist that made album
      const artists = await artistsCollection();
      const artist = await artists.findOne({_id: parentValue.artistId});
      return artist;
    },
    recordcompany: async (parentValue) => { //get record company that distributed album
      const companies = await companiesCollection();
      const company = await companies.findOne({_id: parentValue.recordCompanyId});
      return company;
    }
  },
  RecordCompany: {
    albums: async (parentValue) => { //get lsit of albums distributed by company
      const albums = await albumsCollection();
      const albumsList = await albums.find({
        companyId: parentValue._id
      }).toArray();
      return albumsList;
    }
  },
  Mutation: {
    addArtist: async (_, args) => {

    },
    editArtist: async (_, args) => {

    },
    removeArtist: async (_, args) => {

    },
    addCompany: async (_, args) => {

    },
    editCompany: async (_, args) => {

    },
    removeCompany: async (_, args) => {

    },
    addAlbum: async (_, args) => {

    },
    editAlbum: async (_, args) => {

    },
    removeAlbum: async (_, args) => {

    }
  }
};
