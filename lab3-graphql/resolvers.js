import {GraphQLError} from 'graphql';

import {
  artists as artistsCollection,
  albums as albumsCollection,
  recordcompanies as companiesCollection,
  recordcompanies
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
    artists: async () => {
    },
    albums: async () => {
    },
    recordcompanies: async() => {

    },
    getArtistById: async (_, args) => {

    },
    getAlbumById: async (_, args) => {

    },
    getCompanyById: async (_, args) => {

    },
    getSongsByArtistId: async (_, args) => {

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
