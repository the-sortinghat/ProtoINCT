import { connect } from 'node-nats-streaming';

const brokerID = process.env.BROKER_CLUSTER_ID || 'broker';
const brokerClientID = process.env.BROKER_CLIENT_ID || 'collector';
const brokerUrl = process.env.BROKER_URL || 'nats://broker:4222';

export const stan = connect(brokerID, brokerClientID, {
  url: brokerUrl,
});
