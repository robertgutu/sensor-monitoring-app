import "./Home.css"
import Chart from '../../components/chart/Chart.js';
import {useState, useEffect} from 'react'
import { db } from '../../firebase-config'
import { collection,getDocs } from 'firebase/firestore'
import SensorWidget from "../../components/sensor_details/SensorWidget.js";

function Home(){

    const [sensors, setSensors] = useState([]);
    const sensorsReference = collection(db,"sensors");
    const measurementsReference = collection(db,"measured_values");
    const [sensorsLoaded, setSensorsLoaded] = useState(false)
    const [measuredData,setMeasuredData] = useState()

    useEffect(() => {
        const fetchSensors = async () => {
            const data = await getDocs(sensorsReference)
            /* console.log("data",data) */
            setSensors(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
            setSensorsLoaded(true)
        }

        fetchSensors()
    },[])

    useEffect(() => {
        const fetchMeasurements = async () => {
            const fetched_data = await getDocs(measurementsReference)
            .then((data) => {
                /* console.log("measured_data",data.docs.map((doc) => ({...doc.data(), id: doc.id}))[0].measured_humidity) */
                setMeasuredData(data.docs.map((doc) => ({...doc.data(), id: doc.id}))[0].measured_humidity)
            })
            
        }

        fetchMeasurements()
    },[])

    return(
    <div className="container">
        
            {sensors.map( sensor => {
                return(
                    <div className="row custom-row">
                        <div className="col-4">
                            <SensorWidget data={sensor}/>
                    
                        </div>
                        <div className="col-8">
                            <Chart measured_data={measuredData} sensor_id={sensor.sensor_id}/>
                        </div>
                    </div>
                )
            })}
            
        
    </div>
    )
}

export default Home;