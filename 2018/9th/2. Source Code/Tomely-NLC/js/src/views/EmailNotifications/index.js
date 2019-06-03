import MailCore from "react-native-mailcore";
import moment from "moment";
import Constants from "../Constants/constants";
import _ from "lodash";

const testDataEmailIdsArr = [
  "andrew_richardson@test.com",
  "tomelyfbla@gmail.com",
  "rodriguez2003@test.com",
  "margaret_johnson@test.com",
  "thompson_casey@test.com",
  "bellpatricia0704@test.com",
  "michaelm@test.com",
  "ericmcniel@test.com"
];

export const sendCheckedInEmail = (book, user) => {
  console.log("Inside sendCheckedInEmail");

  // Default the target email address to tomelyfbla@gmail.com
  var toEmailAddress = "tomelyfbla@gmail.com";

  if (!_.includes(testDataEmailIdsArr, user.email)) {
    toEmailAddress = user.email;
  }

  console.log("ToEmailAddress: " + toEmailAddress);

  var date = new Date();
  MailCore.sendMail({
    hostname: Constants.SMTP_HOST,
    port: Constants.SMTP_PORT,
    username: Constants.GMAIL_USER_NAME,
    password: Constants.GMAIL_PASSWORD,
    from: {
      addressWithDisplayName: Constants.EMAIL_DISPLAY_NAME,
      mailbox: Constants.EMAIL_ADDRESS
    },
    to: {
      addressWithDisplayName: `${user.first_name}` + " " + `${user.last_name}`,
      mailbox: `${toEmailAddress}`
    },
    subject: "Checked-in from your Tomely library - " + date,
    htmlBody: `<h3> ID Number - ${user.id_number} </h3>
                <h3>  Name - ${user.first_name} ${user.last_name}</h3>
              <p> The following book was checked-in by you on ${date} </p>
              <h4> ISBN: ${book.book_data.isbn} </h4>
              <h4> Title: ${book.book_data.title} </h4>
              <img src="${
                book.book_data.image_url
              }" alt="Sorry! Image not available at this time">
              <br/>
              <br/>
              <br/>
              <br/>

              <p> Thank you! </p>
              <br/>

              <p> Follow Us </p>
              <a href="https://www.facebook.com/Tomely-1536793186375640/" target="_blank">
                  <img src="https://c866088.ssl.cf3.rackcdn.com/assets/facebook30x30.png" alt="Facebook" border=0>
              </a>

              <a href="https://twitter.com/tomelyfbla?lang=en" target="_blank">
                  <img src="https://c866088.ssl.cf3.rackcdn.com/assets/twitter30x30.png" alt="Twitter" border=0>
              </a>

              <a href="https://www.instagram.com/tomelyfbla" target="_blank">
                  <img src="https://c866088.ssl.cf3.rackcdn.com/assets/instagram30x30.png" alt="Instagram" border=0>
              </a>

              <a href="https://www.youtube.com/channel/UC2lpd4H_5YFhoRNdzCfodTA" target="_blank">
                  <img src="https://c866088.ssl.cf3.rackcdn.com/assets/youtube30x30.png" alt="Youtube" border=0>
              </a>

              <br/>
              <br/>
              <p> Please do not reply to this message </p>
            `
  })
    .then(result => {
      console.log(result);
      // alert(result.status);
    })
    .catch(error => {
      console.log(error);
      // alert(error);
    });
};

