import React from 'react';
import {Link} from 'react-router-dom';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography
} from '@mui/material';

function LaunchListCard({launch}) {
  return (
    <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={launch.id}>
      <Card
        variant='outlined'
        sx={{
          maxWidth: 250,
          height: 'auto',
          marginLeft: 'auto',
          marginRight: 'auto',
          borderRadius: 5,
          border: '1px solid #1e8678',
          boxShadow:
            '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
        }}
      >
        <CardActionArea>
          <Link to={`/launches/${launch.id}`}>
            <CardMedia
              sx={{
                height: '100%',
                width: '100%'
              }}
              component='img'
              image={
                launch.links.flickr.original[0]
                  ? launch.links.flickr.original[0]
                  : launch.links.patch.small
              }
              title='launch image'
            />

            <CardContent>
              <Typography
                sx={{
                  borderBottom: '1px solid #1e8678',
                  fontWeight: 'bold'
                }}
                gutterBottom
                variant='h6'
                component='h3'
              >
                {launch.name}
              </Typography>
              <Typography variant='body2' color='textSecondary' component='p'>
                Flight Number: {launch.flight_number}
                <br />
                <span>More Info</span>
              </Typography>
            </CardContent>
          </Link>
        </CardActionArea>
      </Card>
    </Grid>
  );
}

export default LaunchListCard;
