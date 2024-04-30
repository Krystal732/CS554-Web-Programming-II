import axios from 'axios';
import Link from 'next/link';
import Head from 'next/head'


export default function List({payload}){

    // return (
    //     <div>
    //         <h1>{props.page}</h1>
    //     </div>
    // );
    return(
        <div>
            <Head>
                <title>{payload.name}</title>
            </Head>
            <h1>{payload.name}</h1>
            <br/>
            
            <p>
            Payload Type: {payload.type ? payload.type : 'N/A'}
            </p>
            <br/>
            <p>
            Resused?: {payload.reused ? payload.reused : 'N/A'}
            </p>
            <br/>
            <div>
                <p>Nationalities:</p>
                {payload.nationalities && payload.nationalities >= 1 ? (
                  <ol>
                    {payload.nationalities.map((nationality) => (
                      <li key={nationality}>
                        {nationality}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p>N/A</p>
                )}
            </div>
            <br/>
            <div>
                <p>Manufactureres:</p>
                {payload.manufactureres && payload.manufactureres >= 1 ? (
                  <ol>
                    {payload.manufactureres.map((manufacturere) => (
                      <li key={manufacturere}>
                        {manufacturere}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p>N/A</p>
                )}
            </div>
            <br/>
            <p>
            Mass: {payload.mass_kg && payload.mass_lb ? `${payload.mass_kg}kg/${payload.mass_lb}lb` : 'N/A'}
            </p>
            <br/>
            <p>
            Orbit: {payload.orbit ? payload.orbit : 'N/A'}
            </p>
            <br/>
            <p>
            Reference System: {payload.reference_system ? payload.reference_system : 'N/A'}
            </p>
            <br/>
            <p>
            Regime: {payload.regime ? payload.regime : 'N/A'}
            </p>
            <br/>
            <p>
            Launch: {payload.launch ? (
                <Link href={`/launches/${payload.launch}`}>
                    {payload.launch}
                </Link>) : 'N/A'}
            </p>     

        </div>
        
    )
        
  }
  
  export async function getStaticProps({params}){
    const id = params.id;
    const {data: payload} = await axios.get(
        `https://api.spacexdata.com/v4/payloads/${id}`
      );
    // console.log(payload)          
    return {
      props: {
        payload
      }
    };
  }


 
  export async function getStaticPaths(){
    const {data} = await axios.get(`https://api.spacexdata.com/v4/payloads`);
    // console.log(data)
  
    const paths = data.map((payload) =>{
        return {
            params: {id: payload.id.toString()}
        }
    })
  
    return {
      paths,
      fallback: false
    };
  }
  