//
//  BidVC.swift
//  Picket
//
//  Created by Yash Kakodkar on 2/20/17.
//  Copyright © 2017 Yash Kakodkar. All rights reserved.
//

import UIKit
import MessageUI
import Firebase
import FirebaseDatabase

class BidVC: UIViewController, UITableViewDelegate, UITableViewDataSource, MFMailComposeViewControllerDelegate, MFMessageComposeViewControllerDelegate {
    
    // outlets to user interface items in the view controller
    @IBOutlet weak var tableView: UITableView!
    var bids = [Bid]()
    var item: Item!
    var ref: FIRDatabaseReference!
    var toUserVCID = ""
    
    override func viewDidLoad() {
        
        //connect the tableview
        tableView.delegate = self
        tableView.dataSource = self
        
        //create reference to Firebase
        ref = FIRDatabase.database().reference()
        getBids()
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return bids.count
    }
    
    //customize each cell
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "bid", for: indexPath as IndexPath) as! BidCell
        cell.setUpCell(bid: bids[indexPath.row], vc: self, itemID: item.firebaseKey)
        return cell
    }
    
    //contact various bidders
    func messageComposeViewController(_ controller: MFMessageComposeViewController, didFinishWith result: MessageComposeResult) {
        controller.dismiss(animated: true, completion: nil)
    }
    
    //contact various bidders email
    func mailComposeController(_ controller: MFMailComposeViewController, didFinishWith result: MFMailComposeResult, error: Error?) {
        controller.dismiss(animated: true, completion: nil)
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 150
    }
    
    //get firebase bids
    func getBids() {
        ref.child("items").child(item.firebaseKey).child("bids").observeSingleEvent(of: .value, with: { (snapshot) in
            if let json = snapshot.value as? [String : AnyObject] {
                for dict in json {
                    if let dict = dict.value as? [String : AnyObject] {
                        let userID = dict["user"] as! String
                        let bidAmount = dict["bid"] as! String
                        let time = dict["time"] as! Double
                        let bid = Bid(cost: Double(bidAmount)!, userID: userID, timeStamp: time)
                        self.bids.append(bid)
                    }
                }
            }
            self.bids.sort(by: {$0.numericTimeStamp > $1.numericTimeStamp})
            self.tableView.reloadData()
        })
        
    }
    
    func toUserVC(id: String) {
        toUserVCID = id
        performSegue(withIdentifier: "offersToUser", sender: self)
    }
    

    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "toMarket" {
            let vc = segue.destination as! ShopVC
            vc.loadedOnce = false
        } else if segue.identifier == "offersToUser" {
            let vc = segue.destination as! UserVC
            vc.userID = toUserVCID
        }
    }
    
}
