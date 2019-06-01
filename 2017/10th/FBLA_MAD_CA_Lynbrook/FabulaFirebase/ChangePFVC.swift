//
//  ChangePFVC.swift
//
//
//  Created by Raghav Sreeram on 2/10/17.
//
//

import UIKit
import Firebase

//Allows user to change profile images
class ChangePFVC: UIViewController, UIImagePickerControllerDelegate, UINavigationControllerDelegate {
    
    @IBOutlet weak var imageView: CustomImageView!
    
    //Creates Activity Indicator
    var activityIndicator: UIActivityIndicatorView = UIActivityIndicatorView()
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        //Sets up activity Indicator
        activityIndicator.center = self.view.center
        activityIndicator.hidesWhenStopped = true
        activityIndicator.activityIndicatorViewStyle = .gray
        self.view.addSubview(activityIndicator)
        
        //Makes image view circular
        imageView.layer.cornerRadius = imageView.frame.height/2
        imageView.clipsToBounds = true
        self.imageView.layer.borderWidth = 2
        self.imageView.layer.borderColor = UIColor.white.cgColor
        
        //Loads current profile pic with url
        self.imageView.loadImageUsingUrlString(urlString: myUser.picStr)
        
    }
    
    //Opens image picker when chage Pf Button is pressed
    @IBAction func changePFButton(_ sender: Any) {
        
        if UIImagePickerController.isSourceTypeAvailable(UIImagePickerControllerSourceType.photoLibrary) {
            var imagePicker = UIImagePickerController()
            imagePicker.delegate = self
            imagePicker.sourceType = UIImagePickerControllerSourceType.photoLibrary;
            imagePicker.allowsEditing = true
            self.present(imagePicker, animated: true, completion: nil)
        }
        
        
    }
    
    //Gets called after user finishes picking an Image
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [String : AnyObject]) {
        
        if let pickedImage = info[UIImagePickerControllerOriginalImage] as? UIImage {
            imageView.contentMode = .scaleToFill
            imageView.image = pickedImage
            saveImageToFirebase()
        }
        
        picker.dismiss(animated: true, completion: nil)
        
    }
    
    
    
    func saveImageToFirebase(){
        
        //Start activity indicator and begin ignoring interaction events until finishes uploading new pf Image
        activityIndicator.startAnimating()
        UIApplication.shared.beginIgnoringInteractionEvents()
        
        var ref = FIRDatabase.database().reference()
        let storage = FIRStorage.storage()
        
        // Create a storage reference from storage service
        let storageRef = storage.reference(forURL: "gs://fabulajan10.appspot.com")
        var userRef = ref.child("users").child("\(FIRAuth.auth()!.currentUser!.uid)")
        
        var img = self.imageView.image!
        
        var data = NSData()
        data = UIImageJPEGRepresentation(img, 1.0)! as NSData
        // set upload path
        let filePath = "users/\(FIRAuth.auth()!.currentUser!)"
        let metaData = FIRStorageMetadata()
        metaData.contentType = "image/png"
        
        //Creates storage ref and saves new Image
        storageRef.child(filePath).put(data as Data, metadata: metaData){(metaData,error) in
            if let error = error {
                print(error.localizedDescription)
                return
            }else{
                //store downloadURL
                let downloadURL = metaData!.downloadURL()!.absoluteString
                
                //Saves download url in database
                userRef.updateChildValues(["userPhoto": downloadURL])
                print("everything should be set!")
                
                //Stops activity indicator and ends ignoring interaction events
                self.activityIndicator.stopAnimating()
                UIApplication.shared.endIgnoringInteractionEvents()
                
            }
        }
        
        
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
}
