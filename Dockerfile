FROM node:16
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY package*.json ./
COPY lib/ lib/
COPY index.js .
RUN npm install --quiet --production
USER node
EXPOSE 8080
ENTRYPOINT ["node", "index.js"]
