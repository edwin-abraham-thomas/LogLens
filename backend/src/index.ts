const { initializeDatabase } = require("./data-access/database.js");
const logIngestJob = require("./jobs/log-ingest-job.js");

async function startApp() {
  const db = await initializeDatabase();
  logIngestJob.start(db);
}

startApp();
