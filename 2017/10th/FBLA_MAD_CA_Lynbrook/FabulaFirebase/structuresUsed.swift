//
//  structuresUsed.swift
//  FabulaFirebase
//
//  Created by Raghav Sreeram on 2/10/17.
//  Copyright © 2017 Raghav Sreeram. All rights reserved.
//

import Foundation
import Firebase


//Holds comments and userid of commenter
struct newCommentStruct {
    var userID: String
    var text: String
    
    init(textI: String, userIDI: String){
        self.text = textI
        self.userID = userIDI
    }
    
    func toAnyObject() -> Any {
        return [
            "userID": userID,
            "comment": text
        ]
    }
}



//message struct holds image link to messager and message
struct msgStruct {
    var imgLink: String
    var text: String
    
    init(imgL: String, msg: String){
        self.imgLink = imgL
        self.text = msg
    }
    
    func toAnyObject() -> Any {
        return [
            "text": text,
            "imgLink": imgLink
        ]
    }
}

//Holds name, email and pic link of user
struct userStruct {
    
    var name: String
    
    var email: String
    var picStr: String
    
    init(n: String, pic: String, e: String){
        
        self.name = n
        
        self.email = e
        self.picStr = pic
        
    }
    
}

//Holds all necessary information of a post
struct postStruct {
    
    //let condition: Int
    var name: String
    var condition: Int
    var desc: String
    var price: Int
    var sold: Bool
    var user: String
    var pic1: String
    var img: UIImage
    var fundName: String
    var comments: [String: AnyObject]
    var commentsList: [newCommentStruct]
    var keyy: String
    
    init(snapshot: FIRDataSnapshot) {
        var key = snapshot.key
        
        let snapshotValue = snapshot.value as! [String: AnyObject]
        self.name = snapshotValue["name"] as! String
        
        self.keyy = key
        self.condition = snapshotValue["condition"] as! Int
        self.desc = snapshotValue["description"] as! String
        self.price = snapshotValue["price"] as! Int
        self.user = snapshotValue["user"] as! String
        self.sold = snapshotValue["sold"] as! Bool
        self.pic1 = snapshotValue["pic1"] as! String
        self.img = UIImage(named: "vintageBG2.png")!
        self.fundName = snapshotValue["fund"] as! String
        self.comments = [:]
        
        if(snapshotValue["comments"] != nil){
            self.comments = snapshotValue["comments"] as! [String: AnyObject]
            
        }
        
        self.commentsList = []
        for value in comments.values {
            var text = "\(value["text"])"
            print(text)
            var userID = "\(value["userID"]!)"
            self.commentsList.append(newCommentStruct(textI: text, userIDI: userID))
        }
        
        
    }
    
    func toAnyObject() -> Any {
        return [
            "name": name,
            "description": desc,
            "condition": condition,
            "price": price,
            "user": user,
            "sold": sold,
            "pic1": pic1,
            "comments": comments,
            "key": keyy
        ]
    }
    
    
}




