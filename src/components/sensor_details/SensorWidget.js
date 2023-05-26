import {useState, useEffect} from 'react';
import GaugeChart from 'react-gauge-chart'
import './SensorWidget.css'
import { rtdb } from '../../firebase-config';
import {ref, onValue} from 'firebase/database';

function SensorWidget(props){

    const [node,setNode] = useState('');
    const [isNodeLoaded,setIsNodeLoaded] = useState(false)


    useEffect(() => {

        console.log("node id:", props.node_id)
        fetchRTData(props.node_id)

    },[props.node_id])

    const fetchRTData = async (curr_node_id) => {
        const rt_data_ref = await ref(rtdb,"/")
        onValue(rt_data_ref, (snapshot) => {
            const rt_data = snapshot.val();
            const current_node = Object.values(rt_data).find(el => el.id ===curr_node_id)
            console.log("current_node",current_node);
            setNode(current_node)
            setIsNodeLoaded(true)
            //setRealtimeData(Object.values(rt_data));
            //setIsRealtimeDataLoaded(true)
        }) 
    };



    return(
        <div className="card widget-card">
            <div className="card-header widget-header">
                Realtime values for {node.name}
            </div>
            <div className="card-body widget-content">
                <div className="row">
                    <div className="col-4 meterCol">
                        <GaugeChart className="widget-meter" id="gauge-chart2" 
                        nrOfLevels={3} 
                        formatTextValue={value => value+' C'}
                        percent={node.temperature ? node.temperature/100 : 0} 
                        animate={false}
                        />
                        <p className="meter-name">Temperature</p>
                    </div>
                    <div className="col-4 meterCol">
                        <GaugeChart className="widget-meter" id="gauge-chart2" 
                        nrOfLevels={20} 
                        formatTextValue={value => value+' %'}
                        percent={node.humidity ? node.humidity/100 : 0} 
                        animate={false}
                        />
                        <p className="meter-name">Humidity</p>
                    </div>
                    <div className="col-4 meterCol">
                        <GaugeChart className="widget-meter" id="gauge-chart2" 
                        nrOfLevels={20} 
                        formatTextValue={value => value+' %'}
                        percent={node.air_quality ? node.air_quality/100 : 0} 
                        animate={false}
                        />
                        <p className="meter-name">Air</p>
                    </div>
                </div>
                
            </div>
        </div>
    )

    /* return(
        <div className="card widget-card">
            <div className="card-header widget-header">
                REALTIME VALUES FOR NODE {nodeID}
            </div>
            <div className="card-body widget-content">
                <div className="row">
                    <div className="col-6 meterCol">
                        <GaugeChart className="widget-meter" id="gauge-chart2" 
                        nrOfLevels={3} 
                        formatTextValue={value => value+' C'}
                        percent={temp/100} 
                        animate={false}
                        />
                        <p className="meter-name">Temperature</p>
                    </div>
                    <div className="col-6 meterCol">
                        <GaugeChart className="widget-meter" id="gauge-chart2" 
                        nrOfLevels={20} 
                        formatTextValue={value => value+' %'}
                        percent={hum/100} 
                        animate={false}
                        />
                        <p className="meter-name">Humidity</p>
                    </div>
                </div>
                
            </div>
        </div>
    ) */
}
export default SensorWidget;