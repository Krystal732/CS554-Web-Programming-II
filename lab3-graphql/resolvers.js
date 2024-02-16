import {GraphQLError} from 'graphql';
import redis from 'redis'
import {ObjectId} from 'mongodb';

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
function checkAndTrimString(s, varName) {
  if (typeof s !== "string") {
    throw new GraphQLError (`${varName} is not a string`)
  }
  s = s.trim()
  if(s.length === 0){
      throw new GraphQLError (`String must not be empty`)
  }
  return s
}

function checkIsNumber(val, varName) {
  if (typeof val !== "number") {
    throw new GraphQLError (`${varName } is not a number`)
  }

  if (isNaN(val)) {
    throw new GraphQLError (`${varName }  is not a number`)
  }

  if(val === Infinity || val === -Infinity){
    throw new GraphQLError (`${varName} is not a finite number`)
  }
}
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
      args._id = checkAndTrimString(args._id, "artistID")
      if (!ObjectId.isValid(args._id)){
        throw new GraphQLError(`artist ID is invalid object ID`)
      } 

      let exists = await client.exists(args._id); 
      let artist = undefined
      if (exists){
        artist = await client.get(args._id)// from cache
      }else{
        const artists = await artistsCollection();
        artist = await artists.findOne({_id: new ObjectId(args._id)});
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
      args._id = checkAndTrimString(args._id, "albumID")
      if (!ObjectId.isValid(args._id)){
        throw new GraphQLError(`album ID is invalid object ID`)
      } 

      let exists = await client.exists(args._id); 
      let album = undefined
      if (exists){
        album = await client.get(args._id)// from cache
      }else{
        const albums = await albumsCollection();
        album = await albums.findOne({_id: new ObjectId(args._id)});
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
      args._id = checkAndTrimString(args._id, "companyID")
      if (!ObjectId.isValid(args._id)){
        throw new GraphQLError(`artist ID is invalid object ID`)
      } 

      let exists = await client.exists(args._id); 
      let company = undefined
      if (exists){
        company = await client.get(args._id)// from cache
      }else{
        const companies = await companiesCollection();
        company = await companies.findOne({_id: new ObjectId(args._id)});
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
    getSongsByArtistId: async (_, args) => { //get all albums by artist id then return list of all songs
      args._id = checkAndTrimString(args._id)
      if (!ObjectId.isValid(args._id)){
        throw new GraphQLError(`artistID is invalid object ID`)
      } 
      let exists = await client.exists("songs:"+args.artistId)
      let songs = []
      if (exists){
        songs = await client.get("songs:"+args.artistId)
      }else{
        const albums = await albumsCollection()
        let artistsAlbums = albums.find({ artistId: new ObjectId(args.artistId) })
        if (!artistsAlbums) {
          //can't find the albums by artist
          throw new GraphQLError('Artist does not have albums', {
            extensions: {code: 'NOT_FOUND'}
          });
        }
        artistsAlbums.forEach(album => {songs = songs.concat(album.songs)})
        await client.lPush("songs:"+args.artistId, songs) //save to cache
        await client.expire("songs:"+args.artistId, 3600) //expire in 1 hour

      }
      return songs
    },
    albumsByGenre: async (_, args) => {//check albums and get ones w mathcing genre
      args.genre = checkAndTrimString(args.genre, "genre")
      args.genre = args.genre.toUpperCase()
      let exists = await client.exists(args.genre)
      let albumsList = []
      if (exists){
        albumsList = await client.get(args.genre)
      }else{
        const albums = await albumsCollection()
        albumsList = albums.find({genre: args.genre})
        if (!artistsAlbums) {
          //can't find the albums with genre
          throw new GraphQLError('No albums found with that genre', {
            extensions: {code: 'NOT_FOUND'}
          });
        }
        await client.lPush(args.genre, albumsList) //save to cache
        await client.expire(args.genre, 3600) //expire in 1 hour
      }
      return albumsList
    },
    companyByFoundedYear: async (_, args) => {
      args.min = checkIsNumber(args.min, "min year")
      if(!Number.isInteger(args.min) || args.min <1900){
        throw new GraphQLError('Min Year must be int greater or equal to 1900')
      }

      args.max = checkIsNumber(args.max, "max year")
      if(!Number.isInteger(args.max) || args.max <args.min || args.max > 2024){
        throw new GraphQLError('Max year must be int greater than min year and less than 2025')
      }
      let exists = await client.exists("min"+args.min.toString()+"max"+args.max.toString())
      let companiesList = []
      if (exists){
        companiesList = await client.get("min"+args.min.toString()+"max"+args.max.toString())
      }else{
        const companies = await companiesCollection()
        companiesList = companies.find({foundedYear: {$gte: args.min, $lte: args.max}})
        if (!companiesList) {
          //can't find the companies between those years
          throw new GraphQLError('No comapnies found with that year range', {
            extensions: {code: 'NOT_FOUND'}
          });
        }
        await client.lPush("min"+args.min.toString()+"max"+args.max.toString(), companiesList)
        await client.expire("min"+args.min.toString()+"max"+args.max.toString(), 3600)
      }
      return companiesList
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
