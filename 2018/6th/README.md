# iLibrary - A Revolutionary, New Library Management System

## 2018 FBLA Mobile Application Development, NLC

### Authors: Devansh Yerpude & Anish Ganga

## App Features

* **Simple, Vibrant User Interface**
    * Integrated tabs system for easy access to key features
    * Error handling on all pages
    * Creative popups featuring diverse images
    * Integrated graphics and branding through app
* **Robust Login Page**
    * Login & Create Accounts, Cloud Authentication
* **Intuitive Checkout/Reserve System** 
    * Checkout, reserve, and get information for books all in one page
    * Data is stored per user in the Cloud
    * Easy access to your books across multiple devices
* **Adaptive Search**
    * Search through books based on title, author, and genre
    * Filters books as users type, enabling more convenient searching
* **User Friendly**
    * Easily add events to calendar, send emails, or visit our website
    * View a map of Northview's library, and through pop-ups, explore each genre in more detail
* **Integrated Socaial Media/Bug Reporting**
    * Users can directly report bugs from within the app to developers
    * Integrated social media and graphic allows user to share app logo and thoughts on any platform
    * Easy access from Snapshot page ensures that transcribed text can easily be used
* **Innovative Snapshot & Live Text Pages**
    * Easily transcribe text from books to your phone 
    * Live text recognition for hard to read 


## Instructions After Download

1) Open "Mobile-App-Development-master" (folder) and navigate to then open the folder "m.a.d"
2) In this folder, search for a file called "GoogleService-Info.plist", and double click it to open it in XCode. 
3) Where it says "BUNDLE_ID", to the left find the string of text starting with "com." Double click on this, and edit it to be some random, unique string in a similiar format. For example: com.gafblatesting2.testing. Copy this text and save it for later setup use. 
4) After saving the file, close out of it, and exit the "m.a.d" folder. Back in the "Mobile-App-Development-master" folder, you should see a file called "m.a.d.xcworkspace". Double click this file to open it within XCode. After opening Xcode, you should see, on the left most column, "m.a.d" and "pods". Click "m.a.d" once, and you should see a settings page open to "General" 
5) In the field "Bundle Identifier, replace the text there with whatever text you used in Step 3. 
6) Now head down towards the "Signing" section, and where it says "Team", click and scroll down and click "Add Team". This should open up a new window where you are prompted to enter an Apple ID. We have pre-created one with an email as [iLibrarynhs@gmail.com] and password [iLibrarygafbla1]. 
7)After logging below "Team", signing certificate should be filled out with some details. If you get an error message, read the directions, and click try again. 
8) There are two options moving forward: you can either run our app on IOS Simulator, or you can run it on your Apple Device. If you choose to run it on the Simulator, you won't be able to test the "Snapshot" or "Live Text" pages on our app, because they require access to a camera. Attempting to open "Live Text" within the simulator will cause an error and crash the app. If you do choose to run it on the simulator, at the very top where it says "Generic IOS Device" next to "m.a.d", make the Simulator either an iPhone 6, 6S, 7, or 8. All these devices will properly scale the app, and run it. Click on the big play button to the left (sideways triangle) and now you should see the simulator opening up our app. For details on the features of the app, scroll down on this README file. If you choose to use a phone, continue the steps below. 
9) Similarly, if you wish to properly run the app on a phone, an iPhone 6S, 7, or 8 are the best options. Any of the "Plus" models will work too, but the scaling while be off. Plug in your phone to your Mac, and follow the instructions in Step 8 for setting up an emulator, except scroll to the top and pick your device. After clicking run, and the app compiling, you should see a popup that says "enabling debugger support". Click cancel on this, and proceed to run the app again. This time you should get a popup saying "Developer not trusted". This means you've succesfull installed the app on your phone, and have one more step to go. 
10) On your phone, go to Settings, and scroll down to General, and under "Device and Profile Management", trust "iLibrary". After you do this, you can now run the app. 
11) To login, the preset credentials are [ga@fbla.org] and password [testing].
12) Remember to be connected to the internet to run the app, without Internet access, you won't have access to many of the app's features. 

## Feature Details

### Login

Through the use of Firebase Authentication, our app is able to create new users, and authenticate previosuly created accounts, all from the cloud. Cloud based authentication allows users to have their credentials work across an array of devices, and their data is never lost. With vibrant and seamless error and success messages, the user can easily identify if they have entered the wrong username or password, and if their account has been created succesfully. Upon succesful logging in, a seven second loading screen is played, integrating our app logo with books and technology. 

### Backpack 

The very first page that the user is directed to is the "Backpack". This page essentially serves as the home page for any book that the user has checked out. Through a built in tableview feature, the user can scroll through the books that they have checked out, and view the date that the book is due. This page is user authenticated, meaning that it changes based on who is logged in, and only shows the book that the user logged in has checked out. 

### Search 

At the beginning, the search page simply features four books from various genres, but after clicking the "search" button, the user is transitioned to an adaptive tablewview, which displays all the books in our database. The user then has the option to search based off of genre, book title, or book author. As the user types into the search bar, non-relevant books are automatically removed, making it easier for the user to see which books match their criteria. Depending on the search criteria, the tablview features a combination of the book cover, book author, book genre and book title. This constant updating of search results makees it easier for users to find books in a potentially large database of books. 

### Map

The interactive map features a colorful map of Northview High School's library, and features labels so that users can easily identify which section corresponds to which genre of books. Upon clicking of any of the sections, a pop-up is displayed with a brief summary of the section, and who would enjoy reading books there. This pop-up features a colorful image so that the user isn't bored with the constant boring pop-up messages. 

### Info

This page is the central information processing page of our app. Through this page, user's can easily report any bug founds via a text field, and their bug report is instantly uploaded to our database, allowing for us to check the email and complaint that is recieved. This page also allows for users to type in a message, and seamlessly, without leaving the app, share that message and a picture of our logo to any social media that is installed on their phone. This page also features direct links that open up a web browser to our website, and the default email application to send us an email. 

### Snapshot

The snapshot page is the most revolutionary and code intensive page of our application. This page allows users to, from within the app, take a picture of any text, and have it transcribed onto their phone. Through this page, users can easily take quotes or notes from books, without ever having to type anything on their own. After the text has been recognized, user's have the option of editing the text if minor discrepancies occur, and directly coying it to their keybaord, or sharing it through any other application. The Snapshot page uses a pretrained neural network (Tesseract), and utilizes a three stage verification engine to detect and recognize text from an image. 

### Live Text

This page utilizes the same neural network engine from Snapshot, but is considerably more accurate, considering that it takes a video feed and uses up to 60 frames a second to recognize and detect text. This page is placed to help the visually impaired or users  having trouble reading a certain text due to quality. This page takes a live video feed from within the app and updates the text recognized constantly, and displays it in big bright letters, that are clearly visible. 

### Calendar

The calendar page is simply a reminder page for users, and works to retreive events from our datbase, and displays the two closest upcoming events. Users can toggle through both events, and have the option of being directly transitioned to their calendar app to add that event to their calendar. 

### Hot Books

This is the second page in the tab bar view. This page serves to highlight four book's based on the adminstrator's choice. This page allows for direct transition to the check out date, and displays the current date so that users can ensure that the books displayed are the "hot" books for today. 
