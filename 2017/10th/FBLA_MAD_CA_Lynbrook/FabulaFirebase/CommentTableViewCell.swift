//
//  CommentTableViewCell.swift
//  FabulaFirebase
//
//  Created by Raghav Sreeram on 1/19/17.
//  Copyright © 2017 Raghav Sreeram. All rights reserved.
//

import UIKit
import Firebase
class CommentTableViewCell: UITableViewCell {

    @IBOutlet weak var commenterImage: CustomImageView!
    @IBOutlet weak var commenterNameL: UILabel!
    @IBOutlet weak var comment: UITextView!
        
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
        commenterImage.layer.cornerRadius = commenterImage.frame.height/2
        commenterImage.clipsToBounds = true
    }
    
    
    //Sets up message by getting image each time
    func setUp(s: String, t: String){

        var ref: FIRDatabaseReference!
        
        ref = FIRDatabase.database().reference()
        
        //Gets commenter Image
        ref.child("users").child(s).observeSingleEvent(of: .value, with: { (snapshot) in
            // Get user value
            let value = snapshot.value as?  [String: AnyObject]
            
            var userPicURl = value?["userPhoto"] as? String ?? ""
            
            self.commenterImage.loadImageUsingUrlString(urlString: userPicURl)
            
            self.comment.text = t
            self.commenterNameL.text = value?["name"] as? String

        }
        )
        
        
    }
    
    //Sets up message: image and text
    func setUpMsg(imageLink: String, text: String){
        
        self.commenterImage.loadImageUsingUrlString(urlString: imageLink)
        
        self.comment.text = text
   
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }

}
