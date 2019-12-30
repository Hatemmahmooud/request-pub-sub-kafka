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
                connectionToKafka();
            }, config.kafkaReconnectionInterval);
        })
    }
    catch (err) {
        console.log(err);
        setTimeout(() => {
            connectionToKafka();
        }, config.kafkaReconnectionInterval);

    }
}




const pushResponseToKafka = (response) => {

    try {
        let payloadToKafkaTopic = [{ topic: config.kafkaResponseTopic, messages: JSON.stringify(response) }];
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



module.exports = pushResponseToKafka;


