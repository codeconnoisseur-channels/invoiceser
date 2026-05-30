import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.cron(
  "mark overdue invoices",
  "0 1 * * *", // 01:00 UTC daily
  internal.invoices.markOverdueInvoices,
  {}
);

crons.cron(
  "send auto reminders",
  "0 9 * * *", // 09:00 UTC daily
  internal.reminders.sendAutoReminders,
  {}
);

export default crons;
