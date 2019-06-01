//
//  NewPostViewController.swift
//  FabulaFirebase
//
//  Created by Raghav Sreeram on 1/14/17.
//  Copyright © 2017 Raghav Sreeram. All rights reserved.
//

import UIKit
import Firebase

//Allows user to post new products to sell
class NewPostViewController: UIViewController, UIImagePickerControllerDelegate,
UINavigationControllerDelegate, UIPickerViewDelegate, UIPickerViewDataSource {
    
    @IBOutlet weak var placeHolderImageText: UILabel!
    @IBOutlet weak var productNameT: UITextField!
    @IBOutlet weak var descriptionT: UITextView!
    @IBOutlet weak var priceT: UITextField!
    @IBOutlet weak var conditionT: UITextField!
    
    @IBOutlet weak var pickerFund: UIPickerView!
    @IBOutlet weak var imageView: CustomImageView!
    
    var activityIndicator: UIActivityIndicatorView = UIActivityIndicatorView()
    
    //Stores current Fundraisers
    var fundraisers: [String] = []
    var selectedFund = "Lynbrook FBLA NLC"
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        //Sets up activity Indicator
        activityIndicator.center = self.view.center
        activityIndicator.hidesWhenStopped = true
        activityIndicator.activityIndicatorViewStyle = .gray
        self.view.addSubview(activityIndicator)
        
        //Sets up tap gesture recognizer to dismiss keyboard when user taps on background
        let tap: UITapGestureRecognizer = UITapGestureRecognizer(target: self, action: "dismissKeyboard")
        view.addGestureRecognizer(tap)
        let tapGestureRecognizer = UITapGestureRecognizer(target:self, action:#selector(imageTapped))
        
        //Makes Imageview tappable
        imageView.isUserInteractionEnabled = true
        imageView.addGestureRecognizer(tapGestureRecognizer)
        
        
        //Loads fundraisers from Firebase
        var ref: FIRDatabaseReference!
        ref = FIRDatabase.database().reference()
        ref.child("fundList").observe(.childAdded, with: {(snapshot) in
            
            self.fundraisers.append(snapshot.key)
            self.pickerFund.reloadAllComponents()
            
        }, withCancel: nil)
        
        
    }
    
    //Sets picker view's number of components to 1
    func numberOfComponents(in pickerView: UIPickerView) -> Int {
        return 1
    }
    
    //Sets title of each row to name of Fundraiser
    func pickerView(_ pickerView: UIPickerView, titleForRow row: Int, forComponent component: Int) -> String? {
        return fundraisers[row]
    }
    
    //Sets number of rows in picker view
    func pickerView(_ pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int {
        return fundraisers.count
        
    }
    
    //If picker view value changes, update selectedFund Variable
    func pickerView(_ pickerView: UIPickerView, didSelectRow row: Int, inComponent component: Int) {
        selectedFund = fundraisers[row]
        print(selectedFund)
    }
    
    
    func dismissKeyboard() {
        //Causes the view (or one of its embedded text fields) to resign the first responder status.
        view.endEditing(true)
    }
    
    
    //Allows user to select Image of product by opening up image picker controller
    func imageTapped()
    {
        
        if UIImagePickerController.isSourceTypeAvailable(UIImagePickerControllerSourceType.photoLibrary) {
            var imagePicker = UIImagePickerController()
            imagePicker.delegate = self
            imagePicker.sourceType = UIImagePickerControllerSourceType.photoLibrary;
            imagePicker.allowsEditing = true
            self.present(imagePicker, animated: true, completion: nil)
        }
        
    }
    
    //After user picks image, sets imageview to that image and dismisses image picker controller
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [String : AnyObject]) {
        if let pickedImage = info[UIImagePickerControllerOriginalImage] as? UIImage {
            imageView.contentMode = .scaleToFill
            imageView.image = pickedImage
            placeHolderImageText.text = ""
        }
        
        picker.dismiss(animated: true, completion: nil)
    }
    
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    //Called when user presses 'Post'
    @IBAction func posButt(_ sender: Any) {
        
        //Starts animating activity indicator and beigns ignoring interaction events
           UIApplication.shared.beginIgnoringInteractionEvents()
        activityIndicator.startAnimating()
     
        
        //If any fields are empty, shows alert
        if(self.productNameT.text == nil || self.descriptionT.text == nil || Int(self.conditionT.text!) == nil || Int(self.priceT.text!) == nil || imageView.image == nil ){
            
            let alert = UIAlertController(title: "Missing or Invalid information", message: "Please fill out all fields!", preferredStyle: UIAlertControllerStyle.alert)
            alert.addAction(UIAlertAction(title: "OK", style: UIAlertActionStyle.default, handler: nil))
            self.present(alert, animated: true, completion: nil)
            return
        }
        
        
        //ALL of the code below adds the new post to the database
        var ref = FIRDatabase.database().reference()
        var newPost = ref.child("posts").childByAutoId()
        
        var postKey = newPost.key
        let storage = FIRStorage.storage()
        
        // Create a storage reference from our storage service
        let storageRef = storage.reference(forURL: "gs://fabulajan10.appspot.com")
        
        var keyToAddPostToUser = ref.child("users").child("\(FIRAuth.auth()!.currentUser!.uid)").child("posts").childByAutoId()
        
        keyToAddPostToUser.setValue("\(postKey)")
        
        var img = self.imageView.image!
        
        var data = NSData()
        data = UIImageJPEGRepresentation(img, 1.0)! as NSData
        // set upload path
        let filePath = "posts/\(postKey)"
        let metaData = FIRStorageMetadata()
        metaData.contentType = "image/png"
        storageRef.child(filePath).put(data as Data, metadata: metaData){(metaData,error) in
            if let error = error {
                print(error.localizedDescription)
                return
            }else{
                //store downloadURL
                let downloadURL = metaData!.downloadURL()!.absoluteString
                
                
                newPost.setValue(["name": self.productNameT.text, "description": self.descriptionT.text, "condition": Int(self.conditionT.text!), "price": Int(self.priceT.text!), "sold": false, "user": FIRAuth.auth()!.currentUser!.uid, "pic1": downloadURL, "fund": self.selectedFund])
                print("everything shud be set!")
                
                //Activity indicatory stops animating and ends ignoring interaction events
                    self.clearFields()
                self.activityIndicator.stopAnimating()
                UIApplication.shared.endIgnoringInteractionEvents()
            
                
            }
            
        }
        
        
        
        
    }
    
    //Clears all fields after Post is saved to database
    func clearFields(){
        self.productNameT.text = ""
        self.descriptionT.text = ""
        self.conditionT.text = ""
        self.priceT.text = ""
        self.imageView.image == nil
        
    }
    
}
