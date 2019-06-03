
import FirebaseAuth
import FirebaseDatabase
import ImageSlideshow
import UIKit

class FirstViewController: UIViewController {

    var data : String?
    
    @IBOutlet weak var slideshow: ImageSlideshow!
    @IBOutlet weak var browse: UIButton!
    @IBOutlet weak var featured: UIButton!
    @IBOutlet weak var overdue: UIButton!
    @IBOutlet weak var search: UIButton!
    static var dict = [String : String]()
    static var checkOutDict = [String : String]()
    static var checkedOutArr = [String : String]()
    static var overdueArr = [String : String]()
    
    
    override func viewDidLoad() {
        //
        super.viewDidLoad()
        
        // If iOS 11 is available, make the navigation bar title large
        if #available(iOS 11.0, *) {
            navigationController?.navigationBar.prefersLargeTitles = true
            navigationController?.navigationBar.largeTitleTextAttributes =
                [NSAttributedStringKey.foregroundColor : UIColor.white]
        } else {
            
        }
        
        // Set the images to cycle in the slideshow
        slideshow.setImageInputs([
            ImageSource(image: UIImage(named: "lib1")!),
            ImageSource(image: UIImage(named: "lib2")!),
            ImageSource(image: UIImage(named: "lib3")!),
            ImageSource(image: UIImage(named: "lib4")!),
            ])
        
        // Set the interval between images in the slideshow
        slideshow.slideshowInterval = 3.0
        slideshow.contentScaleMode = UIViewContentMode.scaleToFill
        
        // Create a reference to the current date in the database
        let dateRef = Database.database().reference().child("Date")
        
        // Put a listener on the database that will return back the date and return back the new date whenever it changes
        dateRef.observe(.value, with: { (snapshot) in
            let data = snapshot.value as? [String : String]
            for (key,value) in data! {
                FirstViewController.dict[key] = value
            }
            self.loadCheckedOut()
        })

    }
    

    // When the user clicks the Browse button, take them to the browse tab
    @IBAction func browsePressed(_ sender: Any) {
        self.tabBarController?.selectedIndex = 1
    }
    
    // When the user clicks the Featured button, take them to the featured tab
    @IBAction func featuredPressed(_ sender: Any) {
        self.tabBarController?.selectedIndex = 2
    }
    
    // When the user clicks the Checked Out or Reserved button, take the user to the respective page
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        let senderButton = sender as! UIButton
        if senderButton.titleLabel?.text == "Checked Out" || senderButton.titleLabel?.text == "Reserved"{
        let final = segue.destination as! UserBookList
        final.listName = senderButton.title(for: .normal)
        }
    }
    
    // Function to create a Date object from the String with date that is returned from the database
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
    
    // Function to convert a Date object into a String to store in the database
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
    
    func checkOverdue() {
        // Go through the list of checked out books and add all overdue books to a separate array
        for (name, genre) in FirstViewController.checkedOutArr {
            var temp = Date()
            let bookRef = Database.database().reference().child(genre + "/" + name + "/" + "Users")
            bookRef.observe(DataEventType.value, with: { (snapshot) in
                let data = snapshot.value as? [String : AnyObject] ?? [:]
                for (key,value) in data {
                    if key == "Current Date" {
                        temp = self.dateFromString(originalDate: value as! String)
                    }
                }
                let someDateTime = self.currDate()
                var diff = Int((temp.timeIntervalSince(someDateTime)))
                diff = diff/86400
                if diff < 0 {
                    FirstViewController.overdueArr[name] = genre
                }
                // Remind the user about overdue books
                if FirstViewController.overdueArr.count > 0 {
                    let alertController = UIAlertController(title: "You Have Overdue Books", message:
                        "The book " + name + " is overdue!\n You can't check out any new books until you return this one.", preferredStyle: UIAlertControllerStyle.alert)
                    alertController.addAction(UIAlertAction(title: "Dismiss", style: UIAlertActionStyle.default,handler: nil))
                    
                    self.present(alertController, animated: true, completion: nil)
                }
            })
        }
    }
    
    func loadCheckedOut() {
        // Fill up an array with all the books that are checked out by the signed in user
        let overdueRef = Database.database().reference().child("Users/" + (Auth.auth().currentUser?.email?.replacingOccurrences(of: ".", with: "_"))! + "/Checked Out")
        overdueRef.observe(.value, with: { (snapshot) in
            let data = snapshot.value as? [String : AnyObject] ?? [:]
            for (key,value) in data {
                FirstViewController.checkedOutArr[key] = value["Genre"] as! String
            }
            self.checkOverdue()
        })
    }

}

