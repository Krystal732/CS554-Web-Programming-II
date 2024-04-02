import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Grid} from '@mui/material';
import ListCard from './ListCard';
import {Link, useParams} from 'react-router-dom';


const List = (props) => {
  const [loading, setLoading] = useState(true);
  const [launchesData, setLaunchesData] = useState(undefined);
  let {id} = useParams();
  const [prev, setPrev] = useState(false); 
  const [next, setNext] = useState(false); 

  const [searchTerm, setSearchTerm] = useState('')
  const [searchData, setSearchData] = useState(undefined)
  let form  = undefined

  let cardsData = undefined
  
  useEffect(() => { 
    async function fetchData() {
      try {
        const { data } = await axios.post(`https://api.spacexdata.com/v4/${props.type}/query`, {
          query: {}, 
          options: {
            limit: 10,
            page: id
          }
        });
        setLaunchesData(data.docs);
        setPrev(data.hasPrevPage)
        setNext(data.hasNextPage)
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, [id]);



  
  useEffect(() => {
    // console.log('search useEffect fired');
    async function fetchData() {
      try {
        let name = 'name'
        if(props.type === 'cores'){
          name = 'serial'
        }
        // console.log(`in fetch searchTerm: ${searchTerm}`);
        const { data } = await axios.post(`https://api.spacexdata.com/v4/${props.type}/query`, {
          query: {
            [name]: {
              "$regex": searchTerm,
              "$options": "i" 
            }
          }, 
          options: {
            limit: 10,
            page: id
          }
        });
        setSearchData(data.docs);
        setPrev(data.hasPrevPage)
        setNext(data.hasNextPage)
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
    if (searchTerm) {
      // console.log('searchTerm is set');
      fetchData();
    }
  }, [searchTerm, id]);

  

  if (searchTerm) {
    // console.log('search card data')
    cardsData =
    searchData &&
    searchData.map((launch) => {
      return <ListCard object={launch} key={launch.id} type = {props.type}/>;
    });
  } else {
    // console.log('all card datA')
    cardsData =
    launchesData &&
    launchesData.map((launch) => {
      return <ListCard object={launch} key={launch.id} type = {props.type}/>;
    })}; 

if(props.type === 'launches' || props.type == 'payloads' || props.type === 'cores'){
  form =
  <div>
      <form
          method='POST '
          onSubmit={(e) => {
            e.preventDefault();
          }}
          name='formName'
          className='center'
        >
          <label>
            <span>Search {props.type} </span>
            <input
              autoComplete='off'
              type='text'
              name='searchTerm'
              onChange={(e) => setSearchTerm(e.target.value)}
              />
          </label>
        </form>
        <br />
        <br />
  </div>
  
}

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } else {
    return (
      <div>
        {form}
        <Grid
          container
          spacing={2}
          sx={{
            flexGrow: 1,
            flexDirection: 'row'
          }}
        >
          {cardsData}
        </Grid>
        <div>
          {prev ? <Link to={`/${props.type}/page/${parseInt(id) - 1}`}>Previous</Link> : null}
          <br />
          {next ? <Link to={`/${props.type}/page/${parseInt(id) + 1}`}>Next</Link> : null}
        </div>
      </div>
    );
  }
};


export default List