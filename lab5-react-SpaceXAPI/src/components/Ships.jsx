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

const Ship = () => {
  const [shipData, setShipData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  let {id} = useParams();


  useEffect(() => {
    async function fetchData() {
      try {
        const {data: ship} = await axios.get(
          `https://api.spacexdata.com/v4/ships/${id}`

        );
        setShipData(ship);
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
          title={shipData.name}
          sx={{
            borderBottom: '1px solid #1e8678',
            fontWeight: 'bold'
          }}
        />
        <CardMedia
          component='img'
          image={
            shipData.image
                  ? shipData.image
                  : noImage
          }
          title='Ship image'
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
                <dt className='title'>Legacy ID:</dt>
                {shipData && shipData.legacy_id? (
                  <dd>{shipData.legacy_id}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Model:</dt>
                {shipData && shipData.model? (
                  <dd>{shipData.model}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Type:</dt>
                {shipData && shipData.type? (
                  <dd>{shipData.type}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <div>
                <dt className='title'>Roles:</dt>
                {shipData && shipData.roles && shipData.roles.length >= 1? (
                  <ol>
                    {shipData.roles.map((role) => (
                      // <li key={payload}>{payload}</li>
                      <li key={role}> {role}</li>
                    ))}
                  </ol>
                ) : (
                  <dd>N/A</dd>
                )}
              </div>
              <p>
                <dt className='title'>imo:</dt>
                {shipData && typeof shipData.imo === "number"? (
                  <dd>{shipData.imo}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>mmsi:</dt>
                {shipData && typeof shipData.mmsi === "number"? (
                  <dd>{shipData.mmsi}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>abs:</dt>
                {shipData && typeof shipData.abs === "number"? (
                  <dd>{shipData.abs}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>class:</dt>
                {shipData && typeof shipData.class === "number"? (
                  <dd>{shipData.class}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Mass:</dt>
                {shipData && shipData.mass_kg && shipData.mass_lbs? (
                  <dd>{shipData.mass_kg}kg/{shipData.mass_lbs}lbs</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Year Built:</dt>
                {shipData && shipData.year_built ? (
                  <dd>{shipData.year_built}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Home Port:</dt>
                {shipData && shipData.home_port ? (
                  <dd>{shipData.home_port}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Status:</dt>
                {shipData && shipData.status ? (
                  <dd>{shipData.status}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Speed KN:</dt>
                {shipData && shipData.speed_kn ? (
                  <dd>{shipData.speed_kn}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Course Deg:</dt>
                {shipData && shipData.course_deg ? (
                  <dd>{shipData.course_deg}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Latitude:</dt>
                {shipData && shipData.latitude ? (
                  <dd>{shipData.latitude}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Longitude:</dt>
                {shipData && shipData.longitude ? (
                  <dd>{shipData.longitude}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Link:</dt>
                {shipData && shipData.link ? (
                  <dd>
                    <a
                      rel='noopener noreferrer'
                      target='_blank'
                      href={shipData.link}
                    >
                      {shipData.name} Link
                    </a>
                  </dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Active?:</dt>
                {shipData.active ? (
                  <dd>Yes</dd>
                ) : (
                  <dd>No</dd>
                )}
              </p>
              <div>
                <dt className='title'>Launches:</dt>
                {shipData && shipData.launches && shipData.launches.length >= 1 ? (
                  <ol>
                    {shipData.launches.map((launch) => (
                      // <li key={payload}>{payload}</li>
                      <li key={launch}>
                        <Link to={`/launches/${launch}`}>{launch}</Link>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <dd>N/A</dd>
                )}
              </div>
                           
            </dl>
            {/* <Link to='/launches'>Back to all launches...</Link> */}
          </Typography>
        </CardContent>
      </Card>
    );
  }
};

export default Ship;
