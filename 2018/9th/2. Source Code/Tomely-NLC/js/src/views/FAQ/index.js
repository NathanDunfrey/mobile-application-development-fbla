import React, { Component } from "react";
import {
  Image,
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity
} from "react-native";

import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Card,
  CardItem,
  Text,
  Label,
  Item,
  Thumbnail,
  Left,
  Right,
  Body,
  List,
  Separator,
  ListItem
} from "native-base";

import styles from "./styles";
import AddSocialIcons from "../WebPage/AddSocialIcons";

const datas = [
  "Allow students and teachers to reserve books.",
  "Allow students and teachers to check out books.",
  "Remind students and teachers when books are overdue.",
  "Show a map of the school library."
];

export default class Faq extends Component {
  goToHomePage() {
    this.props.navigation.navigate("Home");
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header style={{ backgroundColor: "dodgerblue" }}>
          <Left />
          <Body style={{ alignSelf: "center" }}>
            <Title>FAQ</Title>
          </Body>
          <Right>
            <Button
              iconRight
              transparent
              style={styles.mb15}
              onPress={this.goToHomePage.bind(this)}
            >
              <Icon active name="home" />
            </Button>
          </Right>
        </Header>

        <Content padder>
          <ScrollView>
            <Card>
              <Text style={{ fontWeight: "bold" }}>What is Tomely? </Text>
              <Text>
                Tomely is a mobile app to manage the issuance of books and to
                provide other information at a school library. Tomely has been
                developed to support the Google’s Android platform. Some of the
                most important features of Tomely are as follows:
              </Text>

              <List
                dataArray={datas}
                renderRow={data => (
                  <ListItem>
                    <Text>{data}</Text>
                  </ListItem>
                )}
              />
            </Card>

            <Card>
              <Text style={{ fontWeight: "bold" }}>
                What is Tomely's mission?
              </Text>
              <Text>
                Tomely mission is to provide teachers and students with the
                next-generation mobile digital library application that allows
                them to Read, Engage and Connect.
              </Text>
            </Card>

            <Card>
              <Text style={{ fontWeight: "bold" }}>
                What kind of technology was used to develop Tomely?
              </Text>
              <Text>
                Tomely was developed in React Native to build cross platform
                Android & iOS mobile apps using ready to use generic components
                of React Native. Google's firebase realtime database was used to
                store the books and user data.
              </Text>
            </Card>

            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Does Tomely run on Android and IOS?
              </Text>
              <Text>
                Although Tomely was developed in React Native to run
                cross-platform on both Android & iOS, it was extensively tested
                and verified in Android. Currently, Tomely is not supported for
                IOS.
              </Text>
            </Card>

            <Card>
              <Text style={{ fontWeight: "bold" }}>
                What version of Android does Tomely run on/support?
              </Text>
              <Text>Tomely was developed and tested on Android 7.1.1</Text>
            </Card>

            <Card>
              <Text style={{ fontWeight: "bold" }}>
                What version of IOS does Tomely run on/support?
              </Text>
              <Text>Currently, Tomely is not supported for IOS.</Text>
            </Card>

            <Card>
              <Text style={{ fontWeight: "bold" }}>
                What are the different types of accounts that can be created in
                Tomely?
              </Text>
              <Text>
                There are 3 different types of accounts supported by Tomely.
                They are Student, Teacher and Admin. The Admin account is the
                librarian account that maintains and administers the Tomely
                system, maintains the books inventory, creates members and
                check-in books. The Teacher/Student account types are meant for
                the teachers/students respectively and allows them to browse,
                check out, reserve books, read review and add reviews.
              </Text>
            </Card>

            <Card>
              <Text style={{ fontWeight: "bold" }}>
                How does Tomely notify Students/Teachers when books are overdue?
              </Text>
              <Text>
                When the student or teacher logs into the Tomely app, and click
                on the "My Books" footer tab, the "Borrowed" tab will display
                all the books that are borrowed along with the due date and
                number of day remaining. Tomely also provides a PIE indicating
                the number of days remaining. Also, a system generated daily
                email reminder will be sent to the Students/Teachers email
                address for every book that is checked out and due within one
                week.
              </Text>
            </Card>

            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Can the users Register themselves?
              </Text>
              <Text>
                The users can register themselves as a Student or Teacher by
                clicking on the "Register" button on the relevant Login page.
              </Text>
            </Card>

            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Can the users check the Tomely's features before registering
                themselves?
              </Text>
              <Text>
                The users are encouraged to check Tomely's cool features using
                the Guest Login option provided on the Student/Teacher login
                page. The guest access will give limited readonly functionality
                to browse books, view book details, preview book and read
                reviews. To check out or reserve, the users must register
                themselves to the Tomely system.
              </Text>
            </Card>

            <Card>
              <Text style={{ fontWeight: "bold" }}>
                How does Tomely protect our personal data?
              </Text>
              <Text>
                Tomely stores the Student/Teacher's profile data in Google's
                firebase datastore and utilizes firebase encryption to protect
                the data. Also, Tomely does not pass this data to any third
                parties.
              </Text>
            </Card>

            <Card>
              <Text style={{ fontWeight: "bold" }}>
                What are restrictions on the student accounts?
              </Text>
              <Text>
                The Student accounts are allowed to keep the checked out books
                for 14 days. Once a books is past due, they will not be
                permitted to check out or reserve anymore books until the
                overdue book is returned back to the library.
              </Text>
            </Card>

            <Card>
              <Text style={{ fontWeight: "bold" }}>
                What are the restrictions on teacher accounts?
              </Text>
              <Text>
                The Teacher accounts are allowed to keep the checked out books
                for 28 days. Once a books is past due, they will not be
                permitted to check out or reserve anymore books until the
                overdue book is returned back to the library.
              </Text>
            </Card>

            <Card>
              <Text style={{ fontWeight: "bold" }}>
                How to update my profile?
              </Text>
              <Text>
                Currently, Tomely does not support update of Profile settings.
                Please contact the Admin team or send a note via "Contact Us"
                for any help required on profile updates. In future releases,
                Tomely will add functionality that will allow them to update
                their profile and change password from the "Me" page.
              </Text>
            </Card>

            <Card>
              <Text style={{ fontWeight: "bold" }}>
                How can the members check out books?
              </Text>
              <Text>
                First login to Tomely as a Teacher or Student. After successful
                authenication with the Tomely application, the users can click
                on any book displayed on the Home Page will navigate them to the
                Book Details screen. Users can also search for a specific book
                or browse all books by clicking on the "All Books" button on the
                home page. This will present list view of all the books
                available in the library and users can select any one of the
                books and it will navigate them to the Book Details screen. On
                the Book Details screen, users can view the book details, read
                reviews, preview and click on "Check out" button. A confirmation
                popup is displayed asking users consent to proceed with the
                check out transaction. Upon clicking "continue", the book will
                be checked out. Certain validations are done before the check
                out process -- 1) Prevent users from checking out a book that is
                already borrowed or reserved. 2) Prevent users from checking out
                a book if they currently borrowed a book that is past overdue.
                After successful validations, the book will be checked out. At
                this point, users can notice that the checked out book will
                appear in the "BORROWED" tab under the "My Books" footer tab.
                Also, Tomely notifies the user via email with details of the
                check out transaction.
              </Text>
            </Card>

            <Card>
              <Text style={{ fontWeight: "bold" }}>
                How can the members reserve books?
              </Text>
              <Text>
                First login to Tomely as a Teacher or Student. After successful
                authenication with the Tomely application, the users can click
                on any book displayed on the Home Page will navigate them to the
                Book Details screen. Users can also search for a specific book
                or browse all books by clicking on the "All Books" button on the
                home page. This will present list view of all the books
                available in the library and users can select any one of the
                books and it will navigate them to the Book Details screen. On
                the Book Details screen, users can view the book details, read
                reviews, preview or click on "Reserve" button. A confirmation
                popup is displayed asking users consent to proceed with the
                reserve transaction. Upon clicking "continue", the book will be
                reserved. Certain validations are done before the reserve
                transaction -- 1) Prevent users from reserving a book that is
                already borrowed or reserved. 2) Prevent users from reserving a
                book if they currently borrowed a book that is past overdue.
                After successful validations, the book will be reserved and
                users can notice that the reserved book appears in the
                "RESERVED" tab under the "My Books" footer tab. Also, Tomely
                notifies the user via email with details of the reserve
                transaction.
              </Text>
            </Card>

            <Card>
              <Text style={{ fontWeight: "bold" }}>
                How can the members check in books?
              </Text>
              <Text>
                The student/teacher should take the book the Library. Then, the
                Admin will login to Tomely and identify the user that is trying
                to check in the book. Then Admin will click on the "Books" to
                see the book activity of the user. The book being returned will
                have "Check In" button. Upon clicking the "Check in" button, the
                book is returned back to the Tomely library. The book is also
                removed from the user "BORROWED" tab of the specific user. Also,
                Tomely notifies the member via email with date, time, and
                details of the check in transaction.
              </Text>
            </Card>

            <Card>
              <Text style={{ fontWeight: "bold" }}>
                How can the members check out books that they reserved?
              </Text>
              <Text>
                Checking out books reserved by a user can only be performed by
                the Admin. First, the Admin will login to Tomely and identify
                the user that is trying to check out the reserved book. Then
                Admin will click on the "Books" button to see the book activity
                of the user. The book reserved by the user will have a "Check
                Out" button displayed next to it. Upon clicking the "Check Out"
                button, the book is checked out for the user. The book will now
                appear in the specific user's "BORROWED" tab within the "My
                Books" footer tab. Tomely also notifies the user via email with
                date, time, and details of the check out transaction.
              </Text>
            </Card>

            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Does Tomely help members locate books in the Library?
              </Text>
              <Text>
                On the Browse books tab, members can click on the "Locate"
                button to open the library map to find the book location.
              </Text>
            </Card>

            <Card>
              <Text style={{ fontWeight: "bold" }}>
                What is the functionality of the Preview button displayed
                against each book?
              </Text>
              <Text>
                When the user click on the Preview button displayed next to a
                specific book, it opens a mobile friendly web page with the
                Amazon Kindle preview for the book if available. The preview
                page also has a tab called "BUY" which users can click to buy
                the book directly from Amazon store.
              </Text>
            </Card>

            <Card>
              <Text style={{ fontWeight: "bold" }}>
                What is the functionality of the Share button displayed against
                each book?
              </Text>
              <Text>
                When the user click on the Share button displayed next to a
                specific book, it opens all the apps like Snapchat, WhatsApp,
                Messaging, Email etc installed on the Android mobile device
                through which the user can share book details like title, author
                and summary to another user.
              </Text>
            </Card>

            <Card>
              <Text style={{ fontWeight: "bold" }}>
                How to contact Tomely team in case of issues?
              </Text>
              <Text>
                On the Home page of Tomely, members can click on the "Contact
                US" button which will navigate them to the "Contact Us" screen.
                Members can provide their Name, Email and Message. The messages
                will be reviwed by the Admin team and responded within 24 hours
                in the order it was received.
              </Text>
            </Card>

            <Card>
              <Text style={{ fontWeight: "bold" }}>
                What are some future enhancements for Tomely?
              </Text>
              <Text>
                Tomely team is constantly working to improve the usability of
                the app. Below are some of the future enhancements that can be
                done via Tomely app:
              </Text>
              <ListItem style={{ borderBottomWidth: 0 }}>
                <Item>
                  <Text>
                    Allow Teachers/Students to update profile details and change
                    password
                  </Text>
                </Item>
              </ListItem>
              <ListItem style={{ borderBottomWidth: 0 }}>
                <Item>
                  <Text>
                    Ability to reserve/check out multiple books in one
                    transaction - Add to Cart functionality
                  </Text>
                </Item>
              </ListItem>
              <ListItem style={{ borderBottomWidth: 0 }}>
                <Item>
                  <Text>
                    Add book recommendations page based on the users past book
                    activity.
                  </Text>
                </Item>
              </ListItem>
              <ListItem style={{ borderBottomWidth: 0 }}>
                <Item>
                  <Text>
                    Add the ability to check out/reserve digital media like CDs
                    and DVDs.
                  </Text>
                </Item>
              </ListItem>
            </Card>

            <Card>
              <Text style={{ fontWeight: "bold" }}>
                How can the members stay in touch with Tomely updates and
                events?
              </Text>
              <Text>
                Tomely's core design principle is to allow the students and
                teachers to Read, Engage and Connect. To facilate this, Tomely
                has created its presence in various social media websites like
                FaceBook, Twitter, Youtube and Instagram. The members can
                follows by clicking the below social icons:
              </Text>
              <AddSocialIcons navigation={this.props.navigation} />
            </Card>
            <Text> </Text>
            <Card />
          </ScrollView>
        </Content>
      </Container>
    );
  }
}
