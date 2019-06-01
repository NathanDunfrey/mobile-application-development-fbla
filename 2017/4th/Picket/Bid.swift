//
//  Bid.swift
//  Picket
//
//  Created by Yash Kakodkar on 2/5/17.
//  Copyright © 2017 Yash Kakodkar. All rights reserved.
//

import Foundation
import UIKit
import Firebase
import FirebaseDatabase

class Bid: NSObject {
    
    //bid attributes
    var cost = 0.0
    var timeStamp = ""
    var userID = ""
    var name = ""
    var pictureURL = ""
    var email = ""
    var phone = ""
    var numericTimeStamp = 0.0
    
    //initialize bid with raw information
    init(cost: Double, userID: String, timeStamp: Double) {
        self.numericTimeStamp = timeStamp
        self.cost = cost
        self.userID = userID
        let date = Date(timeIntervalSince1970: timeStamp)
        let df = DateFormatter()
        df.dateFormat = "MMM d, h:mm a"
        self.timeStamp = df.string(from: date)
        
    }
    
    //get info about bidder from Firebase
    func getUserInfo(completionHandler:@escaping (Bool) -> ()) {
        let ref = FIRDatabase.database().reference()
        ref.child("users").child(userID).observeSingleEvent(of: .value, with: { (snapshot) in
            if let userDict = snapshot.value as? [String : AnyObject] {
                self.name = userDict["name"] as! String
                self.pictureURL = userDict["image"] as! String
                self.email = userDict["email"] as! String
                self.phone = userDict["phone"] as! String
                completionHandler(true)
            }
        })
    }
    
}
