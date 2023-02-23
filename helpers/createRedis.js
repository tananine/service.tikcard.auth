const redis = require('redis');

exports.client = redis.createClient({
  socket: {
    host: 'docker.for.mac.localhost',
    port: '6379',
  },
});
