//
//  MessagesVC.swift
//  FabulaFirebase
//
//  Created by Raghav Sreeram on 2/6/17.
//  Copyright © 2017 Raghav Sreeram. All rights reserved.
//

import UIKit
import Firebase

//Controls all features in message channel
class MessagesVC: UIViewController, UITextFieldDelegate, UITextViewDelegate, UITableViewDataSource, UITableViewDelegate {
    
    
    @IBOutlet weak var productImage: CustomImageView!
    @IBOutlet weak var messageField: UITextView!
    @IBOutlet weak var productName: UILabel!
    @IBOutlet weak var productDescrip: UITextView!
    @IBOutlet weak var otherUserImage: CustomImageView!
    @IBOutlet weak var priceLabel: UILabel!
    @IBOutlet weak var myUserImage: CustomImageView!
    @IBOutlet weak var myConfirmButt: UIButton!
    @IBOutlet weak var otherConfrimButt: UIButton!
    
    @IBOutlet weak var myNameLabel: UILabel!
    @IBOutlet weak var otherName: UILabel!
    @IBOutlet weak var messagesTable: UITableView!
    @IBOutlet weak var myTitleLabel: UILabel!
    @IBOutlet weak var otherTitleLabel: UILabel!
    
    
    //Keeps track of whether user is a Seller or Buyer
    var isSeller = false
    
    //Contains all information about present transaction
    var messageInfo: FIRDataSnapshot!
    
    //Holds all messages in transaction
    var msgList: [msgStruct] = []
    
    //Keeps track of confirmations
    var sellerConfirmed = false
    var buyerConfirmed = false
    
    //Makes sures sold() doesn't get called when view loads
    var callSold = false
    
    
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        
        //Creates Database reference
        var ref: FIRDatabaseReference!
        ref = FIRDatabase.database().reference()
        
        let userID = FIRAuth.auth()?.currentUser?.uid
        
        
        //Loads all messages in channel and gets confirmations
        ref.child("messagesList").child(messageInfo.key).observe(.value , with: {(snapshot) in
            
            let snapshotValue = snapshot.value as! [String: AnyObject]
            
            //Checks if Product is sold
            if(snapshotValue["buyerConfirmed"] as! Bool && snapshotValue["sellerConfirmed"] as! Bool){
                self.priceLabel.text = "Sold!"
                if(self.callSold){
                    self.sold()
                }
                self.callSold = true
            }
            
            
            //Sets up confirmation buttons based on buyerConfirmed and sellerConfirmed varialbes in database
            if(self.isSeller){
                
                if(snapshotValue["buyerConfirmed"] as! Bool){
                    
                    self.otherConfrimButt.setTitleColor(UIColor.white, for: .normal)
                    self.otherConfrimButt.setTitle("Confirmed!", for: .normal)
                    self.otherConfrimButt.backgroundColor = UIColor.red
                }else{
                    
                    self.otherConfrimButt.setTitleColor(UIColor.red, for: .normal)
                    self.otherConfrimButt.setTitle("Waiting for Confirmation", for: .normal)
                    self.otherConfrimButt.backgroundColor = UIColor.white
                }
                
                if(snapshotValue["sellerConfirmed"] as! Bool){
                    
                    self.myConfirmButt.setTitleColor(UIColor.white, for: .normal)
                    self.myConfirmButt.setTitle("Confirmed!", for: .normal)
                    self.myConfirmButt.backgroundColor = UIColor.red
                }else{
                    
                    self.myConfirmButt.setTitleColor(UIColor.red, for: .normal)
                    self.myConfirmButt.setTitle("Confirm!", for: .normal)
                    self.myConfirmButt.backgroundColor = UIColor.white
                }
                
            }else{
                if(snapshotValue["sellerConfirmed"] as! Bool){
                    
                    self.otherConfrimButt.setTitleColor(UIColor.white, for: .normal)
                    self.otherConfrimButt.setTitle("Confirmed!", for: .normal)
                    self.otherConfrimButt.backgroundColor = UIColor.red
                }else{
                    
                    self.otherConfrimButt.setTitleColor(UIColor.red, for: .normal)
                    self.otherConfrimButt.setTitle("Waiting for Confirmation", for: .normal)
                    self.otherConfrimButt.backgroundColor = UIColor.white
                }
                
                if(snapshotValue["buyerConfirmed"] as! Bool){
                    
                    self.myConfirmButt.setTitleColor(UIColor.white, for: .normal)
                    self.myConfirmButt.setTitle("Confirmed!", for: .normal)
                    self.myConfirmButt.backgroundColor = UIColor.red
                }else{
                    
                    self.myConfirmButt.setTitleColor(UIColor.red, for: .normal)
                    self.myConfirmButt.setTitle("Confrim!", for: .normal)
                    self.myConfirmButt.backgroundColor = UIColor.white
                }
            }
            
        }, withCancel: nil)
        
        
        
