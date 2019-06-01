//
//  UserVC.swift
//  Picket
//
//  Created by Yash Kakodkar on 2/19/17.
//  Copyright © 2017 Yash Kakodkar. All rights reserved.
//

import UIKit
import Firebase
import FirebaseDatabase
import FirebaseAuth

class UserVC: UIViewController, UICollectionViewDelegate, UICollectionViewDataSource {
    
    //Outlets
    @IBOutlet weak var viewBackground: UIView!
    @IBOutlet weak var imageView: CustomImageView!
    @IBOutlet weak var editSelfButton: UIButton!
    @IBOutlet weak var nameLabel: UILabel!
    
    // Outlet to the UICollectionView which will contain cells for each item this user is selling
    @IBOutlet weak var collectionView: UICollectionView!
    
    // Array of Item objects that have been created and the respective
    var items = [Item]()
    var itemsToFetch = [String]()
    
    //Reference to Firebase
    var ref: FIRDatabaseReference!
    
    //Ref to item
    var selectedItem: Item?
    
    var loadedOnce = false
    var isCurrentUser = false
    
    //user id and name
    var userID = ""
    var name = ""
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        //UIView Background

        viewBackground.layer.shadowColor = UIColor.black.cgColor
        viewBackground.layer.shadowOffset = CGSize(width: 0, height: 2)
        viewBackground.layer.shadowOpacity = 0.2
        viewBackground.layer.shadowRadius = 2
        
        // initialize the reference to the database
        ref = FIRDatabase.database().reference()
        
        // gain UICollectionView delegate and data source methods
        collectionView.delegate = self
        collectionView.dataSource = self
        
        //customize the UICollectionView to have 10px padding and cells with dynamic widths so 2 cells are in each row. Background color is set to clear.
        let screenWidth = UIScreen.main.bounds.size.width
        let layout: UICollectionViewFlowLayout = UICollectionViewFlowLayout()
        collectionView!.contentInset = UIEdgeInsets(top: 10, left: 10, bottom: 10, right: 10)
        layout.itemSize = CGSize(width: (screenWidth - 30)/2, height: 200)
        collectionView!.collectionViewLayout = layout
        collectionView!.backgroundColor = UIColor.clear
    }
    
    override func viewDidAppear(_ animated: Bool) {
        if !loadedOnce {
            
            
            // get currentUser's ID
            if isCurrentUser {
                userID = (FIRAuth.auth()?.currentUser?.uid)!
                self.editSelfButton.isHidden = false
            }
            
            // get items sold by user
            getUserInfo { (bool) in
                
                self.getDataRefs(completionHandler: { (bool2) in
                    
                    for itemReference in self.itemsToFetch {
                        self.getDataForRef(node: itemReference)
                    }
                    self.collectionView.reloadData()
                    self.collectionView.alpha = 0
                    UIView.animate(withDuration: 1, animations: {
                        self.collectionView.alpha = 1
                    })
                })
            }
            loadedOnce = true
        }
    }
    
    func getDataRefs(completionHandler:@escaping (Bool) -> ()) {
        

        
        //iterate through Firebase nodes
        ref.child("users").child(userID).observeSingleEvent(of: .value, with: { (snapshot) in
            if snapshot.hasChild("items") {
                self.ref.child("users").child(self.userID).child("items").observeSingleEvent(of: .value, with: { (snapshot) in
                    self.items = []
                    self.itemsToFetch = []
                    if let json = snapshot.value as? [String : AnyObject] {
                        self.itemsToFetch = Array(json.keys)
                        
                    }
                    completionHandler(true)
                })
            }
            completionHandler(true)
        })
    }
    
    //Gather user item data
    func getDataForRef(node: String) {
        ref.child("items").child(node).observeSingleEvent(of: .value, with: { (snapshot) in
            if let dict = snapshot.value as? [String : AnyObject] {
            
                let currentBid = dict["bid"] as! String
                let condition = dict["condition"] as! String
                let description = dict["description"] as! String
                let imageArray = dict["images"] as! [String: String]
                let images = imageArray.values.reversed()
                let itemName = dict["name"] as! String
                let sellerID = dict["sellerID"] as! String
                let sellerName = dict["seller"] as! String
                let seller = User(sellerID: sellerID)
                seller.name = sellerName
                seller.getUserInfo()
                let i = Item(name: itemName, condition: condition, seller: seller, imageURLs: images, cost: Double(currentBid)!, description: description, firebaseKey: node)
                self.items.append(i)
            }
            self.collectionView.reloadData()
        })
        
    }
    
    
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return items.count
    }
    
    //customize each cell for each item
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "itemCell", for: indexPath as IndexPath) as! ItemCell
        cell.setUpCell(obj: items[indexPath.row])
        return cell
    }
    
    //transition to ItemVC when item is clicked
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        selectedItem = items[indexPath.row]
        performSegue(withIdentifier: "toItemDetailFromProfile", sender: self)
    }
    
    //white status bar
    override var preferredStatusBarStyle: UIStatusBarStyle {
        return .lightContent
    }
    
    //transition to ItemVC
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if (segue.identifier == "toItemDetailFromProfile") {
            let auction = segue.destination as! ItemVC
            auction.item = selectedItem
        }
    }
    
    
    //get info about this user
    func getUserInfo(completionHandler:@escaping (Bool) -> ()) {
        let ref = FIRDatabase.database().reference()
        ref.child("users").child(userID).observeSingleEvent(of: .value, with: { (snapshot) in
            if let userDict = snapshot.value as? [String : AnyObject] {
                let name = userDict["name"] as! String
                self.nameLabel.text = name
                let pictureURL = userDict["image"] as! String
                self.imageView.loadImageUsingUrlString(urlString: pictureURL)
                completionHandler(true)
            }
        })
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

