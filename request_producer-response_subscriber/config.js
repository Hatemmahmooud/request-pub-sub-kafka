

const config = {
  kafkaHost: "localhost:9092",
  kafkaRequestTopic: "Request",
  kafkaResponseTopic: "Response",
  kafkaReconnectionInterval: 10000,
  mongoHost: "mongodb://localhost:27017/test",
  mongoReconnectInterval: 10000,
  mongoConnectionMaxRetries: 3
};

module.exports = config;

