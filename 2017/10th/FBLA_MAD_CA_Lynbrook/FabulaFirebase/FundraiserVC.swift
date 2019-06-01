//
//  FundraiserVC.swift
//  FabulaFirebase
//
//  Created by Raghav Sreeram on 2/16/17.
//  Copyright © 2017 Raghav Sreeram. All rights reserved.
//

import UIKit
import Firebase


//Shows information about fundraiser
class FundraiserVC: UIViewController {
    
    @IBOutlet weak var fundName: UILabel!
    @IBOutlet weak var fundDescription: UITextView!
    
    @IBOutlet weak var fundLabel: UILabel!
    @IBOutlet weak var fundImage: CustomImageView!
    
    var fundNamee:String!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        
        var ref: FIRDatabaseReference!
        
        ref = FIRDatabase.database().reference()
        
        //Gets data of fundraiser
        ref.child("fundList").child(fundNamee).observeSingleEvent(of: .value, with: { (snapshot) in
            
            let value = snapshot.value as! [String: AnyObject]
            let url =  value["pic"] as! String
            
            //Sets up the labels and images
            self.fundImage.loadImageUsingUrlString(urlString: url)
            self.fundDescription.text = value["description"] as! String
            self.fundName.text = self.fundNamee
            self.fundLabel.text = "Fundraiser"
            
        }) { (error) in
            print(error.localizedDescription)
        }
        
        
        
        //Sets up navigation bar
        self.navigationItem.backBarButtonItem = UIBarButtonItem(title: "", style: UIBarButtonItemStyle.plain, target: nil, action: nil)
        UINavigationBar.appearance().backgroundColor = UIColor.white
    }
    
    
    //Hides image When view is disappearing
    override func viewWillDisappear(_ animated: Bool) {
        self.fundImage.image = nil
        
    }
    
    //Hides tab bar when view is appearing
    override func viewWillAppear(_ animated: Bool) {
        self.tabBarController?.tabBar.isHidden = true
    }
    
    
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    
    
    
}
