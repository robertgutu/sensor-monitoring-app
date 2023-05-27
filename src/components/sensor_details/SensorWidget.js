import {useState, useEffect} from 'react';
import GaugeChart from 'react-gauge-chart'
import './SensorWidget.css'
import { rtdb } from '../../firebase-config';
import {ref, onValue} from 'firebase/database';
import ReactSpeedometer from "react-d3-speedometer";
import moment from "moment";
function SensorWidget(props){

    const [node,setNode] = useState('');
    const [isNodeLoaded,setIsNodeLoaded] = useState(false)
    const [lastUpdatedDate, setLastUpdatedDate] = useState(new Date())

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
            setLastUpdatedDate(new Date)
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
                    valueTextFontWeight={"normal"}
                    labelFontSize='14px'
                    minValue={0}
                    maxValue={40}
                    customSegmentStops={[0, 20, 30,40]}
                    segmentColors={["limegreen", "gold", "tomato"]}
                    value={node.temperature ? node.temperature : 0}
                    currentValueText={`Temperature: ${node.temperature ? node.temperature : 0} ℃`}
                    fluidWidth={true}
                    dimensionUnit={"%"}
                    height={100}
                    width={32}
                />
              </div>
              <div className="speedometer">
                <ReactSpeedometer
                    textColor={"white"}
                    valueTextFontWeight={"normal"}
                    labelFontSize='14px'
                    minValue={0}
                    maxValue={100}
                    customSegmentStops={[0, 20, 30, 70 ,80 ,100]}
                    segmentColors={["tomato", "gold", "limegreen","gold", "tomato"]}
                    value={node.humidity ? node.humidity : 0}
                    currentValueText={`Humidity: ${node.humidity ? node.humidity : 0}%RH`}
                    fluidWidth={true}
                    dimensionUnit={"%"}
                    height={100}
                    width={32}
                />
              </div>
              <div className="speedometer">
                <ReactSpeedometer
                    textColor={"white"}
                    valueTextFontWeight={"normal"}
                    labelFontSize='14px'
                    customSegmentStops={[0, 400, 550, 1000]}
                    segmentColors={["limegreen", "gold","tomato" ]}
                    value={node.air_quality ? node.air_quality : 0}
                    currentValueText={`CO2 level: ${node.air_quality ? node.air_quality : 0}ppm`}
                    fluidWidth={true}
                    dimensionUnit={"%"}
                    height={100}
                    width={32}
                />
              </div>
            </div>
            <div className="float-end lastUpdate">Last time updated {moment(lastUpdatedDate).format("DD/MM/YY HH:mm:ss")}</div>
          </div>
        </div>
      );
}
export default SensorWidget;