        //Loads messages in channel
        ref.child("messagesList").child(self.messageInfo.key).child("messages").queryOrderedByKey().observe(.childAdded, with: {(snapshot) in
            
            var value = (snapshot.value as! NSDictionary)
            var text = "\(value["msg"]!)"
            var picurl = value["senderPhoto"] as? String ?? ""
            
            //Appends each message to msgList
            self.msgList.append(msgStruct(imgL: picurl, msg: text))
            
            //reloads tableView in main thread
            DispatchQueue.main.async(){
                self.messagesTable.reloadData()
                
            }
            
        }, withCancel: nil)
        
        
        
        
        //Sets up navigation bar
        self.navigationItem.backBarButtonItem = UIBarButtonItem(title: "", style: UIBarButtonItemStyle.plain, target: nil, action: nil)
        
        
        //Allows for view to move up and down when keyboard is shown
        let tap: UITapGestureRecognizer = UITapGestureRecognizer(target: self, action: "dismissKeyboard")
        view.addGestureRecognizer(tap)
        NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillShow), name:NSNotification.Name.UIKeyboardWillShow, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillHide), name:NSNotification.Name.UIKeyboardWillHide, object: nil)
        
        
    }
    
    
    
    
    override func viewWillAppear(_ animated: Bool) {
        self.tabBarController?.tabBar.isHidden = true
        
        var ref: FIRDatabaseReference!
        
        ref = FIRDatabase.database().reference()
        
        let snapshotValue = messageInfo.value as! [String: AnyObject]
        
        //Determines if current user is seller or not
        if(snapshotValue["sellerID"] as! String == FIRAuth.auth()!.currentUser!.uid){
            self.isSeller = true
            
        }
        
        
        //Gets the product information to load at the top
        ref.child("posts").child(snapshotValue["postKey"] as! String).observeSingleEvent(of: .value, with: { (snapshot) in
            
            let snapshotValue2 = snapshot.value as! [String: AnyObject]
            
            let url2 = snapshotValue2["pic1"] as! String
            
            self.productImage.loadImageUsingUrlString(urlString: url2)
            self.productDescrip.text = snapshotValue2["description"] as! String
            self.productName.text = snapshotValue2["name"] as! String
            self.priceLabel.text = "$\(snapshotValue2["price"] as! Int)"
            
        }) { (error) in
            print(error.localizedDescription)
        }
        
        
        //Gets userkey of other user
        var otherUserKey = ""
        if(isSeller){
            otherUserKey = snapshotValue["buyerID"] as! String
        }else{
            otherUserKey = snapshotValue["sellerID"] as! String
        }
        
        
        //Gets data of other user including name and image
        ref.child("users").child(otherUserKey).observeSingleEvent(of: .value, with: { (snapshot) in
            
            let snapshotValue3 = snapshot.value as! [String: AnyObject]
            let url2 = snapshotValue3["userPhoto"] as! String //postPhoto URL
            
            self.otherUserImage.loadImageUsingUrlString(urlString: url2)
            
            let url3 = myUser.picStr  //postPhoto URL
            self.myUserImage.loadImageUsingUrlString(urlString: url3)
            
            //Sets up profile puctures in circle
            self.myUserImage.layer.cornerRadius  = self.myUserImage.frame.height * 0.5
            self.otherUserImage.layer.cornerRadius = self.myUserImage.frame.height * 0.5
            self.myUserImage.layer.borderWidth = 2
            self.myUserImage.layer.borderColor = UIColor.white.cgColor
            self.otherUserImage.layer.borderWidth = 2
            self.otherUserImage.layer.borderColor = UIColor.white.cgColor
            
            //Sets up names
            self.otherName.text = snapshotValue3["name"] as! String
            self.myNameLabel.text = myUser.name
            
            self.changeTitleLabels()
        }) { (error) in
            print(error.localizedDescription)
        }
        
    }
    
    
    
    //Sets up number of rows in tableview
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int{
        return self.msgList.count
    }
    
    
    
    
    //Keyboard closes when return is pressed
    func textFieldShouldReturn(textField: UITextField) -> Bool {
        textField.resignFirstResponder()
        
        return true
    }
    
    
    
    
    //Sets up each cell
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell{
        
        let cellIdentifier = "commentCell"
        let cell = tableView.dequeueReusableCell(withIdentifier: cellIdentifier) as! CommentTableViewCell
        
        cell.setUpMsg(imageLink: msgList[indexPath.row].imgLink, text: msgList[indexPath.row].text)
        
        return cell
    }
    
    
    
    //Sends message instantly
    @IBAction func sendMessage(_ sender: Any) {
        
        var ref = FIRDatabase.database().reference()
        var newPost = ref.child("messagesList").child(messageInfo.key).child("messages").child("c\(msgList.count + 1)")
        
        var userType: String = ""
        if(isSeller){
            userType = "seller"
        }else{
            userType = "buyer"
        }
        
        var msg: String = messageField.text
        
        //Uploads message to database
        newPost.setValue(["senderPhoto": myUser.picStr, "msg": msg])
        
        //Clears messageField
        messageField.text = ""
        
    }
    
    
    
    //Called when user confirms deal
    @IBAction func confrimButton(_ sender: Any) {
        var ref = FIRDatabase.database().reference()
        var newPost = ref.child("messagesList").child(messageInfo.key)
        
        myConfirmButt.isEnabled = false
        
        //Saves true to proper variable in database
        if(isSeller){
            newPost.updateChildValues(["sellerConfirmed": true])
        }else{
            newPost.updateChildValues(["buyerConfirmed": true])
        }
        
        //Changes Confirmed button
        myConfirmButt.setTitle("Confirmed!", for: .normal)
        myConfirmButt.setTitleColor(UIColor.white, for: .normal)
        myConfirmButt.backgroundColor = UIColor.red
    }
    
    
    
    //If both confrim, sold() is called. This function adds the product key to users' "sold" and "bought" lists accordingly
    func sold(){
        print("Sold")
        self.priceLabel.text = "Sold!"
        
        
        var ref = FIRDatabase.database().reference()
        let snapshotValue = messageInfo.value as! [String: AnyObject]
        
        //Adds product key to seller's 'sold' list
        var newPost = ref.child("users").child(snapshotValue["sellerID"] as! String).child("sold").childByAutoId()
        newPost.setValue(["post": snapshotValue["postKey"] as! String])
        
        
        //Adds product key to buyer's 'bought' list
        newPost = ref.child("users").child(snapshotValue["buyerID"] as! String).child("bought").childByAutoId()
        newPost.setValue(["post": snapshotValue["postKey"] as! String])
        
        
        
    }
    
    
    
    
    
    //Changes labels to show who is buyer and who is seller
    func changeTitleLabels(){
        
        if(isSeller){
            myTitleLabel.text = "Seller"
            otherTitleLabel.text = "Buyer"
        }else{
            myTitleLabel.text = "Buyer"
            otherTitleLabel.text = "Seller"
            
        }
        
    }
    
    
    
    //Dismisses Keyboard
    func dismissKeyboard() {
        
        view.endEditing(true)
    }
    
    
    
    //View moves up when keyboard is shown
    func keyboardWillShow(sender: NSNotification) {
        self.view.frame.origin.y -= 256
    }
    
    
    
    //View moves down when keyboard is hiding
    func keyboardWillHide(sender: NSNotification) {
        self.view.frame.origin.y += 256
    }
    
    
    
    //Shows tab bar when view is disappearing
    override func viewWillDisappear(_ animated: Bool) {
        self.tabBarController?.tabBar.isHidden = false
    }
    
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
}



