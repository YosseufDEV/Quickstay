FROM node:18-alpine
WORKDIR /assets
RUN npm install -g serve
COPY ./assets ./assets
EXPOSE 5001
CMD ["serve", "./assets", "-l", "5001"]
