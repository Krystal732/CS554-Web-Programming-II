import React from 'react'
import {Link} from 'react-router-dom'

const Home = () => {
  return (
    <div>
        <h2>The purpose of this website is to view information from the SpaceX API in a neat way!</h2>
        <br />
        <p>SpaceX designs, manufactures and launches advanced rockets and spacecraft. The company was founded in 2002 to revolutionize space technology, with the ultimate goal of enabling people to live on other planets.</p>
        <Link to='/launches/page/1'>Launches</Link>
    </div>
  )
}

export default Home