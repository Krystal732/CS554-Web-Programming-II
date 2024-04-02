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
import noImage from '../img/download.jpeg';


function ListCard({object, type}) {

  let pic = undefined
  let name = undefined
  let flight = undefined
  let serial = undefined

  if(type === 'launches'){ 
    pic = 
    <CardMedia
      sx={{
        height: '100%',
        width: '100%'
      }}
      component='img'
      image={
        object.links.flickr.original[0]
          ? object.links.flickr.original[0]
          : object.links.patch.small
      }
      title= {object.name}
    />

    flight = 
    <Typography variant='body2' color='textSecondary' component='p'>
    Flight Number: {object.flight_number}
    </Typography>

  }
  if(type === 'rockets'){ 
    pic = 
    <CardMedia
      sx={{
        height: '100%',
        width: '100%'
      }}
      component='img'
      image={
        object.flickr_images[0]
          ? object.flickr_images[0]
          : noImage
      }
      title= {object.name}
    />
  }
  if(type === 'launchpads'){ 
    pic = 
    <CardMedia
      sx={{
        height: '100%',
        width: '100%'
      }}
      component='img'
      image={
        object.images.large[0]
          ? object.images.large[0]
          : noImage
      }
      title= {object.name}
    />
  }
  if(type === 'ships'){ 
    pic = 
    <CardMedia
      sx={{
        height: '100%',
        width: '100%'
      }}
      component='img'
      image={
        object.image
          ? object.image
          : noImage
      }
      title= {object.name}
    />
  }
  if(type === 'launches' || type === 'payloads' || type === 'rockets' || type === 'ships' || type === 'launchpads'){
    name = 
    <Typography
      sx={{
        borderBottom: '1px solid #1e8678',
        fontWeight: 'bold'
      }}
      gutterBottom
      variant='h6'
      component='h3'
    >
      {object.name}
    </Typography>
  }
  if(type === 'cores'){
    serial = 
    <Typography
    sx={{
      borderBottom: '1px solid #1e8678',
      fontWeight: 'bold'
    }}
    gutterBottom
    variant='h6'
    component='h3'
  >
    {object.serial}
  </Typography>

  }
  



  return (
    <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={object.id}>
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
          <Link to={`/${type}/${object.id}`}>
            {pic}

            <CardContent>
              {name}
              {flight}
              {serial}

            </CardContent>
          </Link>
        </CardActionArea>
      </Card>
    </Grid>
  );
}

export default ListCard;
