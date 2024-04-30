import axios from 'axios';
import Head from 'next/head'



export default function List({rocket}){

    // return (
    //     <div>
    //         <h1>{props.page}</h1>
    //     </div>
    // );
    return(
        <div>
          <Head><title>{rocket.name}</title></Head>
            <h1>{rocket.name}</h1>
            <br/>
            {rocket.flickr_images[0] && (
            <img src={rocket.flickr_images[0]} alt={rocket.name} style={{maxWidth: '250px'}}/>
            )}
            <br/>
            <p>
            Active?: {rocket.active ? "Yes" : "No"}
            </p>
            <br/>
            <p>
            Stages: {typeof rocket.stages === "number" ? rocket.stages : 'N/A'}
            </p>
            <br/>
            <p>
            Boosters: {typeof rocket.boosters === "number" ? rocket.boosters : 'N/A'}
            </p>
            <br/>
            <p>
            Cost Per Launch: {typeof rocket.cost_per_launch === "number" ? rocket.cost_per_launch : 'N/A'}
            </p>
            <br/>
            <p>
            Success Rate Percent: {typeof rocket.success_rate_pct === "number" ? rocket.success_rate_pct : 'N/A'}
            </p>
            <br/>
            <p>
            First Fligt: {rocket.first_flight ? rocket.first_flight : 'N/A'}
            </p>
            <br/>
            <p>
            Country: {rocket.country ? rocket.country : 'N/A'}
            </p>
            <br/>
            <p>
            Rocket Wikipedia: {rocket.wikipedia ? (
            <a href={rocket.wikipedia}>
                {rocket.name} Wikipedia Link
            </a>) : 'N/A'}
            </p>
            <br/>
            <p>
            Description: {rocket.description ? rocket.description : 'N/A'}
            </p>
            <br/>
            <p>
            Mass: {rocket.mass.kg && rocket.mass.lb? `${rocket.mass.kg}kg/${rocket.mass.lb}` : 'N/A'}
            </p>
            <br/>
            <p>
            Height: {rocket.height.meters && rocket.height.feet? `${rocket.height.meters}m/${rocket.height.feet}ft` : 'N/A'}
            </p>
            <br/>
            <p>
            Diameter: {rocket.diameter.meters && rocket.diameter.feet? `${rocket.diameter.meters}m/${rocket.diameter.feet}ft` : 'N/A'}
            </p>
        
        </div>
        
    )
        
  }
  
  export async function getStaticProps({params}){
    const id = params.id;
    const {data: rocket} = await axios.get(
        `https://api.spacexdata.com/v4/rockets/${id}`
      );
    return {
      props: {
        rocket
      }
    };
  }


 
  export async function getStaticPaths(){
    const {data} = await axios.get(`https://api.spacexdata.com/v4/rockets`);
  
    const paths = data.map((rocket) =>{
        return {
            params: {id: rocket.id.toString()}
        }
    })
  
    return {
      paths,
      fallback: false
    };
  }
  