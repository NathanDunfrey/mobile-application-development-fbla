//
//  ItemCell.swift
//  Picket
//
//  Created by Yash Kakodkar on 2/10/17.
//  Copyright © 2017 Yash Kakodkar. All rights reserved.
//

import UIKit


class ItemCell: UICollectionViewCell {
    
    //outlets
    @IBOutlet weak var spinner: UIActivityIndicatorView!
    @IBOutlet weak var imageView: CustomImageView!
    @IBOutlet weak var costLabel: UILabel!
    @IBOutlet weak var itemNameLabel: UILabel!
    @IBOutlet weak var ownerLabel: UILabel!
    @IBOutlet weak var conditionLabel: UILabel!
    @IBOutlet weak var viewBackground: UIView!
    @IBOutlet weak var chapterCheck: UIImageView!
    
    func setUpCell(obj: Item) {
        
        //show the spinner
        spinner.startAnimating()
        
        // load the item images
        imageView.loadImageUsingUrlString(urlString: obj.imageURLs[0])
        
        // use a number formatter to display money properly
        let price = obj.cost as NSNumber
        
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        
        
        costLabel.text = " " + formatter.string(from: price)! + "  "
        
        //UI and setupbackground
        viewBackground.layer.borderColor = UIColor(red:0.88, green:0.88, blue:0.88, alpha: 1.0).cgColor
        
        //check is user is FBLA chapter
        if obj.seller.isChapter == "false" {
            chapterCheck.isHidden = true
        } else if obj.seller.isChapter == "true" {
            chapterCheck.isHidden = false
        }

        itemNameLabel.text = obj.name
        ownerLabel.text = obj.seller.name
        
        //format the condition label
        let condition = obj.condition
        if condition == "NEW" {
            conditionLabel.backgroundColor = UIColor(red:1.00, green:0.80, blue:0.25, alpha:1.0)
        } else if condition == "USED" {
            conditionLabel.backgroundColor = UIColor(red:0.38, green:0.44, blue:0.99, alpha:1.0)
        } else {
            conditionLabel.backgroundColor = UIColor(red:1.00, green:0.00, blue:0.35, alpha:1.0)
        }
        conditionLabel.text = " " + obj.condition + " "
        conditionLabel.layer.masksToBounds = true
        conditionLabel.layer.cornerRadius = 8
        
    }
    
    required init?(coder aDecoder: NSCoder) {
        super.init(coder:aDecoder)

        //cell shadow
        self.layer.shadowColor = UIColor(red:0, green:0, blue:0, alpha:1.00).cgColor
        self.layer.shadowOffset = CGSize(width:0,height: 2.0)
        self.layer.shadowRadius = 1.0
        self.layer.shadowOpacity = 0.1
    }
    
}

