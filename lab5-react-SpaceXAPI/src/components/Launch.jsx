import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link, useParams} from 'react-router-dom';

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardHeader
} from '@mui/material';
import '../App.css';

const Launch = () => {
  const [launchData, setLaunchData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  let {id} = useParams();


  useEffect(() => {
    async function fetchData() {
      try {
        const {data: launch} = await axios.get(
          `https://api.spacexdata.com/v4/launches/${id}`
        );
        setLaunchData(launch);
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
          title={launchData.name}
          sx={{
            borderBottom: '1px solid #1e8678',
            fontWeight: 'bold'
          }}
        />
        <CardMedia
          component='img'
          image={
            launchData.links.flickr.original[0]
                  ? launchData.links.flickr.original[0]
                  : launchData.links.patch.small
          }
          title='Launch image'
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
                <dt className='title'>Launch Date (UTC):</dt>
                {launchData && launchData.date_utc? (
                  <dd>{launchData.date_utc}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Launch Video:</dt>
                {launchData && launchData.links.webcast ? (
                  <dd>
                    <a
                      rel='noopener noreferrer'
                      target='_blank'
                      href={launchData.links.webcast}
                    >
                      {launchData.name} Video Link
                    </a>
                  </dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Launch Article:</dt>
                {launchData && launchData.links.article ? (
                  <dd>
                    <a
                      rel='noopener noreferrer'
                      target='_blank'
                      href={launchData.links.article}
                    >
                      {launchData.name} Article Link
                    </a>
                  </dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Launch Wikipedia:</dt>
                {launchData && launchData.links.wikipedia ? (
                  <dd>
                    <a
                      rel='noopener noreferrer'
                      target='_blank'
                      href={launchData.links.wikipedia}
                    >
                      {launchData.name} Wikipedia Link
                    </a>
                  </dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Details:</dt>
                {launchData && launchData.details ? (
                  <dd>{launchData.details}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Flight Number:</dt>
                {launchData && launchData.flight_number ? (
                  <dd>{launchData.flight_number}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Success?:</dt>
                {launchData.success ? (
                  <dd>Yes</dd>
                ) : (
                  <dd>No</dd>
                )}
              </p>
              <p>
                <dt className='title'>Launchpad:</dt>
                {launchData && launchData.launchpad ? (
                  // <dd>{launchData.launchpad}</dd>
                  <Link to={`/launchpads/${launchData.launchpad}`}>{launchData.launchpad}</Link>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Rocket:</dt>
                {launchData && launchData.rocket ? (
                  // <dd>{launchData.rocket}</dd>
                  <Link to={`/rockets/${launchData.rocket}`}>{launchData.rocket}</Link>

                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <div>
                <dt className='title'>Payloads:</dt>
                {launchData && launchData.payloads && launchData.payloads.length >= 1 ? (
                  <ol>
                    {launchData.payloads.map((payload) => (
                      // <li key={payload}>{payload}</li>
                      <li key={payload}>
                        <Link to={`/payloads/${payload}`}>{payload}</Link>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <dd>N/A</dd>
                )}
              </div>
              <div>
                <dt className='title'>Ships:</dt>
                {launchData && launchData.ships && launchData.ships.length >= 1 ? (
                  <ol>
                    {launchData.ships.map((ship) => (
                      // <li key={ship}>{ship}</li>
                      <li key={ship}>{ship}
                        <Link to={`/ships/${ship}`}>{ship}</Link>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <dd>N/A</dd>
                )}
              </div>
              <div>
                <dt className='title'>Cores:</dt>
                {launchData && launchData.cores && launchData.cores.length >= 1 ? (
                  <ol>
                    {launchData.cores.map((core) => (
                      // <li key={core.core}>{core.core}</li>
                      <li key={core.core}>
                        <Link to={`/cores/${core.core}`}>{core.core}</Link>
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

export default Launch;
