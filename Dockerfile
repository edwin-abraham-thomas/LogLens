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
    org.opencontainers.image.description="View container logs. Alpha release" \
    org.opencontainers.image.vendor="edwinat" \
    com.docker.desktop.extension.api.version="0.3.3" \
    com.docker.desktop.extension.icon="https://raw.githubusercontent.com/edwin-abraham-thomas/LogLens/main/loglens.svg" \
    com.docker.extension.screenshots="" \
    com.docker.extension.detailed-description="" \
    com.docker.extension.publisher-url="" \
    com.docker.extension.additional-urls="" \
    com.docker.extension.changelog="<p>Extension changelog<ul><li>Alpha launch</li></ul></p>" \
    com.docker.extension.categories="utility-tools"
COPY metadata.json .
COPY loglens.svg .
COPY --from=client-builder /ui/build ui