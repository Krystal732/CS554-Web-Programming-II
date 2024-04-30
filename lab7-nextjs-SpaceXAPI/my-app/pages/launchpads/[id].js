import axios from 'axios';
import Link from 'next/link';
import Head from 'next/head'




export default function List({launchpad}){

    return(
        <div>
            <Head>
                <title>{launchpad.name}</title>
            </Head>
            <h1>{launchpad.name}</h1>
            <br/>
            {launchpad.images.large[0] && (
            <img src={launchpad.images.large[0]} alt={launchpad.name } style={{maxWidth: '250px'}} />
            )}
            <br/>
            <p>
            Full Name: {launchpad.full_name ? launchpad.full_name : 'N/A'}
            </p>
            <br/>
            <p>
            Locality: {launchpad.locality ? launchpad.locality : 'N/A'}
            </p>
            <br/>
            <p>
            Region: {launchpad.region ? launchpad.region : "N?A"}
            </p>
            <br/>
            <p>
            Latitude: {launchpad.latitude ? launchpad.latitude : "N?A"}
            </p>
            <br/>
            <p>
            Longitude: {launchpad.longitude ? launchpad.longitude : "N?A"}
            </p>
            <br/>
            <p>
            Launch Attempts: {typeof launchpad.launch_attempts === "number" ? launchpad.launch_attempts : 'N/A'}
            </p>
            <br/>
            <p>
            Launch Successes: {typeof launchpad.launch_successes === "number" ? launchpad.launch_successes : 'N/A'}
            </p>
            <br/>
            <p>
            Timezone: {launchpad.timezone ? launchpad.timezone : "N?A"}
            </p>
            <br/>
            <p>
            Status: {launchpad.status ? launchpad.status : "N?A"}
            </p>  
            <br/>
            <p>
            Details: {launchpad.details ? launchpad.details : "N?A"}
            </p>  
            <br/>
            <div>
                <p>Rockets:</p>
                {launchpad.rockets && launchpad.rockets.length >= 1 ? (
                  <ol>
                    {launchpad.rockets.map((rocket) => (
                      <li key={rocket}>
                        <Link href={`/rockets/${rocket}`}>{rocket}</Link>
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
    const {data: launchpad} = await axios.get(
        `https://api.spacexdata.com/v4/launchpads/${id}`
      );
    return {
      props: {
        launchpad
      }
    };
  }


 
  export async function getStaticPaths(){
    const {data} = await axios.get(`https://api.spacexdata.com/v4/launchpads`);
  
    const paths = data.map((launchpad) =>{
        return {
            params: {id: launchpad.id.toString()}
        }
    })
  
    return {
      paths,
      fallback: false
    };
  }
  