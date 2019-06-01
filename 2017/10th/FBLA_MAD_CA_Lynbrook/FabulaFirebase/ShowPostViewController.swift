//
//  ShowPostViewController.swift
//  FabulaFirebase
//
//  Created by Raghav Sreeram on 1/16/17.
//  Copyright © 2017 Raghav Sreeram. All rights reserved.
//

import UIKit
import Firebase


//Shows more information about product and allows users to comment
class ShowPostViewController: UIViewController, UITableViewDataSource, UITableViewDelegate {
    
    var postToShow: postStruct!
    @IBOutlet weak var productName: UILabel!
    @IBOutlet weak var usersName: UILabel!
    @IBOutlet weak var userPic: CustomImageView!
    @IBOutlet weak var productPic: CustomImageView!
    @IBOutlet weak var priceL: UILabel!
    @IBOutlet weak var conditionL: UILabel!
    @IBOutlet weak var descL: UITextView!
    @IBOutlet weak var newComment: UITextView!
    
    @IBOutlet weak var fundButt: UIButton!
    var commentList: [newCommentStruct] = []
    
    var activityIndic: UIActivityIndicatorView = UIActivityIndicatorView()
    @IBOutlet weak var commentsTable: UITableView!
    override func viewDidLoad() {
        super.viewDidLoad()
        
        //Sets up activity indicator
        activityIndic.center = self.view.center
        activityIndic.hidesWhenStopped = true
        activityIndic.activityIndicatorViewStyle = UIActivityIndicatorViewStyle.gray
        view.addSubview(activityIndic)
        
        
        //Sets up Tap gesture recognizer
        let tap: UITapGestureRecognizer = UITapGestureRecognizer(target: self, action: "dismissKeyboard")
        view.addGestureRecognizer(tap)
        
        
        
        //Adds observer to move view up and down when keyboard opens
        NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillShow), name:NSNotification.Name.UIKeyboardWillShow, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillHide), name:NSNotification.Name.UIKeyboardWillHide, object: nil)
        
        
        
        //Sets up Navigation bar
        self.navigationItem.backBarButtonItem = UIBarButtonItem(title: "", style: UIBarButtonItemStyle.plain, target: nil, action: nil)
        UINavigationBar.appearance().backgroundColor = UIColor.white
        
        
        //Sets up all the fields
        self.productName.text = postToShow.name
        self.productPic.image = postToShow.img
        self.conditionL.text = "\(postToShow.condition)/5"
        self.descL.text = postToShow.desc
        self.priceL.text = "$\(postToShow.price)"
        self.fundButt.setTitle(postToShow.fundName, for: UIControlState.normal)
        
        
        
        var ref: FIRDatabaseReference!
        ref = FIRDatabase.database().reference()
        
        //Loads image of seller and his name
        ref.child("users").child(postToShow.user).observeSingleEvent(of: .value, with: { (snapshot) in
            
            let value = snapshot.value as! [String: AnyObject]
            let url = value["userPhoto"] as! String //postPhoto URL
            
            self.userPic.loadImageUsingUrlString(urlString: url)
            self.usersName.text = value["name"] as! String
            
            
        }) { (error) in
            print(error.localizedDescription)
        }
        
        
        //sets up commentsTable
        commentsTable.delegate = self
        commentsTable.dataSource = self
    }
    
    //Updates comments
    func updateComments(){
        
        commentList = []
        
        //Starts animating activity indicator
        activityIndic.startAnimating()
        UIApplication.shared.beginIgnoringInteractionEvents()
        
        
        
        let user = FIRAuth.auth()?.currentUser
        var ref: FIRDatabaseReference!
        ref = FIRDatabase.database().reference()
        let userID = FIRAuth.auth()?.currentUser?.uid
      
        //Loads all comments in post
        ref.child("posts").child(postToShow.keyy).child("comments").queryOrderedByKey().observe(.childAdded, with: {(snapshot) in
            
            
            var value = (snapshot.value as! NSDictionary)
            var text = "\(value["text"]!)"
            var userId = value["userID"] as? String ?? ""
            
            
            //Adds comment in commentList
            self.commentList.append(newCommentStruct(textI: text, userIDI: userId))
            
            
            
            //Switches to main thread to reload data of table view
            DispatchQueue.main.async(){
                self.commentsTable.reloadData()
            }
            
            
            
        }, withCancel: nil)
        
        
        
        //Stops animating activity indicator
        activityIndic.stopAnimating()
        UIApplication.shared.endIgnoringInteractionEvents()
        
    }
    
    //Takes user to Fundraiser page for more information
    @IBAction func goToFundPage(_ sender: Any) {
        
        
        let secondViewController = self.storyboard?.instantiateViewController(withIdentifier: "showFund") as! FundraiserVC
        secondViewController.fundNamee = postToShow.fundName as! String
        
        self.navigationController?.pushViewController(secondViewController, animated: true)
        
        
        
    }
    
    //Hides tab bar before appearing and updates comments
    override func viewWillAppear(_ animated: Bool) {
        
        self.tabBarController?.tabBar.isHidden = true
        
        updateComments()
    }
    
    
    
    //Shows tab bar before disappearing
    override func viewWillDisappear(_ animated: Bool) {
        
        self.tabBarController?.tabBar.isHidden = false
        
    }
    
    
    
    //Sets number of rows in table view
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int{
        
        return self.commentList.count
        
    }
    
    
    
    //Hides keyboard if return is pressed
    func textFieldShouldReturn(textField: UITextField) -> Bool {
        textField.resignFirstResponder()
        return true
    }
    
    
    
    //Sets up cell at index
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell{
        
        let cellIdentifier = "commentCell"
        let cell = tableView.dequeueReusableCell(withIdentifier: cellIdentifier) as! CommentTableViewCell

        cell.setUp(s: commentList[indexPath.row].userID, t: commentList[indexPath.row].text)
        return cell
    }
    
    
    //Posts the new comment
    @IBAction func postButt(_ sender: Any) {
        
        var ref = FIRDatabase.database().reference()
        var newPost = ref.child("posts").child(postToShow.keyy).child("comments").child("c\(commentList.count + 1)")
        
        var userId: String = (FIRAuth.auth()?.currentUser?.uid)!
        var comment: String = newComment.text!
        
        newPost.setValue(["text": comment, "userID": userId])
        
        //Clears comment field
        self.newComment.text = ""

    }
    
    
    
    
    //Starts a new chat channel with buyer and seller
    @IBAction func messageButt(_ sender: Any) {
        
        var ref = FIRDatabase.database().reference()
        var newPost = ref.child("messagesList").childByAutoId()
        
        newPost.setValue(["buyerID": FIRAuth.auth()?.currentUser?.uid, "sellerID": postToShow.user, "postKey": postToShow.keyy, "sellerConfirmed": false, "buyerConfirmed": false])
        
        //Takes user to chat page
        tabBarController?.selectedIndex = 1
        
        
    }
    
    //Dismisses the keyboard
    func dismissKeyboard() {
        view.endEditing(true)
    }
    
    
    //Moves view up if keyboard is shown
    func keyboardWillShow(sender: NSNotification) {
        
        self.view.frame.origin.y -= 256
        
    }
    
    //Moves view back down when keyboard is hiding
    func keyboardWillHide(sender: NSNotification) {
        
        self.view.frame.origin.y += 256
        
    }
    
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    

}



