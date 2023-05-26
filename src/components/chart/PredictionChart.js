import React, { useState, useEffect } from 'react';
import { LineChart,BarChart, Bar,Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';
import './Chart.css'
import moment from 'moment';
import { CO2Predictions } from '../predictions/CO2Predictions';
import { predictHumidity } from '../predictions/predictHumidity';
import axios from 'axios';

const algs = [
  {
    "id": 1,
    "name": "Linear Regresion"
  },
  {
    "id": 2,
    "name": "Prophet"
  },
  {
    "id": 3,
    "name": "ARIMA"
  }
]

function PredictionChart(props){

  const [data,setData] = useState([])
  const [predictedData,setPredictedData] = useState([]);
  const [isPredictedDataLoaded,setIsPredictedDataLoaded] = useState(false)
  const [isDataReceived, setIsDataReceived] = useState(false)

  const api = axios.create({
    baseURL:"http://127.0.0.1:5000/",
    headers:{
      "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    }
  })

  useEffect(() => {

    if(typeof props.measured_data !== 'undefined' && typeof props.node !== 'undefined'){
      //console.log("props.measured_data",props.measured_data)
      //console.log("props.node",props.node)

      const filtered_data = props.measured_data.filter(obj => {
        return obj.node_id === props.node.id
      })
      
      //console.log("Measured and filtered data",filtered_data)
      setData(filtered_data)

      if(filtered_data.length >= 10){
        if(props.prediction_type === 1){
          getLinearRegresionPredict(filtered_data)
        }else if(props.prediction_type === 2){
          getProphetPredict(filtered_data)
        }else if(props.prediction_type === 3){
          getARIMAPredict(filtered_data)
        }
      }

      setIsDataReceived(true)
      setIsPredictedDataLoaded(true)
    }

  },[props.measured_data,props.node])

  const getARIMAPredict = (data) => {
    api.post(`predict_arima`,data)
    .then(res => {
        console.log("Response for ARIMA prediction",res);
        setPredictedData(res.data)
        
    })
    .catch(err => {
        console.error(err)
    })
    .finally(() =>{
      setIsPredictedDataLoaded(true)
    })
  } 


  const getLinearRegresionPredict = (data) => {
    api.post(`predict_linear`,data)
    .then(res => {
        //console.log("Response for linear prediction",res);
        setPredictedData(res.data.predictions)
        setIsPredictedDataLoaded(true)
    })
    .catch(err => {
        console.error(err)
    })
  } 

  const getProphetPredict = (data) => {
    api.post(`predict_prophet`,data)
    .then(res => {
        console.log("res from Flask predict_prophet:",res);
        setPredictedData(res.data)
        setIsPredictedDataLoaded(true)
    })
    .catch(err => {
        console.error(err)
    })
  } 

  const formatXAxis = tickFormat => {
    return moment(tickFormat).format('DD MMM');
  }

    //console.log("predictedData",predictedData)
    console.log(`Data for node ${props.node.id} and algorithm ${props.prediction_type}`, [].concat(data,predictedData))

    if(!isPredictedDataLoaded){
      return(<div>Loading</div>)
    }else{
      if(data.length < 10){
        return(
        <div className='emptyCard'>
          <p>Not enough samples for predicting data using {algs.find(el => el.id === props.prediction_type).name} model!</p>
        </div>
        )
      }else{
        return (
          <div className="card">
          <div className="card-header chart-header">
            {/* {props.node.name}(ID:{props.node.id})  */}Algorithm used: {algs.find(el => el.id === props.prediction_type).name}
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
                  contentStyle={{backgroundColor: '#014F86',fontSize: "16px"}}
                />
                <Legend />
                <Brush height={20}
                /* dataKey="timestamp" tickFormatter={tickFormat => moment(tickFormat).format('DD MMM HH:mm')} *//>
                <Line type="monotone" dataKey="humidity" stroke="#e85d04" strokeWidth={3} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="temperature" stroke="#ffd60a" strokeWidth={3} activeDot={{ r: 8 }}/>
                <Line type="monotone" dataKey="predicted_humidity" stroke="green" strokeWidth={3} activeDot={{ r: 8 }}/>
                <Line type="monotone" dataKey="predicted_temperature" stroke="#ef476f" strokeWidth={3} activeDot={{ r: 8 }}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        )
      }
      
    }
}
export default PredictionChart;

