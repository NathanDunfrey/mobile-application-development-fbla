//
//  CreateNewViewController.swift
//  BLAuctions
//
// This class is where new listings are created
//
//  Created by Drew Patel on 12/11/16.
//  Copyright © 2016 DrafeSu. All rights reserved.
//

import UIKit
//Eureka is a form builder for Swift
import Eureka
import ImageRow
import Firebase
import FirebaseDatabase
class CreateNewViewController: FormViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        //create a new data form
        //This part is where all the data entry cells are created
        //each reside in the form and are divided up by sections
        form = Section("Product information")
            <<< NameRow("title"){ row in
                row.title = "Title"
                row.placeholder = "IKEA Sofa"
            }
            <<< TextAreaRow("description"){ row in
                row.title = "Description: Description"
                row.placeholder = "Its super comfy!"
            }
            <<< AlertRow<String>("condition") {
                $0.title = "Product Condition"
                $0.selectorTitle = "Pick the condition"
                $0.options = ["New","Like-New","Used", "Non-functional"]
                $0.value = "Used"    // initially selected
            }
            <<< DecimalRow("price"){
                $0.title = "Price"
                $0.placeholder = "$92.10"
            }
            <<< ImageRow("productimage") { row in
                row.title = "Product Image"
                row.sourceTypes = [.PhotoLibrary, .SavedPhotosAlbum]
                row.clearAction = .yes(style: UIAlertActionStyle.destructive)
                
            }
            +++ Section("listinglength")
            <<< SwitchRow("switchRowTag"){
                $0.title = "Until Sold"
                $0.value = false
                
            }
            <<< DateRow("endDate"){
                //this row will hide some boxes unless the switchrow is activated
                
                $0.hidden = Condition.function(["endDateRowTag"], { form in
                    return ((form.rowBy(tag: "endDateRowTag") as? SwitchRow)?.value ?? false)
                })
                $0.title = "End date"
                $0.value = NSDate() as Date
                
            }
            +++ Section("Shipping")
            <<< SwitchRow("shippingRowTag"){
                $0.title = "Local Pickup Only"
                $0.value = false
            }
            <<< DecimalRow("shippingcost") {
                
                $0.hidden = Condition.function(["shippingRowTag"], { form in
                    
                    return !((form.rowBy(tag: "shippingRowTag") as? SwitchRow)?.value ?? false)
                })
                $0.title = "Shipping Cost"
            }
            <<< ZipCodeRow("pickupZip"){
                $0.title = "Your Zipcode"
        }
        
        

        
    }

    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    //this function sends all the data to Firebase
    @IBAction func addListing(_ sender: Any) {
        //obtain all the information from the form and place it inside a dictionary
        var valuesDictionary : Dictionary! = form.values()

        //split the dictionary variables up into individual variables
        let title = valuesDictionary["title"]!
        let description = valuesDictionary["description"]!
        let condition = valuesDictionary["condition"]!
        let productImg = valuesDictionary["productimage"]
        let listingLength = valuesDictionary["endDate"]
        let localPickup = valuesDictionary["shippingRowTag"]!
        let shippingCost = valuesDictionary["shippingcost"]!
        let zipcode = valuesDictionary["pickupZip"]!
        let price = valuesDictionary["price"]!
        
        //format the date into a string so it can be easily stored
        let dateformatter = DateFormatter()
        dateformatter.dateStyle = DateFormatter.Style.short
        let endDateFormatted = dateformatter.string(from: listingLength as! Date)
     
        //get the User's id and generate a random number between 1000 and 99999
        //the two values are combined to give the listing a unique ID
        var userID = FIRAuth.auth()?.currentUser?.uid
        userID = userID! + String(Int(arc4random_uniform(99999) + 1000))
        
        //create reference to Firebase storage for storing image
        let storage = FIRStorage.storage()
        let storageRef = storage.reference()
        var data = NSData()
        data = UIImageJPEGRepresentation(productImg! as! UIImage, 1)! as NSData
        // set upload path
        let filePath = storageRef.child("listings/\(userID!)/photo")
        //uploads the product image to firebase
        let uploadTask = filePath.put(data as Data, metadata: nil) { (metadata, error) in
            guard let metadata = metadata else {
 
                return
            }

            //create reference to Firebase text entry database
        var ref: FIRDatabaseReference!
            ref = FIRDatabase.database().reference()
            
            //individually store each variable in firebase
            ref.child("listings/\(userID!)/title").setValue(title)
            ref.child("listings/\(userID!)/description").setValue(description)
            ref.child("listings/\(userID!)/condition").setValue(condition)
            ref.child("listings/\(userID!)/listingLength").setValue(endDateFormatted)
            ref.child("listings/\(userID!)/localPickup").setValue(localPickup)
            ref.child("listings/\(userID!)/shippingCost").setValue(shippingCost)
            ref.child("listings/\(userID!)/zipcode").setValue(zipcode)
            ref.child("listings/\(userID!)/price").setValue(price)
            //get the URL of the image stored in the file hosting of Firebase and store that url in firebase text storage
            ref.child("listings/\(userID!)/imageURL").setValue((metadata.downloadURL())?.absoluteString)
            
        
 
    }

   
}
}
