//
//  LogInVC.swift
//  Picket
//
//  Created by Yash Kakodkar on 2/21/17.
//  Copyright © 2017 Yash Kakodkar. All rights reserved.
//

import UIKit
import Firebase
import SwiftMessages
import FBSDKCoreKit
import FBSDKLoginKit
import FirebaseAuth

class LogInVC: UIViewController {
    
    // user interface elements in view
    @IBOutlet weak var container: UIView!
    @IBOutlet weak var usernameField: UITextField!
    @IBOutlet weak var passwordField: UITextField!
    @IBOutlet weak var loginButton: UIButton!
    
    //authentication
    var sepAuth = false
    
    struct Auth {
        var email = ""
        var name = ""
        var profileURL = ""
    }
    
    var auth = Auth()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        loginButton.backgroundColor = .clear
        loginButton.layer.cornerRadius = 5
        loginButton.layer.borderWidth = 1.15
        loginButton.layer.borderColor = UIColor(red: 1, green: 1, blue: 1, alpha: 0.15).cgColor
        
        //hide the keyboard when someone taps outside of it
        self.hideKeyboardWhenTappedAround()

    }
    
    
    //sign in
    @IBAction func signIn(_ sender: AnyObject) {
        
        //fetch email and password
        let email = usernameField.text!
        let password = passwordField.text!
        
        //error catching in case information isn't filled out properly
        if email == "" {
            self.showLoginError(text: "Please enter an email.")
            usernameField.attributedPlaceholder = NSAttributedString(string:"EMAIL",
                                                                     attributes:[NSForegroundColorAttributeName: UIColor(red:0.99, green:0.24, blue:0.27, alpha:1.00)])
        } else if password == "" {
            self.showLoginError(text: "Please enter a password.")
            passwordField.attributedPlaceholder = NSAttributedString(string:"PASSWORD",
                                                                     attributes:[NSForegroundColorAttributeName: UIColor(red:0.99, green:0.24, blue:0.27, alpha:1.00)])
        } else {
            
            //begin loading and authenticate with Firebase
            self.beginLoading()
            FIRAuth.auth()?.signIn(withEmail: usernameField.text!, password: passwordField.text!) { (user, error) in
                if error == nil {
                    self.endLoading(vc: self, dismissVC: false)
                    self.performSegue(withIdentifier: "toHomeVC", sender: self)
                } else {
                    self.endLoading(vc: self, dismissVC: false)
                    let errText = (error?.localizedDescription)!
                    if errText == "An internal error has occurred, print and inspect the error details for more information." {
                        self.showLoginError(text: "The form has been filled out incorrectly. Check for errors.")
                    } else {
                        if (error?.localizedDescription)!.contains("The user may have been deleted.") {
                            self.showLoginError(text: "Sorry, you've entered an invalid username or password. Please try again. ")
                        } else {
                            self.showLoginError(text: (error?.localizedDescription)!)
                        }
                    }
                }
            }
        }
    }
    
    func showLoginError(text: String) {
        let view = MessageView.viewFromNib(layout: .CardView)
        view.button?.removeFromSuperview()
        
        view.configureTheme(.error)
        view.configureDropShadow()
        view.configureContent(title: "Login Error", body: text)
        SwiftMessages.show(view: view)
        
    }
    
    //white status bar
    override var preferredStatusBarStyle: UIStatusBarStyle {
        return .lightContent
    }
    
    @IBOutlet weak var faceBookSignIn: UIButton!
    
    
    
    @IBAction func signUpWithFacebook(_ sender: AnyObject) {
        
        //use the Facebook API to gather user data such as name, email, and profile picture from the current user's account.
        let alert = UIAlertController(title: "Sign Up via Facebook", message: "Your name, email, and profile picture will automatically be gathered from your account. We will still require your phone number, username, and password.", preferredStyle: UIAlertControllerStyle.alert)
        alert.addAction(UIAlertAction(title: "Cancel", style: UIAlertActionStyle.cancel, handler: nil))
        alert.addAction(UIAlertAction(title: "Proceed", style: UIAlertActionStyle.destructive, handler: { action in
            self.sepAuth = true
            let facebookLogin = FBSDKLoginManager()
            facebookLogin.logIn(withReadPermissions: ["email"], from: self) { (facebookResult, error) in
                if error != nil {
                    self.showLoginError(text: "Facebook login failed.")
                } else if (facebookResult?.isCancelled)! {
                    self.showLoginError(text: "Facebook login cancelled.")
                } else {
                    if (facebookResult?.grantedPermissions.contains("email"))! {
                        self.gatherUserData()
                    }
                }
            }
        }))
        
        //show the alert
        self.present(alert, animated: true, completion: nil)
    }
    
    //gather user's Facebook data through the Facebook Software Development Kit (FBSDK)
    func gatherUserData(){
        if((FBSDKAccessToken.current()) != nil){
            FBSDKGraphRequest(graphPath: "me", parameters: ["fields": "email, name, picture.type(large)"]).start(completionHandler: { (connection, result, error) -> Void in
                if (error == nil){
                    let data:[String:AnyObject] = result as! [String : AnyObject]
                    self.auth.email = data["email"] as! String
                    self.auth.name = data["name"] as! String
                    self.auth.profileURL = (data["picture"]!["data"]!! as! [String : AnyObject])["url"] as! String
                    self.performSegue(withIdentifier: "toSignUp", sender: self)
                } else {
                }
            })
        } else {
        }
    }
    
    //transition to next screen after authorization
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "toSignUp" {
            if sepAuth {
                let vc = segue.destination as! NewAccountVC
                vc.otherAuthMethod = true
                vc.email = auth.email
                vc.name = auth.name
                vc.picURL = auth.profileURL
            }
        }
    }
    
}

//simple public extensions to the view controller for any view to user
public extension UIViewController {
    @IBAction public func unwindToViewController (_ segue: UIStoryboardSegue){}
    
    func hideKeyboardWhenTappedAround() {
        let tap: UITapGestureRecognizer = UITapGestureRecognizer(target: self, action: #selector(UIViewController.dismissKeyboard))
        view.addGestureRecognizer(tap)
    }
    
    func dismissKeyboard() {
        view.endEditing(true)
    }
    
    func beginLoading() {
        let alert = UIAlertController(title: "Loading...", message: nil, preferredStyle: .alert)
        alert.view.tintColor = UIColor.black
        let loadingIndicator: UIActivityIndicatorView = UIActivityIndicatorView(frame: CGRect(x: 10, y: 5, width: 50, height: 50)) as UIActivityIndicatorView
        loadingIndicator.hidesWhenStopped = true
        loadingIndicator.activityIndicatorViewStyle = .whiteLarge
        loadingIndicator.color = UIColor(red:0.20, green:0.29, blue:0.37, alpha:1.00)
        loadingIndicator.startAnimating();
        
        alert.view.addSubview(loadingIndicator)
        present(alert, animated: true, completion: nil)
    }
    
    func endLoading(vc: UIViewController, dismissVC: Bool) {
        dismiss(animated: false, completion: {
            if dismissVC {
                vc.dismiss(animated: true, completion: nil)
            }
        })
    }
}
