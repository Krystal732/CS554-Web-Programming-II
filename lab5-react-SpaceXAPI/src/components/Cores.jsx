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

const Cores = () => {
  const [coreData, setcoreData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  let {id} = useParams();


  useEffect(() => {
    async function fetchData() {
      try {
        const {data: core} = await axios.get(
          `https://api.spacexdata.com/v4/cores/${id}`

        );
        setcoreData(core);
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
          title={coreData.serial}
          sx={{
            borderBottom: '1px solid #1e8678',
            fontWeight: 'bold'
          }}
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
                <dt className='title'>Block:</dt>
                {coreData && coreData.block? (
                  <dd>{coreData.block}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Reuse Count:</dt>
                {coreData && typeof coreData.reuse_count === "number" ? (
                  <dd>{coreData.reuse_count}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>RTLS Attempts:</dt>
                {coreData && typeof coreData.rtls_attempts === "number"? (
                  <dd>{coreData.rtls_attempts}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>RTLS landings:</dt>
                {coreData && typeof coreData.rtls_landings === "number"? (
                  <dd>{coreData.rtls_landings}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>ASDS Attempts:</dt>
                {coreData && typeof coreData.asds_attempts === "number"? (
                  <dd>{coreData.rtls_attempts}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>ASDS Landings:</dt>
                {coreData && typeof coreData.asds_landings === "number"? (
                  <dd>{coreData.asds_landings}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Last Update:</dt>
                {coreData && coreData.last_update? (
                  <dd>{coreData.last_update}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Status:</dt>
                {coreData && coreData.status? (
                  <dd>{coreData.status}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <div>
                <dt className='title'>Launches:</dt>
                {coreData && coreData.launches && coreData.launches.length >= 1 ? (
                  <ol>
                    {coreData.launches.map((launch) => (
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

export default Cores;
