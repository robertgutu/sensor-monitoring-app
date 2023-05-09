import {useState, useEffect} from 'react';
import GaugeChart from 'react-gauge-chart'
import './SensorWidget.css'

function SensorWidget(props){

    const [nodeID,setNodeID] = useState(null);
    const [temp,setTemp] = useState(0);
    const [hum,setHum] = useState(0);

    useEffect(() => {
        console.log("props.data",props.data)
        if(props.data.id && props.data.id !== nodeID){
            setNodeID(props.data.id)
        }

        if(props.data.temperature && props.data.temperature !== temp){
            setTemp(props.data.temperature)
        }

        if(props.data.humidity && props.data.humidity !== hum){
            setHum(props.data.humidity)
        }

    },[props.data])

    return(
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
    )
}
export default SensorWidget;