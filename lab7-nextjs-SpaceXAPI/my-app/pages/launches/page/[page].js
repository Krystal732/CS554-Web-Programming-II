import axios from 'axios';
import Link from 'next/link';


export default function List(props){

    // return (
    //     <div>
    //         <h1>{props.page}</h1>
    //     </div>
    // );
    return(
        <div>
            <ul>
                {props.data.map((launch) => (
                <li key={launch.id}>
                    <Link href={`/launches/${launch.id}`}>
                    <h1>{launch.name}</h1>
                    <h2>Flight Number: {launch.flight_number}</h2>
                    <br/>
                    {launch.links.flickr.original[0] ? (
                    <img src={launch.links.flickr.original[0]} alt={launch.name} style={{maxWidth: '250px'}}/>
                    ):(
                    <img src={launch.links.patch.small} alt={launch.name} />)}
                    </Link>
                    <br/>
                    <br/>
                </li>
                ))}
            </ul>
            <div>
            {props.prev ? <Link href={`/launches/page/${parseInt(props.page) - 1}`}>Previous</Link> : null}
            <br />
            {props.next ? <Link href={`/launches/page/${parseInt(props.page) + 1}`}>Next</Link> : null}
            </div>
        </div>
        
    )
        
  }
  
  export async function getStaticProps({params}){
    const page = params.page;
    const {data} = await axios.post(`https://api.spacexdata.com/v4/launches/query`, {
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
    const { data } = await axios.post(`https://api.spacexdata.com/v4/launches/query`, {
        query: {}, 
        options: {}
    });
    // console.log(data)
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
  