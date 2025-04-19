import cron from 'node-cron';
import { runAllChecks } from '../scripts/run_all_checks.js';
import logger from '../utils/logger.js';

// Schedule task to run every 5 days
// Cron expression: At 00:00 every 5th day
const scheduledTask = cron.schedule('0 0 */5 * *', async () => {
  logger.info('Starting scheduled environmental checks...');
  try {
    await runAllChecks();
    logger.info('Completed scheduled environmental checks successfully');
  } catch (error) {
    logger.error('Error in scheduled environmental checks:', error);
  }
});

export const startCronJobs = () => {
  logger.info('Starting cron jobs...');
  scheduledTask.start();
};

export const stopCronJobs = () => {
  logger.info('Stopping cron jobs...');
  scheduledTask.stop();
};

export default {
  startCronJobs,
  stopCronJobs
}; 