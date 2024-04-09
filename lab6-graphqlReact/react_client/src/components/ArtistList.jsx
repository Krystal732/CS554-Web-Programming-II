import React, {useState} from 'react';
import './App.css';
import {useQuery} from '@apollo/client';
import queries from '../queries';
import Add from './Add';
import RemoveArtistModal from './RemoveArtistModal';
import EditArtistModal from './EditArtistModal';

const ArtistList = () => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [editArtist, setEditArtist] = useState(null);
    const [removeArtist, setRemoveArtist] = useState(null);

    const {loading, error, data} = useQuery(queries.GET_ARTISTS, {
        fetchPolicy: 'cache-and-network'
    });
    const handleOpenEditModal = (artist) => {
        setShowEditModal(true);
        setEditArtist(artist);
    };

    const handleOpenRemoveModal = (artist) => {
        setShowRemoveModal(true);
        setRemoveArtist(artist);
    };
    const closeAddFormState = () => {
        setShowAddForm(false);
    };

    const handleCloseModals = () => {
        setShowEditModal(false);
        setShowRemoveModal(false);
    };

    if (data) {
        const {artists} = data;
        return (
        <div>
            <button className='button' onClick={() => setShowAddForm(!showAddForm)}>
            Create Artist
            </button>
            {showAddForm && (
            <Add type='artist' closeAddFormState={closeAddFormState} />
            )}
            <br />
            <br />

            {artists.map((artist) => {
            return (
                <div className='card' key={artist._id}>
                <div className='card-body'>
                    <h5 className='card-title'>
                    {artist.name} 
                    </h5>
                    Members: {artist.members}
                    <br />
                    Number of Albums: {artist.numofAlbums}
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
                        handleOpenRemoveModal(artist);
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
            <EditArtistModal
                isOpen={showEditModal}
                artist={editArtist}
                handleClose={handleCloseModals}
            />
            )}

            {showRemoveModal && (
            <RemoveArtistModal
                isOpen={showRemoveModal}
                handleClose={handleCloseModals}
                removeArtist={removeArtist}
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