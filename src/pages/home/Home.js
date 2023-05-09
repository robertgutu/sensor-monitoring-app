import "./Home.css"
import Chart from '../../components/chart/Chart.js';
import {useState, useEffect} from 'react';
import { db, rtdb } from '../../firebase-config';
import { collection,getDocs } from 'firebase/firestore';
import {ref, onValue} from 'firebase/database'
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
    const [realtimeData, setRealtimeData] = useState([]);
    const [isRealtimeDataLoaded,setIsRealtimeDataLoaded] = useState(false)
    const [isDataLoaded,setIsDataLoaded] = useState(false)

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

    const fetchRTData = async () => {
        const rt_data_ref = await ref(rtdb,"/")
        onValue(rt_data_ref, (snapshot) => {
            const rt_data = snapshot.val();
            console.log("rt_data",Object.values(rt_data));
            setRealtimeData(Object.values(rt_data));
            setIsRealtimeDataLoaded(true)
        }) 
    };

    const fetchMeasurements = async () => {
        const fetched_data = await getDocs(measurementsReference)
        .then((data) => {
            console.log("measured_data",data.docs.map((doc) => ({...doc.data(), id: doc.id})))
            setMeasuredData(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
        }).finally(() => {
            setIsDataLoaded(true)
        })
        
    }

    /* const testFetchServer = () => {
        axios.get(`http://127.0.0.1:5000/measured_data`)
        .then(res => {
            console.log("res from Flask:",res);
            setTestData(res.data)
        })
        .catch(err => {
            console.error(err)
        })
    } */

    useEffect(() => {
        fetchRTData()
        fetchMeasurements()
    },[])

    /* useEffect(() => {
        const interval = setInterval(() => {
          console.log('This will run every second!');
          fetchRTData()
        }, 7000);
        return () => clearInterval(interval);
      }, []); */

    if(isDataLoaded && isRealtimeDataLoaded){
        return(
            <div className="container">
                
                    {realtimeData.map( node => {
                        return(
                            <div className="row custom-row">
                                <div className="col-4">
                                    <SensorWidget data={node}/>
                            
                                </div>
                                <div className="col-8">
                                    <Chart measured_data={measuredData} sensor_id={node.id}/>
                                </div>
                            </div>
                        )
                    })}
                    
                    <div className="test">
                        {JSON.stringify(testData)}
                    </div>
                
            </div>
            )
    }else{
        return(
            <div>Loading</div>
        )
    }
    
}

export default Home;