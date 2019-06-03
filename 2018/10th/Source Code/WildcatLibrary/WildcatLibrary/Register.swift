// This class is to process new users who are registering


import FirebaseAuth
import UIKit
import FirebaseDatabase

class Register: UIViewController {

    @IBOutlet var registerButton: UIView!
    @IBOutlet weak var email: UITextField!
    @IBOutlet weak var id: UITextField!
    @IBOutlet weak var firstName: UITextField!
    @IBOutlet weak var lastName: UITextField!
    @IBOutlet weak var password: UITextField!
    @IBOutlet weak var passwordRetype: UITextField!
    @IBOutlet weak var role: UISegmentedControl!
    var ref: DatabaseReference!

    override func viewDidLoad() {
        super.viewDidLoad()
        // set title on navigation bar to Register
        self.title = "Register"
        
        // Make button curved
        registerButton.layer.cornerRadius = 4
        
        // Create a reference to the database
        ref = Database.database().reference()
    }
    
    @IBAction func authenticate(_ sender: Any) {
        // If the the passwords don't match, alert the user
        if password.text != passwordRetype.text{
            let alert = UIAlertController(title: "Error", message: "The passwords do not match.", preferredStyle: UIAlertControllerStyle.alert)
            alert.addAction(UIAlertAction(title: "Dismiss", style: UIAlertActionStyle.default, handler: nil))
            self.present(alert, animated: true, completion: nil)
        }
        
        // If the id is improper, alert the user
        if Int(id.text!) == nil || id.text?.count != 6
        {
            let alert = UIAlertController(title: "Error", message: "The ID must be a six digit number.", preferredStyle: UIAlertControllerStyle.alert)
            alert.addAction(UIAlertAction(title: "Dismiss", style: UIAlertActionStyle.default, handler: nil))
            self.present(alert, animated: true, completion: nil)
        }
            
        // When all the local conditions are satisfied, try to create a new user with Firebase Authentication
        else {
            Auth.auth().createUser(withEmail: email.text!, password: password.text!, completion: { (User, Error) in
                
                // If there is no errors, sign the user in
                if Error == nil{
                    // Create the user in the database and add all of their details
                    self.ref = self.ref.child("Users")
                    self.ref.child(self.email.text!.replacingOccurrences(of: ".", with: "_")).setValue(["Role" : self.role.titleForSegment(at: self.role.selectedSegmentIndex), "Email" : self.email.text!, "School ID" : self.id.text!, "First Name" : self.firstName.text!, "Last Name" : self.lastName.text!])
                    
                    // Navigate them into the app
                    let storyBoard: UIStoryboard = UIStoryboard(name: "Main", bundle: nil)
                    let newViewController = storyBoard.instantiateViewController(withIdentifier: "TabBarController") as! UITabBarController
                    self.present(newViewController, animated: true, completion: nil)
                }
                    
                // If there are errors, alert the user
                else {
                    let alert = UIAlertController(title: "Error", message: Error?.localizedDescription, preferredStyle: UIAlertControllerStyle.alert)
                    alert.addAction(UIAlertAction(title: "Dismiss", style: UIAlertActionStyle.default, handler: nil))
                    self.present(alert, animated: true, completion: nil)
                }
                
            })
            
        }
    }
    
    // Close the keyboard if the user clicks out
    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
        self.view.endEditing(true)
    }

}
