# syntax=docker/dockerfile:1
FROM --platform=$BUILDPLATFORM node:18.9-alpine3.15 AS client-builder
WORKDIR /ui
# cache packages in layer
COPY package.json /ui/package.json
COPY package-lock.json /ui/package-lock.json
RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm ci
# install
COPY . /ui
RUN npm run build

FROM alpine
LABEL org.opencontainers.image.title="Log Lens" \
    org.opencontainers.image.description="Filter and view container logs. (Alpha release)" \
    org.opencontainers.image.vendor="edwinat" \
    com.docker.desktop.extension.api.version="0.3.4" \
    com.docker.desktop.extension.icon="https://raw.githubusercontent.com/edwin-abraham-thomas/LogLens/main/loglens.svg" \
    com.docker.extension.screenshots='[{"alt":"Logs view", "url":"https://raw.githubusercontent.com/edwin-abraham-thomas/LogLens/main/screenshots/Logs.png"}, , {"alt":"Filter view", "url":"https://raw.githubusercontent.com/edwin-abraham-thomas/LogLens/main/screenshots/LogDetails.png"}]' \
    com.docker.extension.detailed-description="Dive into logs and gain insights into what is going on inside your containers. View full logs without losing information. Also supports structured JSON logs." \
    com.docker.extension.publisher-url="https://github.com/edwin-abraham-thomas" \
    com.docker.extension.additional-urls="" \
    com.docker.extension.changelog="<p>Extension changelog<ul><li>Alpha launch</li></ul></p>" \
    com.docker.extension.categories="utility-tools"
COPY metadata.json .
COPY loglens.svg .
COPY --from=client-builder /ui/build ui