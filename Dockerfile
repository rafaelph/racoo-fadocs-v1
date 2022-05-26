FROM node:14.17-alpine AS node
WORKDIR /app
COPY ./racoo_fadocs_front .
RUN npm i
RUN npm run build

FROM node:12
WORKDIR /app
COPY ./racoo-google-drive-api .
RUN npm i
COPY --from=node /app/build ./public/
ENV PORT 80
EXPOSE $PORT
CMD node "bin/www.js"

