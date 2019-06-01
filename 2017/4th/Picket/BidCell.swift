//
//  BidCell.swift
//  Picket
//
//  Created by Yash Kakodkar on 2/14/17.
//  Copyright © 2017 Yash Kakodkar. All rights reserved.
//

import UIKit
import MessageUI
import Firebase
import FirebaseDatabase
import SwiftMessages

class BidCell: UITableViewCell {
    
    //outlets
    @IBOutlet weak var profileImage: CustomImageView!
    @IBOutlet weak var nameLabel: UILabel!
    @IBOutlet weak var timeLabel: UILabel!
    @IBOutlet weak var bidAmountLabel: UILabel!
    @IBOutlet weak var cardView: UIView!
    var itemID = ""
    var bid: Bid!
    var vc: BidVC?
    var ref: FIRDatabaseReference!
    
    func setUpCell(bid: Bid, vc: BidVC, itemID: String) {
        
        
        //ui
        cardView.layer.borderColor = UIColor(red:0.88, green:0.88, blue:0.88, alpha: 1.0).cgColor
        cardView.layer.shadowColor = UIColor.black.cgColor
        cardView.layer.shadowOffset = CGSize(width: 0, height: 2)
        cardView.layer.shadowOpacity = 0.1
        cardView.layer.shadowRadius = 1
        
        //get bid info
        bid.getUserInfo(completionHandler: { (bool) in
            self.ref = FIRDatabase.database().reference()
            self.vc = vc
            self.bid = bid
            
            self.itemID = itemID
            let price = bid.cost as NSNumber
            
            //format currency
            let formatter = NumberFormatter()
            formatter.numberStyle = .currency
            
            self.bidAmountLabel.text = formatter.string(from: price)
            
            //display bid info
            self.nameLabel.text = bid.name
            self.timeLabel.text = bid.timeStamp
            self.profileImage.loadImageUsingUrlString(urlString: bid.pictureURL)
        })
    }
    
    //contact this bidder through email, phone, or text
    @IBAction func contactBidder(_ sender: AnyObject) {
        let alert = UIAlertController(title: "Contact \(bid.name)", message: "How would you like to get in touch with the bidder on this item?", preferredStyle: .actionSheet)
        alert.addAction(UIAlertAction(title: "Email", style: .default, handler: {
            action in
            let mailVC = MFMailComposeViewController()
            mailVC.mailComposeDelegate = self.vc as MFMailComposeViewControllerDelegate?
            mailVC.setToRecipients([self.bid.email])
            
            self.vc?.present(mailVC, animated: true, completion: nil)
        }))
        alert.addAction(UIAlertAction(title: "Phone Call", style: .default, handler: {
            action in
            let url = NSURL(string: "telprompt://\(self.bid.phone)")!
            UIApplication.shared.openURL(url as URL)
        }))
        alert.addAction(UIAlertAction(title: "Text Message", style: .default, handler: {
            action in
            let messageVC = MFMessageComposeViewController()
            messageVC.messageComposeDelegate = self.vc as MFMessageComposeViewControllerDelegate?
            messageVC.recipients = [self.bid.phone]
            
            self.vc?.present(messageVC, animated: true, completion: nil)
            
        }))
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel, handler: nil))
        alert.popoverPresentationController?.sourceView = sender as? UIView
        alert.popoverPresentationController?.sourceRect = sender.bounds
        vc?.present(alert, animated: true, completion: nil)
        
    }
    
    //remove the item from the auction
    @IBAction func sellItemOff(_ sender: AnyObject) {
        let itemRef = self.ref.child("items").child(self.itemID)
        itemRef.removeValue()
        let view = MessageView.viewFromNib(layout: .CardView)
        view.button?.removeFromSuperview()
        
        view.configureTheme(.success)
        
        view.configureDropShadow()
        
        view.configureContent(title: "Item sold!", body: "Item has successfully been sold")
        
        SwiftMessages.show(view: view)
        self.vc?.performSegue(withIdentifier: "toMarket", sender: self)
    }
    

    
    @IBAction func toUserInfo(_ sender: Any) {
        vc?.toUserVC(id: bid.userID)
    }
    
}
