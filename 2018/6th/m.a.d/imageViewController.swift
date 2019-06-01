//
//  imageViewController.swift
//  m.a.d
//
//  Created by Devansh Yerpude on 2/11/18.
//  Copyright © 2018 Devansh Yerpude. All rights reserved.
//
import UIKit

//sets up Snapshot Page
class imageViewController: UIViewController, UIImagePickerControllerDelegate, UINavigationControllerDelegate {

    override func viewDidLoad() {
        super.viewDidLoad()
        
        textView.layer.borderColor = UIColor.white.cgColor
        textView.layer.borderWidth = 2
        
        // Do any additional setup after loading the view, typically from a nib.
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
   
    
    
  
    }
    //share with social medai found on phone
    
    @IBAction func onshare(_ sender: Any) {
        let activity = UIActivityViewController(activityItems: [textView.text!, #imageLiteral(resourceName: "Social.png")], applicationActivities: nil)
        present(activity, animated: true, completion: nil)
        
    }
    @IBOutlet var textView: UITextView!
    @IBAction func takePhoto(_ sender: AnyObject) {
        //takes photo from inbuilt photo function, saves it and calls recognition function
        if UIImagePickerController.isSourceTypeAvailable(UIImagePickerControllerSourceType.camera) {
            let imagePicker = UIImagePickerController()
            imagePicker.delegate = self as? UIImagePickerControllerDelegate & UINavigationControllerDelegate
            imagePicker.sourceType = UIImagePickerControllerSourceType.camera
            imagePicker.allowsEditing = false
            self.present(imagePicker, animated: true, completion: nil)
        }
        
    }
    
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [String : Any]) {
        if let pickedImage = info[UIImagePickerControllerOriginalImage] as? UIImage {
            performImageRecognition(pickedImage.scaleImage(640)!)
        }
        picker.dismiss(animated: true, completion: nil)
}
    func performImageRecognition(_ image: UIImage) {
        //sets language to english
        if let tesseract = G8Tesseract(language: "eng") {
            tesseract.engineMode = .tesseractCubeCombined //sets engine to use for recognition
            tesseract.pageSegmentationMode = .auto //automatically segments the image
            tesseract.image = image.g8_blackAndWhite() //greyscale for better detection
            tesseract.recognize() //calls engine and recognizes text
            textView.text = tesseract.recognizedText //displays text in textfield
        }
    }
    //if clicking outside of entry box, makes keyboard dissappear
    override func touchesBegan(_ touches:Set<UITouch>, with event: UIEvent?){
        self.view.endEditing(true)
    }
    
    func text(_textView:UITextView)->Bool{
        textView.resignFirstResponder()
        
        return(true)
        
    }
    
}
extension UIImage {
    //scale image function which scales image to the proper size for recognition
    func scaleImage(_ maxDimension: CGFloat) -> UIImage? {
        
        var scaledSize = CGSize(width: maxDimension, height: maxDimension)
        
        if size.width > size.height {
            let scaleFactor = size.height / size.width
            scaledSize.height = scaledSize.width * scaleFactor
        } else {
            let scaleFactor = size.width / size.height
            scaledSize.width = scaledSize.height * scaleFactor
        }
        
        UIGraphicsBeginImageContext(scaledSize)
        draw(in: CGRect(origin: .zero, size: scaledSize))
        let scaledImage = UIGraphicsGetImageFromCurrentImageContext()
        UIGraphicsEndImageContext()
        
        return scaledImage
    }
    
}






    
