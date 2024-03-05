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

    cardsData =
    launchesData &&
    launchesData.map((launch) => {
      return <ListCard object={launch} key={launch.id} type = {props.type}/>;
    }); 


  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } else {
    return (
      <div>
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