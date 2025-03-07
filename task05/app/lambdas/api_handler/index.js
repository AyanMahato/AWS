const AWS = require('aws-sdk');
const uuid = require('uuid');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    const principalId = body.principalId;
    const content = body.content;

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

        return {
            statusCode: 201,
            body: JSON.stringify({
                event: eventItem
            })
        };
    } catch (error) {
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