export const sendCheckedOutEmail = (book, user) => {
  console.log("Inside sendCheckedOutEmail");
  console.log("---Book-----");
  console.log(book);
  console.log("---user-----");
  console.log(user);

  const { title, author, isbn, image_url } = book;

  var currentDate = new Date();

  // Default the target email address to tomelyfbla@gmail.com
  var toEmailAddress = "tomelyfbla@gmail.com";

  if (!_.includes(testDataEmailIdsArr, user.email)) {
    toEmailAddress = user.email;
  }

  console.log("ToEmailAddress: " + toEmailAddress);

  var maxReturnByDays = Constants.MAX_CHECKOUT_DAYS_STUDENT;

  if (user.member_type !== "STUDENT") {
    maxReturnByDays = Constants.MAX_CHECKOUT_DAYS_TEACHER;
  }

  var dueDate = moment(currentDate)
    .add(maxReturnByDays, "days")
    .format("MM/DD/YYYY");

  MailCore.sendMail({
    hostname: Constants.SMTP_HOST,
    port: Constants.SMTP_PORT,
    username: Constants.GMAIL_USER_NAME,
    password: Constants.GMAIL_PASSWORD,
    from: {
      addressWithDisplayName: Constants.EMAIL_DISPLAY_NAME,
      mailbox: Constants.EMAIL_ADDRESS
    },
    to: {
      addressWithDisplayName: `${user.first_name}` + " " + `${user.last_name}`,
      mailbox: `${toEmailAddress}`
    },
    subject: "Checked-out from your Tomely library - " + currentDate,
    htmlBody: `<h3> ID Number - ${user.id_number} </h3>
                  <h3>  Name - ${user.first_name} ${user.last_name}</h3>
                <p> The following book was checked out by you on ${
                  currentDate
                } </p>
                <h4> ISBN: ${isbn} </h4>
                <h4> Title: ${title} </h4>
                <h4> Due: ${dueDate} </h4>
                <img src="${
                  image_url
                }" alt="Sorry! Image not available at this time">
                <br/>
                <br/>
                <br/>
                <br/>

                <p> Thank you! </p>
                <br/>

                <p> Follow Us </p>
                <a href="https://www.facebook.com/Tomely-1536793186375640/" target="_blank">
                    <img src="https://c866088.ssl.cf3.rackcdn.com/assets/facebook30x30.png" alt="Facebook" border=0>
                </a>

                <a href="https://twitter.com/tomelyfbla?lang=en" target="_blank">
                    <img src="https://c866088.ssl.cf3.rackcdn.com/assets/twitter30x30.png" alt="Twitter" border=0>
                </a>

                <a href="https://www.instagram.com/tomelyfbla" target="_blank">
                    <img src="https://c866088.ssl.cf3.rackcdn.com/assets/instagram30x30.png" alt="Instagram" border=0>
                </a>

                <a href="https://www.youtube.com/channel/UC2lpd4H_5YFhoRNdzCfodTA" target="_blank">
                    <img src="https://c866088.ssl.cf3.rackcdn.com/assets/youtube30x30.png" alt="Youtube" border=0>
                </a>

                <br/>
                <br/>
                <p> Please do not reply to this message </p>
              `
  })
    .then(result => {
      console.log(result);
      // alert(result.status);
    })
    .catch(error => {
      console.log(error);
      // alert(error);
    });
};

export const sendDueDateReminder = (book, user) => {
  console.log("Inside sendDueDateReminder");
  var date = new Date();

  // Default the target email address to tomelyfbla@gmail.com
  var toEmailAddress = "tomelyfbla@gmail.com";

  if (!_.includes(testDataEmailIdsArr, user.email)) {
    toEmailAddress = user.email;
  }

  console.log("ToEmailAddress: " + toEmailAddress);

  var checkedOutDate = moment(book.last_activity_date).format("MM/DD/YYYY");

  var maxReturnByDays = Constants.MAX_CHECKOUT_DAYS_STUDENT;

  if (user.member_type !== "STUDENT") {
    maxReturnByDays = Constants.MAX_CHECKOUT_DAYS_TEACHER;
  }

  var dueDate = moment(checkedOutDate)
    .add(maxReturnByDays, "days")
    .format("MM/DD/YYYY");

  var today = moment();
  var daysRemaining =
    maxReturnByDays - today.diff(book.last_activity_date, "days");

  var displayText = "You have " + daysRemaining + " days remaining";
  if (daysRemaining < 0) {
    displayText =
      "Your book is " +
      -1 * daysRemaining +
      " days past due !!! Please return it to the library immediately. " +
      " According to the library guidelines, you cannot borrow or reserve anymore books until you return this overdue book.";
  }

  // Only start sending notifications 1 week prior
  if (daysRemaining >= Constants.START_REMINDER_NOTIFICATIONS) {
    console.log(
      "Days Remaining is not 1 week prior to due date: " + daysRemaining
    );
    return;
  }

  MailCore.sendMail({
    hostname: Constants.SMTP_HOST,
    port: Constants.SMTP_PORT,
    username: Constants.GMAIL_USER_NAME,
    password: Constants.GMAIL_PASSWORD,
    from: {
      addressWithDisplayName: Constants.EMAIL_DISPLAY_NAME,
      mailbox: Constants.EMAIL_ADDRESS
    },
    to: {
      addressWithDisplayName: `${user.first_name}` + " " + `${user.last_name}`,
      mailbox: `${toEmailAddress}`
    },
    subject: "Due date reminder from your Tomely library - " + date,
    htmlBody: `<h3> ID Number - ${user.id_number} </h3>
                <h3>  Name - ${user.first_name} ${user.last_name}</h3>
              <p> The following book was checked out by you on <strong> ${
                checkedOutDate
              } </strong></p>
              <h4> ISBN: ${book.isbn} </h4>
              <h4> Title: ${book.title} </h4>
              <h4 style="color:red;"> Due: ${dueDate} </h4>
              <h2 style="color:red;"> Note: ${displayText} </h2>
              <img src="${
                book.image_url
              }" alt="Sorry! Image not available at this time">
              <br/>
              <br/>
              <br/>
              <br/>

              <p> Thank you! </p>
              <br/>

              <p> Follow Us </p>
              <a href="https://www.facebook.com/Tomely-1536793186375640/" target="_blank">
                  <img src="https://c866088.ssl.cf3.rackcdn.com/assets/facebook30x30.png" alt="Facebook" border=0>
              </a>

              <a href="https://twitter.com/tomelyfbla?lang=en" target="_blank">
                  <img src="https://c866088.ssl.cf3.rackcdn.com/assets/twitter30x30.png" alt="Twitter" border=0>
              </a>

              <a href="https://www.instagram.com/tomelyfbla" target="_blank">
                  <img src="https://c866088.ssl.cf3.rackcdn.com/assets/instagram30x30.png" alt="Instagram" border=0>
              </a>

              <a href="https://www.youtube.com/channel/UC2lpd4H_5YFhoRNdzCfodTA" target="_blank">
                  <img src="https://c866088.ssl.cf3.rackcdn.com/assets/youtube30x30.png" alt="Youtube" border=0>
              </a>

              <br/>
              <br/>
              <p> Please do not reply to this message </p>
            `
  })
    .then(result => {
      console.log(result);
      // alert(result.status);
    })
    .catch(error => {
      console.log(error);
      // alert(error);
    });
};

