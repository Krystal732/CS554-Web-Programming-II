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
    if(!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString))
      return false;

    // Parse the date parts to integers
    var parts = dateString.split("/");
    var day = parseInt(parts[1], 10);
    var month = parseInt(parts[0], 10);
    var year = parseInt(parts[2], 10);

    // Check the ranges of month and year
    if(year < 1000 || year > 3000 || month == 0 || month > 12)
        return false

    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    // Adjust for leap years
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
};
// const MusicGenre =[
//   "POP",
//   "ROCK",
//   "HIP_HOP",
//   "COUNTRY",
//   "JAZZ",
//   "CLASSICAL",
//   "ELECTRONIC",
//   "R_AND_B",
//   "INDIE",
//   "ALTERNATIVE"
// ]
export const resolvers = {
  Query: {
    artists: async () => { //array of all artists
      let exists = await client.exists('allArtists'); 
      let allArtists = undefined
      if (exists){
        allArtists = JSON.parse(await client.get('allArtists')); //from cache
      }else{
        const artists = await artistsCollection()
        allArtists = await artists.find().toArray();
        if (!allArtists) {
          //Could not get list
          throw new GraphQLError(`Internal Server Error`, {
            extensions: {code: 'INTERNAL_SERVER_ERROR'}
          });
        }
        await client.set('allArtists', JSON.stringify(allArtists)) //add to cache
        await client.expire('allArtists', 3600) //expire in 1 hour
      }
      return allArtists
    },

    albums: async () => {//array of all albums
      let exists = await client.exists('allAlbums'); 
      let allAlbums = undefined
      if (exists){
        allAlbums = JSON.parse (await client.get('allAlbums')); //from cache
      }else{
        const albums = await albumsCollection()
        allAlbums = await albums.find().toArray();
        if (!allAlbums) {
          //Could not get list
          throw new GraphQLError(`Internal Server Error`, {
            extensions: {code: 'INTERNAL_SERVER_ERROR'}
          });
        }
        await client.set('allAlbums', JSON.stringify(allAlbums)) //add to cache
        await client.expire('allAlbums', 3600) //expire in 1 hour
      }
      return allAlbums
    },
    recordCompanies: async() => {
      let exists = await client.exists('allCompanies'); 
      let allCompanies = undefined
      if (exists){
        allCompanies = JSON.parse(await client.get('allCompanies')); //from cache
      }else{
        const companies = await companiesCollection()
        allCompanies = await companies.find().toArray();
        if (!allCompanies) {
          //Could not get list
          throw new GraphQLError(`Internal Server Error`, {
            extensions: {code: 'INTERNAL_SERVER_ERROR'}
          });
        }
        await client.set('allCompanies', JSON.stringify(allCompanies)) //add to cache
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
        artist = JSON.parse(await client.get(args._id))// from cache
      }else{
        const artists = await artistsCollection();
        artist = await artists.findOne({_id: new ObjectId(args._id)});
        if (!artist) {
          //can't find the artist
          throw new GraphQLError('Artist Not Found', {
            extensions: {code: 'NOT_FOUND'}
          });
        }
        await client.set(args._id, JSON.stringify(artist)) //add to cache

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
        album = JSON.parse(await client.get(args._id))// from cache
      }else{
        const albums = await albumsCollection();
        album = await albums.findOne({_id: new ObjectId(args._id)});
        if (!album) {
          //can't find the album
          throw new GraphQLError('Album Not Found', {
            extensions: {code: 'NOT_FOUND'}
          });
        }
        await client.set(args._id, JSON.stringify(album)) //add to cache

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
        company = JSON.parse(await client.get(args._id))// from cache
      }else{
        const companies = await companiesCollection();
        company = await companies.findOne({_id: new ObjectId(args._id)});
        if (!company) {
          //can't find the company
          throw new GraphQLError('Company Not Found', {
            extensions: {code: 'NOT_FOUND'}
          });
        }
        await client.set(args._id, JSON.stringify(company)) //add to cache

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
        songs = JSON.parse(await client.get("songs:"+args.artistId))
      }else{
        const albums = await albumsCollection()
        let artistsAlbums = albums.find({ artistId: new ObjectId(args.artistId) })
        if (!artistsAlbums) {
          //can't find the albums by artist
          throw new GraphQLError('Artist does not have albums', {
            extensions: {code: 'NOT_FOUND'}
          });
        }
        songs = artistsAlbums.forEach(album => {songs = songs.concat(album.songs)})
        await client.lPush("songs:"+args.artistId, JSON.stringify(songs)) //save to cache
        await client.expire("songs:"+args.artistId, 3600) //expire in 1 hour

      }
      return songs
    },
    albumsByGenre: async (_, args) => {//check albums and get ones w mathcing genre
      args.genre = checkAndTrimString(args.genre, "genre")
      // args.genre = args.genre.toUpperCase()
      let exists = await client.exists(args.genre)
      let albumsList = []
      if (exists){
        albumsList = JSON.parse(await client.get(args.genre))
      }else{
        const albums = await albumsCollection()
        albumsList = albums.find({genre: args.genre})
        if (!albumsList) {
          //can't find the albums with genre
          throw new GraphQLError('No albums found with that genre', {
            extensions: {code: 'NOT_FOUND'}
          });
        }
        await client.lPush(args.genre, JSON.stringify(albumsList)) //save to cache
        await client.expire(args.genre, 3600) //expire in 1 hour
      }
      return albumsList
    },
    companyByFoundedYear: async (_, args) => {
      checkIsNumber(args.min, "min year")
      if(!Number.isInteger(args.min) || args.min <1900){
        throw new GraphQLError('Min Year must be int greater or equal to 1900', {
          extensions: {code: 'BAD_USER_INPUT'}
        })
      }

      checkIsNumber(args.max, "max year")
      if(!Number.isInteger(args.max) || args.max <args.min || args.max > 2024){
        throw new GraphQLError('Max year must be int greater than min year and less than 2025', {
          extensions: {code: 'BAD_USER_INPUT'}
        })
      }
      let exists = await client.exists("min"+args.min.toString()+"max"+args.max.toString())
      let companiesList = []
      if (exists){
        companiesList = JSON.parse(await client.get("min"+args.min.toString()+"max"+args.max.toString()))
      }else{
        const companies = await companiesCollection()
        companiesList = companies.find({foundedYear: {$gte: args.min, $lte: args.max}}).toArray()
        if (!companiesList) {
          //can't find the companies between those years
          throw new GraphQLError('No comapnies found with that year range', {
            extensions: {code: 'NOT_FOUND'}
          });
        }
        await client.lPush("min"+args.min.toString()+"max"+args.max.toString(), JSON.stringify(companiesList))
        await client.expire("min"+args.min.toString()+"max"+args.max.toString(), 3600)
      }
      return companiesList
    },
    searchArtistByArtistName: async (_, args) => {
      args.searchTerm = checkAndTrimString(args.searchTerm).toLowerCase()
      let exists = await client.exists(args.searchTerm)
      let matchingArtists = []
      if(exists){
        matchingArtists = JSON.parse(await client.get(args.searchTerm))
      }else{
        const artists = await artistsCollection()
        const regex = new RegExp(args.searchTerm, 'i') //case insensitve regex 
        matchingArtists = await artists.find({name: {$regex: regex}}).toArray()
        await client.set(args.searchTerm, JSON.stringify(matchingArtists))
        await client.expire(args.searchTerm, 3600)
      }
      return matchingArtists
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
      let artist = await artists.findOne({_id: new ObjectId(parentValue._id)})
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
      const artist = await artists.findOne({_id: new ObjectId(parentValue.artistId)});
      return artist;
    },
    recordCompany: async (parentValue) => { //get record company that distributed album
      const companies = await companiesCollection();
      const company = await companies.findOne({_id: new ObjectId( parentValue.recordCompanyId)})
      return company
    }
  },
  RecordCompany: {
    albums: async (parentValue) => { //get lsit of albums distributed by company
      const albums = await albumsCollection();
      const albumsList = await albums.find({recordCompanyId: new ObjectId(parentValue._id)}).toArray()
      return albumsList;
    },
    numOfAlbums: async(parentValue) => {
      const companies = await companiesCollection()
      let company = await companies.findOne({_id: new ObjectId(parentValue._id)})
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
      args.date_formed = checkAndTrimString(args.date_formed, "date formed")
      if(!isValidDate(args.date_formed)){
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
        if (!/^[a-zA-Z\s]+$/.test(member)) {
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
        dateFormed: args.date_formed,
        members: args.members,
        albums: []
      };
     
      let insertedArtist = await artists.insertOne(newArtist);
      if (!insertedArtist.acknowledged || !insertedArtist.insertedId) {
        throw new GraphQLError(`Could not Add Artist`, {
          extensions: {code: 'INTERNAL_SERVER_ERROR'}
        });
      }
      await client.set(insertedArtist.insertedId.toString(), JSON.stringify(newArtist))
      if(await client.exists('allArtists')){
        await client.del("allArtists")
      }
      return newArtist;
    },
    editArtist: async (_, args) => {
      args._id = checkAndTrimString(args._id, "artist ID")
      if (!ObjectId.isValid(args._id)){
        throw new GraphQLError(`artist ID is invalid object ID`, {
          extensions: {code: 'BAD_USER_INPUT'}
        })
      } 
      if(!(args.name || args.date_formed || args.members)){
        throw new GraphQLError(
          `Must update at least 1 field`,
          {
            extensions: {code: 'BAD_USER_INPUT'}
          })
      }
      const artists = await artistsCollection();
      let newArtist = await artists.findOne({_id: new ObjectId(args._id)});
      if (newArtist) {
        if (args.name) {
          args.name = checkAndTrimString(args.name, "artist name")
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
            if (!/^[a-zA-Z\s]+$/.test(member)) {
              throw new GraphQLError(
                `Member ${member} must only contain letters`,
                {
                  extensions: {code: 'BAD_USER_INPUT'}
                })
            }
          })
          newArtist.members = args.members
        }
        await artists.updateOne({_id: new ObjectId(args._id)}, {$set: newArtist});
        await client.set(args._id, JSON.stringify(newArtist))
        if(await client.exists('allArtists')){
          await client.del("allArtists")
        }
      } else {
        throw new GraphQLError(
          `Could not update artist with _id of ${args._id}`,
          {
            extensions: {code: 'NOT_FOUND'}
          }
        );
      }
      
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
      const deletedArtist = await artists.findOneAndDelete({_id: new ObjectId(args._id)});

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

      const albumIds = deletedArtist.albums;

      // Delete each album from the albums collection
      if(albumIds){
        if(await client.exists('allAlbums')){
          await client.del("allAlbums")
        }
        for (const albumId of albumIds) {
          await albums.deleteOne({_id: albumId})
          await client.del(albumId.toString());
        }
      }
      
      //delete artist from cache
      if(await client.exists(args._id)){
        await client.del(args._id)
      }
      if(await client.exists('allArtists')){
        await client.del("allArtists")
      }
      
      return deletedArtist;

    },
    addCompany: async (_, args) => {
      const companies = await companiesCollection();
      args.name = checkAndTrimString(args.name, "company name")
      if (!/^[a-zA-Z\s]+$/.test(args.name)) {
        throw new GraphQLError(
          `Name ${args.name} must only contain letters`,
          {
            extensions: {code: 'BAD_USER_INPUT'}
          })
      }
      checkIsNumber(args.founded_year, "founded year")
      if(!Number.isInteger(args.founded_year) || args.founded_year < 1900 || args.founded_year > 2024){
        throw new GraphQLError('founded year must be int between 1900 and 2025', {
          extensions: {code: 'BAD_USER_INPUT'}
        })
      }
      args.country = checkAndTrimString(args.country, "company country")

      const newCompany = {
        _id: new ObjectId(),
        name: args.name,
        foundedYear: args.founded_year,
        country: args.country,
        albums: []
      };
     
      let insertedCompany = await companies.insertOne(newCompany);
      if (!insertedCompany.acknowledged || !insertedCompany.insertedId) {
        throw new GraphQLError(`Could not Add Company`, {
          extensions: {code: 'INTERNAL_SERVER_ERROR'}
        });
      }
      await client.set(insertedCompany.insertedId.toString(), JSON.stringify(newCompany))
      if(await client.exists('allCompanies')){
        await client.del("allCompanies")
      }
      return newCompany;
    },
    editCompany: async (_, args) => {
      args._id = checkAndTrimString(args._id, "company ID")
      if (!ObjectId.isValid(args._id)){
        throw new GraphQLError(`company ID is invalid object ID`, {
          extensions: {code: 'BAD_USER_INPUT'}
        })
      } 
      if(!(args.name || args.founded_year || args.country)){
        throw new GraphQLError(
          `Must update at least 1 field`,
          {
            extensions: {code: 'BAD_USER_INPUT'}
          })
      }
      const companies = await companiesCollection();
      let newCompany = await companies.findOne({_id: new ObjectId(args._id)});
      if (newCompany) {
        if (args.name) {
          args.name = checkAndTrimString(args.name, "comapnies name")
          if (!/^[a-zA-Z\s]+$/.test(args.name)) {
            throw new GraphQLError(
              `Name ${args.name} must only contain letters`,
              {
                extensions: {code: 'BAD_USER_INPUT'}
              })
          }
          newCompany.name = args.name;
        }
        if (args.founded_year) {
          checkIsNumber(args.founded_year, "founded year")
          if(!Number.isInteger(args.founded_year) || args.founded_year < 1900 || args.founded_year > 2024){
            throw new GraphQLError('founded year must be int between 1900 and 2025', {
              extensions: {code: 'BAD_USER_INPUT'}
            })
          }
          newCompany.foundedYear = args.founded_year;
        }
        if (args.country){
          args.country = checkAndTrimString(args.country, "company country")
          newCompany.country = args.country
        }
        await companies.updateOne({_id: new ObjectId(args._id)}, {$set: newCompany});
      } else {
        throw new GraphQLError(
          `Could not update company with _id of ${args._id}`,
          {
            extensions: {code: 'NOT_FOUND'}
          }
        );
      }
      await client.set(args._id, JSON.stringify(newCompany))
      if(await client.exists('allCompanies')){
        await client.del("allCompanies")
      }
      return newCompany;
    },
    removeCompany: async (_, args) => {
      args._id = checkAndTrimString(args._id, "company ID")
      if (!ObjectId.isValid(args._id)){
        throw new GraphQLError(`company ID is invalid object ID`, {
          extensions: {code: 'BAD_USER_INPUT'}
        })
      } 
      const companies = await companiesCollection();
      const deletedCompany = await companies.findOneAndDelete({_id:new ObjectId(args._id)});

      if (!deletedCompany) {
        throw new GraphQLError(
          `Could not delete company with _id of ${args._id}`,
          {
            extensions: {code: 'NOT_FOUND'}
          }
        );
      }
      //delete albums with that company
      const albums = await albumsCollection()

      const albumIds = deletedCompany.albums;

      // Delete each album from the albums collection
      if (albumIds){
        for (const albumId of albumIds) {
          await albums.deleteOne({_id: albumId})
          if(await client.exists(albumId.toString())){
            await client.del(albumId.toString())
          }
        }
        if(await client.exists('allAlbums')){
          await client.del("allAlbums")
        }
      }

      //delete company from cache
      if(await client.exists(args._id)){
        await client.del(args._id)
      }
      if(await client.exists('allCompanies')){
        await client.del("allCompanies")
      }
      return deletedCompany;
    },
    addAlbum: async (_, args) => {
      const albums = await albumsCollection();
      args.title = checkAndTrimString(args.title, "album title")
      
      args.releaseDate = checkAndTrimString(args.releaseDate, "date released")
      if(!isValidDate(args.releaseDate)){
        throw new GraphQLError(
          `Date is not in valid format`,
          {
            extensions: {code: 'BAD_USER_INPUT'}
          })
      }
      args.genre = checkAndTrimString(args.genre, "album genre")
      if (!Array.isArray(args.songs)) {
        throw new GraphQLError(
          `songs is not an array`,
          {
            extensions: {code: 'BAD_USER_INPUT'}
          })
      }
      args.songs.forEach(song => {
        song = checkAndTrimString(song)
        if (!/^[a-zA-Z\s]+$/.test(song)) {
          throw new GraphQLError(
            `Song ${song} must only contain letters`,
            {
              extensions: {code: 'BAD_USER_INPUT'}
            })
        }
      });
      //make sure they entered a valid artist ID
      const artists = await artistsCollection()
      let artist = await artists.findOne({_id: new ObjectId(args.artistId)});
      if (!artist) {
        throw new GraphQLError(
          `Could not Find Artist with an ID of ${args.artistId}`,
          {
            extensions: {code: 'BAD_USER_INPUT'}
          }
        );
      }
      //make sure they entered a valid company ID
      const companies = await companiesCollection()
      let company = await companies.findOne({_id: new ObjectId(args.companyId)});
      if (!company) {
        throw new GraphQLError(
          `Could not Find Company with an ID of ${args.companyId}`,
          {
            extensions: {code: 'BAD_USER_INPUT'}
          }
        );
      }

      const newAlbum = {
        _id: new ObjectId(),
        title: args.title,
        releaseDate: args.releaseDate,
        genre: args.genre,
        artistId: new ObjectId(args.artistId),
        recordCompanyId: new ObjectId(args.companyId),
        songs: args.songs
      };
     
      let insertedAlbum = await albums.insertOne(newAlbum);
      if (!insertedAlbum.acknowledged || !insertedAlbum.insertedId) {
        throw new GraphQLError(`Could not Add Album`, {
          extensions: {code: 'INTERNAL_SERVER_ERROR'}
        });
      }
      await client.set(insertedAlbum.insertedId.toString(), JSON.stringify(newAlbum))
      if(await client.exists('allAlbums')){
        await client.del("allAlbums")
      }

      //push to albums array of artists and record compnaies
      await artists.updateOne(
        {_id:new ObjectId(args.artistId)},
        {$push: {albums: newAlbum._id}}
      );
      if(await client.exists(args.artistId)){
        await client.del(args.artistId)
      }
      await companies.updateOne(
        {_id:new ObjectId(args.companyId)},
        {$push: {albums: newAlbum._id}}
      );
      if(await client.exists(args.companyId)){
        await client.del(args.companyId)
      }

      if(await client.exists('allArtists')){
        await client.del("allArtists")
      }
      if(await client.exists('allCompanies')){
        await client.del("allCompanies")
      }
      
      return newAlbum;

    },
    editAlbum: async (_, args) => {
      args._id = checkAndTrimString(args._id, "album ID")
      if (!ObjectId.isValid(args._id)){
        throw new GraphQLError(`album ID is invalid object ID`, {
          extensions: {code: 'BAD_USER_INPUT'}
        })
      } 
      if(!(args.title || args.releaseDate || args.genre || args.songs || args.artistId || args.companyId)){
        throw new GraphQLError(
          `Must update at least 1 field`,
          {
            extensions: {code: 'BAD_USER_INPUT'}
          })
      }
      const albums = await albumsCollection();
      let newAlbum = await albums.findOne({_id: new ObjectId(args._id)});
      if (newAlbum) {
        if (args.title) {
          args.title = checkAndTrimString(args.title, "album title")
          newAlbum.title = args.title;
        }
        if (args.releaseDate) {
          args.releaseDate = checkAndTrimString(args.releaseDate, "date released")
          if(!isValidDate(args.releaseDate)){
            throw new GraphQLError(
              `Date is not in valid format`,
              {
                extensions: {code: 'BAD_USER_INPUT'}
              })
          }
          newAlbum.releaseDate = args.releaseDate;
        }
        if (args.genre){
          args.genre = checkAndTrimString(args.genre, "album genre")
          // if (!Object.values(MusicGenre).includes(args.genre)) {
          //   throw new GraphQLError(
          //     `Invalid album music genre`,
          //     {
          //       extensions: {code: 'BAD_USER_INPUT'}
          //     })
          // }
          newAlbum.genre = args.genre
        }
        if (args.songs){
          if (!Array.isArray(args.songs)) {
            throw new GraphQLError(
              `songs is not an array`,
              {
                extensions: {code: 'BAD_USER_INPUT'}
              })
          }
          args.songs.forEach(song => {
            song = checkAndTrimString(song)
            if (!/^[a-zA-Z\s]+$/.test(song)) {
              throw new GraphQLError(
                `Song ${song} must only contain letters`,
                {
                  extensions: {code: 'BAD_USER_INPUT'}
                })
            }
          });
          newAlbum.songs = args.songs
        }
        if (args.artistId){
          const artists = await artistsCollection()
          let artist = await artists.findOne({_id: new ObjectId(args.artistId)});
          if (!artist) {
            throw new GraphQLError(
              `Could not Find Artist with an ID of ${args.artistId}`,
              {
                extensions: {code: 'BAD_USER_INPUT'}
              }
            );
          }
          //pull and push from old and new artists albums
          await artists.updateOne(
            {_id: newAlbum.artistId},
            { $pull: {albums: newAlbum._id} }
          );
          if(await client.exists(newAlbum.artistId.toString())){
            await client.del(newAlbum.artistId.toString())
          }
      
          await artists.updateOne(
            {_id:new ObjectId(args.artistId)},
            {$push: {albums: newAlbum._id}}
          );
          if(await client.exists(args.artistId)){
            await client.del(args.artistId)
          }
          if(await client.exists('allArtists')){
            await client.del("allArtists")
          } 
          newAlbum.artistId = args.artistId
        }
        if (args.companyId){
          const companies = await companiesCollection()
          let company = await companies.findOne({_id: new ObjectId(args.companyId)});
          if (!company) {
            throw new GraphQLError(
              `Could not Find Company with an ID of ${args.companyId}`,
              {
                extensions: {code: 'BAD_USER_INPUT'}
              }
            );
          }
          //pull and push from old and new companies albums
          await companies.updateOne(
            {_id: newAlbum.recordCompanyId},
            {$pull: {albums: newAlbum._id}}
          );
          if(await client.exists(newAlbum.recordCompanyId.toString())){
            await client.del(newAlbum.recordCompanyId.toString())
          }

          await artists.updateOne(
            {_id: new ObjectId(args.companyId)},
            {$push: {albums: newAlbum._id}}
          );
          if(await client.exists(args.companyId)){
            await client.del(args.companyId)
          }

          newAlbum.recordCompanyId = args.companyId

          if(await client.exists('allCompanies')){
            await client.del("allCompanies")
          } 
        }
        await albums.updateOne({_id: new ObjectId(args._id)}, {$set: newAlbum});
        await client.set(args._id, JSON.stringify(newAlbum))
        if(await client.exists('allAlbums')){
          await client.del("allAlbums")
        } 
      } else {
        throw new GraphQLError(
          `Could not update album with _id of ${args._id}`,
          {
            extensions: {code: 'NOT_FOUND'}
          }
        );
      }
      
      return newAlbum;
    },
    removeAlbum: async (_, args) => {
      args._id = checkAndTrimString(args._id, "album ID")
      if (!ObjectId.isValid(args._id)){
        throw new GraphQLError(`album ID is invalid object ID`, {
          extensions: {code: 'BAD_USER_INPUT'}
        })
      } 
      const albums = await albumsCollection();
      const deletedAlbum = await albums.findOneAndDelete({_id: new ObjectId(args._id)});
      if (!deletedAlbum) {
        throw new GraphQLError(
          `Could not delete album with _id of ${args._id}`,
          {
            extensions: {code: 'NOT_FOUND'}
          }
        );
      }
      //pull from old artists albums
      const artists = await artistsCollection()
      await artists.updateOne(
        {_id: deletedAlbum.artistId},
        { $pull: {albums: deletedAlbum._id} }
      )
      if(await client.exists(deletedAlbum.artistId.toString())){
        await client.del(deletedAlbum.artistId.toString())
      } 

      //pull from old companies albums
      const companies = await companiesCollection()
      await companies.updateOne(
        {_id: deletedAlbum.recordCompanyId},
        {$pull: {albums: deletedAlbum._id}}
      )
      if(await client.exists(deletedAlbum.recordCompanyId.toString())){
        await client.del(deletedAlbum.recordCompanyId.toString())
      } 

      //delete album from cache
      if(await client.exists(args._id)){
        await client.del(args._id)
      }
      if(await client.exists('allArtists')){
        await client.del("allArtists")
      }
      if(await client.exists('allCompanies')){
        await client.del("allCompanies")
      }
      if(await client.exists('allAlbums')){
        await client.del("allAlbums")
      }

      return deletedAlbum;
    }
  }
};
