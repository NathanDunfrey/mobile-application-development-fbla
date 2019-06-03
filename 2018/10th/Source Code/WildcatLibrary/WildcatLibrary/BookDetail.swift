
import UIKit
import FirebaseDatabase
import FirebaseAuth

class BookDetail: UIViewController {
    
    @IBOutlet weak var reserveLabel: UILabel!
    @IBOutlet weak var author: UILabel!
    @IBOutlet weak var img: UIImageView!
    @IBOutlet weak var testLabel: UILabel!
    @IBOutlet weak var checkOut: UIButton!
    var test : String!
    weak var please : UIImage!
    var authorName : String!
    var genre : String!
    var userDict = [String : String]()
    override func viewDidLoad() {
        super.viewDidLoad()
        // Hide all labels be default
        reserveLabel.isHidden = true
        // Create a reference to all the users in queue for the book
        let bookRef = Database.database().reference().child(genre + "/" + test + "/" + "Users")
        bookRef.observe(DataEventType.value, with: { (snapshot) in
            let data = snapshot.value as? [String : AnyObject] ?? [:]
            
            // Clean out the local queue
            self.userDict.removeAll()
            
            // Add all users in queue in the database to the local array
            for (key,value) in data {
                self.userDict[key] = value as! String
            }
            
            // Find the status of the book in relation to the signed in user
            self.findStatus()
        })
        self.findStatus()
        self.checkOut.layer.cornerRadius = 4
        self.title = self.test
        self.testLabel.text = test
        self.img.image = please
        self.author.text = authorName
    }
    
