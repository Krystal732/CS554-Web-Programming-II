import React from 'react'
import {Link} from 'react-router-dom'


const Home = () => {
  return (
    <div>
        <h2>The purpose of this website is to learn how to use GraphQL with React using our Lab 3</h2>
        <br />
        <Link to='/artists'>Artists</Link>
        <br />
        {/* <Link to='/payloads/page/1'>Payloads</Link>
        <br />
        <Link to='/cores/page/1'>Cores</Link>
        <br />
        <Link to='/rockets/page/1'>Rockets</Link>
        <br />
        <Link to='/ships/page/1'>Ships</Link>
        <br />
        <Link to='/launchpads/page/1'>Launchpads</Link> */}
    </div>
  )
}

export default Home