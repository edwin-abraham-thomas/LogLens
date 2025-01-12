# LogLens
Dive into logs and gain insights into what is going on inside your containers.

## Features
- View and inspect logs from containers
- Filter logs by container
- View structured logs in formatted view

## Installation
Go to Docker Desktop -> Extensions tab -> Manage. Search for `Log Lens` and install.

## Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

### [2.0.1] - 2025-01-10

- Fix log parsing issue blocking backend

### [2.0.0] - 2025-01-05

- Introduced backend and db to handle high volume of logs.
- UI fixes

### [1.1.0] - 2024-10-27

- Update logs table to use DataGrid to improve usability
    - Columns can be resized and can be hidden
    - Logs can be paginated
- Improve performance when loading large numbers of logs

### [1.0.0] - 2024-10-27

- Stable release
    - Log viewing
    - Filter
    - Search


[2.0.0]: https://github.com/edwin-abraham-thomas/LogLens/tree/v2.0.0
[2.0.1]: https://github.com/edwin-abraham-thomas/LogLens/tree/v2.0.1
[1.1.0]: https://github.com/edwin-abraham-thomas/LogLens/tree/v1.1.0
[1.0.0]: https://github.com/edwin-abraham-thomas/LogLens/tree/v1.0.0