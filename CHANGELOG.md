# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

### [2.1.1] - 2025-05-05

- Added process to remove dangling logs to avoid unnecessary storage consumption.
- Added fix to handle JSON serialization error.

### [2.1.0] - 2025-04-21

- Added functionality to filter logs based on the last N minutes, enhancing log filtering capabilities.

### [2.0.2] - 2025-04-18

- Added auto-refresh button to refresh logs periodically.
- Fixed issue with `All` option in `Rows per page` pagination option. (thanks [@mook-as](https://github.com/mook-as))
- Fixed compiling on case-sensitive file systems (thanks [@mook-as](https://github.com/mook-as))
- NPM package and docker image updated to reduce vulnerabilities.

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


[2.0.2]: https://github.com/edwin-abraham-thomas/LogLens/tree/v2.0.2
[2.0.1]: https://github.com/edwin-abraham-thomas/LogLens/tree/v2.0.1
[2.0.0]: https://github.com/edwin-abraham-thomas/LogLens/tree/v2.0.0
[1.1.0]: https://github.com/edwin-abraham-thomas/LogLens/tree/v1.1.0
[1.0.0]: https://github.com/edwin-abraham-thomas/LogLens/tree/v1.0.0
