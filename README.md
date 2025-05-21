This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Docker Deployment

This project includes Docker support for easy deployment.

### Building the Docker Image

To build the Docker image, run the following command from the project root:

```bash
docker build -t meowify-web .
```

### Running the Docker Container

Once the image is built, you can run the container with:

```bash
docker run -p 3000:3000 meowify-web
```

This will start the application and make it available at [http://localhost:3000](http://localhost:3000).

### Environment Variables

If you need to pass environment variables to the container, you can use the `-e` flag:

```bash
docker run -p 3000:3000 -e PYTHON_API_URL=http://your-api-url/meowify/ meowify-web
```

### Connecting to the Python API

By default, the application tries to connect to the Python API at `http://localhost:8000/meowify/`. If your Python API is running in a different container or on a different host, you'll need to configure the API URL using the `PYTHON_API_URL` environment variable.

#### Using Docker Compose

A `docker-compose.yml` file is included in the project to help you run both the frontend and the Python API together. To use it:

1. Update the Python API image in the `docker-compose.yml` file to point to your actual Python API image
2. Run the following command:

```bash
docker-compose up
```

This will start both the frontend and the API containers, with the frontend configured to communicate with the API using the service name as the hostname.

If you want to run the services in the background, use:

```bash
docker-compose up -d
```

To stop the services:

```bash
docker-compose down
```

The included `docker-compose.yml` file is set up like this:

```yaml
version: '3'
services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - PYTHON_API_URL=http://api:8000/meowify/
    depends_on:
      - api

  api:
    image: your-python-api-image
    ports:
      - "8000:8000"
```

You'll need to customize the `api` service configuration to match your Python API requirements.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
