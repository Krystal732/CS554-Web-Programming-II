import {gql} from '@apollo/client'

const GET_ARTISTS = gql`
    query{
        artists {
            name
            members
            dateFormed
            numOfAlbums
            albums {
                title
            }
        }
    }
`

const ADD_ARTIST = gql`
  mutation createArtist(
    $name: String!
    $dateFormed: Date!
    $members: [String!]!
  ) {
    addArtist(
        name: $name
        date_formed: $dateFormed
        members: $members
    ) {
        name
        members
        dateFormed
        numOfAlbums
        albums {
            title
        }
    }
  }
`
const EDIT_ARTIST = gql `
    mutation changeArtist($id: String!) {
        editArtist(_id: $id) {
            name
            members
            dateFormed
            numOfAlbums
            albums {
                title
            }
        }
    }
`

const REMOVE_ARTIST = gql`
    mutation removeArtist($id: String!) {
        removeArtist(_id: $id) {
            name
            members
            dateFormed
            numOfAlbums
            albums {
                title
            }
        }
    }
`

const GET_ARTIST_ID = gql`
    query Query($id: String!) {
        getArtistById(_id: $id) {
            name
            members
            dateFormed
            numOfAlbums
            albums {
                title
            }
        }
    }
`

const SEARCH_ARTIST_NAME = gql`
query SearchArtistByArtistName($searchTerm: String!) {
  searchArtistByArtistName(searchTerm: $searchTerm) {
    name
    members
    dateFormed
    numOfAlbums
    albums {
        title
    }
  }
}
`

const GET_ALBUMS = gql`
    query{
        albums {
            title
            artist {
            name
            }
            genre
            releaseDate
            recordCompany {
            name
            }
            
  }
}
`

const ADD_ALBUM = gql `
    mutation createAlbum($title: String!, $releaseDate: Date!, $genre: MusicGenre!, $artistId: String!, $companyId: String!) {
    addAlbum(title: $title, releaseDate: $releaseDate, genre: $genre, artistId: $artistId, companyId: $companyId) {
        title
        artist {
        name
        }
        genre
        releaseDate
        recordCompany {
        name
        }
        
    }
    }
`

const EDIT_ALBUM = gql`
    mutation changeAlbum($id: String!) {
    editAlbum(_id: $id) {
        title
        artist {
        name
        }
        genre
        releaseDate
        recordCompany {
        name
        }
        
    }
    }
`

const REMOVE_ALBUM = gql`
mutation RemoveAlbum($id: String!) {
  removeAlbum(_id: $id) {
    title
    artist {
    name
    }
    genre
    releaseDate
    recordCompany {
    name
    }
    
  }
}
`

const GET_ALBUM_ID = gql`
    query Query($id: String!) {
        getAlbumById(_id: $id) {
            title
            artist {
            name
            }
            genre
            releaseDate
            recordCompany {
            name
            }
            
        }
    }
`

const SEARCH_ALBUM_GENRE = gql`
query AlbumsByGenre($genre: MusicGenre!) {
  albumsByGenre(genre: $genre) {
    title
    artist {
    name
    }
    genre
    releaseDate
    recordCompany {
    name
    }
  }
}
`

const GET_COMPANIES = gql`
query{
    recordCompanies {
    name
    foundedYear
    country
    numOfAlbums
    albums {
      title
    }
  }
} 
`

const ADD_COMPANY = gql`
mutation createCompany($name: String!, $foundedYear: Int!, $country: String!) {
  addCompany(name: $name, founded_year: $foundedYear, country: $country) {
    name
    foundedYear
    country
    numOfAlbums
    albums {
      title
    }
  }
}
`

const EDIT_COMPANY = gql`
mutation EditCompany($id: String!) {
  editCompany(_id: $id) {
    name
    foundedYear
    country
    numOfAlbums
    albums {
      title
    }
  }
}
`

const REMOVE_COMPANY = gql`
mutation RemoveCompany($id: String!) {
  removeCompany(_id: $id) {
    name
    foundedYear
    country
    numOfAlbums
    albums {
      title
    }
  }
}
`

const GET_COMPANY_ID = gql`
query Query($id: String!) {
  getCompanyById(_id: $id) {
    name
    foundedYear
    country
    numOfAlbums
    albums {
      title
    }
  }
}
`

const GET_COMPANIES_YEAR = gql`
query CompanyByFoundedYear($min: Int!, $max: Int!) {
  companyByFoundedYear(min: $min, max: $max) {
    name
    foundedYear
    country
    numOfAlbums
    albums {
      title
    }
  }
}
`

const GET_SONG_ID = gql`
query GetSongById($id: String!) {
  getSongById(_id: $id) {
    title
    duration
    albumId {
      title
    }
  }
}
`

const GET_SONG_ALBUM = gql`
query GetSongsByAlbumId($id: String!) {
  getSongsByAlbumId(_id: $id) {
    title
    duration
    albumId {
      title
    }
  }
}
`

const GET_SONG_ARTIST = gql`
query GetSongsByArtistId($artistId: String!) {
  getSongsByArtistId(artistId: $artistId) {
    title
    duration
    albumId {
      title
    }
  }
}
`

const GET_SONG_TITLE = gql`
query SearchSongByTitle($searchTitleTerm: String!) {
  searchSongByTitle(searchTitleTerm: $searchTitleTerm) {
    title
    duration
    albumId {
      title
    }
  }
}
`

const ADD_SONG = gql`
mutation AddSong($title: String!, $duration: String!, $albumId: String!) {
  addSong(title: $title, duration: $duration, albumId: $albumId) {
    title
    duration
    albumId {
      title
    }
  }
}
`

const EDIT_SONG = gql`
mutation EditSong($id: String!) {
  editSong(_id: $id) {
    title
    duration
    albumId {
      title
    }
  }
}
`

const REMOVE_SONG = gql`
mutation RemoveSong($id: String!) {
  removeSong(_id: $id) {
    title
    duration
    albumId {
      title
    }
  }
}
`

let exported = {
    GET_ARTISTS,
    ADD_ARTIST,
    EDIT_ARTIST,
    REMOVE_ARTIST,
    GET_ARTIST_ID,
    SEARCH_ARTIST_NAME,
    GET_ALBUMS,
    ADD_ALBUM,
    EDIT_ALBUM,
    REMOVE_ALBUM,
    GET_ALBUM_ID,
    SEARCH_ALBUM_GENRE,
    GET_COMPANIES,
    ADD_COMPANY,
    EDIT_COMPANY,
    REMOVE_COMPANY,
    GET_COMPANY_ID,
    GET_COMPANIES_YEAR,
    GET_SONG_ID,
    GET_SONG_ALBUM,
    GET_SONG_ARTIST,
    GET_SONG_TITLE,
    ADD_SONG,
    EDIT_SONG,
    REMOVE_SONG
  }

export default exported