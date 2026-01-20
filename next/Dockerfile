FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile

COPY . .


EXPOSE 3000

ENV NODE_OPTIONS="--max-old-space-size=512"
CMD sh -c "npx prisma migrate deploy && yarn start -H 0.0.0.0 -p 3000"
