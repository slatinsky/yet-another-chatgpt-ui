FROM node:16-alpine

WORKDIR /usr/app

COPY package*.json ./
RUN npm install --legacy-peer-deps && \
    npm cache clean --force && \
    rm -rf /root/.npm /root/.node-gyp && \
    rm -rf /usr/src/app/package-lock.json

COPY . .

EXPOSE 8156

CMD ["npm", "run", "dev", "--", "--host"]