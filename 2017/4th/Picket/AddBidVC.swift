//
//  AddBidVC.swift
//  Picket
//
//  Created by Yash Kakodkar on 2/19/17.
//  Copyright © 2017 Yash Kakodkar. All rights reserved.
//

import UIKit
import Firebase
import FirebaseDatabase
import SwiftMessages

class AddBidVC: UIViewController, UITextFieldDelegate {
    
    // outlets
    @IBOutlet weak var greaterThan: UILabel!
    @IBOutlet weak var viewBackground: UIView!
    @IBOutlet weak var bidTextField: UITextField!
    
    let numberFormatter = NumberFormatter()
    
    var itemID = ""
    var userID = ""
    var currentBid = 0.0
    var vc: ItemVC?
    var ref: FIRDatabaseReference!
    
    override func viewDidLoad() {
        // create a reference to Firebase
        ref = FIRDatabase.database().reference()
        
        //UI design
        viewBackground.layer.borderColor = UIColor(red:0.88, green:0.88, blue:0.88, alpha: 1.0).cgColor
        viewBackground.layer.shadowColor = UIColor.black.cgColor
        viewBackground.layer.shadowOffset = CGSize(width: 0, height: 1)
        viewBackground.layer.shadowOpacity = 0.1
        viewBackground.layer.shadowRadius = 2
        
        let tap = UITapGestureRecognizer(target: self.view, action: #selector(UIView.endEditing(_:)))
        tap.cancelsTouchesInView = false
        self.view.addGestureRecognizer(tap)
        
        // get current bid on item
        let num = currentBid as NSNumber
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        super.viewDidLoad()
        greaterThan.text = "It must be greater than " + formatter.string(from: num)!
        
        self.bidTextField.delegate = self
        
        // format the new bid
        numberFormatter.numberStyle = .decimal
        numberFormatter.minimumFractionDigits = 2
        numberFormatter.maximumFractionDigits = 2
    }
    
    func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
        
        var originalString = textField.text
        
        //Replace commas
        originalString = originalString?.replacingOccurrences(of: ",", with: "")
        
        var doubleFromString:  Double!
        
        if originalString!.isEmpty {
            originalString = string
            doubleFromString = Double(originalString!)
            doubleFromString! /= 100
        } else {
            if string.isEmpty {
                //Replace the last character for 0
                let loc = originalString!.characters.count - 1
                let range = NSMakeRange(loc, 1)
                let newString = (originalString! as NSString).replacingCharacters(in: range, with: "0")
                doubleFromString = Double(newString)
                doubleFromString! /= 10
            } else {
                originalString = originalString! + string
                doubleFromString = Double(originalString!)
                doubleFromString! *= 10
            }
            
        }
        
        let finalString = numberFormatter.string(from: doubleFromString as NSNumber)
        
        textField.text = finalString
        
        return false
    }
    
    @IBAction func placeBid(_ sender: AnyObject) {
        
        //post bid if valid
        if bidTextField.text?.replacingOccurrences(of: " ", with: "") == "" {
            let view = MessageView.viewFromNib(layout: .CardView)
            view.button?.removeFromSuperview()
            
            view.configureTheme(.error)
            
            view.configureDropShadow()
            
            view.configureContent(title: "Bidding Error", body: "No bid entered.")
            
            SwiftMessages.show(view: view)
            return
        }
        let bid = Double(bidTextField.text!.replacingOccurrences(of: ",", with: "").replacingOccurrences(of: ".", with: ""))!/100
        if bid > currentBid {
            let b = NSString(format:"%.2f", bid) as String
            let bidRef = ref.child("items").child(itemID).child("bids").childByAutoId()
            bidRef.setValue(["user": String(describing: userID), "bid": String(describing: b), "time": NSDate().timeIntervalSince1970])
            let newBidRef = ref.child("items").child(itemID).child("bid")
            newBidRef.setValue(String(describing: b))
            dismiss(animated: true, completion: nil)
            let view = MessageView.viewFromNib(layout: .CardView)
            view.button?.removeFromSuperview()
            
            view.configureTheme(.success)
            
            view.configureDropShadow()
            
            view.configureContent(title: "Bid Added!", body: "Bid has successfully been added. Good luck!")
            
            SwiftMessages.show(view: view)
            self.performSegue(withIdentifier: "toMarket", sender: self)
        } else {
            let view = MessageView.viewFromNib(layout: .CardView)
            view.button?.removeFromSuperview()
            
            view.configureTheme(.error)
            
            view.configureDropShadow()
            
            view.configureContent(title: "Bidding Error", body: "New bid must be greater than current bid.")
            
            SwiftMessages.show(view: view)
        }
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "toMarket" {
            let vc = segue.destination as! ShopVC
            vc.loadedOnce = false
        }
    }
    /*
     // MARK: - Navigation
     
     // In a storyboard-based application, you will often want to do a little preparation before navigation
     override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
     // Get the new view controller using segue.destinationViewController.
     // Pass the selected object to the new view controller.
     }
     */
    
}
