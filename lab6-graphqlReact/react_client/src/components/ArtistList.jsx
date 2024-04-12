import React, {useState} from 'react';
import './App.css';
import {useQuery, useMutation} from '@apollo/client';
import queries from '../queries';
import AddModal from './AddModal';
// import RemoveModal from './RemoveModal';
import EditModal from './EditModal';

const ArtistList = () => {
    // const [showAddForm, setShowAddForm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editArtist, setEditArtist] = useState(null);
    const [removeArtist] = useMutation(queries.REMOVE_ARTIST);

    // const [addArtist, setAddArtist] = useState(null);

    const {loading, error, data} = useQuery(queries.GET_ARTISTS, {
        fetchPolicy: 'cache-and-network'
    });
    const handleOpenEditModal = (artist) => {
        setShowEditModal(true);
        setEditArtist(artist);
    };

    // const handleOpenAddModal = () => {
    //     setShowAddModal(true);
    //     // setAddArtist();
    // };
    const remove = async (id) => {
        console.log(id)
        try{
            await removeArtist({
              variables: {
                id: id
              }
            });
        }catch(e){
            alert(e)
        }
    }
    const handleCloseModals = () => {
        setShowEditModal(false);
        setShowAddModal(false);
    };


    if (data) {
        const {artists} = data;
        return (
        <div>
            <button
                className='button'
                onClick={() => {
                    setShowAddModal(true)
                }}
                >
                Add Artist
                </button>
            <br />
            <br />

            {artists.map((artist) => {
            return (
                <div className='card' key={artist._id}>
                <div className='card-body'>
                    <h5 className='card-title'>
                    {artist.name} 
                    </h5>
                    Members: {artist.members.join(', ')}
                    <br />
                    Number of Albums: {artist.albums.length}
                    <br />
                    <button
                    className='button'
                    onClick={() => {
                        handleOpenEditModal(artist);
                    }}
                    >
                    Edit
                    </button>
                    <button
                    className='button'
                    onClick={() => {
                        remove(artist._id);
                    }}
                    >
                    Remove
                    </button>
                    <br />
                </div>
                </div>
            );
            })}
            {showEditModal && (
            <EditModal
                isOpen={showEditModal}
                artist={editArtist}
                handleClose={handleCloseModals}
            />
            )}

            {showAddModal && (
            <AddModal
                isOpen={showAddModal}
                handleClose={handleCloseModals}
            />
            )}
        </div>
        );
    } else if (loading) {
        return <div>Loading</div>;
    } else if (error) {
        return <div>{error.message}</div>;
    }
}
    

export default ArtistList