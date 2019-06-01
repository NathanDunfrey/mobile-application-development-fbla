//
//  AboutVC.swift
//  Picket
//
//  Created by Yash Kakodkar on 5/10/17.
//  Copyright © 2017 Yash Kakodkar. All rights reserved.
//

import UIKit

class AboutVC: UIViewController {

    //go to picket website
    @IBAction func goToWebsite(sender: AnyObject) {
        let websiteAddress = NSURL(string: "http://picketfbla.weebly.com/")
        UIApplication.shared.openURL(websiteAddress! as URL)
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
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
