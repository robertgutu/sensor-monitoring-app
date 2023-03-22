import {useState, useEffect} from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import "./Map.css"
import { db } from '../../firebase-config'
import { collection,getDocs } from 'firebase/firestore'

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
    const sensorsReference = collection(db,"sensors");

    useEffect(() => {

        const fetchSensors = async () => {
            const data = await getDocs(sensorsReference)
            .then((data) => {
                setSensors(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
                setIsLoaded(true)
            })
            /* console.log("data",data) */
            
        }

        fetchSensors()
        
        
    },[]);

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
                        <p><strong>Descriere:</strong> {sensor.description}</p>
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