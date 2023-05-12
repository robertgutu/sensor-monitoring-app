import * as tf from '@tensorflow/tfjs';
import moment from 'moment';

export function predictHumidity(humData){

// Convert the timestamps to Date objects
const dates = humData.map(d => new Date(d.timestamp));

// Convert the CO2 values to a tensor
const co2Tensor = tf.tensor1d(humData.map(d => d.humidity));

// Define the model architecture
const model = tf.sequential();
model.add(tf.layers.dense({units: 64, inputShape: [1], activation: 'relu'}));
model.add(tf.layers.dense({units: 32, activation: 'relu'}));
model.add(tf.layers.dense({units: 1}));

// Compile the model
model.compile({optimizer: 'adam', loss: 'meanSquaredError'});

// Train the model
const train = async () => {
  await model.fit(co2Tensor, co2Tensor, {epochs: 200});
};

const newData = []

train().then(() => {
    const predictionDates = [];
    for (let i = 1; i <= 7; i++) {
      const nextDate = new Date(dates[dates.length - 1]);
      nextDate.setDate(nextDate.getDate() + i);
      predictionDates.push(nextDate);
    }
    
    const co2TensorReshaped = co2Tensor.reshape([co2Tensor.shape[0], 1]);
    const predictionTensor = model.predict(co2TensorReshaped.concat(tf.zeros([7, 1])));
    
    // Print the predictions
    
    predictionTensor.data().then(data => {
      for (let i = 0; i < 7; i++) {
        //console.log(predictionDates[i].toISOString(), data[i]);
        newData.push({
            "timestamp": parseInt(moment(predictionDates[i]).format("x")),
            "predicted_humidity": data[i]
        })
      }
    });

});

return newData;

}