export const sendBookReservedEmail = (book, user) => {
  console.log("Inside sendBookReservedEmail");
  console.log("---Book-----");
  console.log(book);
  console.log("---user-----");
  console.log(user);

  // Default the target email address to tomelyfbla@gmail.com
  var toEmailAddress = "tomelyfbla@gmail.com";

  if (!_.includes(testDataEmailIdsArr, user.email)) {
    toEmailAddress = user.email;
  }

  console.log("ToEmailAddress: " + toEmailAddress);

  const { title, author, isbn, image_url } = book;

  var currentDate = new Date();

  var maxReturnByDays = Constants.MAX_CHECKOUT_DAYS_STUDENT;

  if (user.member_type !== "STUDENT") {
    maxReturnByDays = Constants.MAX_CHECKOUT_DAYS_TEACHER;
  }

  MailCore.sendMail({
    hostname: Constants.SMTP_HOST,
    port: Constants.SMTP_PORT,
    username: Constants.GMAIL_USER_NAME,
    password: Constants.GMAIL_PASSWORD,
    from: {
      addressWithDisplayName: Constants.EMAIL_DISPLAY_NAME,
      mailbox: Constants.EMAIL_ADDRESS
    },
    to: {
      addressWithDisplayName: `${user.first_name}` + " " + `${user.last_name}`,
      mailbox: `${toEmailAddress}`
    },
    subject: "Reserved from your Tomely library - " + currentDate,
    htmlBody: `<h3> ID Number - ${user.id_number} </h3>
                  <h3>  Name - ${user.first_name} ${user.last_name}</h3>
                <p> The following book was reserved by you on ${
                  currentDate
                } </p>
                <h4> ISBN: ${isbn} </h4>
                <h4> Title: ${title} </h4>
                <img src="${
                  image_url
                }" alt="Sorry! Image not available at this time">
                <br/>
                <br/>
                <br/>
                <br/>

                <p> Thank you! </p>
                <br/>

                <p> Follow Us </p>
                <a href="https://www.facebook.com/Tomely-1536793186375640/" target="_blank">
                    <img src="https://c866088.ssl.cf3.rackcdn.com/assets/facebook30x30.png" alt="Facebook" border=0>
                </a>

                <a href="https://twitter.com/tomelyfbla?lang=en" target="_blank">
                    <img src="https://c866088.ssl.cf3.rackcdn.com/assets/twitter30x30.png" alt="Twitter" border=0>
                </a>

                <a href="https://www.instagram.com/tomelyfbla" target="_blank">
                    <img src="https://c866088.ssl.cf3.rackcdn.com/assets/instagram30x30.png" alt="Instagram" border=0>
                </a>

                <a href="https://www.youtube.com/channel/UC2lpd4H_5YFhoRNdzCfodTA" target="_blank">
                    <img src="https://c866088.ssl.cf3.rackcdn.com/assets/youtube30x30.png" alt="Youtube" border=0>
                </a>

                <br/>
                <br/>
                <p> Please do not reply to this message </p>
              `
  })
    .then(result => {
      console.log(result);
      // alert(result.status);
    })
    .catch(error => {
      console.log(error);
      // alert(error);
    });
};
