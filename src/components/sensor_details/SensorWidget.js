import {useState, useEffect} from 'react';
import GaugeChart from 'react-gauge-chart'
import './SensorWidget.css'
import { rtdb } from '../../firebase-config';
import {ref, onValue} from 'firebase/database';
import ReactSpeedometer from "react-d3-speedometer";

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



    return (
        <div className="card widget-card">
          <div className="card-header widget-header">
            Realtime values for {node.name}
          </div>
          <div className="card-body widget-content">
            <div className="speedometer-container">
              <div className="speedometer">
                <ReactSpeedometer
                    textColor={"white"}
                    minValue={0}
                    maxValue={40}
                    customSegmentStops={[0, 20, 30,40]}
                    segmentColors={["limegreen", "gold", "tomato"]}
                    value={node.temperature ? node.temperature : 0}
                    currentValueText={`Temperature: ${node.temperature ? node.temperature : 0} ℃`}
                    fluidWidth={true}
                    dimensionUnit={"%"}
                    height={100}
                    width={33}
                />
              </div>
              <div className="speedometer">
                <ReactSpeedometer
                    textColor={"white"}
                    minValue={0}
                    maxValue={100}
                    customSegmentStops={[0, 20, 30, 70 ,80 ,100]}
                    segmentColors={["tomato", "gold", "limegreen","gold", "tomato"]}
                    value={node.humidity ? node.humidity : 0}
                    currentValueText={`Humidity: ${node.humidity ? node.humidity : 0}%`}
                    fluidWidth={true}
                    dimensionUnit={"%"}
                    height={100}
                    width={33}
                />
              </div>
              <div className="speedometer">
                <ReactSpeedometer
                    textColor={"white"}
                    customSegmentStops={[0, 400, 550, 1000]}
                    segmentColors={["limegreen", "gold","tomato" ]}
                    value={node.air_quality ? node.air_quality : 0}
                    currentValueText={`CO2 level: ${node.air_quality ? node.air_quality : 0}ppm`}
                    fluidWidth={true}
                    dimensionUnit={"%"}
                    height={100}
                    width={33}
                />
              </div>
            </div>
          </div>
        </div>
      );

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