import "./Home.css"
import Chart from '../../components/chart/Chart.js';
import {useState, useEffect} from 'react'
import { db } from '../../firebase-config'
import { collection,getDocs } from 'firebase/firestore'
import SensorWidget from "../../components/sensor_details/SensorWidget.js";
import axios from 'axios';

function Home(){

    const [sensors, setSensors] = useState([]);
    const sensorsReference = collection(db,"sensors");
    const measurementsReference = collection(db,"measurements");
    //const measurementsReference = collection(db,"measured_values");
    const [sensorsLoaded, setSensorsLoaded] = useState(false)
    const [measuredData,setMeasuredData] = useState()
    const [testData,setTestData] = useState()

    useEffect(() => {
        const fetchSensors = async () => {
            const data = await getDocs(sensorsReference)
            //console.log("data",data.docs.map((doc) => ({...doc.data(), id: doc.id}))) 
            setSensors(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
            setSensorsLoaded(true)
        }

        fetchSensors()
        //testFetchServer()
    },[])

    const testFetchServer = () => {
        axios.get(`http://127.0.0.1:5000/measured_data`)
        .then(res => {
            console.log("res from Flask:",res);
            setTestData(res.data)
        })
        .catch(err => {
            console.error(err)
        })
    }

    useEffect(() => {
        const fetchMeasurements = async () => {
            const fetched_data = await getDocs(measurementsReference)
            .then((data) => {
                console.log("measured_data",data.docs.map((doc) => ({...doc.data(), id: doc.id})))
                setMeasuredData(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
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
            
            <div className="test">
                {JSON.stringify(testData)}
            </div>
        
    </div>
    )
}

export default Home;