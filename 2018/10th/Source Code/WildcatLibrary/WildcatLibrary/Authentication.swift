
import UIKit
import FirebaseAuth


class Authentication: UIViewController {
    @IBOutlet weak var email: UITextField!
    @IBOutlet weak var password: UITextField!
    @IBOutlet weak var loginButton: UIButton!
    @IBOutlet weak var registerButton: UIButton!

    override func viewDidLoad() {
        super.viewDidLoad()
        // Make buttons on the screen have curved edges
        loginButton.layer.cornerRadius = 4
        registerButton.layer.cornerRadius = 4
        
        // Change the color of the navigation bar
        self.navigationController?.navigationBar.barTintColor = UIColor.init(red: 0.8, green: 0, blue: 0, alpha: 1)
    }
    
    // Authenticate the user's credentials with Firebase Authentication
    @IBAction func authenticateUser(_ sender: Any){
        Auth.auth().signIn(withEmail: email.text!, password: password.text!) { (user, error) in
            
            // If there is no error, sign the user into the app
            if error == nil{
                let newViewController = self.storyboard?.instantiateViewController(withIdentifier: "TabBarController") as! TabBarController
                
                self.present(newViewController, animated: true, completion: nil)
                
            }
            
            // If the authentication system returns an error, display it to the user in an alert
            else{
                let alert = UIAlertController(title: "Incorrect Username or Password", message: error?.localizedDescription, preferredStyle: UIAlertControllerStyle.alert)
                alert.addAction(UIAlertAction(title: "Dismiss", style: UIAlertActionStyle.default, handler: nil))
                self.present(alert, animated: true, completion: nil)
            }
        }
    }
    
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
    override func viewDidAppear(_ animated: Bool) {
        
    }
    
    // Get a notification if there is a change in who is signed in
    override func viewWillAppear(_ animated: Bool) {
        Auth.auth().addStateDidChangeListener{ (auth, user) in
            
        }
        
    }
    
    // Close the keyboard when the user touches outside of the keyboard
    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
        self.view.endEditing(true)
    }
    

}
