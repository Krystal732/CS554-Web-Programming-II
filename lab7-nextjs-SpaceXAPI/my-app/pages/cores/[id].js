import axios from 'axios';
import Link from 'next/link';
import Head from 'next/head'


export default function List({core}){

    // return (
    //     <div>
    //         <h1>{props.page}</h1>
    //     </div>
    // );
    return(
        <div>
          <Head>
            <title>{core.serial}</title>
          </Head>
            <h1>{core.serial}</h1>
            <br/>
            
            <p>
            Block: {core.block ? core.block : 'N/A'}
            </p>
            <br/>
            <p>
            Reuse Count: {typeof core.reuse_count === "number" ? core.reuse_count : 'N/A'}
            </p>
            <br/>
            <p>
            RTLS Attempts: {typeof core.rtls_attempts === "number" ? core.rtls_attempts : 'N/A'}
            </p>
            <br/>
            <p>
            RTLS Landings: {typeof core.rtls_landings === "number" ? core.rtls_landings : 'N/A'}
            </p>
            <br/>
            <p>
            ASDS Attempts: {typeof core.asds_attempts === "number" ? core.asds_attempts : 'N/A'}
            </p>
            <br/>
            <p>
            ASDS Landings: {typeof core.asds_landings === "number" ? core.asds_landings : 'N/A'}
            </p>
            <br/>
            <p>
            Last Update: {core.last_update ? core.last_update : 'N/A'}
            </p>
            <br/>
            <p>
            Status: {core.status ? core.status : 'N/A'}
            </p>
            <br/>
            <div>
                <p>Launches:</p>
                {core.launches && core.launches.length >= 1 ? (
                  <ol>
                    {core.launches.map((launch) => (
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
    const {data: core} = await axios.get(
        `https://api.spacexdata.com/v4/cores/${id}`
      );
    return {
      props: {
        core
      }
    };
  }


 
  export async function getStaticPaths(){
    const {data} = await axios.get(`https://api.spacexdata.com/v4/cores`);
  
    const paths = data.map((core) =>{
        return {
            params: {id: core.id.toString()}
        }
    })
  
    return {
      paths,
      fallback: false
    };
  }
  