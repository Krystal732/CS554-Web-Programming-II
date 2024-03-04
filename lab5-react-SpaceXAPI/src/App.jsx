import './App.css'
import {Route, Routes} from 'react-router-dom';
import LaunchesList from './components/LaunchesList';
import Launch from './components/Launch';
import Home from './components/Home';


function App() {

  return (
    <>
    <header>
      <h1>
        Welcome to the SpaceX API
      </h1>
    </header>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/launches/page/:id' element={<LaunchesList />} />
        <Route path='/launches/:id' element={<Launch />} />
      </Routes>
    </>
  )
}

export default App
