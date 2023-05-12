import React, { useState, useEffect } from 'react';
import { LineChart,BarChart, Bar,Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';
import './Chart.css'
import moment from 'moment';
import { CO2Predictions } from '../predictions/CO2Predictions';
import { predictHumidity } from '../predictions/predictHumidity';
import axios from 'axios';

function Chart(props){

  const [data,setData] = useState([])
  const [predictedData,setPredictedData] = useState([]);
  const [isPredictedDataLoaded,setIsPredictedDataLoaded] = useState(false)

  const api = axios.create({
    baseURL:"http://127.0.0.1:5000/",
    headers:{
      "Content-Type": "application/json"
    }
  })

  useEffect(() => {

    if(typeof props.measured_data !== 'undefined' && typeof props.node !== 'undefined'){
      console.log("chart measured data",props.measured_data)
      //console.log("chart sensor id",props.node.id)

      const filtered_data = props.measured_data.filter(obj => {
        return obj.node_id === props.node.id
      })
      
      filtered_data.map(el => {
        el.timestamp = parseInt(el.timestamp)*1000;
      })
      
      console.log("filtered_data",filtered_data)
      testFetchServer(filtered_data)

      setData(filtered_data)
      //setPredictedData(predicted_data)
    }

  },[props.measured_data,props.node])

  const formatXAxis = tickFormat => {
    return moment(tickFormat).format('DD MMM');
  }

  //const chartData = data.concat(predictedData)
  //console.log("[].concat(data,predictedData)",chartData)

  const testFetchServer = (data) => {
        api.post(`predict_humidity`,data)
        .then(res => {
            console.log("res from Flask:",res);
            setPredictedData(res.data.predictions)
            setIsPredictedDataLoaded(true)
        })
        .catch(err => {
            console.error(err)
        })
  } 

    console.log("predictedData",predictedData)

    if(!isPredictedDataLoaded){
      return(<div></div>)
    }else{
      return (
        <div className="card">
        <div className="card-header chart-header">
          Measured values for {props.node.name} (ID:{props.node.id})
        </div>
        <div className="card-body chart-content">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              width={500}
              height={200}
              data={[].concat(data,predictedData)}
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
                contentStyle={{backgroundColor: '#014F86'}}
              />
              <Legend />
              <Line type="monotone" dataKey="humidity" stroke="#e85d04" strokeWidth={3} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="temperature" stroke="#ffd60a" strokeWidth={3} activeDot={{ r: 8 }}/>
              <Line type="monotone" dataKey="predicted_humidity" stroke="green" strokeWidth={3} activeDot={{ r: 8 }}/>
              <Line type="monotone" dataKey="predicted_temperature" stroke="blue" strokeWidth={3} activeDot={{ r: 8 }}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      )
    }
}
export default Chart;

