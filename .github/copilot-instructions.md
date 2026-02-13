# LogLens
Dive into logs and gain insights into what is going on inside your containers.

## Features
- View and inspect logs from containers
- Filter logs by container
- View structured logs in formatted view

## Installation
Go to Docker Desktop -> Extensions tab -> Manage. Search for `Log Lens` and install.

## Local Development
To develop LogLens locally, you can use the following Makefile commands:

### Setup and Installation
- `make install` - Build the extension locally and install it to Docker Desktop
- `make update` - Build the extension locally and update an existing installation

### Development with Live Reload
For UI development with live reload:
1. Run `npm run dev` to start the local development server
2. Run `make attach-localhost` to make the extension listen to http://localhost:3000 for UI files
3. Changes to the UI will be reflected immediately without requiring a rebuild

Note: While UI live reload works with this setup, backend changes will still require a rebuild.

### Additional Commands
- `make update-lh` - Update the extension and automatically attach localhost for development
- `make reset-localhost` - Reset the extension to use the packaged UI files instead of localhost