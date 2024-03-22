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

const Rockets = () => {
  const [rocketsData, setRocketsData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  let {id} = useParams();


  useEffect(() => {
    async function fetchData() {
      try {
        const {data: rocket} = await axios.get(
          `https://api.spacexdata.com/v4/rockets/${id}`

        );
        setRocketsData(rocket);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, [id]);

 
  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
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
          title={rocketsData.name}
          sx={{
            borderBottom: '1px solid #1e8678',
            fontWeight: 'bold'
          }}
        />
        <CardMedia
          component='img'
          image={
            rocketsData.flickr_images[0]
                  ? rocketsData.flickr_images[0]
                  : noImage
          }
          title='Rocket image'
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
                <dt className='title'>Active?:</dt>
                {rocketsData.success ? (
                  <dd>Yes</dd>
                ) : (
                  <dd>No</dd>
                )}
              </p>
              <p>
                <dt className='title'>Stages:</dt>
                {rocketsData && typeof rocketsData.stages === "number"? (
                  <dd>{rocketsData.stages}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Boosters:</dt>
                {rocketsData && typeof rocketsData.boosters === "number"? (
                  <dd>{rocketsData.boosters}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Cost Per Launch:</dt>
                {rocketsData && typeof rocketsData.cost_per_launch === "number"? (
                  <dd>{rocketsData.cost_per_launch}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Success Rate Percent:</dt>
                {rocketsData && typeof rocketsData.success_rate_pct === "number"? (
                  <dd>{rocketsData.success_rate_pct}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>First Flight:</dt>
                {rocketsData &&  rocketsData.first_flight? (
                  <dd>{rocketsData.first_flight}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Country:</dt>
                {rocketsData && rocketsData.country ? (
                  <dd>{rocketsData.country}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Wikipedia</dt>
                {rocketsData && rocketsData.wikipedia ? (
                  <dd>
                    <a
                      rel='noopener noreferrer'
                      target='_blank'
                      href={rocketsData.wikipedia}
                    >
                      {rocketsData.name} Wikipedia Link
                    </a>
                  </dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Description:</dt>
                {rocketsData && rocketsData.description ? (
                  <dd>{rocketsData.description}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Mass:</dt>
                {rocketsData && rocketsData.mass.kg && rocketsData.mass.lb? (
                  <dd>{rocketsData.mass.kg}kg/{rocketsData.mass.lb}lb</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Height:</dt>
                {rocketsData && rocketsData.height.meters && rocketsData.height.feet? (
                  <dd>{rocketsData.height.meters}meters/{rocketsData.height.feet}feet</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Diameter:</dt>
                {rocketsData && rocketsData.diameter.meters && rocketsData.diameter.feet? (
                  <dd>{rocketsData.diameter.meters}meters/{rocketsData.diameter.feet}feet</dd>
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

export default Rockets;
