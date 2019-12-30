const Kafka = require('kafka-node');
const config = require("./config");
var producerReady;
function connectionToKafka(callback) {
    //Kafka configuration and connection
    try {
        if (producerReady) return callback(producerReady);
        const Producer = Kafka.Producer;
        const client = new Kafka.KafkaClient({ kafkaHost: config.kafkaHost });
        const producer = new Producer(client, { requireAcks: 0, partitionerType: 2 });

        //Subscribe to the ready and error states
        producer.on("ready", async function () {
            producerReady = producer;
            return callback(producer);
        });

        producer.on("error", function (err) {
            console.log(err);
            setTimeout(() => {
                connectionToKafka(callback);
            }, config.kafkaReconnectionInterval);
        })
    }
    catch (err) {
        console.log(err);
        setTimeout(() => {
            connectionToKafka(callback);
        }, config.kafkaReconnectionInterval);

    }
}




const pushRequestToKafka = (request) => {

    try {
        let payloadToKafkaTopic = [{ topic: config.kafkaRequestTopic, messages: JSON.stringify(request) }];
        connectionToKafka(producer => {
            producer.send(payloadToKafkaTopic, (err, data) => {
                if (err)
                    console.error("Error occured while pushing the message ", err);
            });
        })
    }
    catch (error) {
        console.log(error);
        return;
    }

};



module.exports = pushRequestToKafka;


