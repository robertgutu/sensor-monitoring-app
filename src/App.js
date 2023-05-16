import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/home/Home.js'
import Map from './pages/map/Map.js'
import Header from './components/header/Header.js';
import Predictions from './pages/predictions/Predictions';
import AddNodes from './pages/AddNodes/AddNodes';

function App() {
  return (
    <div className="App">
      <Header />
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/map" element={<Map/>} />
          <Route path="/predictions" element={<Predictions/>} />
          <Route path="add-node" element={<AddNodes />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
