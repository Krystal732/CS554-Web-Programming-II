import axios from 'axios';
import Link from 'next/link';
import Head from 'next/head'



export default function List({launch}){

    // return (
    //     <div>
    //         <h1>{props.page}</h1>
    //     </div>
    // );
    return(
        <div>
            <Head><title>{launch.name}</title></Head>
            <h1>{launch.name}</h1>
            <h2>Flight Number: {launch.flight_number}</h2>
            <br/>
            {launch.links.flickr.original[0] ? (
            <img src={launch.links.flickr.original[0]} alt={launch.name } style={{maxWidth: '250px'}} />
            ):(
            <img src={launch.links.patch.small} alt={launch.name} />)}
            <br/>
            <p>
            Launch Date (UTC): {launch.date_utc ? launch.date_utc : 'N/A'}
            </p>
            <br/>
            <p>
            Launch Video: {launch.links.webcast ? (
                <a href={launch.links.webcast}>
                    {launch.name} Video Link
                </a>) : 'N/A'}
            </p>
            <br/>
            <p>
            Launch Article: {launch.links.article ? (
                <a href={launch.links.article}>
                    {launch.name} Article Link
                </a>) : 'N/A'}
            </p>
            <br/>
            <p>
            Launch Wikipedia: {launch.links.wikipedia ? (
                <a href={launch.links.wikipedia}>
                    {launch.name} Wikipedia Link
                </a>) : 'N/A'}
            </p>
            <br/>
            <p>
            Details: {launch.details ? launch.details : 'N/A'}
            </p>
            <br/>
            <p>
            Success?: {launch.success ? "Yes" : "No"}
            </p>
            <br/>
            <p>
            Launchpad: {launch.launchpad ? (
                <Link href={`/launchpads/${launch.launchpad}`}>
                    {launch.launchpad}
                </Link>) : 'N/A'}
            </p>
            <br/>
            <p>
            Rocket: {launch.rocket ? (
                <Link href={`/rockets/${launch.rocket}`}>
                    {launch.rocket}
                </Link>) : 'N/A'}
            </p>
            <br/>
            <div>
                <p>Payloads:</p>
                {launch.payloads && launch.payloads.length >= 1 ? (
                  <ol>
                    {launch.payloads.map((payload) => (
                      <li key={payload}>
                        <Link href={`/payloads/${payload}`}>{payload}</Link>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p>N/A</p>
                )}
            </div>
            <br/>
            <div>
                <p>Ships:</p>
                {launch.ships && launch.ships.length >= 1 ? (
                  <ol>
                    {launch.ships.map((ship) => (
                      <li key={ship}>
                        <Link href={`/ships/${ship}`}>{ship}</Link>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p>N/A</p>
                )}
            </div>
            <br/>
            <div>
                <p>Cores:</p>
                {launch.cores && launch.cores.length >= 1 ? (
                  <ol>
                    {launch.cores.map((core) => (
                      <li key={core.core}>
                        <Link href={`/cores/${core.core}`}>{core.core}</Link>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p>N/A</p>
                )}
            </div>

        </div>
        
    )
        
  }
  
  export async function getStaticProps({params}){
    const id = params.id;
    const {data: launch} = await axios.get(
        `https://api.spacexdata.com/v4/launches/${id}`
      );
    // console.log(launch)          
    return {
      props: {
        launch
      }
    };
  }


 
  export async function getStaticPaths(){
    const {data} = await axios.get(`https://api.spacexdata.com/v4/launches`);
    // console.log(data)
  
    const paths = data.map((launch) =>{
        return {
            params: {id: launch.id.toString()}
        }
    })
  
    return {
      paths,
      fallback: false
    };
  }
  