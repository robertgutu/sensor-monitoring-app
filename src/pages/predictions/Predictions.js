import {useState, useEffect} from 'react'
import demo_data from '../../demo-data/co2.json'
import { CO2Predictions } from '../../components/predictions/CO2Predictions'

function Predictions(){

    const [forecast, setForecast] = useState()

    useEffect(() => {
        try{
        CO2Predictions(demo_data.CO2)
        }
        catch(err){
            console.log("ERR",err);
        }
    },[])

    return(
    <div className="container">     
        Pred
    </div>
    )
}

export default Predictions;