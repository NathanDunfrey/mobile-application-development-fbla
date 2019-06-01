//
//  OwnerActionCell.swift
//  Picket
//
//  Created by Yash Kakodkar on 2/13/17.
//  Copyright © 2017 Yash Kakodkar. All rights reserved.
//

import UIKit
import Firebase
import FirebaseDatabase
import FirebaseAuth

class OwnerActionsCell: UITableViewCell {
    
    //outlets
    @IBOutlet weak var seeOffersButton: UIButton!
    @IBOutlet weak var deleteItemButton: UIButton!
    
    var itemID = ""
    var vc: ItemVC?
    var ref: FIRDatabaseReference!
    
    func setUpCell(itemID: String,  vc: ItemVC) {
        ref = FIRDatabase.database().reference()
        self.itemID = itemID
        self.vc = vc
    }
    
    override func awakeFromNib() {
        super.awakeFromNib()
        
        ref = FIRDatabase.database().reference()
    }
    
    //show alert
    @IBAction func deleteCurrentItem(_ sender: AnyObject) {
        //create alert
        let alert = UIAlertController(title: "Delete Item", message: "Would you like to delete this item from the shop?", preferredStyle: UIAlertControllerStyle.alert)
        
        //add actions
        alert.addAction(UIAlertAction(title: "Delete", style: UIAlertActionStyle.destructive) { (result: UIAlertAction) -> Void in
            let itemRef = self.ref.child("items").child(self.itemID)
            itemRef.removeValue()
            let userItemRef = self.ref.child("users").child((FIRAuth.auth()?.currentUser?.uid)!).child("items").child(self.itemID)
            userItemRef.removeValue()
            self.vc?.performSegue(withIdentifier: "toMarket", sender: self.vc)
        })
        alert.addAction(UIAlertAction(title: "Cancel", style: UIAlertActionStyle.cancel, handler: nil))
        
        //show alert
        vc?.present(alert, animated: true, completion: nil)
    }
    
}
