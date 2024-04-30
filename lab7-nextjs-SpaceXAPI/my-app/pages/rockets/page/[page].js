import axios from 'axios';
import Link from 'next/link';
import Head from 'next/head'


export default function List(props){

    return(
        <div>
          <Head>
            <title>Rockets</title>
          </Head>
            <ul>
                {props.data.map((rocket) => (
                <li key={rocket.id}>
                    <Link href={`/rockets/${rocket.id}`}>
                    <h1>{rocket.name}</h1>
                    <br/>
                    {rocket.flickr_images[0] && (
                    <img src={rocket.flickr_images[0]} alt={rocket.name} style={{maxWidth: '250px'}}/>
                    )}
                    </Link>
                    <br/>
                    <br/>
                </li>
                ))}
            </ul>
            <div>
            {props.prev ? <Link href={`/rockets/page/${parseInt(props.page) - 1}`}>Previous</Link> : null}
            <br />
            {props.next ? <Link href={`/rockets/page/${parseInt(props.page) + 1}`}>Next</Link> : null}
            </div>
        </div>
        
    )
        
  }
  
  export async function getStaticProps({params}){
    const page = params.page;
    const {data} = await axios.post(`https://api.spacexdata.com/v4/rockets/query`, {
        query: {}, 
        options: {
        limit: 10,
        page: page
        }
    });

          
    return {
      props: {
        page,
        data: data.docs,
        prev: data.hasPrevPage,
        next: data.hasNextPage,
        loading: false
      }
    };
  }


 
  export async function getStaticPaths(){
    const {data} = await axios.post(`https://api.spacexdata.com/v4/rockets/query`, {
        query: {}, 
        options: {}
    });
    const pages = Array.from({length: data.totalPages}, (_, i) => (i + 1).toString()); 
  
    const paths = pages.map((page) =>{
        return {
            params: {page: page}
        }
    })
  
    return {
      paths,
      fallback: false
    };
  }
  