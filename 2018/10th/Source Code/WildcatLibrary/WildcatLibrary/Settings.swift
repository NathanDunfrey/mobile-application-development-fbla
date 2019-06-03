// This is the class that processes sign outs


import UIKit
import FirebaseAuth

class Settings: UIViewController {

    @IBOutlet weak var logOut: UIButton!
    @IBOutlet weak var bug: UIButton!
    
    // The function called when a user tries to sign out
    @IBAction func buttonOut(_ sender: Any) {
        
        do{
            // Try to sign out when the user clicks the button
            try Auth.auth().signOut()
            FirstViewController.overdueArr.removeAll()
            FirstViewController.checkedOutArr.removeAll()
        }
        catch{
            // Debug message if the user is unable to sign out
            print("Error while signing out.")
        }
    }
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Make button have curved edges
        logOut.layer.cornerRadius = 5
        bug.layer.cornerRadius = 5
        
        // If ios 11 is available, use the large title
        if #available(iOS 11.0, *) {
            navigationController?.navigationBar.prefersLargeTitles = true
            navigationController?.navigationBar.largeTitleTextAttributes =
                [NSAttributedStringKey.foregroundColor : UIColor.white]
        } else {
            
        }
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        
    }

}
