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
    throw new GraphQLError (`${varName} is not a string`, {
      extensions: {code: 'BAD_USER_INPUT'}
    })
  }
  s = s.trim()
  if(s.length === 0){
      throw new GraphQLError (`String must not be empty`, {
        extensions: {code: 'BAD_USER_INPUT'}
      })
  }
  return s
}

function checkIsNumber(val, varName) {
  if (typeof val !== "number") {
    throw new GraphQLError (`${varName } is not a number`, {
      extensions: {code: 'BAD_USER_INPUT'}
    })
  }

  if (isNaN(val)) {
    throw new GraphQLError (`${varName }  is not a number`, {
      extensions: {code: 'BAD_USER_INPUT'}
    })
  }

  if(val === Infinity || val === -Infinity){
    throw new GraphQLError (`${varName} is not a finite number`, {
      extensions: {code: 'BAD_USER_INPUT'}
    })
  }
}

function isValidDate(dateString)
{
  // Source:
  //https://stackoverflow.com/questions/6177975/how-to-validate-date-with-format-mm-dd-yyyy-in-javascript
    // First check for the pattern
    if(!/^(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01])\/\d{4}$/.test(dateString))
        return false;

    // Parse the date parts to integers
    var parts = dateString.split("/");
    var day = parseInt(parts[1], 10);
    var month = parseInt(parts[0], 10);
    var year = parseInt(parts[2], 10);

    // Check the ranges of month and year
    if(year < 1000 || year > 3000 || month == 0 || month > 12)
        return false;

    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    // Adjust for leap years
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
};

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
    recordCompanies: async() => {
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
        throw new GraphQLError(`artist ID is invalid object ID`), {
          extensions: {code: 'BAD_USER_INPUT'}
        }
      } 

      let exists = await client.exists(args._id); 
      let artist = undefined
      if (exists){
        artist = await client.get(args._id)// from cache
      }else{
        const artists = await artistsCollection();
        artist = await artists.findOne({_id: ObjectId(args._id)});
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
        throw new GraphQLError(`album ID is invalid object ID`, {
          extensions: {code: 'BAD_USER_INPUT'}
        })
      } 

      let exists = await client.exists(args._id); 
      let album = undefined
      if (exists){
        album = await client.get(args._id)// from cache
      }else{
        const albums = await albumsCollection();
        album = await albums.findOne({_id: ObjectId(args._id)});
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
        throw new GraphQLError(`artist ID is invalid object ID`, {
          extensions: {code: 'BAD_USER_INPUT'}
        })
      } 

      let exists = await client.exists(args._id); 
      let company = undefined
      if (exists){
        company = await client.get(args._id)// from cache
      }else{
        const companies = await companiesCollection();
        company = await companies.findOne({_id:  ObjectId(args._id)});
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
        throw new GraphQLError(`artistID is invalid object ID`, {
          extensions: {code: 'BAD_USER_INPUT'}
        })
      } 
      let exists = await client.exists("songs:"+args.artistId)
      let songs = []
      if (exists){
        songs = await client.get("songs:"+args.artistId)
      }else{
        const albums = await albumsCollection()
        let artistsAlbums = albums.find({ artistId:  ObjectId(args.artistId) })
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
        throw new GraphQLError('Min Year must be int greater or equal to 1900', {
          extensions: {code: 'BAD_USER_INPUT'}
        })
      }

      args.max = checkIsNumber(args.max, "max year")
      if(!Number.isInteger(args.max) || args.max <args.min || args.max > 2024){
        throw new GraphQLError('Max year must be int greater than min year and less than 2025', {
          extensions: {code: 'BAD_USER_INPUT'}
        })
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
      if (!albumsList) {
        //can't find albums by the artist
        throw new GraphQLError('No albums found for that artist', {
          extensions: {code: 'NOT_FOUND'}
        });
      }
      return albumsList;
    },
    numOfAlbums: async(parentValue) => {
      const artists = await artistsCollection()
      let artist = await artists.findOne({_id: parentValue._id})
      if (!artist) {
        //can't find the artist from the id
        throw new GraphQLError('No artist with that Id', {
          extensions: {code: 'NOT_FOUND'}
        });
      }
      return artist.albums.length
    }
  },
  Album: {
    artist: async (parentValue) => { //get artist that made album
      const artists = await artistsCollection();
      const artist = await artists.findOne({_id: parentValue.artist._id});
      return artist;
    },
    recordCompany: async (parentValue) => { //get record company that distributed album
      const companies = await companiesCollection();
      const company = await companies.findOne({_id: parentValue.recordCompany._id});
      return company;
    }
  },
  RecordCompany: {
    albums: async (parentValue) => { //get lsit of albums distributed by company
      const albums = await albumsCollection();
      const albumsList = await albums.find({
        recordCompany: parentValue
      }).toArray();
      return albumsList;
    },
    numOfAlbums: async(parentValue) => {
      const companies = await companiesCollection()
      let company = await companies.findOne({_id: parentValue._id})
      if (!company) {
        //can't find the company from the id
        throw new GraphQLError('No company with that Id', {
          extensions: {code: 'NOT_FOUND'}
        });
      }
      return company.albums.length
    }
  },
  Mutation: {
    addArtist: async (_, args) => {
      const artists = await artistsCollection();
      args.name = checkAndTrimString(args.name, "artist name")
      args.dateFormed = checkAndTrimString(args.dateFormed, "date formed")
      if(!isValidDate(args.dateFormed)){
        throw new GraphQLError(
          `Date is not in valid format`,
          {
            extensions: {code: 'BAD_USER_INPUT'}
          })
      }
      if (!Array.isArray(args.members)) {
        throw new GraphQLError(
          `Members is not an array`,
          {
            extensions: {code: 'BAD_USER_INPUT'}
          })
      }
      args.members.forEach(member => {
        member = checkAndTrimString(member)
        if (!/^[a-zA-Z]+$/.test(member)) {
          throw new GraphQLError(
            `Member ${member} must only contain letters`,
            {
              extensions: {code: 'BAD_USER_INPUT'}
            })
        }
      });

      const newArtist = {
        _id: new ObjectId(),
        name: args.name,
        dateFormed: args.dateFormed,
        memebers: args.members,
        albums: [],
        numOfAlbums: 0
      };
     
      let insertedArtist = await artists.insertOne(newArtist);
      if (!insertedArtist.acknowledged || !insertedArtist.insertedId) {
        throw new GraphQLError(`Could not Add Artist`, {
          extensions: {code: 'INTERNAL_SERVER_ERROR'}
        });
      }
      await client.set(insertedArtist.insertedId, newArtist)
      await client.del("allArtists")
      return newArtist;
    },
    editArtist: async (_, args) => {
      args._id = checkAndTrimString(args._id, "artist ID")
      if (!ObjectId.isValid(args._id)){
        throw new GraphQLError(`artist ID is invalid object ID`, {
          extensions: {code: 'BAD_USER_INPUT'}
        })
      } 
      if(args.name || args.date_formed || args.members){
        throw new GraphQLError(
          `Must update at least 1 field`,
          {
            extensions: {code: 'BAD_USER_INPUT'}
          })
      }
      const artists = await artistsCollection();
      let newArtist = await artists.findOne({_id: ObjectId(args._id)});
      if (newArtist) {
        if (args.name) {
          args.firstName = checkAndTrimString(args.firstName, "artist first name")
          newArtist.name = args.name;
        }
        if (args.date_formed) {
          args.date_formed = checkAndTrimString(args.date_formed, "date formed")
          if(!isValidDate(args.date_formed)){
            throw new GraphQLError(
              `Date is not in valid format`,
              {
                extensions: {code: 'BAD_USER_INPUT'}
              })
          }
          newArtist.dateFormed = args.date_formed;
        }
        if (args.members){
          if (!Array.isArray(args.members)) {
            throw new GraphQLError(
              `Members is not an array`,
              {
                extensions: {code: 'BAD_USER_INPUT'}
              })
          }
          args.members.forEach(member => {
            member = checkAndTrimString(member)
            if (!/^[a-zA-Z]+$/.test(member)) {
              throw new GraphQLError(
                `Member ${member} must only contain letters`,
                {
                  extensions: {code: 'BAD_USER_INPUT'}
                })
            }
          })
          newArtist.members = args.members
        }
        await artists.updateOne({_id: args._id}, {$set: newArtist});
      } else {
        throw new GraphQLError(
          `Could not update artist with _id of ${args._id}`,
          {
            extensions: {code: 'NOT_FOUND'}
          }
        );
      }
      await client.set(insertedArtist.insertedId, newArtist)
      await client.del("allArtists")
      return newArtist;

    },
    removeArtist: async (_, args) => {
      args._id = checkAndTrimString(args._id, "artist ID")
      if (!ObjectId.isValid(args._id)){
        throw new GraphQLError(`artist ID is invalid object ID`, {
          extensions: {code: 'BAD_USER_INPUT'}
        })
      } 
      const artists = await artistsCollection();
      const deletedArtist = await artists.findOneAndDelete({_id: ObjectId(args._id)});

      if (!deletedArtist) {
        throw new GraphQLError(
          `Could not delete artist with _id of ${args._id}`,
          {
            extensions: {code: 'NOT_FOUND'}
          }
        );
      }
      //delete albums with that artist
      const albums = await albumsCollection()

      // const deletedIds = await albums.find({ artistId: artistIdToDelete }).toArray();

      // // Delete albums for the specified artistId
      // const deleteResult = await albumsCollection.deleteMany({ artistId: artistIdToDelete });
  
      await client.del(args._id)
      await client.del("allArtists")
      return deletedArtist;

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
