//
//  NewAccountVC.swift
//  Picket
//
//  Created by Yash Kakodkar on 2/22/17.
//  Copyright © 2017 Yash Kakodkar. All rights reserved.
//

import UIKit
import Firebase
import FirebaseDatabase
import FirebaseStorage
import SwiftMessages
import FirebaseAuth

class NewAccountVC: UIViewController, UIImagePickerControllerDelegate, UINavigationControllerDelegate {
    
    //outlets
    @IBOutlet weak var imageView: CustomImageView!
    @IBOutlet weak var pictureButton: UIButton!
    @IBOutlet weak var emailLabel: UITextField!
    @IBOutlet weak var phoneLabel: UITextField!
    @IBOutlet weak var passwordLabel: UITextField!
    @IBOutlet weak var reenterPasswordLabel: UITextField!
    @IBOutlet weak var nameLabel: UITextField!
    @IBOutlet weak var signupButton: UIButton!

    
    var ref: FIRDatabaseReference!
    var otherAuthMethod = false
    var name = ""
    var email = ""
    var picURL = ""
    var chapter = "false"
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        //signupbutton UI
        signupButton.backgroundColor = .clear
        signupButton.layer.cornerRadius = 5
        signupButton.layer.borderWidth = 1.15
        signupButton.layer.borderColor = UIColor(red: 1, green: 1, blue: 1, alpha: 0.15).cgColor
        
        
        //load input data from third party authentication (like Facebook)
        if otherAuthMethod == true {
            nameLabel.text = name
            emailLabel.text = email
            imageView.loadImageUsingUrlString(urlString: picURL)
        }
        
        self.hideKeyboardWhenTappedAround()
        
