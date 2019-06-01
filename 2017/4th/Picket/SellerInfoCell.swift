//
//  SellerInfoCell.swift
//  Picket
//
//  Created by Yash Kakodkar on 2/11/17.
//  Copyright © 2017 Yash Kakodkar. All rights reserved.
//

import UIKit

class SellerInfoCell: UITableViewCell {
    
    //outlets 
    @IBOutlet weak var nameLabel: UILabel!
    @IBOutlet weak var profileImage: CustomImageView!
    @IBOutlet weak var chapterCheck: UIImageView!
    
    var user: User?
    var vc: ItemVC?
    
    func setUpCell(seller: User, vc: ItemVC) {
        
        //show seller information
        self.vc = vc
        self.user = seller
        profileImage.loadImageUsingUrlString(urlString: seller.pictureURL)
        nameLabel.text = seller.name
        
        //check is seller is FBLA chapter
        if seller.isChapter == "false" {
            chapterCheck.isHidden = true
        }
        
        
    }
    
    //show seller profile
    @IBAction func toUserDetail(_ sender: Any) {
        vc?.toUserVC(id: (user?.id)!)
    }
    
}

