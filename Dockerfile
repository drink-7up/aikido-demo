FROM node:14.15.0

WORKDIR /app
COPY package.json package.json
RUN npm install
COPY . .

ENV AWS_SECRET_ACCESS_KEY=fake-aws-secret_K7MDENGbPxRfiCY_DEMO_KEY

USER root
EXPOSE 3000
CMD ["node", "src/server.js"]
