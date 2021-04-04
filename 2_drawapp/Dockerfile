FROM node:10-alpine
WORKDIR /app
COPY package.json .
COPY server.js .
COPY /public ./public
RUN npm install
EXPOSE 80:80
# Run the server as a non-root user

CMD npm start
