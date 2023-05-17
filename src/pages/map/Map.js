import {useState, useEffect} from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import "./Map.css"
import { rtdb } from '../../firebase-config'
import {ref, get, child} from 'firebase/database';

const dummyData=[
    {
        "name":"Node 1",
        "lat": "45.684012",
        "lon": "25.643561",
        "description": "Testing desc"
    },
    {
        "name":"Node 2",
        "lat": "45.693771",
        "lon": "25.655804",
        "description": "Testing desc 2"
    },
    
]

function Home(){

    const [isLoaded, setIsLoaded] = useState(false)

    const [sensors, setSensors] = useState([]);

    useEffect(() => {
        fetchNodes()
    },[]);

    const fetchNodes= async () => {
        const dbRef = ref(rtdb, '/');
        get(child(dbRef, `/`)).then((snapshot) => {
            if (snapshot.exists()) {
                const temp_nodes = Object.values(snapshot.val())
                console.log("nodes",temp_nodes);
                setSensors(temp_nodes)
            } else {
                console.log("No data available");
            }
        }).catch((err) => {
            console.error(err);
        }).finally(() => {
            setIsLoaded(true)
        })
    }

    return(
    <div>
        {!isLoaded ?
        <div>loading</div>
        :
        <MapContainer center={[`${sensors[0].lat}`, `${sensors[0].lon}`]} zoom={13} scrollWheelZoom={true}>
            <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {sensors.map(sensor => {
                return(
                <Marker key={sensor.id} position={[`${sensor.lat}`, `${sensor.lon}`]}>
                    <Popup>
                        <p><strong>Latitudine:</strong> {sensor.lat}</p>
                        <p><strong>Longitudine:</strong> {sensor.lon}</p>
                        <p><strong>Descriere:</strong> {sensor.desc}</p>
                    </Popup>
                </Marker>  
                )
            })}
            
        </MapContainer>
        }
    </div>
    )
}

export default Home;