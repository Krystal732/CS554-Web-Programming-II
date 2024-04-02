import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link, useParams} from 'react-router-dom';
import noImage from '../img/download.jpeg'


import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardHeader
} from '@mui/material';
import '../App.css';

const Launchpad = () => {
  const [launchpadData, setLaunchpadData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);

  let {id} = useParams();


  useEffect(() => {
    async function fetchData() {
      try {
        const {data: launchpad} = await axios.get(
          `https://api.spacexdata.com/v4/launchpads/${id}`

          
        );
        setLaunchpadData(launchpad);
        setLoading(false);
      } catch (e) {
        if (e.response.status === 404) {
          setError(<div>404 Error - No Launchpad with that ID</div>)
        } else {
          console.log(e); 
        }
      }
    }
    fetchData();
  }, [id]);

 
  if (loading) {
    if(error){
      return(error)
    }else{
      return (
        <div>
          <h2>Loading....</h2>
        </div>
      );
    }
  } else {
    return (
      <Card
        variant='outlined'
        sx={{
          maxWidth: 550,
          height: 'auto',
          marginLeft: 'auto',
          marginRight: 'auto',
          borderRadius: 5,
          border: '1px solid #1e8678',
          boxShadow:
            '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
        }}
      >
        <CardHeader
          title={launchpadData.name}
          sx={{
            borderBottom: '1px solid #1e8678',
            fontWeight: 'bold'
          }}
        />
        <CardMedia
          component='img'
          image={
            launchpadData.images.large[0]
                  ? launchpadData.images.large[0]
                  : noImage
          }
          title='Launchpad image'
        />

        <CardContent>
          <Typography
            variant='body2'
            color='textSecondary'
            component='span'
            sx={{
              borderBottom: '1px solid #1e8678',
              fontWeight: 'bold'
            }}
          >
            <dl>
              <p>
                <dt className='title'>Full Name:</dt>
                {launchpadData && launchpadData.full_name? (
                  <dd>{launchpadData.full_name}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Locality:</dt>
                {launchpadData && launchpadData.locality? (
                  <dd>{launchpadData.locality}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Region:</dt>
                {launchpadData && launchpadData.region? (
                  <dd>{launchpadData.region}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Latitude:</dt>
                {launchpadData && typeof launchpadData.latitude === "number"? (
                  <dd>{launchpadData.latitude}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Longitude:</dt>
                {launchpadData && typeof launchpadData.longitude === "number"? (
                  <dd>{launchpadData.longitude}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Launch Attempts:</dt>
                {launchpadData && typeof launchpadData.launch_attempts === "number"? (
                  <dd>{launchpadData.launch_attempts}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Launch Successes:</dt>
                {launchpadData && typeof launchpadData.launch_successes === "number"? (
                  <dd>{launchpadData.launch_successes}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <div>
                <dt className='title'>Rockets:</dt>
                {launchpadData && launchpadData.rockets && launchpadData.rockets.length >= 1 ? (
                  <ol>
                    {launchpadData.rockets.map((rocket) => (
                      <li key={rocket}>
                        <Link to={`/rockets/${rocket}`}>{rocket}</Link>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <dd>N/A</dd>
                )}
              </div>
              <p>
                <dt className='title'>Timezone:</dt>
                {launchpadData && launchpadData.timezone? (
                  <dd>{launchpadData.timezone}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Status:</dt>
                {launchpadData && launchpadData.status? (
                  <dd>{launchpadData.status}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Details:</dt>
                {launchpadData && launchpadData.details? (
                  <dd>{launchpadData.details}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>             
            </dl>
            {/* <Link to='/launches'>Back to all launches...</Link> */}
          </Typography>
        </CardContent>
      </Card>
    );
  }
};

export default Launchpad;
