import axios from 'axios';


export default function List({launch}){

    // return (
    //     <div>
    //         <h1>{props.page}</h1>
    //     </div>
    // );
    return(
        <div>
            <h1>{launch.name}</h1>
            <h2>Flight Number: {launch.flight_number}</h2>
            <br/>
            {launch.links.flickr.original[0] ? (
            <img src={launch.links.flickr.original[0]} alt={launch.name} />
            ):(
            <img src={launch.links.patch.small} alt={launch.name} />)}

            <p>
            Launch Date (UTC): {launch.date_utc ? launch.date_utc : 'N/A'}
            </p>
            <p>
            Launch Video: {launch.links.webcast ? (
                <a href={launch.links.webcast}>
                    {launch.name} Video Link
                </a>) : 'N/A'}
            </p>
            <p>
            Launch Article: {launch.links.article ? (
                <a href={launch.links.article}>
                    {launch.name} Article Link
                </a>) : 'N/A'}
            </p>
            <p>
            Launch Wikipedia: {launch.links.wikipedia ? (
                <a href={launch.links.wikipedia}>
                    {launch.name} Wikipedia Link
                </a>) : 'N/A'}
            </p>
            <p>
            Details: {launch.details ? launch.details : 'N/A'}
            </p>
            <p>
            Success?: {launch.success ? Yes : No}
            </p>
            <p>
            Launchpad: {launch.launchpad ? (
                <Link href={`/launchpads/${launch.launchpad}`}>
                    {launch.launchpad}
                </Link>) : 'N/A'}
            </p>
            <p>
            Rocket: {launch.rocket ? (
                <Link href={`/rockets/${launch.rocket}`}>
                    {launch.rocket}
                </Link>) : 'N/A'}
            </p>
            <p>
            Rocket: {launch.rocket ? (
                <Link href={`/rockets/${launch.rocket}`}>
                    {launch.rocket}
                </Link>) : 'N/A'}
            </p>

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
    const {data} = await axios.post(`https://api.spacexdata.com/v4/launches/query`, {
        query: {}, 
        options: {}
    });
    // console.log(data)
  
    const paths = data.docs.map((launch) =>{
        return {
            params: {id: launch.id.toString()}
        }
    })
  
    return {
      paths,
      fallback: false
    };
  }
  