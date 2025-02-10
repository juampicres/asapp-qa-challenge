# Usa Cypress v13 (Node 18 incluido)
FROM cypress/included:14.0.2
WORKDIR /tests

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
COPY cypress/config/local.env /cypress/.env
ENV $(cat /cypress/.env | xargs)