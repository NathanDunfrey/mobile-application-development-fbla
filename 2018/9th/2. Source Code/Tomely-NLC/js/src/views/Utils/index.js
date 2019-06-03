import moment from "moment";
import { getDatabase } from "../../../firebase";
import { sendDueDateReminder } from "../EmailNotifications";
import { Alert } from "react-native";

export const checkAndSendAlerts = books_due_for_reminder => {
  var isReminderAlreadySent = checkIfAlertsWereSentToday();
  // Check to send reminders only once per day
  if (!isReminderAlreadySent) {
    _.map(books_due_for_reminder, (data, counter) => {
      console.log(data);
      if (data.booksDue.length === 0) {
        console.log(
          data.userProfile.first_name +
            " " +
            data.userProfile.last_name +
            " has no books to send reminder"
        );
      } else {
        console.log(
          data.userProfile.first_name +
            " " +
            data.userProfile.last_name +
            " has " +
            data.booksDue.length +
            " books to send reminder"
        );

        data.booksDue.forEach(function(bookItem, i) {
          sendDueDateReminder(bookItem, data.userProfile);
        });
      }
    });

    markReminderSentToday();
  }
};

export const checkIfAlertsWereSentToday = () => {
  var isReminderAlreadySent = true;
  var alertRef = getDatabase().ref("/middletonhighschool/due_date_reminders/");

  alertRef.on("value", snapshot => {
    var data = snapshot.val();

    var currentDate = new Date();
    var today = moment();
    var daysSinceAlertSent = today.diff(data.last_sent_timestamp, "days");
    console.log("daysSinceAlertSent: " + daysSinceAlertSent);

    if (daysSinceAlertSent >= 1) {
      isReminderAlreadySent = false;
      console.log("Generating email reminders for books due within a week");
    } else {
      console.log("Email reminder already sent for today");
    }
  });

  return isReminderAlreadySent;
};

export const markReminderSentToday = () => {
  var alertRef = getDatabase().ref("/middletonhighschool/due_date_reminders/");

  const currentDate = new Date();
  const formattedCurrDate = moment(currentDate).format("MM/DD/YYYY");
  alertRef
    .set(
      {
        last_sent_timestamp: formattedCurrDate,
        reminder_sent: true,
        status: "SUCCESS"
      },
      function(error) {
        if (error) {
          console.log("Error updating due_date_reminders table " + error);
        } else {
          console.log("Successfully updated due_date_reminders table ");
        }
      }
    )
    .then(user => {
      console.log("Successfully updated due_date_reminders table");
    })
    .catch(error => {
      // Handle Errors here.
      var errorMessage = error.code + " -- " + error.message;
      console.log("Error updating due_date_reminders table: " + errorMessage);
    });
};

// Admin Reminders will send reminder notifications every time this Button
// is clicked
export const sendAdminReminders = books_due_for_reminder => {
  // Check to send reminders only once per day
  _.map(books_due_for_reminder, (data, counter) => {
    console.log(data);
    if (data.booksDue.length === 0) {
      console.log(
        data.userProfile.first_name +
          " " +
          data.userProfile.last_name +
          " has no books to send reminder"
      );
    } else {
      console.log(
        data.userProfile.first_name +
          " " +
          data.userProfile.last_name +
          " has " +
          data.booksDue.length +
          " books to send reminder"
      );

      data.booksDue.forEach(function(bookItem, i) {
        sendDueDateReminder(bookItem, data.userProfile);
      });
    }
  });
};

// Admin Reminders will send reminder notifications every time this Button
// is clicked
export const updateRequestData = (key, data, status) => {
  const currentDate = new Date();
  const formattedCurrDate = moment(currentDate).format("MM/DD/YYYY");

  console.log("Request Key: ", key);

  getDatabase()
    .ref(`/middletonhighschool/requests/${key}`)
    .set(
      {
        name: data.name,
        email: data.email,
        message: data.message,
        created: data.created,
        status: status,
        updated: formattedCurrDate
      },
      function(error) {
        if (error) {
          Alert.alert("Error", "Failed to review user request");
        } else {
          Alert.alert("Info", "Request reviewed successfully");
        }
      }
    )
    .then(request => {
      console.log("Request reviewed successfully");
    })
    .catch(error => {
      // Handle Errors here.
      var errorMessage = error.code + " -- " + error.message;
      console.log("Error: " + errorMessage);
    });
};
