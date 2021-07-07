import fastify from 'fastify';
import fs from 'fs/promises';
import { exec } from 'child_process';

const server = fastify();
const port = process.env.SERVER_PORT || 3000;
const host = process.env.SERVER_HOST || '::';
const scriptsPath = process.env.SCRIPTS_PATH || './scripts/';

server.get<{ Params: { script_name: string } }>(
  '/run/:script_name',
  async (request, reply) => {
    const name = request.params.script_name.replace(/^(\.)+/, '');
    const scriptPath = `${scriptsPath}/${name}.sh`;

    let fileInfos;

    try {
      fileInfos = await fs.stat(scriptPath);
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

    try {
      const { stdout, stderr } = await new Promise(
        // TODO: use spawn instead of exec
        (resolve, reject) => exec(scriptPath, (error, out, err) => {
          if (error) {
            reject(error);
          } else {
            resolve({ stdout: out, stderr: err });
          }
        }),
      );

      return reply.code(200).send({
        success: true,
        stdout,
        stderr,
      });
    } catch (e) {
      return reply.code(500).send({
        success: false,
        message: e.message,
      });
    }
  },
);

server.listen(port, host, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