    override func viewDidAppear(_ animated: Bool) {
        self.findStatus()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
    @IBAction func checkOutAction(_ sender: Any) {
        
        // Check out the book under the user's name in the database and give them the due date for the book
        if checkOut.titleLabel?.text == "Check Out" {
            // Only allow check outs if there are no overdue books and less than 5 books checked out
            if FirstViewController.overdueArr.count <= 0 && FirstViewController.checkedOutArr.count < 5 {
            let book = Database.database().reference().child(genre + "/" + test)
            var testDict = [String : String]()
            var someDateTime = currDate()
            someDateTime = someDateTime.addingTimeInterval(1209600)
            let someDateTimeString = dateToString(originalDate: someDateTime)
            testDict[(Auth.auth().currentUser?.email)!.replacingOccurrences(of: ".", with: "_")] = someDateTimeString
            testDict["Date"] = someDateTimeString
            testDict["User"] = Auth.auth().currentUser?.email!.replacingOccurrences(of: ".", with: "_")
            testDict["Current Date"] = someDateTimeString
            testDict["Current User"] = Auth.auth().currentUser?.email!.replacingOccurrences(of: ".", with: "_")
            book.child("Users").setValue(testDict)
            FirstViewController.checkOutDict[test] = someDateTimeString
            Database.database().reference().child("Users/" + (Auth.auth().currentUser?.email)!.replacingOccurrences(of: ".", with: "_") + "/Books").setValue(FirstViewController.checkOutDict)
            var temp = [String : String]()
            temp["Title"] = self.test
            temp["Image"] =  imgToString(img: self.img.image!)
            temp["Genre"] = self.genre
            temp["Author"] = self.authorName
            Database.database().reference().child("Users/" + (Auth.auth().currentUser?.email)!.replacingOccurrences(of: ".", with: "_") + "/Checked Out/" + self.test).setValue(temp)
            Database.database().reference().child("Users/" + (Auth.auth().currentUser?.email)!.replacingOccurrences(of: ".", with: "_") + "/Reserved/" + self.test).removeValue()

            }
                
            // Remind the user of overdue books
            else if FirstViewController.overdueArr.count > 0 {
                let alertController = UIAlertController(title: "You Have Overdue Books", message:
                    "You can't check out any new books until you return your overdue books.", preferredStyle: UIAlertControllerStyle.alert)
                alertController.addAction(UIAlertAction(title: "Dismiss", style: UIAlertActionStyle.default,handler: nil))
                
                self.present(alertController, animated: true, completion: nil)
            }
                
            // Remind the user if they have too many checked out books
            else {
                let alertController = UIAlertController(title: "You Have Too Many Books Checked Out", message:
                    "You can't check out any new books until you return some that you have checked out.", preferredStyle: UIAlertControllerStyle.alert)
                alertController.addAction(UIAlertAction(title: "Dismiss", style: UIAlertActionStyle.default,handler: nil))
                
                self.present(alertController, animated: true, completion: nil)
            }
        }
        
        // A return method that can be implemented when the database is connected to the librarian's computer
//        if checkOut.titleLabel?.text == "Return" {
//            let someDateTime = currDate()
//            let retDateTime = dateFromString(originalDate: self.userDict[(Auth.auth().currentUser?.email?.replacingOccurrences(of: ".", with: "_"))!]!)
//            let interval = someDateTime.timeIntervalSince(retDateTime)
//            var min = 999999
//            var minString = ""
//            var minName = ""
//            for (user, date) in self.userDict {
//                if(user != "Date" && user != "User"){
//                    print(date)
//                    if Int(date.replacingOccurrences(of: "-", with: ""))! < min {
//                        min = Int(date.replacingOccurrences(of: "-", with: ""))!
//                        minString = date
//                        minName = user
//                    }
//                    var compsDateTime = dateFromString(originalDate: self.userDict[user]!)
//                    compsDateTime = compsDateTime.addingTimeInterval(interval)
//                    let compsDateTimeString = dateToString(originalDate: compsDateTime)
//                    self.userDict[(Auth.auth().currentUser?.email)!.replacingOccurrences(of: ".", with: "_")] = compsDateTimeString
//                    Database.database().reference().child(genre + "/" + test + "/" + "Users/" + self.userDict["User"]!).removeValue()
//                    Database.database().reference().child("Users/" + (Auth.auth().currentUser?.email)!.replacingOccurrences(of: ".", with: "_") + "/Checked Out/" + self.test).removeValue()
//                    if min != 999999 {
//                    print(min)
//                    Database.database().reference().child(genre + "/" + test + "/" + "Users/Date").setValue(minString)
//                    Database.database().reference().child(genre + "/" + test + "/" + "Users/User").setValue(minName)
//                    }
//                    else {
//                        print("hi")
//                        self.checkOut.setTitle("Check Out", for: .normal)
//                        self.userDict = [:]
//                        Database.database().reference().child(genre + "/" + test + "/" + "Users").removeValue()
//                        Database.database().reference().child("Users/" + (Auth.auth().currentUser?.email)!.replacingOccurrences(of: ".", with: "_") + "/Checked Out/" + self.test).removeValue()
//                        self.findStatus()
//                        break
//                    }
//                    
//                }
//            }
//        }
        
        // Add user to queue in database and provide them with an estimated availability date
        if checkOut.titleLabel?.text == "Place Hold" {
            // Only allow check outs if there are no overdue books and less than 5 books checked out
            if FirstViewController.overdueArr.count <= 0 || FirstViewController.checkedOutArr.count < 5{
            var retDateTime = dateFromString(originalDate: self.userDict[self.userDict["User"]!]!)
            retDateTime = retDateTime.addingTimeInterval(1209600)
            let timeString = dateToString(originalDate : retDateTime)
            self.userDict[(Auth.auth().currentUser?.email?.replacingOccurrences(of: ".", with: "_"))!] = timeString
            self.userDict["Date"] = timeString
            self.userDict["User"] = Auth.auth().currentUser?.email?.replacingOccurrences(of: ".", with: "_")
            Database.database().reference().child(genre + "/" + test + "/" + "Users").setValue(self.userDict)
            var temp = [String : String]()
            temp["Title"] = self.test
            temp["Image"] =  imgToString(img: self.img.image!)
            temp["Genre"] = self.genre
            temp["Author"] = self.authorName
            Database.database().reference().child("Users/" + (Auth.auth().currentUser?.email)!.replacingOccurrences(of: ".", with: "_") + "/Reserved/" + self.test).setValue(temp)
            }
            // Remind the user of overdue books
            else if FirstViewController.overdueArr.count > 0 {
                let alertController = UIAlertController(title: "You Have Overdue Books", message:
                    "You can't check out any new books until you return your overdue books.", preferredStyle: UIAlertControllerStyle.alert)
                alertController.addAction(UIAlertAction(title: "Dismiss", style: UIAlertActionStyle.default,handler: nil))
                
                self.present(alertController, animated: true, completion: nil)
            }
            
            // Remind the user if they have too many checked out books
            else {
                let alertController = UIAlertController(title: "You Have Too Many Books Checked Out", message:
                    "You can't check out any new books until you return some that you have checked out.", preferredStyle: UIAlertControllerStyle.alert)
                alertController.addAction(UIAlertAction(title: "Dismiss", style: UIAlertActionStyle.default,handler: nil))
                
                self.present(alertController, animated: true, completion: nil)
            }
        }
    }

    
    // This function provides the status of any book in relation to the user
    func findStatus(){
        
        if self.userDict.count == 0 {
            self.checkOut.setTitle("Check Out", for: .normal)
            self.checkOut.isHidden = false
            self.reserveLabel.isHidden = true
        }
        
        else if self.userDict["Current User"] == Auth.auth().currentUser?.email?.replacingOccurrences(of: ".", with: "_") {
            self.checkOut.setTitle("Return", for: .normal)
            self.checkOut.isHidden = true
            self.checkOutDate()
        }
        
        else if self.userDict[(Auth.auth().currentUser?.email?.replacingOccurrences(of: ".", with: "_"))!] != nil {
            self.checkOut.setTitle("", for: .normal)
            self.checkOut.isHidden = true
            self.reserveDate()
        }
        else {
            self.checkOut.setTitle("Place Hold", for: .normal)
            self.checkOut.isHidden = false
        }
    }
    
    // Find the status of a reserved book
    func reserveDate(){
        
        if checkOut.isHidden {
            let someDateTime = currDate()
            var comeDateTime = dateFromString(originalDate: self.userDict[(Auth.auth().currentUser?.email?.replacingOccurrences(of: ".", with: "_"))!]!)
            comeDateTime = comeDateTime.addingTimeInterval(-1209600)
            var diff = Int((comeDateTime.timeIntervalSince(someDateTime)))
            diff = diff/86400
            if diff != 1 {
            reserveLabel.text = "You are in queue, est. time: \(diff) days."
            }
            if diff <= 0 {
                reserveLabel.text = "Available when checked back in."
            }
            if diff == 1 {
                reserveLabel.text = "You are in queue, est. time: \(diff) day."
            }
            reserveLabel.isHidden = false
        }
    }
    
    // Function that converts String to a Date class
    func dateFromString(originalDate : String) -> Date{
        let returnDateArr = originalDate.components(separatedBy: "-")
        var retDateComponents = DateComponents()
        retDateComponents.year = Int(returnDateArr[2])
        retDateComponents.month = Int(returnDateArr[0])
        retDateComponents.day = Int(returnDateArr[1])
        let userCalendar = Calendar.current
        let retDateTime = userCalendar.date(from: retDateComponents)
        return retDateTime!
    }
    
    // Function that converts a Date object into a String for storing in the database
    func dateToString(originalDate : Date) -> String {
        let calendarUnitFlags: Set<Calendar.Component> = [.year, .month, .day]
        let rets = Calendar.current.dateComponents(calendarUnitFlags, from: originalDate)
        return String(describing: rets.month!) + "-" + String(describing: rets.day!) + "-" + String(describing: rets.year!)
    }
    
    // Function that returns the current date from the database
    func currDate() -> Date {
        var dateComponents = DateComponents()
        dateComponents.year = Int(FirstViewController.dict["Year"]!)
        dateComponents.month = Int(FirstViewController.dict["Month"]!)
        dateComponents.day = Int(FirstViewController.dict["Day"]!)
        let userCalendar = Calendar.current
        let someDateTime = userCalendar.date(from: dateComponents)
        return someDateTime!
    }
    
    // Function that gives the status of a checked out book
    func checkOutDate(){
            let someDateTime = currDate()
            let comeDateTime = dateFromString(originalDate: self.userDict["Current Date"]!)
            var diff = Int((comeDateTime.timeIntervalSince(someDateTime)))
            diff = diff/86400
        if diff != 1 {
            reserveLabel.text = "This book is due in \(diff) days."
        }
        if diff == 0 {
            reserveLabel.text = "This book is due today."
        }
        if diff < 0 {
            reserveLabel.text = "This book is overdue!"
            }
        if diff == 1 {
            reserveLabel.text = "This book is due in \(diff) day."
        }
            reserveLabel.isHidden = false
    }
    
    // Create a share option so that users can share any book on any social network on their phone
    @IBAction func sharePressed(_ sender: Any) {
        let activityVC = UIActivityViewController(activityItems: [self.img.image, self.testLabel.text! + " by: " + self.author.text!, "\nCheck out this great book!\nOnly at the Cy Woods Library!"], applicationActivities: nil)
        activityVC.popoverPresentationController?.sourceView = self.view
        self.present(activityVC, animated: true, completion: nil)
    }
    
    // Convert UIImage to String for storage in the database
    func imgToString(img : UIImage) -> String {
        let imageData:NSData = UIImagePNGRepresentation(img)! as NSData
        let strBase64 = imageData.base64EncodedString(options: .lineLength64Characters)
        return strBase64
    }
}
