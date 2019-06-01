//
//  FeedCollectionViewCell.swift
//  FabulaFirebase
//
//  Created by Raghav Sreeram on 1/9/17.
//  Copyright © 2017 Raghav Sreeram. All rights reserved.
//

import UIKit

class FeedCollectionViewCell: UICollectionViewCell {
    
    @IBOutlet weak var cellView: UIView!
    @IBOutlet weak var productImage: CustomImageView!

    @IBOutlet weak var fundName: UIButton!
    
    @IBOutlet weak var productName: UILabel!
    
    
    override func awakeFromNib() {
        cellView.layer.cornerRadius = 3.0
        cellView.mask?.clipsToBounds = true
    }

    
    func setupCell(post: postStruct){
    
        productImage.image = post.img
        productName.text = post.name
        fundName.setTitle(post.fundName, for: UIControlState.normal)
    }
    
}
