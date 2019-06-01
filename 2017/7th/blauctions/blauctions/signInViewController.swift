//
//  signInViewController.swift
//  BLAuctions
//
// this class handles the sign in form
//
//  Created by Drew Patel on 2/20/17.
//  Copyright © 2017 DrafeSu. All rights reserved.
//

import UIKit
//sky floating is a custom textbox that is very nice looking
import SkyFloatingLabelTextField
import FirebaseAuth
class signInViewController: UIViewController {

    //create reference for two boxes for signing in
    @IBOutlet var usernameBox: SkyFloatingLabelTextField!
    @IBOutlet var passwordBox: SkyFloatingLabelTextField!
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
//this function takes all the information in the boxes and sends to firebase auth to see if it's the correct login info, then handles that
    //We used our own login form over facebook because our whole system is built around Firebase and IOS messaging over the facebook environement which allows us and the user to have both more control, privacy, and not have our service undermined with ads from Facebook's ad partners.
    @IBAction func signInFunction(_ sender: Any) {
        print(usernameBox.text!)
        print(passwordBox.text!)
        FIRAuth.auth()?.signIn(withEmail: usernameBox.text!, password: passwordBox.text!) { (user, error) in
            if FIRAuth.auth()?.currentUser != nil {
                print("Signed in")
                //close the login view because sign in success
                self.dismiss(animated: true, completion: nil)
                
            } else {
                //sign in failed, don't do anything and allow user to retry
                print("Invalid login")
            }
        }
    }

    
}
