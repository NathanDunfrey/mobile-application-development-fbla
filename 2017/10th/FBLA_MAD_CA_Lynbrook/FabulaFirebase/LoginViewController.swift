//
//  LoginViewController.swift
//  Fabula
//
//  Created by Raghav Sreeram on 1/10/17.
//  Copyright © 2017 Raghav Sreeram. All rights reserved.
//

import UIKit
import Firebase
import FirebaseAuth

//Logs in User
class LoginViewController: UIViewController, UITextFieldDelegate {
    
    var emailField: UITextField!
    var passwordField: UITextField!
    var loginButt: UIButton!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        //Sets Navigation back to empty string so it shows custom Image only
        self.navigationItem.backBarButtonItem = UIBarButtonItem(title: "", style: UIBarButtonItemStyle.plain, target: nil, action: nil)
        
        //Tap recognizer to dismiss keyboard when user taps on background
        let tap: UITapGestureRecognizer = UITapGestureRecognizer(target: self, action: "dismissKeyboard")
        view.addGestureRecognizer(tap)
        
        
        emailField = UITextField()
        emailField.frame = CGRect(x: 0, y: 80, width: screenW, height: 60)
        emailField.autocapitalizationType = UITextAutocapitalizationType.none
        emailField.backgroundColor = UIColor.init(red: 237/255.0, green: 237/255.0, blue: 237/255.0, alpha: 1.0)
        emailField.setPlaceHolder(x: "Email")
        self.view.addSubview(emailField)
        
        passwordField = UITextField()
        passwordField.frame = CGRect(x: 0, y: 150, width: screenW, height: 60)
        passwordField.backgroundColor = UIColor.init(red: 237/255.0, green: 237/255.0, blue: 237/255.0, alpha: 1.0)
        passwordField.setPlaceHolder(x: "Password")
        passwordField.isSecureTextEntry = true
        self.view.addSubview(passwordField)
        
        loginButt = UIButton()
        loginButt.frame = CGRect(x: 0, y: screenH - 65, width: screenW, height: 65)
        loginButt.setTitle("Login", for: UIControlState.normal)
        loginButt.backgroundColor = UIColor.init(red: 237/255.0, green: 237/255.0, blue: 237/255.0, alpha: 1.0)
        loginButt.addTarget(self, action: #selector(loginTapped), for: UIControlEvents.touchDown)
        loginButt.setTitleColor(UIColor.red, for: .normal)
        self.view.addSubview(loginButt)
        
    }
    
    
    /// Dismisses Keyboard
    func dismissKeyboard() {
        view.endEditing(true)
    }
    
    
    /// Called when Login button is tapped
    func loginTapped(){
        
        //If email or password or empty, Show an alert
        if(emailField.text == "" || passwordField.text == ""){
            
            let alert = UIAlertController(title: "Missing information", message: "Please fill out all fields!", preferredStyle: UIAlertControllerStyle.alert)
            alert.addAction(UIAlertAction(title: "OK", style: UIAlertActionStyle.default, handler: nil))
            self.present(alert, animated: true, completion: nil)
            
            return
        }
        
        
        //If fields are filled, Attempts login with Firebase
        FIRAuth.auth()?.signIn(withEmail: self.emailField.text!, password: self.passwordField.text!) { (user, error) in
            if(error != nil){
                
                //If credentials are Invalid, Shows alert
                let alert = UIAlertController(title: "Invalid Login In", message: "Please check fields and try again!", preferredStyle: UIAlertControllerStyle.alert)
                alert.addAction(UIAlertAction(title: "OK", style: UIAlertActionStyle.default, handler: nil))
                self.present(alert, animated: true, completion: nil)
                
                
            }else{
                //Login is succesful, calls login() which takes user to home screen
                let appDelegate : AppDelegate = UIApplication.shared.delegate as! AppDelegate
                appDelegate.login()
                
            }
        }
        
    }
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
}
