import axios from 'axios';
import Link from 'next/link';
import Head from 'next/head'


export default function List(props){

    // return (
    //     <div>
    //         <h1>{props.page}</h1>
    //     </div>
    // );
    return(
        <div>
          <Head>
            <title>Ships</title>
          </Head>
            <ul>
                {props.data.map((ship) => (
                <li key={ship.id}>
                    <Link href={`/ships/${ship.id}`}>
                    <h1>{ship.name}</h1>
                    <br/>
                    {ship.image && (
                      <img src={ship.image} alt={ship.name} style={{maxWidth: '250px'}}/>
                    )}
                    </Link>
                    <br/>
                    <br/>
                </li>
                ))}
            </ul>
            <div>
            {props.prev ? <Link href={`/ships/page/${parseInt(props.page) - 1}`}>Previous</Link> : null}
            <br />
            {props.next ? <Link href={`/ships/page/${parseInt(props.page) + 1}`}>Next</Link> : null}
            </div>
        </div>
        
    )
        
  }
  
  export async function getStaticProps({params}){
    const page = params.page;
    const {data} = await axios.post(`https://api.spacexdata.com/v4/ships/query`, {
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
    const { data } = await axios.post(`https://api.spacexdata.com/v4/ships/query`, {
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
  