import fastify from 'fastify';

const server = fastify();
const port = 3000;
const host = '::';

server.get('/run/:script_name', async (request, reply) => 'ok');

server.listen(port, host, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
