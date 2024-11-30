FROM node:20.18.0-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/spa.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]