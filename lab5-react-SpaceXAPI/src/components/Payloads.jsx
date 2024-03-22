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

const Payload = () => {
  const [payloadData, setPayloadData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  let {id} = useParams();


  useEffect(() => {
    async function fetchData() {
      try {
        const {data: payload} = await axios.get(
          `https://api.spacexdata.com/v4/payloads/${id}`

        );
        setPayloadData(payload);
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
          title={payloadData.name}
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
                <dt className='title'>Payload Type:</dt>
                {payloadData && payloadData.type? (
                  <dd>{payloadData.type}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Reused?:</dt>
                {payloadData.reused ? (
                  <dd>Yes</dd>
                ) : (
                  <dd>No</dd>
                )}
              </p>
              <div>
                <dt className='title'>Nationalities:</dt>
                {payloadData && payloadData.nationalities && payloadData.nationalities.length >= 1 ? (
                  <ol>
                    {payloadData.nationalities.map((nationality) => (
                      // <li key={payload}>{payload}</li>
                      <li key={nationality}>
                        <dd>{nationality}</dd>
                      </li>
                    ))}
                  </ol>
                  ) : (
                  <dd>N/A</dd>
                )}
              </div>
              <div>
                <dt className='title'>Manufactureres:</dt>
                {payloadData && payloadData.manufactureres && payloadData.manufactureres.length >= 1 ? (
                  <ol>
                    {payloadData.manufactureres.map((manufacture) => (
                      // <li key={payload}>{payload}</li>
                      <li key={manufacture}>
                        <dd>{manufacture}</dd>
                      </li>
                    ))}
                  </ol>
                  ) : (
                  <dd>N/A</dd>
                )}
              </div>
              <p>
                <dt className='title'>Mass:</dt>
                {payloadData && payloadData.mass_kg && payloadData.mass_lb? (
                  <dd>{payloadData.mass_kg}kg/{payloadData.mass_lb}lb</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Orbit:</dt>
                {payloadData && payloadData.orbit ? (
                  <dd>{payloadData.orbit}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Reference System:</dt>
                {payloadData && payloadData.reference_system ? (
                  <dd>{payloadData.reference_system}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Regime:</dt>
                {payloadData && payloadData.regime ? (
                  <dd>{payloadData.regime}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Launch:</dt>
                {payloadData && payloadData.launch ? (
                  // <dd>{launchData.launchpad}</dd>
                  <Link to={`/launches/${payloadData.launch}`}>{payloadData.launch}</Link>
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

export default Payload;
