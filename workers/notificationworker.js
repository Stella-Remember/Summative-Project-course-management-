const { Notification, User } = require('../models');

/**
 * Create and send a notification to a user
 * @param {Object} options
 * @param {number} options.userId - ID of the user to notify
 * @param {string} options.type - Notification type (reminder, alert, info, warning)
 * @param {string} options.message - The notification message
 * @param {Date} [options.sentAt] - Optional sent date (defaults to now)
 */
async function sendNotification({ userId, type, message, sentAt = new Date() }) {
  try {
    // Validate user exists
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // Create notification record
    const notification = await Notification.create({
      user_id: userId,
      type,
      message,
      is_read: false,
      sent_at: sentAt
    });

    // In a real app, send email, push notification, or SMS here
    console.log(`Notification sent to user ${userId}: ${message}`);

    return notification;
  } catch (err) {
    console.error('Error sending notification:', err);
    throw err;
  }
}

/**
 * Example worker process that sends daily reminders
 * This could be run on a cron job
 */
async function sendDailyReminders() {
  try {
    const users = await User.findAll({ where: { receive_reminders: true } });

    for (const user of users) {
      await sendNotification({
        userId: user.id,
        type: 'reminder',
        message: 'Don’t forget to check your dashboard today!'
      });
    }

    console.log(`Daily reminders sent to ${users.length} users`);
  } catch (err) {
    console.error('Error in sendDailyReminders:', err);
  }
}
/**
 * Starts the background worker that runs at a fixed interval
 */
function startNotificationWorker() {
  console.log('🔔 Notification worker started.');
  // Run every 24 hours (adjust as needed)
  setInterval(sendDailyReminders, 24 * 60 * 60 * 1000);
}

module.exports = {
  sendNotification,
  sendDailyReminders,
   startNotificationWorker
};
