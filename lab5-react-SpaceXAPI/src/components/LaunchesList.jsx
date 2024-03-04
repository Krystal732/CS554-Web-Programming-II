import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Grid} from '@mui/material';
import LaunchListCard from './LaunchListCard';
import {Link, useParams} from 'react-router-dom';


const LaunchesList = () => {
  const [loading, setLoading] = useState(true);
  const [launchesData, setLaunchesData] = useState(undefined);
  let {id} = useParams();
  const [prev, setPrev] = useState(false); 
  const [next, setNext] = useState(false); 


  
  useEffect(() => { 
    console.log('on load launches useeffect');
    async function fetchData() {
      try {
        const { data } = await axios.post('https://api.spacexdata.com/v4/launches/query', {
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


  let cardsData =
  launchesData &&
  launchesData.map((launch) => {
    return <LaunchListCard launch={launch} key={launch.id} />;
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
          {prev ? <Link to={`/launches/page/${parseInt(id) - 1}`}>Previous</Link> : null}
          <br />
          {next ? <Link to={`/launches/page/${parseInt(id) + 1}`}>Next</Link> : null}
        </div>
      </div>
    );
  }
};


export default LaunchesList