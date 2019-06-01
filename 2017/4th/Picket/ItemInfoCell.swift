//
//  ItemInfoCell.swift
//  Picket
//
//  Created by Yash Kakodkar on 2/10/17.
//  Copyright © 2017 Yash Kakodkar. All rights reserved.
//

import UIKit

class ItemInfoCell: UITableViewCell {
    
    // outlets to user interface items in the view controller
    @IBOutlet weak var nameLabel: UILabel!
    
    @IBOutlet weak var costLabel: UILabel!
    
    @IBOutlet weak var conditionLabel: UILabel!
    
    @IBOutlet weak var descriptionLabel: UILabel!
    
    @IBOutlet weak var viewBackground: UIView!
    
    func setUpCell(obj: Item) {
        
        
        //UI Setup
        let gradient = CAGradientLayer()
        
        gradient.frame = viewBackground.bounds
        gradient.colors = [UIColor.white.cgColor, UIColor(red:0.92, green:0.92, blue:0.92, alpha: 1.0).cgColor]
        
        viewBackground.layer.insertSublayer(gradient, at: 0)
        
        
        //show information about this item
        nameLabel.text = obj.name
        let price = obj.cost as NSNumber
        
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        
        costLabel.text = formatter.string(from: price)
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
        conditionLabel.layer.cornerRadius = 10
        descriptionLabel.text = obj.descrip
    }
    
}
