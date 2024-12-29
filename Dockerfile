# syntax=docker/dockerfile:1

# Build ui
FROM --platform=$BUILDPLATFORM node:18.9-alpine3.15 AS ui-builder
WORKDIR /ui
# cache packages in layer
COPY ui/package.json /ui/package.json
COPY ui/package-lock.json /ui/package-lock.json
RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm ci
COPY /ui/. /ui
RUN npm run build

# Build backend
FROM --platform=$BUILDPLATFORM node:18.9-alpine3.15 AS backend-builder
WORKDIR /backend
# cache packages in layer
COPY backend/package.json /backend/package.json
COPY backend/package-lock.json /backend/package-lock.json
RUN --mount=type=cache,target=/usr/src/backend/.npm \
    npm set cache /usr/src/backend/.npm && \
    npm ci
# Copy files
COPY backend /backend
RUN npm run build

FROM --platform=$BUILDPLATFORM node:21.6.0-alpine3.18
LABEL org.opencontainers.image.title="Log Lens" \
    org.opencontainers.image.description="Filter and view container logs." \
    org.opencontainers.image.vendor="edwinat" \
    com.docker.desktop.extension.api.version="0.3.4" \
    com.docker.desktop.extension.icon="https://raw.githubusercontent.com/edwin-abraham-thomas/LogLens/main/loglens.svg" \
    com.docker.extension.screenshots='[{"alt":"Filter view", "url":"https://raw.githubusercontent.com/edwin-abraham-thomas/LogLens/main/screenshots/Filter.png"}, {"alt":"Search view", "url":"https://raw.githubusercontent.com/edwin-abraham-thomas/LogLens/main/screenshots/Search.png"}, {"alt":"Logs view", "url":"https://raw.githubusercontent.com/edwin-abraham-thomas/LogLens/main/screenshots/Logs.png"}, {"alt":"Filter view", "url":"https://raw.githubusercontent.com/edwin-abraham-thomas/LogLens/main/screenshots/LogDetails.png"}]' \
    com.docker.extension.detailed-description="Dive into logs and gain insights into what is going on inside your containers. View full logs without losing information. Also supports structured JSON logs." \
    com.docker.extension.publisher-url="https://github.com/edwin-abraham-thomas" \
    com.docker.extension.additional-urls="" \
    com.docker.extension.changelog="<p>Extension changelog<ul><li>Minor update</li></ul></p>" \
    com.docker.extension.categories="utility-tools"
COPY metadata.json .
COPY loglens.svg .
COPY docker-compose.yaml .


# Configure ui
COPY --from=ui-builder /ui/build ui

# Configure backend
COPY --from=backend-builder /backend/dist /backend
COPY --from=backend-builder /backend/node_modules /backend/node_modules
CMD ["node", "/backend/index.js"]