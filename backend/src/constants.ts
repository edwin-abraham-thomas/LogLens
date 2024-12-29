const mongoConnectionString = "mongodb://loglensdb:27001";
const mongodbname = "loglensdb";

const logsCollectionName = "logs";

const backendApiSocketFile = "/run/guest-services/socket-backend.sock";
const dockerSocketFile = "/var/run/docker.sock";

module.exports = {
  mongoConnectionString,
  mongodbname,
  logsCollectionName,
  backendApiSocketFile,
  dockerSocketFile
};
