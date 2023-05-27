import React, { useState, useEffect } from 'react';
import { LineChart,BarChart, Bar,Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';
import './Chart.css'
import moment from 'moment';
import { CO2Predictions } from '../predictions/CO2Predictions';
import { predictHumidity } from '../predictions/predictHumidity';
import axios from 'axios';

function Chart(props){

  const [data,setData] = useState([])
  const [isDataLoaded,setIsDataLoaded] = useState(false)

  useEffect(() => {

    if(typeof props.measured_data !== 'undefined' && typeof props.node !== 'undefined'){
      console.log("chart measured data",props.measured_data)
      //console.log("chart sensor id",props.node.id)

      const filtered_data = props.measured_data.filter(obj => {
        return obj.node_id === props.node.id
      })
      
      filtered_data.map(el => {
        el.timestamp = parseInt(el.timestamp)*1000;
        el.co2 = el.air_quality / 10
      })
      
      //console.log("filtered_data",filtered_data)
      setData(filtered_data)
      setIsDataLoaded(true)
    }

  },[props.measured_data,props.node])

  const formatXAxis = tickFormat => {
    return moment(tickFormat).format('DD MMM');
  }


    //console.log("predictedData",predictedData)

    if(!isDataLoaded){
      return(<div></div>)
    }else{
      return (
        <div className="card">
        <div className="card-header chart-header">
          Measured values for {props.node.name} (ID:{props.node.id})
        </div>
        <div className="card-body chart-content">
          <ResponsiveContainer width="100%" height={160}>
            <LineChart
              width={500}
              height={200}
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey="timestamp" 
                tickFormatter={formatXAxis} 
                stroke='white'
                domain={['dataMin', 'dataMax']}
              />
              <YAxis stroke='white'/>
              <Tooltip labelFormatter={(label) => moment(label).format("DD/MM/YY HH:mm:ss")}
                contentStyle={{backgroundColor: '#014F86',fontSize: "16px"}}
              />
              <Legend />
              <Line type="monotone" dataKey="humidity" stroke="#e85d04" unit={" %RH"} strokeWidth={3} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="temperature" stroke="#ffd60a" unit={" ℃"} strokeWidth={3} activeDot={{ r: 8 }}/>
              <Line type="monotone" dataKey="co2" unit=" ppm/10" stroke="#f28482" strokeWidth={3} activeDot={{ r: 8 }}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      )
    }
}
export default Chart;

