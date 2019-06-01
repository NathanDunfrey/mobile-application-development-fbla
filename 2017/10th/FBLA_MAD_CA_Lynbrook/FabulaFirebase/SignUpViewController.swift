//
//  SignUpViewController.swift
//  Fabula
//
//  Created by Raghav Sreeram on 1/10/17.
//  Copyright © 2017 Raghav Sreeram. All rights reserved.
//

import UIKit
import Firebase
import FirebaseAuth

//Allows user to make a new account and sign in
class SignUpViewController: UIViewController {
    
    var nameField: UITextField!
    var emailField: UITextField!
    var userName: UITextField!
    var passwordField: UITextField!
    var signupButt: UIButton!
    var setPFButt: UIButton!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        //Sets Navigation back to empty string so it shows custom Image only
        self.navigationItem.backBarButtonItem = UIBarButtonItem(title: "", style: UIBarButtonItemStyle.plain, target: nil, action: nil)
        
        //Tap recognizer to dismiss keyboard when user taps on background
        let tap: UITapGestureRecognizer = UITapGestureRecognizer(target: self, action: "dismissKeyboard")
        view.addGestureRecognizer(tap)
        
        nameField = UITextField()
        nameField.frame = CGRect(x: 0, y: 80, width: screenW, height: 60)
        nameField.backgroundColor = fabWhiteColor
        nameField.setPlaceHolder(x: "Name")
        self.view.addSubview(nameField)
        
        emailField = UITextField()
        emailField.frame = CGRect(x: 0, y: 150, width: screenW, height: 60)
        emailField.backgroundColor = fabWhiteColor
        emailField.autocapitalizationType = UITextAutocapitalizationType.none
        emailField.setPlaceHolder(x: "Email")
        self.view.addSubview(emailField)
        
        userName = UITextField()
        userName.frame = CGRect(x: 0, y: 220, width: screenW, height: 60)
        userName.backgroundColor = fabWhiteColor
        userName.autocapitalizationType = UITextAutocapitalizationType.none
        userName.setPlaceHolder(x: "Username")
        self.view.addSubview(userName)
        
        
        passwordField = UITextField()
        passwordField.frame = CGRect(x: 0, y: 290, width: screenW, height: 60)
        passwordField.backgroundColor = fabWhiteColor
        passwordField.isSecureTextEntry = true
        passwordField.setPlaceHolder(x: "Password")
        self.view.addSubview(passwordField)
        
        signupButt = UIButton()
        signupButt.frame = CGRect(x: 0, y: screenH - 65, width: screenW, height: 65)
        signupButt.setTitle("Sign Up", for: UIControlState.normal)
        signupButt.backgroundColor = fabRedColor
        signupButt.setTitleColor(UIColor.white, for: .normal)
        signupButt.addTarget(self, action: #selector(signupTapped), for: UIControlEvents.touchDown)
        self.view.addSubview(signupButt)
        
    }
    
    /// dismisses keyboard when user taps on background
    func dismissKeyboard() {
        view.endEditing(true)
    }
    
    /// Called when sign up button is pressed
    func signupTapped(_ sender: AnyObject) {
        guard let email = emailField.text, let password = passwordField.text else { return }
        
        //If any fields are empty, shows alert
        if(emailField.text == "" || passwordField.text == "" || userName.text == "" || nameField.text == ""){
            
            let alert = UIAlertController(title: "Missing information", message: "Please fill out all fields!", preferredStyle: UIAlertControllerStyle.alert)
            alert.addAction(UIAlertAction(title: "OK", style: UIAlertActionStyle.default, handler: nil))
            self.present(alert, animated: true, completion: nil)
            
            return
        }
        
        //Creates new firebase user with inputted credentials
        FIRAuth.auth()?.createUser(withEmail: email, password: password) { (user, error) in
            
            if let error = error {
                print(error.localizedDescription)
                return
            }
            
            //Automatic url for anon profile pic place holder
            var url: String = "https://firebasestorage.googleapis.com/v0/b/fabulajan10.appspot.com/o/anonPlaceHolder.png?alt=media&token=a69cdbff-badd-47b2-b4f9-19ea8ec6f239"
            
            var ref = FIRDatabase.database().reference()
            ref.child("users").child("\(FIRAuth.auth()!.currentUser!.uid)").setValue(["name": self.nameField.text! , "email" : self.emailField.text!, "userPhoto": url])
            
            //Signs in user automatically
            FIRAuth.auth()?.signIn(withEmail: self.emailField.text!, password: self.passwordField.text!) { (user, error) in
                if(error != nil){
                    print(error)
                }else{
                    //If succesful, calls login in AppDelegate and takes user to home screen
                    let appDelegate : AppDelegate = UIApplication.shared.delegate as! AppDelegate
                    appDelegate.login()
                    
                }
            }
            
        }
    }
    
    
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    
}

//Small extension for textFields to positon placeholder text 
extension UITextField{
    func setPlaceHolder(x: String!){
        self.placeholder = "  \(x!)"
    }
}
