import axios from 'axios';
import Link from 'next/link';
import Head from 'next/head'



export default function List({ship}){

    // return (
    //     <div>
    //         <h1>{props.page}</h1>
    //     </div>
    // );
    return(
        <div>
          <Head><title>{ship.name}</title></Head>
            <h1>{ship.name}</h1>
            <br/>
            {ship.image && (
              <img src={ship.image} alt={ship.name} style={{maxWidth: '250px'}}/>
            )}
            <br/>
            <p>
            Legacy ID: {ship.legacy_id ? ship.legacy_id : 'N/A'}
            </p>
            <br/>
            <p>
            Model: {ship.model ? ship.model : 'N/A'}
            </p>
            <br/>
            <p>
            Type: {ship.type ? ship.type : 'N/A'}
            </p>
            <br/>
            <div>
                <p>Roles:</p>
                {ship.roles && ship.roles >= 1 ? (
                  <ol>
                    {ship.roles.map((role) => (
                      <li key={role}>
                        {role}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p>N/A</p>
                )}
            </div>
            <br/>
            <p>
            imo: {typeof ship.imo === "number" ? ship.imo : 'N/A'}
            </p>
            <br/>
            <p>
            mmsi: {typeof ship.mmsi === "number" ? ship.mmsi : 'N/A'}
            </p>
            <br/>
            <p>
            abs: {typeof ship.abs === "number" ? ship.abs : 'N/A'}
            </p>
            <br/>
            <p>
            class: {typeof ship.class === "number" ? ship.class : 'N/A'}
            </p>
            <br/>
            <p>
            Mass: {ship.mass_kg && ship.mass_lb ? `${ship.mass_kg}kg/${ship.mass_lb}lb` : 'N/A'}
            </p>
            <br/>
            <p>
            Year Built: {ship.year_built ? ship.year_built : 'N/A'}
            </p>
            <br/>
            <p>
            Home Port: {ship.home_port ? ship.home_port : 'N/A'}
            </p>
            <br/>
            <p>
            Status: {ship.status ? ship.status : 'N/A'}
            </p>
            <br/>
            <p>
            Speed KN: {ship.speed_kn ? ship.speed_kn : 'N/A'}
            </p>
            <br/>
            <p>
            Course Deg: {ship.course_deg ? ship.course_deg : 'N/A'}
            </p>
            <br/>
            <p>
            Latitude: {ship.latitude ? ship.latitude : 'N/A'}
            </p>
            <br/>
            <p>
            Longitude: {ship.longitude ? ship.longitude : 'N/A'}
            </p>
            <br/>
            <p>
            Link: {ship.link ? (
                <a href={ship.link}>
                    {ship.name} Link
                </a>) : 'N/A'}
            </p>
            <br/>
            <p>
            Active?: {ship.active ? "Yes" : "No"}
            </p>
            <br/>
            <div>
                <p>Launches:</p>
                {ship.launches && ship.launches.length >= 1 ? (
                  <ol>
                    {ship.launches.map((launch) => (
                      <li key={launch}>
                        <Link href={`/launches/${launch}`}>{launch}</Link>
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
    const {data: ship} = await axios.get(
        `https://api.spacexdata.com/v4/ships/${id}`
      );
    return {
      props: {
        ship
      }
    };
  }


 
  export async function getStaticPaths(){
    const {data} = await axios.get(`https://api.spacexdata.com/v4/ships`);
  
    const paths = data.map((ship) =>{
        return {
            params: {id: ship.id.toString()}
        }
    })
  
    return {
      paths,
      fallback: false
    };
  }
  