import cron from 'cron';
import https from 'https';

const URL = "https://graphql-expense-tracker-87s6.onrender.com";

const job = new cron.CronJob("*/14 * * * *", function () {
  https.get(URL, (res) => {
    if (res.statusCode === 200)
      console.log("GET request sent successfully.");
    else
      console.log("GET request failed.", res.statusCode());
  }).on("error", (e) => {
    console.error("Error while sending request.", e);
  });
});

export default job;

//? EXAMPLES && EXPLANATION:
//* 14 * * * * - Every 14 minutes
//* 0 0 * * 0 - At midnight on every Sunday
//* 30 3 15 * * - At 3:30 AM, on the 15th of every month
//* 0 0 1 1 * - At midnight, on January 1st
//* 0 * * * * - Every hour