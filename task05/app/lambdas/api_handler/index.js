const AWS = require('aws-sdk');
const uuid = require('uuid'); // To generate a unique UUID for the event
const dynamoDb = new AWS.DynamoDB.DocumentClient(); // Initialize DynamoDB DocumentClient

exports.handler = async (event) => {
    // Parse the body of the incoming request
    const body = JSON.parse(event.body);
    const principalId = body.principalId;  // Get the principalId from the request body
    const content = body.content; // The content map in the request body

    // Generate a UUID for the event's 'id' field
    const id = uuid.v4();

    // Get the current timestamp in ISO 8601 format
    const createdAt = new Date().toISOString();

    // Prepare the event object to store in DynamoDB
    const eventItem = {
        id: id,
        principalId: principalId,
        createdAt: createdAt,
        body: content // The content of the event
    };

    // Define the parameters for the DynamoDB 'put' operation
    const params = {
        TableName: 'Events', // The name of the DynamoDB table
        Item: eventItem // The event data
    };

    try {
        // Put the event data into the DynamoDB table
        await dynamoDb.put(params).promise();

        // Return the success response with the created event
        return {
            statusCode: 201,  // Status code for successful creation
            body: JSON.stringify({
                event: eventItem // Return the created event in the response
            })
        };
    } catch (error) {
        // Log and return an error response if something goes wrong
        console.error('Error saving event to DynamoDB', error);
        return {
            statusCode: 500,  // Internal server error status code
            body: JSON.stringify({
                message: 'Failed to save event to DynamoDB',
                error: error.message
            })
        };
    }
};
