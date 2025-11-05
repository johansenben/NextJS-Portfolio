FROM node:18-alpine

WORKDIR /app

#copy package.json and package-lock.json
COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE $NEXT_PORT

CMD ["npm", "run", "start"]

#docker build -f Dockerfile.local -t portfolio-local .
#docker run --rm -p 3000:3000 --name nextjs-portfolio portfolio-local
