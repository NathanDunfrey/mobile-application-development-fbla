
//  MainViewController.swift
//  FabulaFirebase
//
//  Created by Raghav Sreeram on 1/11/17.
//  Copyright © 2017 Raghav Sreeram. All rights reserved.
//

import UIKit
import Firebase
import FirebaseDatabase
import FirebaseAuth
import FirebaseStorage

//Keeps track of current user
var myUser: userStruct!

//Shows news feed with all products currently available
class MainViewController: UIViewController, UICollectionViewDelegate, UICollectionViewDataSource {
    
    let user = FIRAuth.auth()?.currentUser
    var listOfPosts: [postStruct] = []
    @IBOutlet weak var feedCollectionView: UICollectionView!
    @IBOutlet weak var testImageView: CustomImageView!
    
    var activityIndic: UIActivityIndicatorView = UIActivityIndicatorView()
    
    var refreshControl: UIRefreshControl!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        //Sets up activity Indicator
        activityIndic.center = self.view.center
        activityIndic.hidesWhenStopped = true
        activityIndic.activityIndicatorViewStyle = UIActivityIndicatorViewStyle.gray
        view.addSubview(activityIndic)
        
        //Custom Navigation Bar Image
        var titleView : UIImageView
        titleView = UIImageView(frame:CGRect(x: 0, y: 0, width: 50, height: 20))
        titleView.contentMode = .scaleAspectFit
        titleView.image = UIImage(named: "fabNav.png")
        self.navigationItem.titleView = titleView
        
        
        //Sets back button text to "" so it shows only custom Image
        self.navigationItem.backBarButtonItem = UIBarButtonItem(title: "", style: UIBarButtonItemStyle.plain, target: nil, action: nil)
    
        feedCollectionView.dataSource = self
        feedCollectionView.delegate = self
        
        //Sets up refresh controller. Allows User to pull down to refresh
        refreshControl = UIRefreshControl()
        refreshControl.attributedTitle = NSAttributedString(string: "Pull to refresh")
        refreshControl.addTarget(self, action: #selector(refresh), for: UIControlEvents.valueChanged)
        feedCollectionView.addSubview(refreshControl)
        
        //Refresh called to get initial data
        refresh()
        
        let user = FIRAuth.auth()?.currentUser
        var ref: FIRDatabaseReference!
        ref = FIRDatabase.database().reference()
        let userID = FIRAuth.auth()?.currentUser?.uid

        //Creates signleEvent Ref to set up myUser
        ref.child("users").child(userID!).observeSingleEvent(of: .value, with: { (snapshot) in
           
            let value = snapshot.value as? NSDictionary
            let name = value?["name"] as! String
            let email = value?["email"] as! String
            let imageLink = value?["userPhoto"] as! String
            
            myUser = userStruct(n: name, pic: imageLink, e: email)
            
        }) { (error) in
            print(error.localizedDescription)
        }
        
        //
        ref.child("users").child(userID!).observe(.childChanged, with: {(snapshot) in
            
            let imageLink = snapshot.value as? String
            if(imageLink != nil){
                myUser = userStruct(n: myUser.name, pic: imageLink!, e: myUser.email)
            }
            

        }, withCancel: nil)
    }
    
    
    
    
    //Refeshes the News feed. Gets all Posts in database
    func refresh(){
        
        activityIndic.startAnimating()
        UIApplication.shared.beginIgnoringInteractionEvents()
        
        self.listOfPosts = []
        userPosts = []
        var ref = FIRDatabase.database().reference()
        
        
        ref.child("posts").queryOrderedByKey().observe(.childAdded, with: {(snapshot) in
            
            var post = postStruct(snapshot: snapshot)
            
            //If Product is not sold, Shows it in newsfeed
            if(post.sold == false){
                
                let url2 = NSURL(string: post.pic1)  //postPhoto URL
                let data = NSData(contentsOf: url2! as URL) // this URL convert into Data
                if data != nil {  //Some time Data value will be nil so we need to validate such things
                    post.img = UIImage(data: data! as Data)!
                }
                
                self.listOfPosts.append(post)
                
                //If post is the users, Adds to userPosts List which is used in Profile Page
                if(post.user == FIRAuth.auth()!.currentUser!.uid){
                    userPosts.append(post)
   
                }
            }

            
            DispatchQueue.main.async(){
                self.refreshControl?.endRefreshing()
                self.feedCollectionView.reloadData()
            }

            
        }, withCancel: nil)
        
        
        activityIndic.stopAnimating()
        UIApplication.shared.endIgnoringInteractionEvents()
        
    }

    
    //If post selected, shows the post in ShowPostViewController
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        
        let secondViewController = self.storyboard?.instantiateViewController(withIdentifier: "showPost") as! ShowPostViewController
        secondViewController.postToShow = listOfPosts[indexPath.row]
        
        self.navigationController?.pushViewController(secondViewController, animated: true)
    }
    
    
    
    func numberOfSections(in collectionView: UICollectionView) -> Int {
        return 1
    }
    
    
    
    //Sets number of cells in collectionview
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return listOfPosts.count
    }
    
    
    
    //Sets up individual Cell
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "Cell", for: indexPath) as! FeedCollectionViewCell
        cell.setupCell(post: listOfPosts[indexPath.row])
        
        return cell
    }
    
    

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    
}




