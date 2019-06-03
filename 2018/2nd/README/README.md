# MAD-2018
HHS Mobile App Development

*By Eric Cheng and David McAllister*

View the most recent ReadMe with image-filled installation instructions: https://github.com/Eric-Cf/MAD-2018

The Homestead High School Library App is designed to provide a mobile interface that works alongside a stable backend database structure to provide users with information about available books, their holds, and their checkouts. Additionally, it implements a scanner that connects to web APIs in order to allow users to discover and hold books with their phone cameras. The app was developed in conjunction with Homestead High School's library to ensure our app would be useful in a real world situation.

This application was programmed entirely in Apple's Swift language. The backend was coded with a mix of MySQL and PHP.

## Key Features

* Robust backend relational database to store information
* Book barcode scanner using RESTful APIs to generate book information
* Well commented database access code
* Checkout with your phone for ease of access
* Intelligent keyword search algorithm to look for books
* Hold system that lets you reserve a book to pick up later
* Customized map with genre pins to identify book locations
* Bug reporting to enable continuous development
* Smart resource management to reduce database calls and memory leaks
* Facebook integration to allow for a social aspect to our application

## Getting Started

The following are the best ways to test HHS Library given your access to certain devices.

### Mac OS Computer
Download XCode from the Mac App Store and create a free developer account on [Apple's Developer Portal](developer.apple.com)
* XCode is a large download so you can [test HHS Library on your personal Apple device](#downloading-on-personal-device-with-apple-testflight) with TestFlight in the meantime.

Once you are done downloading XCode, consult the [Installation and Use](#installation-and-use) section of this ReadMe.


### Windows and iPhone
The best solution for adjudicators with a Windows and iOS device is to open the code on a text editor (we recommend Atom or Sublime Text) in Windows and test app functionality on a personal iOS device.
* Download link to [Atom Text Editor](https://atom.io)
* Download link to [Sublime Text Editor](https://www.sublimetext.com)
Install HHS Library on your personal device with [these instructions](#downloading-on-personal-device-with-apple-testflight).


### Windows Without an iOS Device
The only way to view Swift code on a Windows device is through a text editor. These will not be able to build the project, but coding style and class structure is visible. Our code compiles without warnings or errors.
* Download link to [Atom Text Editor](https://atom.io)
* Download link to [Sublime Text Editor](https://www.sublimetext.com).   
To experience the app in use, please watch this video showing the application in use:    
[https://github.com/Eric-Cf/MAD-2018/wiki/TestFlight-and-YouTube-Video-Information](https://github.com/Eric-Cf/MAD-2018/wiki/TestFlight-and-YouTube-Video-Information)

### Prerequisites

To view the code
```
-Mac OS
-XCode
-Alternative Swift IDE (i.e. AppCode for Mac OS, text editor like Atom or SublimeText on Windows)
```
To run the application on your computer
```
-Mac OS
-XCode
-Developer signing
```

To run the application on your personal device
```
-iOS 9.0 or newer
-TestFlight application (available on the App Store)
```

### Downloading on Personal Device with Apple's Testflight
![testFlightIcon](https://developer.apple.com/assets/elements/icons/testflight/testflight-128x128_2x.png)

TestFlight Logo

Follow this process to get HHS Library running on your personal device.
Support: iPhones with iOS 9.0 or newer, most iPads should be able to run the application in scaled mode

1. Download Apple's official TestFlight application from the App Store
2. Continue through introduction pages until page with "Redeem" in upper right-hand corner appears
3. Select "Redeem" and enter one of the codes on the linked page into the text box
*[https://github.com/Eric-Cf/MAD-2018/wiki/TestFlight-and-YouTube-Video-Information](https://github.com/Eric-Cf/MAD-2018/wiki/TestFlight-and-YouTube-Video-Information)

If the first code you select is unavailable, it was most likely entered by another adjudicator or has expired. If this is the case, please try one of the other provided codes.

4. Download the application and enjoy.
* Note: TestFlight has been having documented issues recently. If the application does not work on your device, follow the installation and use instructions.

### Installation and Use

A step by step series of how to run our project assuming prerequisites are met.

1. Open Xcode and select "Open another project..."
2. Locate the submission folder and enter the MAD folder inside, clicking on the white MAD.xcworkspace file
![proj2](https://user-images.githubusercontent.com/26942890/36134916-905621ee-103c-11e8-9621-bcb171868d55.png)
3. After clicking open, click on the uppermost blue MAD file. You may see some red errors.
![proj3](https://user-images.githubusercontent.com/26942890/36134969-dc8501b6-103c-11e8-9f1c-d5ca45dbf508.png)
4. Change the provisioning profile to your own developer account.
![proj4](https://user-images.githubusercontent.com/26942890/36134994-086cf360-103d-11e8-93b8-e301b817adca.png)
5. It may say “Failed to create provisioning profile.”
![proj5](https://user-images.githubusercontent.com/26942890/36135007-1d194c96-103d-11e8-9f75-c50c5a08c301.png)
6. Edit the bundle identifier by adding a number to the end and click “Try Again.”
![proj6](https://user-images.githubusercontent.com/26942890/36135146-285446a0-103e-11e8-806c-633dc165cd75.png)
7. You can now view all the classes and storyboards that go into the application.
8. [Make sure xcode is opening a simulator of a valid and modern iPhone.]
![proj8](https://user-images.githubusercontent.com/26942890/36135164-3fcf4f0a-103e-11e8-9202-9f1eb4d07472.png)
9. To directly download the app onto your phone, plug your own phone into the computer and select your phone to download the app on your phone. You may have to approve the application on your iPhone.
10. After the application opens, log in with school id “1234567” and password “test.”
11. Feel free to browse the app!
The scanner portion of the app only works on an actual phone where a camera can be accessed.
12. You can log in with facebook within the *Onboarding Pages* or the *Profile Page*. Please use the following login information to see how our app uses facebook friend systems to enhance user experience.
* Email: dmcallister452@student.fuhsd.org
* Password: fblaJudgeLogin
![img_5589](https://user-images.githubusercontent.com/26942890/36135024-3baa4cb4-103d-11e8-9bbd-3068dd2de9d1.PNG)
Onboarding Page On First Launch

13. Below is an example barcode to be used with the scanner.   
**You can also scan any book not found in the library to pull up information about it from online api's.**   
We encourage you to try this out with books around your house!

![barcode](https://user-images.githubusercontent.com/26942890/36134449-b9bf6b56-1039-11e8-91f7-18aed490d548.gif)

14. If you ever run into any issues, submit a bug report at the bottom of the "My Books" page.

## Logging in

Application login credentials

* Student ID: "1234567"
* Password: "test"

Facebook login credentials

* Email: dmcallister452@student.fuhsd.org
* Password: fblaJudgeLogin

## Database Structure

Database is a relational MySQL database running the InnoDB engine. It uses various foreign key checks to ensure the integrity of the data and eliminate potential errors in database calls.
[You can see our design schema here](https://eric-cf.github.io/MAD-2018/)

## Deployment

This application is supported by a server side script, so any user just has to connect with their account (made with the library when they join the school)

## Built With

* MySQL server hosted with bluehost.com
* PHP access code hosted with bluehost.com
* Swift code for UI and implementation
* CocoaPods for library dependency management
* Lottie by Airbnb for in-app animations
* Adobe Photoshop CC for app graphics
* XCode Integrated Development Environment

## Authors

* **Eric Cheng** - *Database Structure and Backend* - [Eric-Cf](https://github.com/Eric-Cf)
* **David McAllister** - *UI design and API functionality* - [mcallisterdavid](https://github.com/mcallisterdavid)

## License

This project is licensed under the GNU Lesser General Public License v3.0 - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Thanks to Stanford Mobile App Development course for iOS app development learning resources
* Thanks to Mr. Kuramoto, the San Mateo Library branch manager, for answering our questions about library operations
* Thanks to Mr. Shelby, former computer engineer, for giving us feedback on user testing
* Special thanks to Mrs. Amity Bateman for answering our questions on what features Homestead High School wanted most from a library app

## Copyright Information

* Book information and cover images powered by Google Books, labeled within the app consistent with their API usage policies
* Facebook logo used for application graphics with explicit permission from the Facebook Brand Resource Center
* Google logo used for application graphics in accordance with trademark usage guidelines available [here](https://www.google.com/permissions/trademark/rules.html)
* The App Store, iOS, iPhone, iPad, XCode, and Swift are all registered trademarks of Apple Inc.
* Photo of Homestead High School cafeteria and horse statue provided by the Homestead High School Epitaph
* Following image acknowledgements are consistent with the [Freepik terms of use](freepik.com/terms_of_use)
* ["Boxing day sale background"](https://www.freepik.com/free-vector/boxing-day-sale-background_1442395.htm) image designed by [Freepik](freepik.com)
* ["Safety lock logo"](https://www.freepik.com/free-vector/safety-lock-logo_717950.htm#term=lock%20icon&page=1&position=9) image designed by [Freepik](freepik.com)
* ["Colorful books pack"](https://www.freepik.com/free-vector/colorful-books-pack_813860.htm#term=book&page=1&position=2) image designed by [Freepik](freepik.com)
* All other images and icons are completely original
