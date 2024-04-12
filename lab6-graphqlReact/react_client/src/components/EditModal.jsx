import React, {useState} from 'react';
import './App.css';
import ReactModal from 'react-modal';
import {useQuery, useMutation} from '@apollo/client';
//Import the file where my query constants are defined
import queries from '../queries';

//For react-modal
ReactModal.setAppElement('#root');
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    border: '1px solid #28547a',
    borderRadius: '4px'
  }
};

function EditModal(props) {
  const [showEditModal, setShowEditModal] = useState(props.isOpen);
  const [artist, setArtist] = useState(props.artist);
  // const {loading, error, data} = useQuery(queries.GET_EMPLOYERS);
  const [editArtist] = useMutation(queries.EDIT_ARTIST);
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setArtist(null);

    props.handleClose();
  };

  let name;
  let dateFormed;
  let members;
  // if (data) {
  //   var {employers} = data;
  // }
  // if (loading) {
  //   return <div>loading...</div>;
  // }
  // if (error) {
  //   return <div>{error.message}</div>;
  // }
  return (
    <div>
      <ReactModal
        name='editModal'
        isOpen={showEditModal}
        contentLabel='Edit Artist'
        style={customStyles}
      >
        <form
          className='form'
          id='edit-artist'
          onSubmit={async (e) => {
            // console.log(name.value);
            // console.log(dateFormed.value);
            // console.log(members.value);
            e.preventDefault();
            try{
              await editArtist({
                variables: {
                  id: props.artist._id,
                  name: name.value || null,
                  dateFormed: dateFormed.value || null,
                  // members: members.value.split(',').map(member => member.trim())
                  members:  members.value? members.value.split(',').map(member => member.trim()) : null
                }
              });
              // console.log('artistName:', name);
              // console.log('artistDateFormed:', dateFormed);
              // console.log('artistMembers:', members);
              // name.value = '';
              // dateFormed.value = '';
              // members.value = '';
              setShowEditModal(false);
  
              alert('Artist Updated');
              props.handleClose();

            }catch(e){
              alert(e)
            }
            
          }}
        >
          <div className='form-group'>
            <label>
              Artist Name:
              <br />
              <input
                ref={(node) => {
                  name = node;
                }}
                defaultValue={artist.name}
                autoFocus={true}
              />
            </label>
          </div>
          <br />
          <div className='form-group'>
            <label>
              Date Formed:
              <br />
              <input
                ref={(node) => {
                  dateFormed = node;
                }}
                defaultValue={artist.dateFormed}
              />
            </label>
          </div>
          <br />

          <div className='form-group'>
            <label>
              Members (Separate names with commas):
              <br />
              <input
                ref={(node) => {
                  members = node;
                }}
                defaultValue={artist.members}
              />
            </label>
          </div>
          <br />
          <br />
          <button className='button add-button' type='submit'>
            Update Artist
          </button>
        </form>

        <button className='button cancel-button' onClick={handleCloseEditModal}>
          Cancel
        </button>
      </ReactModal>
    </div>
  );
}
export default EditModal;
