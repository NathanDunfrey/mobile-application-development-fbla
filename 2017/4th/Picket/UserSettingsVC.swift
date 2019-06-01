//
//  UserSettingsVC.swift
//  Picket
//
//  Created by Yash Kakodkar on 2/23/17.
//  Copyright © 2017 Yash Kakodkar. All rights reserved.
//

import UIKit
import Firebase
import FirebaseDatabase
import FirebaseStorage
import SwiftMessages
import FirebaseAuth

class UserSettingsVC: UIViewController, UIImagePickerControllerDelegate, UINavigationControllerDelegate {
    
    //outlets
    @IBOutlet weak var imageView: CustomImageView!
    @IBOutlet weak var nameLabel: UITextField!
    @IBOutlet weak var emailLabel: UITextField!
    @IBOutlet weak var phoneNumberLabel: UITextField!
    @IBOutlet weak var newPasswordLabel: UITextField!
    @IBOutlet weak var retypeNewPasswordLabel: UITextField!
    @IBOutlet weak var viewBackground: UIView!
    
    var ref: FIRDatabaseReference!
    var userID = ""
    var user: User?
    var imageChanged = false
    var isChapter = ""
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        //background shadow
        viewBackground.layer.shadowColor = UIColor.black.cgColor
        viewBackground.layer.shadowOffset = CGSize(width: 0, height: 2)
        viewBackground.layer.shadowOpacity = 0.2
        viewBackground.layer.shadowRadius = 2
        
        // hide keyboard when the user taps away from it
        self.hideKeyboardWhenTappedAround()
        
        //current user's id
        userID = (FIRAuth.auth()?.currentUser?.uid)!
        
        //create a reference to Firebase
        ref = FIRDatabase.database().reference()
        
        //go through user information and show it on the screen
        ref.child("users").child(userID).observeSingleEvent(of: .value, with: { (snapshot) in
            if let userDict = snapshot.value as? [String : AnyObject] {
                let name = userDict["name"] as! String
                self.nameLabel.text = name
                let email = userDict["email"] as! String
                self.emailLabel.text = email
                let phone = userDict["phone"] as! String
                self.phoneNumberLabel.text = phone
                let profileURL = userDict["image"] as! String
                self.imageView.loadImageUsingUrlString(urlString: profileURL)
                self.user = User(name: name, phone: phone, email: email, pictureURL: profileURL, id: self.userID, isChapter: self.isChapter)
            }
            
        })
    }
    
    //white status bar
    override var preferredStatusBarStyle: UIStatusBarStyle {
        return .lightContent
    }
    
    //enable the user to take a profile picture through their camera or select one from their camera roll
    @IBAction func changeProfilePicture(_ sender: Any) {
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
        alert.popoverPresentationController?.sourceRect = (sender as AnyObject).bounds
        self.present(alert, animated: true, completion: nil)
    }
    
    //send selected picture to this view controller
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [String : Any]) {
        if let pickedImage = info[UIImagePickerControllerEditedImage] as? UIImage {
            imageChanged = true
            imageView.contentMode = .scaleAspectFit
            imageView.image = pickedImage
        }
        
        dismiss(animated: true, completion: nil)
    }
    
    func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
        dismiss(animated: true, completion: nil)
    }
    
    //save new user information
    @IBAction func saveInformation(_ sender: Any) {
        
        // if information is not valid, display errors
        if newPasswordLabel.text?.replacingOccurrences(of: " ", with: "") != "" {
            if newPasswordLabel.text == retypeNewPasswordLabel.text {
                FIRAuth.auth()?.currentUser?.updatePassword(newPasswordLabel.text!) { (error) in
                    if error == nil {
                        self.showChangeInfoSuccess(text: "Password changed successfully.", headerText: "Success")
                    } else {
                        self.showChangeInfoError(text: (error?.localizedDescription)!, headerText: "Password Error")
                    }
                }
            } else {
                self.showChangeInfoError(text: "Entered passwords do not match.", headerText: "Password Mismatch")
            }
        }
        if user?.email != emailLabel.text {
            FIRAuth.auth()?.currentUser?.updateEmail(emailLabel.text!) { (error) in
                if error == nil {
                    self.showChangeInfoSuccess(text: "Email changed successfully.", headerText: "Success")
                } else {
                    self.showChangeInfoError(text: (error?.localizedDescription)!, headerText: "Email Error")
                }
            }
            
        }
        
        //save new data to Firebase
        let emailRef = ref.child("users").child(userID).child("email")
        let nameRef = ref.child("users").child(userID).child("name")
        let phoneRef = ref.child("users").child(userID).child("phone")
        let picRef = ref.child("users").child(userID).child("image")
        emailRef.setValue(emailLabel.text!)
        nameRef.setValue(nameLabel.text!)
        phoneRef.setValue(phoneNumberLabel.text!)
        if imageChanged {
            let imageName = NSUUID().uuidString
            let storageRef = FIRStorage.storage().reference().child("Profiles").child("\(imageName).jpg")
            //TODO: Check if avatar is nil
            if let uploadData = UIImageJPEGRepresentation(self.imageView.image!, 0.5) {
                storageRef.put(uploadData, metadata: nil, completion: { (metadata, error) in
                    if error == nil {
                        if let profileImageUrl = metadata?.downloadURL()?.absoluteString {
                            picRef.setValue(profileImageUrl)
                        }
                    }
                })
            }
        }
        self.showChangeInfoSuccess(text: "User information changed successfully.", headerText: "Success")
    }
    
    
    func showChangeInfoError(text: String, headerText: String) {
        let view = MessageView.viewFromNib(layout: .CardView)
        view.button?.removeFromSuperview()
        view.configureTheme(.error)
        view.configureDropShadow()
        view.configureContent(title: headerText, body: text)
        SwiftMessages.show(view: view)
        
    }
    
    func showChangeInfoSuccess(text: String, headerText: String) {
        let view = MessageView.viewFromNib(layout: .CardView)
        view.button?.removeFromSuperview()
        view.configureTheme(.success)
        view.configureDropShadow()
        view.configureContent(title: headerText, body: text)
        SwiftMessages.show(view: view)
        
    }
    
    // sign out of the user's account
    @IBAction func signOut(_ sender: Any) {
        try! FIRAuth.auth()!.signOut()
        performSegue(withIdentifier: "toMain", sender: self)
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
