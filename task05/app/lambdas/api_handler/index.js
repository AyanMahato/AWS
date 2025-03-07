const AWS = require('aws-sdk');
const uuid = require('uuid'); // For generating unique UUIDs
const dynamoDb = new AWS.DynamoDB.DocumentClient(); // DynamoDB DocumentClient

exports.handler = async (event) => {
    // Parse the body from the incoming event
    const body = JSON.parse(event.body);
    const principalId = body.principalId;
    const content = body.content;

    // Generate a unique UUID for the event
    const id = uuid.v4();

    // Get the current date/time in ISO 8601 format
    const createdAt = new Date().toISOString();

    // Construct the event data to be stored in DynamoDB
    const eventItem = {
        id: id,
        principalId: principalId,
        createdAt: createdAt,
        body: content
    };

    // Define DynamoDB parameters to insert the new event
    const params = {
        TableName: 'Events', // DynamoDB table name
        Item: eventItem // The event data
    };

    try {
        // Put the event into DynamoDB
        await dynamoDb.put(params).promise();

        // Return a successful response with the event data
        return {
            statusCode: 201,
            body: JSON.stringify({
                event: eventItem // The created event data
            })
        };
    } catch (error) {
        // Handle errors and return an error response
        console.error('Error saving event to DynamoDB', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Failed to save event to DynamoDB',
                error: error.message
            })
        };
    }
};
