
import {useState, useEffect} from 'react';
import { db, rtdb } from '../../firebase-config';
import { collection,getDocs } from 'firebase/firestore';
import {ref, onValue, get, child} from 'firebase/database';
import PredictionChart from '../../components/chart/PredictionChart';
import './Predictions.css'

function Predictions(){

    const measurementsReference = collection(db,"measurements");
    const [measuredData,setMeasuredData] = useState()
    const [nodes, setNodes] = useState([]);
    const [isNodesLoaded,setIsNodesLoaded] = useState(false)
    const [isDataLoaded,setIsDataLoaded] = useState(false)
    const [error,setError] = useState(false)

    const fetchMeasurements = async () => {
        await getDocs(measurementsReference)
        .then((data) => {
            const temp_data = data.docs.map((doc) => ({...doc.data(), id: doc.id}))
            temp_data.map(el => {
                el.timestamp = parseInt(el.timestamp)*1000;
              }) 
            temp_data.sort(((a,b) => a.timestamp - b.timestamp))

            console.log("measured_data",temp_data)

            setMeasuredData(temp_data)
        }).catch(err => {
            console.error(err)
            setError(true)
        })
        .finally(() => {
            setIsDataLoaded(true)
        })
        
    }

    const fetchNodes= async () => {
        const dbRef = ref(rtdb, '/');
        get(child(dbRef, `/`)).then((snapshot) => {
            if (snapshot.exists()) {
                const temp_nodes = Object.values(snapshot.val())
                console.log("nodes",temp_nodes);
                setNodes(temp_nodes)
            } else {
                console.log("No data available");
            }
        }).catch((err) => {
            console.error(err);
        }).finally(() => {
            setIsNodesLoaded(true)
        })
    }

    

    useEffect(() => {
        fetchNodes()
        fetchMeasurements()
    },[])

    if(isDataLoaded && isNodesLoaded){
        if(error){
            return(<div>Something went wrong while fetching data</div>)
        }else{
            return(
                <div className="containerCustom">
                    
                        {nodes.map( node => {
                            return(
                                <>
                                <div>
                                    <div className="nodeTitle">
                                        {node.name}-ID:{node.id} (Latitude: {node.lat}, Longitude: {node.lon})  
                                    </div>
                                    
                                </div>
                                <div key={node.id} className="row custom-row underlineCustom">
                                    <div className="col-12 col-xl-6">
                                        <PredictionChart measured_data={measuredData.filter(el => el.node_id === node.id)} node={node} prediction_type={1}/>
                                    </div>
                                    <div className="col-12 col-xl-6">
                                        <PredictionChart measured_data={measuredData.filter(el => el.node_id === node.id)} node={node} prediction_type={2}/>
                                    </div>
                                </div>
                                </>
                                
                            )
                        })}
                    
                </div>
            )
        }
    }else{
        return(
            <div>Loading</div>
        )
    }
    
}

export default Predictions;