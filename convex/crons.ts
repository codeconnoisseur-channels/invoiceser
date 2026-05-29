import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.cron(
  "mark overdue invoices",
  "0 1 * * *", // 01:00 UTC daily
  internal.invoices.markOverdueInvoices,
  {}
);

export default crons;
