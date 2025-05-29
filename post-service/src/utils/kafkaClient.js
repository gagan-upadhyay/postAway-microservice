import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: 'post-service',
    brokers: ['kafka:9092'],
});

const producer = kafka.producer();

const initKafka = async ()=>{
    await producer.connect();
};

const sendEvent = async (topic, message)=>{
    await producer.send({
        topic, 
        message:[{
            value: JSON.stringify(message)
        }],
    });
};
export {initKafka, sendEvent};