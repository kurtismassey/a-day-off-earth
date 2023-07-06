FROM node:16.19.0-alpine AS builder
COPY . ./frontend
WORKDIR /frontend
RUN npm i 
RUN $(npm bin)/ng build --configuration=production

FROM nginx:1.15.8-alpine
COPY --from=builder /frontend/dist/frontend/ /usr/share/nginx/html