        //reference to Firebase database
        ref = FIRDatabase.database().reference()
    }
    
    
    //check if chapter or not
    @IBAction func isChapterSwitch(_ sender: UISwitch) {
    
        if sender.isOn {
            chapter = "true"
        } else {
            chapter = "false"
        }
    
    }

    //create a new account
    @IBAction func makeNewAccount(_ sender: AnyObject) {
        
        //fetch user input
        let email = emailLabel.text!
        let password = passwordLabel.text!
        let phone = phoneLabel.text!
        let name = nameLabel.text!
        let reenterPassword = reenterPasswordLabel.text!
        let isChapter = chapter
        
        // if a field is not filled out, alert the user through the UI
        if name == "" {
            self.showSignupError(text: "Please enter a name.", headerText: "Sign Up Error")
            nameLabel.attributedPlaceholder = NSAttributedString(string:"Full Name",
                                                                 attributes:[NSForegroundColorAttributeName: UIColor(red:0.99, green:0.24, blue:0.27, alpha:1.00)])
        } else if email == "" {
            self.showSignupError(text: "Please enter an email.", headerText: "Sign Up Error")
            emailLabel.attributedPlaceholder = NSAttributedString(string:"Email",
                                                                  attributes:[NSForegroundColorAttributeName: UIColor(red:0.99, green:0.24, blue:0.27, alpha:1.00)])
        } else if phone == "" {
            self.showSignupError(text: "Please enter a phone number.", headerText: "Sign Up Error")
            phoneLabel.attributedPlaceholder = NSAttributedString(string:"Phone Number",
                                                                  attributes:[NSForegroundColorAttributeName: UIColor(red:0.99, green:0.24, blue:0.27, alpha:1.00)])
        } else if password == "" {
            self.showSignupError(text: "Please enter a password.", headerText: "Sign Up Error")
            passwordLabel.attributedPlaceholder = NSAttributedString(string:"Password",
                                                                     attributes:[NSForegroundColorAttributeName: UIColor(red:0.99, green:0.24, blue:0.27, alpha:1.00)])
        } else if password != reenterPassword {
            self.showSignupError(text: "Entered passwords do not match.", headerText: "Password Mismatch")
        } else if imageView.image == nil{
            imageView.image = #imageLiteral(resourceName: "default_profile")
        } else {
            
            //begin loading and create a new account with provided credentials. Alert the user if there are any errors in this process (i.e. password is too short)
            self.beginLoading()
            FIRAuth.auth()?.createUser(withEmail: email, password: password) { (user, error) in
                if error == nil {
                    let imageName = NSUUID().uuidString
                    let storageRef = FIRStorage.storage().reference().child("Profiles").child("\(imageName).jpg")
                    //TODO: Check if avatar is nil
                    if let uploadData = UIImageJPEGRepresentation(self.imageView.image!, 0.5) {
                        storageRef.put(uploadData, metadata: nil, completion: { (metadata, error) in
                            if error == nil {
                                if let profileImageUrl = metadata?.downloadURL()?.absoluteString {
                                    self.ref.child("users").child((user?.uid)!).setValue(["name": name, "email": email, "phone": phone, "image": profileImageUrl, "isChapter": isChapter])
                                    self.endLoading(vc: self, dismissVC: true)
                                    let view = MessageView.viewFromNib(layout: .StatusLine)
                                    view.button?.removeFromSuperview()
                                    view.configureTheme(Theme.success)
                                    var config = SwiftMessages.Config()
                                    config.presentationContext = .window(windowLevel: UIWindowLevelStatusBar)
                                    view.configureContent(title: "Success!", body: "Successfully signed up!")
                                    view.configureTheme(backgroundColor: UIColor(red:0.00, green:0.69, blue:0.42, alpha:1.00), foregroundColor: UIColor.white)
                                    SwiftMessages.show(config: config, view: view)
                                }
                            }
                        })
                    }
                } else {
                    self.endLoading(vc: self, dismissVC: false)
                    let errText = (error?.localizedDescription)!
                    if errText == "An internal error has occurred, print and inspect the error details for more information." {
                        self.showSignupError(text:"Check for errors in your entries.", headerText: "Form has been filled out incorrectly.")
                    } else {
                        self.showSignupError(text: (error?.localizedDescription)!, headerText: "Signup Error")
                    }
                    self.beginLoading()
                }
            }
        }
    }
    
    func showSignupError(text: String, headerText: String) {
        let view = MessageView.viewFromNib(layout: .CardView)
        view.button?.removeFromSuperview()
        view.configureTheme(.error)
        view.configureDropShadow()
        view.configureContent(title: headerText, body: text)
        SwiftMessages.show(view: view)
        
    }
    
    // white status bar
    override var preferredStatusBarStyle: UIStatusBarStyle {
        return .lightContent
    }
    
    // enable the user to take a profile picture through their camera or select one from their camera roll
    @IBAction func takePicture(_ sender: AnyObject) {
        let imagePicker = UIImagePickerController()
        imagePicker.delegate = self
        imagePicker.allowsEditing = true
        let alert = UIAlertController(title: nil, message: nil, preferredStyle: .actionSheet)
        alert.addAction(UIAlertAction(title: "Camera", style: .default, handler: {
            action in
            imagePicker.sourceType = .camera
            self.present(imagePicker, animated: true, completion: nil)
        }))
        alert.addAction(UIAlertAction(title: "Photo Library", style: .default, handler: {
            action in
            imagePicker.sourceType = .photoLibrary
            self.present(imagePicker, animated: true, completion: nil)
        }))
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel, handler: nil))
        alert.popoverPresentationController?.sourceView = sender as? UIView
        alert.popoverPresentationController?.sourceRect = sender.bounds
        self.present(alert, animated: true, completion: nil)
    }
    
    // send selected picture to this view controller
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [String : Any]) {
        if let pickedImage = info[UIImagePickerControllerEditedImage] as? UIImage {
            imageView.contentMode = .scaleAspectFit
            imageView.image = pickedImage
        }
        
        dismiss(animated: true, completion: nil)
    }
    
    func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
        dismiss(animated: true, completion: nil)
    }
    
    /*
     // MARK: - Navigation
     
     // In a storyboard-based application, you will often want to do a little preparation before navigation
     override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
     // Get the new view controller using segue.destinationViewController.
     // Pass the selected object to the new view controller.
     }
     */
    
}
