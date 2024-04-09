import React from 'react';
import './App.css';
import {NavLink, Route, Routes} from 'react-router-dom';
import Home from './Home';
import ArtistList from './ArtistList';
// import Employers from './Employers';

function App() {
  console.log("app")
  return (
    <div>
      <header className='App-header'>
        <h1 className='App-title center'>
          DbIM GraphQL With Apollo Client/Server 
        </h1>

      </header>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/artists' element={<ArtistList />} />
        {/* <Route path='/artists/:id' element={<Artist />} /> */}
      </Routes>
    </div>
  );
}

export default App;