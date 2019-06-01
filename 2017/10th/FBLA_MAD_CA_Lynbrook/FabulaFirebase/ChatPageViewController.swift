//
//  ChatPageViewController.swift
//  FabulaFirebase
//
//  Created by Raghav Sreeram on 1/11/17.
//  Copyright © 2017 Raghav Sreeram. All rights reserved.
//

import UIKit
import Firebase

//Shows list of chat channels
class ChatPageViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {
    
    @IBOutlet weak var noChatsLabel: UILabel!
    @IBOutlet weak var chatListTable: UITableView!
    
    var messagesList: [FIRDataSnapshot] = []
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        //Sets back button text to "", so only shows custom image
        self.navigationItem.backBarButtonItem = UIBarButtonItem(title: "", style: UIBarButtonItemStyle.plain, target: nil, action: nil)
        
        //Sets up table View
        chatListTable.delegate = self
        chatListTable.dataSource = self
        
        
        var ref: FIRDatabaseReference!
        ref = FIRDatabase.database().reference()
        
        //Gets all messages that user is a part of
        ref.child("messagesList").observe(.childAdded, with: {
            (snapshot) in
            
            let snapshotValue = snapshot.value as! [String: AnyObject]
            
            //If current user id equals buyer or seller id, adds snapshot to messagesList array
            if(snapshotValue["buyerID"] as! String == FIRAuth.auth()?.currentUser?.uid || snapshotValue["sellerID"] as! String == FIRAuth.auth()?.currentUser?.uid){
                self.messagesList.append(snapshot)
                self.chatListTable.reloadData()
            }
            
            
        }, withCancel: nil)
        
    }
    
    //Sets number of rows in table view. If 0, shows "No Chats!"
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int{
        if(messagesList.count == 0){
            self.noChatsLabel.text = "No Chats!"
        }else{
            self.noChatsLabel.text = ""
        }
        return messagesList.count
    }
    
    func textFieldShouldReturn(textField: UITextField) -> Bool {
        textField.resignFirstResponder()
        
        return true
    }
    
    ///Sets up individual cells
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell{
        
        let cellIdentifier = "chatListCell"
        let cell = tableView.dequeueReusableCell(withIdentifier: cellIdentifier)! as! ChatTableViewCell
        
        let snapshotValue = messagesList[indexPath.row].value as! [String: AnyObject]
        cell.setUP(buyerID: snapshotValue["buyerID"] as! String, postKey: snapshotValue["postKey"] as! String)
        
        
        return cell
    }
    
    ///If cell selected, takes user to MessagesVC
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        
        let secondViewController = self.storyboard?.instantiateViewController(withIdentifier: "showMessages") as! MessagesVC
        secondViewController.messageInfo = messagesList[indexPath.row]
        self.navigationController?.pushViewController(secondViewController, animated: true)
        
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    
}
