//
//  CommentCell.swift
//  Picket
//
//  Created by Yash Kakodkar on 2/13/17.
//  Copyright © 2017 Yash Kakodkar. All rights reserved.
//

import UIKit

class CommentCell: UITableViewCell {
    
    //outlets
    @IBOutlet weak var nameLabel: UILabel!
    @IBOutlet weak var commentLabel: UILabel!
    @IBOutlet weak var timeLabel: UILabel!
    @IBOutlet weak var profileImage: CustomImageView!
    
    var comment: Comment?
    var vc: ItemVC?
    
    func setUpCell(comment: Comment, vc: ItemVC) {
        
        //display comment
        self.vc = vc
        self.comment = comment
        profileImage.loadImageUsingUrlString(urlString: comment.pictureURL)
        commentLabel.text = comment.comment
        nameLabel.text = comment.name
        timeLabel.text = comment.timeStamp
    }
    
    //show profile
    @IBAction func toUserDetail(_ sender: Any) {
        vc?.toUserVC(id: (comment?.userID)!)
    }
    
}
