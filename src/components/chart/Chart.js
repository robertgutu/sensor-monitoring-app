import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Chart.css'
import moment from 'moment';

/* const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
]; */

function Chart(props){

  const [data,setData] = useState([])

  useEffect(() => {

    if(typeof props.measured_data !== 'undefined' && typeof props.sensor_id !== 'undefined'){
      console.log("chart measured data",props.measured_data)
      console.log("chart sensor id",props.sensor_id)

      const filtered_data = props.measured_data.filter(obj => {
        return obj.node_id === props.sensor_id
      })

      console.log("date filtrate", filtered_data)
      filtered_data.map(el => {
        el.timestamp = parseInt(el.timestamp*1000);
      })
      setData(filtered_data)
    }

  },[props.measured_data,props.sensor_id])

  const formatXAxis = tickFormat => {
    return moment(tickFormat).format('DD MMM');
  }

    return (
      <div className="card">
      <div className="card-header chart-header">
        Measured values for Sensor #{props.sensor_id}
      </div>
      <div className="card-body chart-content">
        <ResponsiveContainer width="100%" height={200}>
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
            <XAxis dataKey="timestamp" tickFormatter={formatXAxis}/>
            <YAxis />
            <Tooltip labelFormatter={(label) => moment(label).format("DD/MM/YY HH:mm:ss")}/>
            <Legend />
            <Line type="monotone" dataKey="humidity" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="temperature" stroke="#82ca9d" activeDot={{ r: 8 }}/>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
    )
}
export default Chart;

