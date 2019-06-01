//
//  User.swift
//  Picket
//
//  Created by Yash Kakodkar on 2/4/17.
//  Copyright © 2017 Yash Kakodkar. All rights reserved.
//

import Foundation
import Firebase
import FirebaseDatabase

class User: NSObject {
    
    //user attributes
    var name = ""
    var phone = ""
    var email = ""
    var pictureURL = ""
    var id = ""
    var isChapter = "false"
    
    //initialize user from raw information
    init(name: String, phone: String, email: String, pictureURL: String, id: String, isChapter: String) {
        self.name = name
        self.phone = phone
        self.email = email
        self.pictureURL = pictureURL
        self.id = id
        self.isChapter = isChapter
    }
    
    //initialize user by ID
    init(sellerID: String) {
        self.id = sellerID
    }
    
    //get user info from Firebase
    func getUserInfo() {
        let ref = FIRDatabase.database().reference()
        ref.child("users").child(id).observeSingleEvent(of: .value, with: { (snapshot) in
            if let userDict = snapshot.value as? [String : AnyObject] {
                self.name = userDict["name"] as! String
                self.email = userDict["email"] as! String
                self.phone = userDict["phone"] as! String
                self.pictureURL = userDict["image"] as! String
                self.isChapter = userDict["isChapter"] as! String
            }
        })
    }
}
