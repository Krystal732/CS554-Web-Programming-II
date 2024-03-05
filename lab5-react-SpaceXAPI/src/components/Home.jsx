import React from 'react'
import {Link} from 'react-router-dom'

const Home = () => {
  return (
    <div>
        <h2>The purpose of this website is to view information from the SpaceX API in a neat way!</h2>
        <br />
        <p>SpaceX designs, manufactures and launches advanced rockets and spacecraft. The company was founded in 2002 to revolutionize space technology, with the ultimate goal of enabling people to live on other planets.</p>
        <br />
        <Link to='/launches/page/1'>Launches</Link>
        <br />
        <Link to='/payloads/page/1'>Payloads</Link>
        <br />
        <Link to='/cores/page/1'>Cores</Link>
        <br />
        <Link to='/rockets/page/1'>Rockets</Link>
        <br />
        <Link to='/ships/page/1'>Ships</Link>
        <br />
        <Link to='/launchpads/page/1'>Launchpads</Link>
    </div>
  )
}

export default Home