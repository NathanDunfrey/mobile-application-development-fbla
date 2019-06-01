//
//  HomeVC.swift
//  Picket
//
//  Created by Yash Kakodkar on 2/21/17.
//  Copyright © 2017 Yash Kakodkar. All rights reserved.
//

import UIKit
import MapKit
import Firebase
import FirebaseDatabase
import FirebaseStorage
import SwiftMessages
import Social
import FirebaseAuth

class HomeVC: UIViewController, MKMapViewDelegate {
    
    // outlets to user interface items in the view controller
    @IBOutlet weak var mapView: MKMapView!
    @IBOutlet weak var aboutButton: UIButton!
    @IBOutlet weak var mapBackground: UIView!
    
    
    // show Taylor High School on the map
    var school = CustomPointAnnotation()
    var ref: FIRDatabaseReference!
    var loggedIn = false
    

    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
        mapBackground.layer.borderColor = UIColor(red:0.88, green:0.88, blue:0.88, alpha: 1.0).cgColor
        
        aboutButton.layer.borderColor = UIColor(red:0.38, green:0.44, blue:0.99, alpha:1.0).cgColor

        // create a reference to Firebase
        ref = FIRDatabase.database().reference()
        
        
    }
    
    
    // use the Social module to share text on Facebook and Twitter
    @IBAction func shareCampaign(_ sender: Any) {
        let alert = UIAlertController(title: "Share our campaign!", message: "Share on social media to increase awareness about your chapter's fundraiser!", preferredStyle: UIAlertControllerStyle.alert)
        alert.addAction(UIAlertAction(title: "Cancel", style: UIAlertActionStyle.cancel, handler: nil))
        alert.addAction(UIAlertAction(title: "Facebook", style: UIAlertActionStyle.default, handler: { action in
            self.shareFacebook()
        }))
        alert.addAction(UIAlertAction(title: "Twitter", style: UIAlertActionStyle.default, handler: {
            action in
            self.shareTwitter()
        }))
        
        self.present(alert, animated: true, completion: nil)
    }
    
    // share Picket on Facebook
    func shareFacebook() {
        UIPasteboard.general.string = "My FBLA chapter needs help to fund our trip to nationals! Download Picket to see items we are currently selling to raise money!"
        if SLComposeViewController.isAvailable(forServiceType: SLServiceTypeFacebook){
            let facebookSheet:SLComposeViewController = SLComposeViewController(forServiceType: SLServiceTypeFacebook)
            facebookSheet.add(URL(string: "http://jethsfbla.weebly.com/"))
            self.present(facebookSheet, animated: true, completion: nil)
        } else {
            let alert = UIAlertController(title: "Accounts", message: "Please login to a Facebook account to share.", preferredStyle: UIAlertControllerStyle.alert)
            alert.addAction(UIAlertAction(title: "OK", style: UIAlertActionStyle.default, handler: nil))
            self.present(alert, animated: true, completion: nil)
        }
    }
    
    // share Picket on Twitter
    func shareTwitter() {
        if SLComposeViewController.isAvailable(forServiceType: SLServiceTypeTwitter){
            let twitterSheet:SLComposeViewController = SLComposeViewController(forServiceType: SLServiceTypeTwitter)
            twitterSheet.setInitialText("My FBLA is raising 💰! Download Picket to see what we're selling to fund our ✈️ to nationals!")
            twitterSheet.add(#imageLiteral(resourceName: "chs"))
            twitterSheet.add(URL(string: "http://jethsfbla.weebly.com/"))
            self.present(twitterSheet, animated: true, completion: nil)
        } else {
            let alert = UIAlertController(title: "Accounts", message: "Please login to a Twitter account to share.", preferredStyle: UIAlertControllerStyle.alert)
            alert.addAction(UIAlertAction(title: "OK", style: UIAlertActionStyle.default, handler: nil))
            self.present(alert, animated: true, completion: nil)
        }
    }
    
    override func viewDidAppear(_ animated: Bool) {
        if loggedIn {
            loggedIn = false
            let view = MessageView.viewFromNib(layout: .CardView)
            view.button?.removeFromSuperview()
            // Theme message elements with the success style.
            view.configureTheme(.success)
            // Add a drop shadow.
            view.configureDropShadow()
            // Set message title, body, and icon. Here, we're overriding the default warning
            // image with an emoji character.
            view.configureContent(title: "Logged In", body: "Successfully signed in as \(FIRAuth.auth()!.currentUser!.email!)")
            
            // Show the message.
            SwiftMessages.show(view: view)
        }
        
        // show Taylor High School on the map and zoom onto it
        self.mapView.delegate = self
        self.school.coordinate = CLLocationCoordinate2DMake(29.776860, -95.730888)
        self.school.imageName = "dusty.png"
        self.school.title = "James E. Taylor High School"
        self.school.subtitle = "20700 Kingsland Blvd, Katy, TX 77450"
        self.mapView.addAnnotation(self.school)
        let region = MKCoordinateRegion(center: CLLocationCoordinate2D(latitude: self.school.coordinate.latitude, longitude: self.school.coordinate.longitude), span: MKCoordinateSpanMake(0.075, 0.075))
        self.mapView.setRegion(region, animated: true)
        self.mapView.selectAnnotation(self.school, animated: true)
        
        
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    // customize the map pin to show our school's mascot, Mustang
    func mapView(_ mapView: MKMapView, viewFor annotation: MKAnnotation) -> MKAnnotationView? {
        if !(annotation is CustomPointAnnotation) {
            return nil
        }
        
        let reuseId = "Location"
        
        var anView = mapView.dequeueReusableAnnotationView(withIdentifier: reuseId)
        if anView == nil {
            anView = MKAnnotationView(annotation: annotation, reuseIdentifier: reuseId)
            anView!.canShowCallout = true
        }
        else {
            anView!.annotation = annotation
        }
        let cpa = annotation as! CustomPointAnnotation
        anView!.image = UIImage(named: cpa.imageName)
        
        return anView
    }
    
    
    //get directions to FBLA Chapter in Apple Maps
    @IBAction func goToTaylorHigh(_ sender: AnyObject) {
        let coordinate = CLLocationCoordinate2DMake(school.coordinate.latitude, school.coordinate.longitude)
        let mapItem = MKMapItem(placemark: MKPlacemark(coordinate: coordinate, addressDictionary:nil))
        mapItem.name = "James E. Taylor High School"
        mapItem.openInMaps(launchOptions: [MKLaunchOptionsDirectionsModeKey : MKLaunchOptionsDirectionsModeDriving])
    }
    
    
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "toMyProfile" {
            let vc = segue.destination as! UserVC
            vc.isCurrentUser = true
        }
    }
    
}

class CustomPointAnnotation: MKPointAnnotation {
    var imageName: String!
}
