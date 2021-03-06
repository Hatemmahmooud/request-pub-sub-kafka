const kafka = require('kafka-node');
let requestsDal = require("./dal/manage-requests");
let config = require("./config");
var consumer;

function connectionToKafka(callback) {
    try {
        if (consumer) return callback();
        const Consumer = kafka.Consumer;
        const client = new kafka.KafkaClient({ idleConnection: 24 * 60 * 60 * 1000, kafkaHost: config.kafkaHost });

        consumer = new Consumer(
            client,
            [{ topic: config.kafkaResponseTopic, partition: 0 }],
            {
                autoCommit: true,
                fetchMaxWaitMs: 1000,
                fetchMaxBytes: 1024 * 1024,
                encoding: 'utf8',
                // fromOffset: false
            }
        );
        consumer.on('error', function (error) {
            //  handle error 
            console.error('Error occured', error);
            consumer.close(true, () => { });
            consumer = null;
            setTimeout(() => {
                connectionToKafka(callback)
            }, config.kafkaReconnectionInterval);
        });
        return callback();
    }
    catch (err) {
        console.error("Error occured while connection to kafka, retrying again");
        setTimeout(() => {
            connectionToKafka(callback);
        }, config.kafkaReconnectionInterval);
    }
}

try {
    connectionToKafka(() => {
        console.log("Consumer running");
        consumer.on('message', async function (message) {
            console.log('kafka ', JSON.parse(message.value));
            var responsePayload = JSON.parse(message.value);
            requestsDal.updateRequestStatus(responsePayload, () => { });
        })
    })

}
catch (error) {
    // catch error trace
    console.log(error);
}