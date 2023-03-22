import {useState, useEffect} from 'react';
import GaugeChart from 'react-gauge-chart'
import './SensorWidget.css'

function SensorWidget(props){

    return(
        <div className="card widget-card">
            <div className="card-header widget-header">
                {props.data.name} - REALTIME VALUES
            </div>
            <div className="card-body widget-content">
                <div className="row">
                    <div className="col-6 meterCol">
                        <GaugeChart className="widget-meter" id="gauge-chart2" 
                        nrOfLevels={3} 
                        formatTextValue={value => value+' C'}
                        percent={23.5/100} 
                        />
                        <p className="meter-name">Temperature</p>
                    </div>
                    <div className="col-6 meterCol">
                        <GaugeChart className="widget-meter" id="gauge-chart2" 
                        nrOfLevels={20} 
                        formatTextValue={value => value+' %'}
                        percent={props.data.last_value / 100} 
                        />
                        <p className="meter-name">Humidity</p>
                    </div>
                </div>
                
            </div>
        </div>
    )
}
export default SensorWidget;