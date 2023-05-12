import "./Home.css"
import Chart from '../../components/chart/Chart.js';
import {useState, useEffect} from 'react';
import { db, rtdb } from '../../firebase-config';
import { collection,getDocs } from 'firebase/firestore';
import {ref, onValue} from 'firebase/database'
import SensorWidget from "../../components/sensor_details/SensorWidget.js";
import axios from 'axios';
import NodeDetails from "../../components/nodeDetails/NodeDetails";

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
            const temp_data = data.docs.map((doc) => ({...doc.data(), id: doc.id}))
            console.log("measured_data",temp_data)
            setMeasuredData(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
        }).finally(() => {
            setIsDataLoaded(true)
        })
        
    }

    useEffect(() => {
        fetchRTData()
        fetchMeasurements()
    },[])

    if(isDataLoaded && isRealtimeDataLoaded){
        return(
            <div className="containerCustom">
                
                    {realtimeData.map( node => {
                        if(node.id === 0)
                        return(
                            <div key={node.id} className="row custom-row underlineCustom">
                                <div className="col-4 col-xl-2">
                                    <NodeDetails node={node}/>
                                </div>
                                <div className="col-8 col-xl-4">
                                    <SensorWidget data={node}/>
                            
                                </div>
                                <div className="col-12 col-xl-6">
                                    <Chart measured_data={measuredData} node={node} />
                                </div>
                            </div>
                        )
                    })}
                
            </div>
            )
    }else{
        return(
            <div>Loading</div>
        )
    }
    
}

export default Home;