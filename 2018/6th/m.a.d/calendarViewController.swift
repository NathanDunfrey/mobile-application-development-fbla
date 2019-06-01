//
//  calendarViewController.swift
//  m.a.d
//
//  Created by Devansh Yerpude on 5/1/18.
//  Copyright © 2018 Devansh Yerpude. All rights reserved.
//
// import firebase, and event kit for possible calendar usage
import Firebase
import FirebaseStorage
import UIKit
import FirebaseDatabase
import EventKit
import EventKitUI

class calendarViewController: UIViewController {
    
    //variable to determine which event to use, default event1
var event = "event1"
  
    override func viewDidLoad() {
        super.viewDidLoad()
        getValues()
        
        imageStuff.layer.borderColor = UIColor.white.cgColor
        imageStuff.layer.borderWidth = 2
        
        
    }
    
    override func didReceiveMemoryWarning() {
    super.didReceiveMemoryWarning()
    }
     var ref: DatabaseReference!
    
    //link to storyboard
    @IBOutlet var imageStuff: UIImageView!
    @IBOutlet var titleText: UILabel!
    @IBOutlet var segment: UISegmentedControl!
    @IBOutlet var dateText: UILabel!
    @IBOutlet var locationText: UILabel!
    @IBOutlet var descriptionText: UILabel!
    
    
    var year = 6
    var day = 6
    var month = 1
    var someDate = Date()
    var hours = 1
    
    func date(){
    var dateComponents = DateComponents()
    dateComponents.year = year
    dateComponents.month = month
    dateComponents.day = day
        dateComponents.hour = hours
    // Create date from components
    let userCalendar = Calendar.current // user calendar
    let someDateTime = userCalendar.date(from: dateComponents)
        someDate = someDateTime!
 
    }
    
    
  
    
    //changes the event displayed and updates valued
    
    
    @IBAction func segmenter(_ sender: UISegmentedControl) {
        switch segment.selectedSegmentIndex {
        case 0:
            event = "awesome"
            getValues()
            year = 2018
            day = 8
            month = 8
            hours = 4
            date()
            
            
        case 1:
           event = "amazing"
            getValues()
            year = 2018
            day = 7
            month = 17
           hours = 1
            date()
        default:
           getValues()
            break;
        }
    }
        
    
// gets info about both events
func getValues(){
    var imageRef:StorageReference{
        return Storage.storage().reference()
    }
    let ref = Database.database().reference()
    if(event == "amazing"){
        
        var downloadRef = imageRef.child("event1.jpg")
        var downloadTask = downloadRef.getData(maxSize: 1024*1024*12) { (data, error) in
            if let data = data {
                let image = UIImage(data:data)
                self.imageStuff.image = image
            }
        }
    }
    else{
       
        var downloadRef = imageRef.child("event2.jpg")
        var downloadTask = downloadRef.getData(maxSize: 1024*1024*12) { (data, error) in
            if let data = data {
                let image = UIImage(data:data)
                self.imageStuff.image = image
            }
        }
    }
    //firebase retrieval
    
    ref.child("bugs").child(event).child("details").observeSingleEvent(of: .value) { (snapshot) in
        let m = snapshot.value as?String
        
   self.descriptionText.text = m
        
    }
    
    ref.child("bugs").child(event).child("title").observeSingleEvent(of: .value) { (snapshot) in
        let m = snapshot.value as?String
        
       self.titleText.text = m
    }
    ref.child("bugs").child(event).child("location").observeSingleEvent(of: .value) { (snapshot) in
        let m = snapshot.value as?String
        
        self.locationText.text = m
        
    }
    
    ref.child("bugs").child(event).child("date").observeSingleEvent(of: .value) { (snapshot) in
        let m = snapshot.value as?String
        
        self.dateText.text = m
    }
    
   
    
        
    
    }
    
    @IBAction func addEvent(_ sender: UIButton) {
        
        
        
        
        open(scheme: "calshow://")
    }
    
    //sets up transition to the calander app
    func open(scheme: String) {
        if let url = URL(string: scheme) {
            if #available(iOS 10, *) {
                UIApplication.shared.open(url, options: [:],
                                          completionHandler: {
                                            (success) in
                                            print("Open \(scheme): \(success)")
                })
            } else {
                let success = UIApplication.shared.openURL(url)
                print("Open \(scheme): \(success)")
            }
        }
    }
}
    
  



