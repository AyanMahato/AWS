const AWS = require('aws-sdk');
const axios = require('axios');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    // Fetch weather data from Open-Meteo API
    const response = await axios.get('https://api.open-meteo.com/v1/forecast?latitude=35.6895&longitude=139.6917&hourly=temperature_2m,time');
    const weatherData = response.data;

    // Prepare data for DynamoDB insertion
    const id = 'some-unique-id';  // Use a UUID or some unique identifier
    const forecast = weatherData;

    // Put item into DynamoDB
    const params = {
      TableName: process.env.WEATHER_TABLE,
      Item: {
        id,
        forecast,
      },
    };
    await dynamodb.put(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Data successfully inserted into DynamoDB' }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'An error occurred' }),
    };
  }
};
