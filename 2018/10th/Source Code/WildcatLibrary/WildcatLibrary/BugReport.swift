// This class

import UIKit
import Foundation
import FirebaseAuth
import FirebaseDatabase

class BugReport: UIViewController {

    @IBOutlet weak var subjectField: UITextField!
    @IBOutlet weak var bodyField: UITextView!
    @IBOutlet weak var submit: UIButton!
    var reportArr = [String : String]()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Set title on navigation bar
        self.title = "Report A Bug"
        
        // Make buttons have curved edges
        submit.layer.cornerRadius = 4
        
        // if ios 11 is available, make the title large
        if #available(iOS 11.0, *) {
            navigationController?.navigationBar.prefersLargeTitles = true
            navigationController?.navigationBar.largeTitleTextAttributes =
                [NSAttributedStringKey.foregroundColor : UIColor.white]
        } else {
            
        }
        
        //
        self.title = "Report A Bug"
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }

    // Send the bug report to the developer through the database
    @IBAction func submitAction(_ sender: Any) {
        let reportRef = Database.database().reference().child("Users/" + (Auth.auth().currentUser?.email?.replacingOccurrences(of: ".", with: "_"))! + "/Bug Reports")
        reportRef.observe(.value, with: { (snapshot) in
            let data = snapshot.value as? [String : AnyObject] ?? [:]
            for (key,value) in data {
                self.reportArr[key] = value as! String
            }
            if self.subjectField.text != "" && self.bodyField.text != "" {
            self.reportArr[self.subjectField.text!] = self.bodyField.text
            reportRef.setValue(self.reportArr)
            self.subjectField.text = ""
            self.bodyField.text = ""
            let alert = UIAlertController(title: "Thank You", message: "Your report has been submitted. We will fix the issue as soon as possible.", preferredStyle: UIAlertControllerStyle.alert)
            alert.addAction(UIAlertAction(title: "Dismiss", style: UIAlertActionStyle.default, handler: nil))
            self.present(alert, animated: true, completion: nil)
            }
            
            else {
                let alert = UIAlertController(title: "Error", message: "Please fill all the fields.", preferredStyle: UIAlertControllerStyle.alert)
                alert.addAction(UIAlertAction(title: "Dismiss", style: UIAlertActionStyle.default, handler: nil))
                self.present(alert, animated: true, completion: nil)
            }
        })
    }
    
    // Close the keyboard if the user clicks out
    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
        self.view.endEditing(true)
    }
    
    
}
