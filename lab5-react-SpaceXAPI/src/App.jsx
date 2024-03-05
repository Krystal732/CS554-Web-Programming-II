import './App.css'
import {Route, Routes} from 'react-router-dom';
import List from './components/List';
import Launch from './components/Launch';
import Payloads from './components/Payloads'
import Rockets from './components/Rockets'
import Ships from './components/Ships'
import Cores from './components/Cores'
import Launchpads from './components/Launchpads'
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
        <Route path='/launches/page/:id' element={<List
        type = 'launches'
        />} />
        <Route path='/payloads/page/:id' element={<List
        type = 'payloads'
        />} />
        <Route path='/cores/page/:id' element={<List
        type = 'cores'
        />} />
        <Route path='/rockets/page/:id' element={<List
        type = 'rockets'
        />} />
        <Route path='/ships/page/:id' element={<List
        type = 'ships'
        />} />
        <Route path='/launchpads/page/:id' element={<List
        type = 'launchpads'
        />} />
        <Route path='/launches/:id' element={<Launch />} />
        <Route path='/payloads/:id' element={<Payloads />} />
        <Route path='/cores/:id' element={<Cores />} />
        <Route path='/rockets/:id' element={<Rockets />} />
        <Route path='/ships/:id' element={<Ships />} />
        <Route path='/launchpads/:id' element={<Launchpads />} />

      </Routes>
    </>
  )
}

export default App
