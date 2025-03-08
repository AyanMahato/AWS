const AWS = require('aws-sdk');
const uuid = require('uuid');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    let body;
    try {
        body = JSON.parse(event.body);
    } catch (err) {
        console.error('Error parsing event body:', err);
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Invalid request body',
                error: err.message
            })
        };
    }

    const { principalId, content } = body;

    if (!principalId || !content) {
        console.error('Missing required fields: principalId or content');
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Missing required fields: principalId or content'
            })
        };
    }

    const id = uuid.v4();
    const createdAt = new Date().toISOString();

    const eventItem = {
        id: id,
        principalId: principalId,
        createdAt: createdAt,
        body: content
    };

    const params = {
        TableName: 'Events',
        Item: eventItem
    };

    try {
        await dynamoDb.put(params).promise();
        console.log('Event saved:', JSON.stringify(eventItem, null, 2));

        return {
            statusCode: 201,
            body: JSON.stringify({
                event: eventItem
            })
        };
    } catch (error) {
        console.error('Error saving event to DynamoDB:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Failed to save event to DynamoDB',
                error: error.message
            })
        };
    }
};
