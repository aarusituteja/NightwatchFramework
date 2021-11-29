# syntax=docker/dockerfile:1
FROM cimg/node:16.5.0-browsers
ENV TZ="Australia/Melbourne"

USER root
WORKDIR /app
COPY . .
