//
//  ChatTableViewCell.swift
//  FabulaFirebase
//
//  Created by Raghav Sreeram on 2/10/17.
//  Copyright © 2017 Raghav Sreeram. All rights reserved.
//

import UIKit
import Firebase
class ChatTableViewCell: UITableViewCell {

    @IBOutlet weak var userPf: CustomImageView!
    @IBOutlet weak var buyerName: UILabel!
    @IBOutlet weak var productImage: CustomImageView!
    @IBOutlet weak var interestedIn: UILabel!
    
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
        userPf.layer.cornerRadius = userPf.frame.height/2
        userPf.clipsToBounds = true
        
        productImage.layer.cornerRadius = 10.0
        productImage.clipsToBounds = true
        
    }
    
    func setUP(buyerID: String, postKey: String){
        var ref: FIRDatabaseReference!
        
        
        
        ref = FIRDatabase.database().reference()
        ref.child("users").child(buyerID).observeSingleEvent(of: .value, with: { (snapshot) in
            // Get user value
            let value = snapshot.value as? NSDictionary
            let name = value?["name"] as! String
            
            let imageLink = value?["userPhoto"] as! String
            
            self.userPf.loadImageUsingUrlString(urlString: imageLink)
            self.buyerName.text = name
            
        }) { (error) in
            print(error.localizedDescription)
        }

        
        
        
        ref.child("posts").child(postKey).observeSingleEvent(of: .value, with: { (snapshot) in
            // Get user value
            let value = snapshot.value as? NSDictionary
            
            let imageLink = value?["pic1"] as! String
            
            self.productImage.loadImageUsingUrlString(urlString: imageLink)
            self.interestedIn.text = "interested in"

            
        }) { (error) in
            
            print(error.localizedDescription)
        }
        
        
    }
    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }

}
