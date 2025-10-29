FROM node:18-alpine

WORKDIR /app

#copy package.json and package-lock.json
COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

#RUN npm install -g concurrently

EXPOSE 3000
#EXPOSE 3000 3001

CMD ["npm", "start"]
#CMD ["concurrently", "\"npm run start:next\"", "\"npm run start:express\""]

#docker build -f Dockerfile.local -t portfolio-local .
#docker run --rm -p 3000:3000 --name nextjs-portfolio portfolio-local