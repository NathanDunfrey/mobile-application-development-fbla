//
//  ProfileViewController.swift
//  FabulaFirebase
//
//  Created by Raghav Sreeram on 1/11/17.
//  Copyright © 2017 Raghav Sreeram. All rights reserved.
//

import UIKit
import FirebaseAuth
import Firebase
import FirebaseDatabase

var userPosts: [postStruct] = []

//Shows profile of user
class ProfileViewController: UIViewController, UICollectionViewDelegate, UICollectionViewDataSource {
    
    @IBOutlet weak var nameLabel: UILabel!
    @IBOutlet weak var userImageView: CustomImageView!
    @IBOutlet weak var collectionView: UICollectionView!
    @IBOutlet weak var sellingNumLabel: UILabel!
    @IBOutlet weak var soldNumLabel: UILabel!
    @IBOutlet weak var boughtNumLabel: UILabel!
    
    @IBOutlet weak var noPostsLabel: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        
        var ref: FIRDatabaseReference!
        ref = FIRDatabase.database().reference()
        let userID = FIRAuth.auth()?.currentUser?.uid
        
        //Gets user data, number of products sold, number of products bought
        ref.child("users").child(userID!).observeSingleEvent(of: .value, with: { (snapshot) in
            // Get user value
            
            let value = snapshot.value as? NSDictionary
            var bought: NSDictionary? = [:]
            bought = value?["bought"] as? NSDictionary
            var sold: NSDictionary? = [:]
            sold = value?["sold"] as? NSDictionary
            
            //Sets how many products the user sold
            if(sold == nil){
                self.soldNumLabel.text = "0"
            }else{
                
                self.soldNumLabel.text = "\(sold!.count)"
            }
            //Sets how many products the user bought
            if(bought == nil){
                self.boughtNumLabel.text = "0"
            }else{
                self.boughtNumLabel.text = "\(bought!.count)"
            }
            
        }) { (error) in
            print(error.localizedDescription)
        }
        
        
        //Sets User Profile Pic to circular image view
        userImageView.layer.cornerRadius = userImageView.frame.height/2
        userImageView.clipsToBounds = true
        self.userImageView.layer.borderWidth = 2
        self.userImageView.layer.borderColor = UIColor.white.cgColor
        
        //Sets users name
        nameLabel.text = myUser.name
        
        //Sets back button text to "", so only shows custom image
        self.navigationItem.backBarButtonItem = UIBarButtonItem(title: "", style: UIBarButtonItemStyle.plain, target: nil, action: nil)
        
        //Sets Navigation title
        self.navigationItem.title = "Profile"
        
        //Assigns datasource and delegate of collectionView to self
        collectionView.dataSource = self
        collectionView.delegate = self
    }

    //Sets number of sections to 1
    func numberOfSections(in collectionView: UICollectionView) -> Int {
        // #warning Incomplete implementation, return the number of sections
        return 1
    }
    
    
    //Sets number of items in collection view. If 0, shows "No Posts!"
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        // #warning Incomplete implementation, return the number of items
        if(userPosts.count == 0){
            self.noPostsLabel.text = "No posts!"
        }else{
            self.noPostsLabel.text = ""
        }
        return userPosts.count
    }
    
    
    //Sets up each cell
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
       
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "Cell", for: indexPath) as! FeedCollectionViewCell
        cell.setupCell(post: userPosts[indexPath.row])

        return cell
        
    }
    
    
    //If post selected, shows post in ShowPostViewController
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        
        let secondViewController = self.storyboard?.instantiateViewController(withIdentifier: "showPost") as! ShowPostViewController
        secondViewController.postToShow = userPosts[indexPath.row]
        
        self.navigationController?.pushViewController(secondViewController, animated: true)
    }
    
    
    
    //Logs out user
    @IBAction func logoutButton(_ sender: Any) {
        
        let firebaseAuth = FIRAuth.auth()
        do {
            try firebaseAuth?.signOut()
            
            let appDelegate : AppDelegate = UIApplication.shared.delegate as! AppDelegate
            appDelegate.takeBackToStart()
            
        } catch let signOutError as NSError {
            print ("Error signing out: %@", signOutError)
        }
        
    }
    
    
    //Sets Up View
    override func viewWillAppear(_ animated: Bool) {
        
        //Sets how many products user is currently selling
        self.sellingNumLabel.text = "\(userPosts.count)"
        self.noPostsLabel.text = ""
        self.collectionView!.reloadData()
        
        userImageView.loadImageUsingUrlString(urlString: myUser.picStr)

    }
    
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    

}
