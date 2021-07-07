import fastify from 'fastify';
import fs from 'fs/promises';

const server = fastify();
const port = 3000;
const host = '::';
const scriptsPath = './scripts/';

server.get<{ Params: { script_name: string } }>('/run/:script_name', async (request, reply) => {
  const name = request.params.script_name.replace(/^(\.)+/, '');
  let fileInfos;
  try {
    fileInfos = await fs.stat(`${scriptsPath}/${name}.sh`);
  } catch (_e) {
    return reply.code(404).send({
      success: false,
      message: 'script not found',
    });
  }

  if (!fileInfos.isFile()) {
    return reply.code(400).send({
      success: false,
      message: 'not a file',
    });
  }

  return fileInfos;
});

server.listen(port, host, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
