import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/home/Home.js'
import Map from './pages/map/Map.js'
import Header from './components/header/Header.js';
import Predictions from './pages/predictions/Predictions';
import AddNodes from './pages/AddNodes/AddNodes';
import { ToastContainer} from 'react-toastify';

function App() {
  return (
    <div className="App">
      <Header />
      <Router>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        />
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
