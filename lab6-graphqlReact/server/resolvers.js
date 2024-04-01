import {GraphQLError, GraphQLScalarType, Kind} from 'graphql';
import redis from 'redis'
import {ObjectId} from 'mongodb';


const client = redis.createClient();
client.connect().then(() => {});


import {
  artists as artistsCollection,
  albums as albumsCollection,
  recordcompanies as companiesCollection,
  songs as songsCollection
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
  dateString = checkAndTrimString(dateString, "date")
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

const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize (value) {
    //should not need to change bc already string?
    return value;
  },
  parseValue(value) {
    //input check
    if (!isValidDate(value)) {
      throw new GraphQLError(
        `Date is not in valid format`,
        {
          extensions: {code: 'BAD_USER_INPUT'}
        })
    }
    return value;
  },
  parseLiteral(ast) {
    // Called to parse AST value from the client
    if (ast.kind !== Kind.STRING || !isValidDate(ast.value)) {
      throw new GraphQLError(
        `Date is not in valid format`,
        {
          extensions: {code: 'BAD_USER_INPUT'}
        })
    }
    return ast.value;
  },
});

export const resolvers = {
  Date: dateScalar,
  Query: {
    artists: async () => { //array of all artists
      let exists = await client.exists('allArtists'); 
      let allArtists = undefined
      if (exists){
        // allArtists = JSON.parse(await client.get('allArtists')); //from cache
        let arr = await client.lRange("allArtists", 0, 1)
        allArtists = arr.map(s=>JSON.parse(s))
      }else{
        const artists = await artistsCollection()
        allArtists = await artists.find().toArray();
        if (!allArtists) {
          //Could not get list
          throw new GraphQLError(`Internal Server Error`, {
            extensions: {code: 'INTERNAL_SERVER_ERROR'}
          });
        }
        for (let a of allArtists){
          await client.lPush('allArtists', JSON.stringify(a)) //add to cache
        }
        await client.expire('allArtists', 3600) //expire in 1 hour
      }
      return allArtists
    },

    albums: async () => {//array of all albums
      let exists = await client.exists('allAlbums'); 
      let allAlbums = undefined
      if (exists){
        // allAlbums = JSON.parse (await client.get('allAlbums')); //from cache
        let arr = await client.lRange("allAlbums", 0, 1)
        allAlbums = arr.map(s=>JSON.parse(s))
      }else{
        const albums = await albumsCollection()
        allAlbums = await albums.find().toArray();
        if (!allAlbums) {
          //Could not get list
          throw new GraphQLError(`Internal Server Error`, {
            extensions: {code: 'INTERNAL_SERVER_ERROR'}
          });
        }
        for(let a of allAlbums){
          await client.lPush('allAlbums', JSON.stringify(a)) //add to cache
        }
        await client.expire('allAlbums', 3600) //expire in 1 hour
      }
      return allAlbums
    },
    recordCompanies: async() => {
      let exists = await client.exists('allCompanies'); 
      let allCompanies = undefined
      if (exists){
        // allCompanies = JSON.parse(await client.get('allCompanies')); //from cache
        let arr = await client.lRange("allCompanies", 0, 1)
        allCompanies = arr.map(s=>JSON.parse(s))
      }else{
        const companies = await companiesCollection()
        allCompanies = await companies.find().toArray();
        if (!allCompanies) {
          //Could not get list
          throw new GraphQLError(`Internal Server Error`, {
            extensions: {code: 'INTERNAL_SERVER_ERROR'}
          });
        }
        for (let c of allCompanies){
          await client.lPush('allCompanies', JSON.stringify(c)) //add to cache
        }
        await client.expire('allCompanies', 3600) //expire in 1 hour
      }
      return allCompanies
    },
    getArtistById: async (_, args) => {
      args._id = checkAndTrimString(args._id, "artistID")
      if (!ObjectId.isValid(args._id)){
        throw new GraphQLError(`artist ID is invalid object ID`, {
          extensions: {code: 'BAD_USER_INPUT'}
        })
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
        throw new GraphQLError(`company ID is invalid object ID`, {
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
      args.artistId = checkAndTrimString(args.artistId)
      if (!ObjectId.isValid(args.artistId)){
        throw new GraphQLError(`artistID is invalid object ID`, {
          extensions: {code: 'BAD_USER_INPUT'}
        })
      } 
      let exists = await client.exists("songs:"+args.artistId)
      let songs = []
      if (exists){
        let arr = await client.lRange("songs:"+args.artistId, 0, 1)
        songs = arr.map(s=>JSON.parse(s))
      }else{
        const albums = await albumsCollection()
        let artistsAlbums = await albums.find({ artistId: new ObjectId(args.artistId) }).toArray()
        if (!artistsAlbums) {
          //can't find the albums by artist
          throw new GraphQLError('Artist does not have albums', {
            extensions: {code: 'NOT_FOUND'}
          });
        }
        let allSongs = await songsCollection()

        for (let album of artistsAlbums){
          for(let songId of album.songs){
            let song = await allSongs.findOne({_id: songId})
            songs.push(song)
            // console.log("songs array in foreach:", songs)
            await client.lPush("songs:"+args.artistId, JSON.stringify(song)) //save to cache
  
          }
        }
        // artistsAlbums.forEach( album => {album.songs.forEach(async songId => {
        // let song = await allSongs.findOne({_id: songId})
        //   songs.push(song)})
        // })
        // await client.lPush("songs:"+args.artistId, JSON.stringify(songs)) //save to cache
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
        let arr = await client.lRange(args.genre, 0, 1)
        albumsList = arr.map(s=>JSON.parse(s))

      }else{
        const albums = await albumsCollection()
        albumsList = await albums.find({genre: args.genre}).toArray()
        if (!albumsList) {
          //can't find the albums with genre
          throw new GraphQLError('No albums found with that genre', {
            extensions: {code: 'NOT_FOUND'}
          });
        }
        for(let a of albumsList){
          await client.lPush(args.genre, JSON.stringify(a)) //save to cache
        }
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
      if(!Number.isInteger(args.max) || args.max <=args.min || args.max > 2024){
        throw new GraphQLError('Max year must be int greater than min year and less than 2025', {
          extensions: {code: 'BAD_USER_INPUT'}
        })
      }
      let exists = await client.exists("min"+args.min.toString()+"max"+args.max.toString())
      let companiesList = []
      if (exists){
        // companiesList = JSON.parse(await client.get("min"+args.min.toString()+"max"+args.max.toString()))
        let arr = await client.lRange("min"+args.min.toString()+"max"+args.max.toString(), 0, 1)
        companiesList = arr.map(s=>JSON.parse(s))
      }else{
        const companies = await companiesCollection()
        companiesList = await companies.find({foundedYear: {$gte: args.min, $lte: args.max}}).toArray()
        if (!companiesList || companiesList.length === 0) {
          //can't find the companies between those years
          throw new GraphQLError('No comapnies found with that year range', {
            extensions: {code: 'NOT_FOUND'}
          });
        }
        // console.log(companiesList)
        for(let c of companiesList){
          await client.lPush("min"+args.min.toString()+"max"+args.max.toString(), JSON.stringify(c))
        }
        await client.expire("min"+args.min.toString()+"max"+args.max.toString(), 3600)
      }
      return companiesList
    },
    searchArtistByArtistName: async (_, args) => {
      args.searchTerm = checkAndTrimString(args.searchTerm).toLowerCase()
      let exists = await client.exists(args.searchTerm)
      let matchingArtists = []
      if(exists){
        let arr = await client.lRange(args.searchTerm, 0, 1)
        matchingArtists = arr.map(s=>JSON.parse(s))
        // matchingArtists = JSON.parse(await client.get(args.searchTerm))
      }else{
        const artists = await artistsCollection()
        const regex = new RegExp(args.searchTerm, 'i') //case insensitve regex 
        matchingArtists = await artists.find({name: {$regex: regex}}).toArray()
        if (!matchingArtists) {
          throw new GraphQLError('No artists found with those chars', {
            extensions: {code: 'NOT_FOUND'}
          });
        }
        for (let a of matchingArtists){
          await client.lPush(args.searchTerm, JSON.stringify(a))
        }
        await client.expire(args.searchTerm, 3600)
      }
      return matchingArtists
    },
    getSongById: async(_, args) => {
      args._id = checkAndTrimString(args._id, "songID")
      if (!ObjectId.isValid(args._id)){
        throw new GraphQLError(`song ID is invalid object ID`, {
          extensions: {code: 'BAD_USER_INPUT'}
        })
      } 

      let exists = await client.exists(args._id); 
      let song = undefined
      if (exists){
        song = JSON.parse(await client.get(args._id))// from cache
      }else{
        const songs = await songsCollection();
        song = await songs.findOne({_id: new ObjectId(args._id)});
        if (!song) {
          //can't find the song
          throw new GraphQLError('Song Not Found', {
            extensions: {code: 'NOT_FOUND'}
          });
        }
        await client.set(args._id, JSON.stringify(song)) //add to cache

      }
      return song;

    },
    getSongsByAlbumId: async(_, args) => {
      args._id = checkAndTrimString(args._id)
      if (!ObjectId.isValid(args._id)){
        throw new GraphQLError(`album is invalid object ID`, {
          extensions: {code: 'BAD_USER_INPUT'}
        })
      } 
      let exists = await client.exists("songs:"+args._id)
      let songs = []
      if (exists){
        let arr = await client.lRange("songs:"+args._id, 0, 1)
        songs = arr.map(s=>JSON.parse(s))

        // console.log(await client.lRange("songs:"+args._id, 0, 1))
        // console.log(JSON.parse(await client.lRange("songs:"+args._id, 0, 1)))
      }else{
        const albums = await albumsCollection()
        let album = await albums.findOne({ _id: new ObjectId(args._id) })
        if (!album) {
          //can't find the album
          throw new GraphQLError('album does not exist', {
            extensions: {code: 'NOT_FOUND'}
          });
        }

        if(album.songs.length === 0){
          return []
        }

        let allSongs = await songsCollection()
        let albumSongs = album.songs
        for(let songId of albumSongs){
          let song = await allSongs.findOne({_id: songId})
          songs.push(song)
          // console.log("songs array in foreach:", songs)
          await client.lPush("songs:"+args._id, JSON.stringify(song)) //save to cache

        }
        // await album.songs.forEach(async songId => {
        //   let song = await allSongs.findOne({_id: songId})
        //   songs.push(song)
        //   console.log("songs array in foreach:", songs)
        // })

      }
      
      return songs
    },
    searchSongByTitle: async(_, args) => {
      args.searchTitleTerm = checkAndTrimString(args.searchTitleTerm).toLowerCase()
      let exists = await client.exists(args.searchTitleTerm)
      let matchingSongs = []
      if(exists){
        // matchingSongs = JSON.parse(await client.get(args.searchTitleTerm))
        let arr = await client.lRange(args.searchTitleTerm, 0, 1)
        matchingSongs = arr.map(s=>JSON.parse(s))
      }else{
        const songs = await songsCollection()
        const regex = new RegExp(args.searchTitleTerm, 'i') //case insensitve regex 
        matchingSongs = await songs.find({title: {$regex: regex}}).toArray()
        if (!matchingSongs || matchingSongs.length === 0) {
          throw new GraphQLError('No songs found with those chars', {
            extensions: {code: 'NOT_FOUND'}
          });
        }
        for(let s of matchingSongs){
          await client.lPush(args.searchTitleTerm, JSON.stringify(s))
        }
        await client.expire(args.searchTitleTerm, 3600)
      }
      return matchingSongs
    }
  },
  Artist: {
    albums: async (parentValue) => { //get lsit of albums by aritst
      const albums = await albumsCollection();
      const albumsList = await albums.find({
        artistId: new ObjectId(parentValue._id)
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
    },
    songs: async (parentValue) => {
      const songs = await songsCollection();
      // console.log("parent value album:", parentValue)
      const albumSongs = await songs.find({albumId: new ObjectId(parentValue._id)}).toArray();
      // console.log("found songs", albumSongs)
      return albumSongs;
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
  Song: {
    albumId: async(parentValue) => {
      const albums = await albumsCollection();
      // console.log(parentValue)
      const album = await albums.findOne({_id: new ObjectId(parentValue.albumId)});
      // console.log(album)
      return album;
    }
  },
  Mutation: {
    addArtist: async (_, args) => {
      const artists = await artistsCollection();
      args.name = checkAndTrimString(args.name, "artist name")
      args.date_formed = checkAndTrimString(args.date_formed, "date formed")
      
      if (!Array.isArray(args.members) || args.members.length === 0) {
        throw new GraphQLError(
          `Members must be non-empty array`,
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
          newArtist.dateFormed = args.date_formed;
        }
        if (args.members){
          if (!Array.isArray(args.members || args.members.length === 0)) {
            throw new GraphQLError(
              `Members must be non-empty array`,
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
      const companies = await companiesCollection()


      const albumIds = deletedArtist.albums;

      // Delete each album from the albums collection
      if(albumIds){
        const songs = await songsCollection()

        for (const albumId of albumIds) {
          let deletedAlbum = await albums.findOneAndDelete({_id: albumId})
          await client.del(albumId.toString());
          //del albums from companies
          await companies.updateOne(
            {_id: deletedAlbum.recordCompanyId},
            {$pull: {albums: deletedAlbum._id}}
          )
          if(await client.exists(deletedAlbum.recordCompanyId.toString())){
            await client.del(deletedAlbum.recordCompanyId.toString())
          } 
          //del songs from album
          for(let song of deletedAlbum.songs){
            await songs.findOneAndDelete({_id: new ObjectId(song._id)});
          }
        }
        
        
        if(await client.exists('allAlbums')){
          await client.del("allAlbums")
        }
        if(await client.exists('allCompanies')){
          await client.del("allCompanies")
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
      const artists = await artistsCollection()

      const albumIds = deletedCompany.albums;

      // Delete each album from the albums collection
      if (albumIds){
        for (const albumId of albumIds) {
          let deletedAlbum = await albums.findOneAndDelete({_id: albumId})
          if(await client.exists(albumId.toString())){
            await client.del(albumId.toString())
          }
          //del albums from artists
          await artists.updateOne(
            {_id: deletedAlbum.artistId},
            {$pull: {albums: deletedAlbum._id}}
          )
          if(await client.exists(deletedAlbum.recordCompanyId.toString())){
            await client.del(deletedAlbum.recordCompanyId.toString())
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

      args.genre = checkAndTrimString(args.genre, "album genre")
      // if (!Array.isArray(args.songs)) {
      //   throw new GraphQLError(
      //     `songs is not an array`,
      //     {
      //       extensions: {code: 'BAD_USER_INPUT'}
      //     })
      // }
      // args.songs.forEach(song => {
      //   song = checkAndTrimString(song)
      //   if (!/^[a-zA-Z\s]+$/.test(song)) {
      //     throw new GraphQLError(
      //       `Song ${song} must only contain letters`,
      //       {
      //         extensions: {code: 'BAD_USER_INPUT'}
      //       })
      //   }
      // });
      //make sure they entered a valid artist ID
      args.artistId = checkAndTrimString(args.artistId)
      if (!ObjectId.isValid(args.artistId)){
        throw new GraphQLError(`artist ID is invalid object ID`, {
          extensions: {code: 'BAD_USER_INPUT'}
        })
      } 
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
      args.companyId = checkAndTrimString(args.companyId)
      if (!ObjectId.isValid(args.companyId)){
        throw new GraphQLError(`company ID is invalid object ID`, {
          extensions: {code: 'BAD_USER_INPUT'}
        })
      } 
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
        songs: []
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
        {$push: {albums: insertedAlbum.insertedId}}
      );
      if(await client.exists(args.artistId)){
        await client.del(args.artistId)
      }
      await companies.updateOne(
        {_id:new ObjectId(args.companyId)},
        {$push: {albums: insertedAlbum.insertedId}}
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
      if(!(args.title || args.releaseDate || args.genre || args.artistId || args.companyId)){
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

          newAlbum.releaseDate = args.releaseDate;
        }
        if (args.genre){
          args.genre = checkAndTrimString(args.genre, "album genre")

          newAlbum.genre = args.genre
        }
        // if (args.songs){
        //   if (!Array.isArray(args.songs)) {
        //     throw new GraphQLError(
        //       `songs is not an array`,
        //       {
        //         extensions: {code: 'BAD_USER_INPUT'}
        //       })
        //   }
        //   args.songs.forEach(song => {
        //     song = checkAndTrimString(song)
        //     if (!/^[a-zA-Z\s]+$/.test(song)) {
        //       throw new GraphQLError(
        //         `Song ${song} must only contain letters`,
        //         {
        //           extensions: {code: 'BAD_USER_INPUT'}
        //         })
        //     }
        //   });
        //   newAlbum.songs = args.songs
        // }
        if (args.artistId){
          args.artistId = checkAndTrimString(args.artistId)
          if (!ObjectId.isValid(args.artistId)){
            throw new GraphQLError(`artist ID is invalid object ID`, {
              extensions: {code: 'BAD_USER_INPUT'}
            })
          } 
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
          newAlbum.artistId = new ObjectId(args.artistId)
        }
        if (args.companyId){
          args.companyId = checkAndTrimString(args.companyId)
          if (!ObjectId.isValid(args.companyId)){ 
            throw new GraphQLError(`company ID is invalid object ID`, {
              extensions: {code: 'BAD_USER_INPUT'}
            })
          } 
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

          await companies.updateOne(
            {_id: new ObjectId(args.companyId)},
            {$push: {albums: newAlbum._id}}
          );
          if(await client.exists(args.companyId)){
            await client.del(args.companyId)
          }

          newAlbum.recordCompanyId = new ObjectId(args.companyId)

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
      //del songs
      const songs = await songsCollection()
      for(let song of deletedAlbum.songs){
        await songs.findOneAndDelete({_id: new ObjectId(song._id)});
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
    },
    addSong: async (_, args) => {
      const songs = await songsCollection();
      args.title = checkAndTrimString(args.title, "song title")
      
      args.duration = checkAndTrimString(args.duration, "song duration")
      if(!/^\d{2}:(?:[0-5][0-9])$/.test(args.duration)){
        throw new GraphQLError(`duration must be in MM:SS format`, {
          extensions: {code: 'BAD_USER_INPUT'}
        })
      }


      //make sure they entered a valid album ID
      args.albumId = checkAndTrimString(args.albumId)
      if (!ObjectId.isValid(args.albumId)){
        throw new GraphQLError(`album ID is invalid object ID`, {
          extensions: {code: 'BAD_USER_INPUT'}
        })
      } 
      const albums = await albumsCollection()
      let album = await albums.findOne({_id: new ObjectId(args.albumId)});
      if (!album) {
        throw new GraphQLError(
          `Could not Find Album with an ID of ${args.albumId}`,
          {
            extensions: {code: 'BAD_USER_INPUT'}
          }
        );
      }
      
      const newSong = {
        _id: new ObjectId(),
        title: args.title,
        duration: args.duration,
        albumId: new ObjectId(args.albumId)     
      };
     
      let insertedSong = await songs.insertOne(newSong);
      if (!insertedSong.acknowledged || !insertedSong.insertedId) {
        throw new GraphQLError(`Could not Add Song`, {
          extensions: {code: 'INTERNAL_SERVER_ERROR'}
        });
      }
      await client.set(insertedSong.insertedId.toString(), JSON.stringify(newSong))

      //push to albums array of songs
      await albums.updateOne(
        {_id:new ObjectId(args.albumId)},
        {$push: {songs: newSong._id}}
      );
      if(await client.exists(args.albumId)){
        await client.del(args.albumId)
      }

      if(await client.exists('allAlbums')){
        await client.del("allAlbums")
      }

      return newSong;


    },
    editSong: async (_, args) => {
      args._id = checkAndTrimString(args._id, "song ID")
      if (!ObjectId.isValid(args._id)){
        throw new GraphQLError(`song ID is invalid object ID`, {
          extensions: {code: 'BAD_USER_INPUT'}
        })
      } 
      if(!(args.title || args.duration || args.albumId)){
        throw new GraphQLError(
          `Must update at least 1 field`,
          {
            extensions: {code: 'BAD_USER_INPUT'}
          })
      }
      const songs = await songsCollection();
      let newSong = await songs.findOne({_id: new ObjectId(args._id)});
      if (newSong) {
        if (args.title) {
          args.title = checkAndTrimString(args.title, "song title")
          newSong.title = args.title;
        }
        if (args.duration) {
          args.duration = checkAndTrimString(args.duration, "song duration")
          if(!/^\d{2}:(?:[0-5][0-9])$/.test(args.duration)){
            throw new GraphQLError(`duration must be in MM:SS format`, {
              extensions: {code: 'BAD_USER_INPUT'}
            })
          }

          newSong.duration = args.duration;
        }
        if (args.albumId){
          args.albumId = checkAndTrimString(args.albumId)
          if (!ObjectId.isValid(args.albumId)){
            throw new GraphQLError(`album ID is invalid object ID`, {
              extensions: {code: 'BAD_USER_INPUT'}
            })
          }
          const albums = await albumsCollection()
          let album = await albums.findOne({_id: new ObjectId(args.albumId)});
          if (!album) {
            throw new GraphQLError(
              `Could not Find Album with an ID of ${args.albumId}`,
              {
                extensions: {code: 'BAD_USER_INPUT'}
              }
            );
          }
          //pull and push from old and new albums
          await albums.updateOne(
            {_id: newSong.albumId},
            { $pull: {songs: newSong._id} }
          );
          if(await client.exists(newSong.albumId.toString())){
            await client.del(newSong.albumId.toString())
          }
      
          await albums.updateOne(
            {_id:new ObjectId(args.albumId)},
            {$push: {songs: newSong._id}}
          );
          if(await client.exists(args.albumId)){
            await client.del(args.albumId)
          }
          if(await client.exists('allAlbums')){
            await client.del("allAlbums")
          } 
          newSong.albumId = new ObjectId(args.albumId)
        }
        
        await songs.updateOne({_id: new ObjectId(args._id)}, {$set: newSong});
        await client.set(args._id, JSON.stringify(newSong))
        if(await client.exists('allAlbums')){
          await client.del("allAlbums")
        } 
      } else {
        throw new GraphQLError(
          `Could not update song with _id of ${args._id}`,
          {
            extensions: {code: 'NOT_FOUND'}
          }
        );
      }
      
      return newSong;
    },
    removeSong: async (_, args) => {
      args._id = checkAndTrimString(args._id, "song ID")
      if (!ObjectId.isValid(args._id)){
        throw new GraphQLError(`song ID is invalid object ID`, {
          extensions: {code: 'BAD_USER_INPUT'}
        })
      } 
      const songs = await songsCollection();
      const deletedSong = await songs.findOneAndDelete({_id: new ObjectId(args._id)});
      if (!deletedSong) {
        throw new GraphQLError(
          `Could not delete song with _id of ${args._id}`,
          {
            extensions: {code: 'NOT_FOUND'}
          }
        );
      }
      //pull from old albums songs
      const albums = await albumsCollection()
      await albums.updateOne(
        {_id: deletedSong.albumId},
        { $pull: {songs: deletedSong._id} }
      )
      if(await client.exists(deletedSong.albumId.toString())){
        await client.del(deletedSong.albumId.toString())
      } 

      //delete album from cache
      if(await client.exists(args._id)){
        await client.del(args._id)
      }
      
      if(await client.exists('allAlbums')){
        await client.del("allAlbums")
      }

      return deletedSong;
    }
  }
};
