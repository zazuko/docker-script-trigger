#!/usr/bin/env node

const fastify = require('fastify');
const fs = require('fs/promises');
const { promisify } = require('util');
const glob = promisify(require('glob'));
const { exec } = require('child_process');
const path = require('path');

const port = process.env.SERVER_PORT || 3000;
const host = process.env.SERVER_HOST || '::';
const scriptsPath = process.env.SCRIPTS_PATH || './scripts/';

const route = script => async (request, reply) => {
  const args = request.body || [];

  if (!Array.isArray(args)) {
    return reply.code(400).send({
      success: false,
      message: 'expected args in an array'
    });
  }

  const argsString = args
    .map(arg => `"${arg}"`) // TODO: escape
    .join(' ')

  try {
    const { stdout, stderr } = await new Promise(
      // TODO: use spawn instead of exec
      (resolve, reject) => exec(`"${script}" ${argsString}`, (error, out, err) => {
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
};

(async () => {
  const server = fastify();
  const files = await glob(`${scriptsPath}/*`);

  for (const name of files) {
    const realpath = await fs.realpath(name);
    const fileInfos = await fs.stat(realpath);

    if (!fileInfos.isFile()) {
      throw new Error(`path ${realpath} is not a regular file`);
    }

    const parsedpath = path.parse(name);
    console.log(`Route /run/${parsedpath.name} runs ${realpath}`);
    server.post(`/run/${parsedpath.name}`, route(realpath));
  }

  const address = await new Promise((resolve, reject) => server.listen(port, host, (err, address) => {
    if (err) reject(err);
    else resolve(address);
  }));

  console.log(`Server listening at ${address}`);
})().catch(e => {
  console.error(e);
  process.exit(1);
});

