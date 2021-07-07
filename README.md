# Docker script trigger

## Quick start

In the Docker image there is already a script `/scripts/hello.sh`.

To try this image, you can follow those instructions:

```sh
docker run --rm -it -p3000:3000 registry.zazuko.com/ludovic.muller/docker-script-trigger:latest
curl -s http://localhost:3000/run/hello | jq
```

and you should get the following output:

```json
{
  "success": true,
  "stdout": "Hello stdout!\n",
  "stderr": "Hello stderr!\n"
}
```

## Configuration

Configuration can be done using following environment variables:

- `SERVER_PORT`: port the server is exposed (default: `3000`)
- `SERVER_HOST`: host the server is listening to (default: `::`)
- `SCRIPTS_PATH`: default path where scripts are stored (default: `/scripts`)

## How to use this image?

This image is based on the `node:14-alpine` image.

You may want to add more scripts and more tools in this Docker image.
You can simply build a new Docker image that uses this image as a base.

For example:

```Dockerfile
FROM registry.zazuko.com/ludovic.muller/docker-script-trigger:latest

# Do your stuff here (copy script files into /scripts, install packages, …)
```

Please replace the `latest` tag with a specific version, so that it doesn't break stuff if the image is getting updated.

Build it, and use it!
