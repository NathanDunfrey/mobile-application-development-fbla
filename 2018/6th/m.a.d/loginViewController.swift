//
//  ViewController.swift
//  m.a.d
//
//  Created by Devansh Yerpude on 2/11/18.
//  Copyright © 2018 Devansh Yerpude. All rights reserved.
//
// Handles Login Page, is the initial view. 
import UIKit
// Imports Authentication & Database management for Firebase
import FirebaseAuth
import FirebaseDatabase
import PopupDialog


class loginViewController: UIViewController {
    //basic function to load view
 
    override func viewDidLoad() {
        super.viewDidLoad() }
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()    }
    //sets up local variables
    @IBOutlet var email: UITextField!
    @IBOutlet var password: UITextField!
    var title1 = ""
    var description1 = ""
    var image = #imageLiteral(resourceName: "sorry")
    
    
    
    //login if authenticated from firebase, otherwise displays error message NIL ENTRY PREVENTION included
    @IBAction func login(_ sender: UIButton) {
        if(email.text != "" && password.text != ""){
             print(email.text, password.text)
            Auth.auth().signIn(withEmail: email.text!, password: password.text!) { (user, error) in
                if user != nil {
                    self.performSegue(withIdentifier: "loginSeg", sender: self)
                }
                
                else{
                    self.title1 = "Error"
                    self.description1 = "You have entered the wrong username or password. Please try again. If you've forgotten your password, please send an email to us at: iLibrary@nhs.org"
                    self.image = #imageLiteral(resourceName: "sorry")
                    self.showImageDialog(animated: true)
                    
                }
                
            }
            
        }
        
    }
    //creates account on firebase, and allows user to login with that same created account
    
    @IBAction func createAcc(_ sender: UIButton) {
        if(email.text != "" && password.text != ""){
            
            Auth.auth().createUser(withEmail: email.text!, password: password.text!) { (user, error) in
                
                if user != nil {
                    
                    self.title1 = "Success"
                    self.description1 = "You have succesfully created an account! Please login to to continue"
                    self.image = #imageLiteral(resourceName: "SUCCESS-1")
                    self.showImageDialog(animated: true)
                    
                }
            }
           
        }
        
    }
    
    //setup popup function 
    func showImageDialog(animated: Bool = true) {
        
        // Prepare the popup assets
        let title = self.title1
        let message = self.description1
        let image = self.image
        
        // Create the dialog
        let popup = PopupDialog(title: title, message: message, image: image, preferredWidth: 580)
        
        // Create first button
        let buttonOne = DefaultButton(title: "OK") { [weak self] in
            
        }
        
        
        // Add buttons to dialog
        popup.addButtons([buttonOne])
        
        // Present dialog
        self.present(popup, animated: animated, completion: nil)
    }
    

override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
    self.view.endEditing(true)
    
}

func texty(_ email:UITextField, _ password:UITextField) -> Bool {
    email.resignFirstResponder()
    password.resignFirstResponder()
    return(true)
}
    
}



