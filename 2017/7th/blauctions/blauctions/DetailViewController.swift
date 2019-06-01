//
//  DetailViewController.swift
//  BLAuctions
//
// The primary function of this class is to control the detail view controller
//
//  Created by Drew Patel on 12/11/16.
//  Copyright © 2016 DrafeSu. All rights reserved.
//
import BraintreeDropIn
import Braintree
import UIKit
import FirebaseStorage
import CoreLocation
import MessageUI

class DetailViewController: UIViewController,MFMessageComposeViewControllerDelegate {
    //create references of all the visual elements
    @IBOutlet var descriptionLabel: UILabel!
    @IBOutlet var locationLabel: UILabel!
    @IBOutlet var priceLabel: UILabel!
    @IBOutlet var shippingLabel: UILabel!
    @IBOutlet var titleLabel: UILabel!
    @IBOutlet var conditionLabel: UILabel!
    @IBOutlet var thumbnailBox: UIImageView!

    //create all the global variables and don't assign them
    //they will be set by the master view controller
    var itemTitle: String!
    var itemThumbnail: String!
    var itemDescription: String!
    var itemPrice: Float!
    var itemCondition: String!
    var itemLocation: String!
    var itemShippingCost: Float!
    var itemPhoneNumber: String!
    
    //this function is called by the viewdidload function
    //this function loads all the visual elements with the variables from above
    func configureView() {

        descriptionLabel.text = itemDescription
        titleLabel.text = itemTitle
        conditionLabel.text = itemCondition
        //the \(...) is the variable inline string that Swift uses
        shippingLabel.text = "Shipping: $\(itemShippingCost!)"
        priceLabel.text = "$\(itemPrice!)"
        
        //create a geocoder which will take the zipcode and turn it into a city and state for visual purposes
        let geocoder = CLGeocoder()
        geocoder.geocodeAddressString(itemLocation) {
            (placemarks, error) -> Void in
            // Placemarks is an optional array of CLPlacemarks, first item in array is best guess of Address
            if let placemark = placemarks?[0] {
                
                self.locationLabel.text = "Location: \(placemark.locality!), \(placemark.administrativeArea!)"
           
            }
            
        }
        
        //reference firebase storage and obtain the image
        let storage = FIRStorage.storage()
        storage.reference(forURL: itemThumbnail).data(withMaxSize: 25 * 1024 * 1024, completion: { (data, error) -> Void in
            let image = UIImage(data: data!)
            //set the image inside the UIImageView
            self.thumbnailBox.image = image
        })
        
        
        
    }

    //when view loads, run the configureView function to load the visual elements
    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.configureView()
    }

    //if memory is being overutilized this will be called, its a default class in each viewcontroller
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    //when the message button is pressed, call the sendSMSText function with parameter of phonenumber
    @IBAction func sendMessage(_ sender: Any) {
        sendSMSText(phoneNumber: itemPhoneNumber)
    }
    
    //creates the view controller for the text message and shows it on the screen
    func sendSMSText(phoneNumber: String) {
            let controller = MFMessageComposeViewController()
            controller.body = ""
            controller.recipients = [phoneNumber]
            controller.messageComposeDelegate = self
            self.present(controller, animated: true, completion: nil)
    }
    
    //Handle when the textmessage has been sent, close the text screen
    func messageComposeViewController(_ controller: MFMessageComposeViewController, didFinishWith result: MessageComposeResult) {
        //... handle sms screen actions
        self.dismiss(animated: true, completion: nil)
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        self.navigationController?.isNavigationBarHidden = false
    }
    
    //This function just creates the payment instance with the BrainTree payment client token.
    @IBAction func showPayment(_ sender: Any) {
        let clientToken = "eyJ2ZXJzaW9uIjoyLCJhdXRob3JpemF0aW9uRmluZ2VycHJpbnQiOiI4N2NlZjQ5MDI0OWQyMzAwMWExYjk0YzNhNzRhNWQ1OGFkZDc2YWNlZjk5MTYzNjE5MGFiMzY2MDAwYTg4ZTkyfGNyZWF0ZWRfYXQ9MjAxNy0wNC0wMlQyMDozNDoxNi4yMzIxNzQ4NDMrMDAwMFx1MDAyNm1lcmNoYW50X2lkPTM0OHBrOWNnZjNiZ3l3MmJcdTAwMjZwdWJsaWNfa2V5PTJuMjQ3ZHY4OWJxOXZtcHIiLCJjb25maWdVcmwiOiJodHRwczovL2FwaS5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tOjQ0My9tZXJjaGFudHMvMzQ4cGs5Y2dmM2JneXcyYi9jbGllbnRfYXBpL3YxL2NvbmZpZ3VyYXRpb24iLCJjaGFsbGVuZ2VzIjpbXSwiZW52aXJvbm1lbnQiOiJzYW5kYm94IiwiY2xpZW50QXBpVXJsIjoiaHR0cHM6Ly9hcGkuc2FuZGJveC5icmFpbnRyZWVnYXRld2F5LmNvbTo0NDMvbWVyY2hhbnRzLzM0OHBrOWNnZjNiZ3l3MmIvY2xpZW50X2FwaSIsImFzc2V0c1VybCI6Imh0dHBzOi8vYXNzZXRzLmJyYWludHJlZWdhdGV3YXkuY29tIiwiYXV0aFVybCI6Imh0dHBzOi8vYXV0aC52ZW5tby5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tIiwiYW5hbHl0aWNzIjp7InVybCI6Imh0dHBzOi8vY2xpZW50LWFuYWx5dGljcy5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tLzM0OHBrOWNnZjNiZ3l3MmIifSwidGhyZWVEU2VjdXJlRW5hYmxlZCI6dHJ1ZSwicGF5cGFsRW5hYmxlZCI6dHJ1ZSwicGF5cGFsIjp7ImRpc3BsYXlOYW1lIjoiQWNtZSBXaWRnZXRzLCBMdGQuIChTYW5kYm94KSIsImNsaWVudElkIjpudWxsLCJwcml2YWN5VXJsIjoiaHR0cDovL2V4YW1wbGUuY29tL3BwIiwidXNlckFncmVlbWVudFVybCI6Imh0dHA6Ly9leGFtcGxlLmNvbS90b3MiLCJiYXNlVXJsIjoiaHR0cHM6Ly9hc3NldHMuYnJhaW50cmVlZ2F0ZXdheS5jb20iLCJhc3NldHNVcmwiOiJodHRwczovL2NoZWNrb3V0LnBheXBhbC5jb20iLCJkaXJlY3RCYXNlVXJsIjpudWxsLCJhbGxvd0h0dHAiOnRydWUsImVudmlyb25tZW50Tm9OZXR3b3JrIjp0cnVlLCJlbnZpcm9ubWVudCI6Im9mZmxpbmUiLCJ1bnZldHRlZE1lcmNoYW50IjpmYWxzZSwiYnJhaW50cmVlQ2xpZW50SWQiOiJtYXN0ZXJjbGllbnQzIiwiYmlsbGluZ0FncmVlbWVudHNFbmFibGVkIjp0cnVlLCJtZXJjaGFudEFjY291bnRJZCI6ImFjbWV3aWRnZXRzbHRkc2FuZGJveCIsImN1cnJlbmN5SXNvQ29kZSI6IlVTRCJ9LCJjb2luYmFzZUVuYWJsZWQiOmZhbHNlLCJtZXJjaGFudElkIjoiMzQ4cGs5Y2dmM2JneXcyYiIsInZlbm1vIjoib2ZmIn0="
        showDropIn(clientTokenOrTokenizationKey: clientToken);
    }
    
    
    //This function is triggered when the user presses the purchase button and it shows all the necessary BrainTree payments dialogs to complete the purchase.
    func showDropIn(clientTokenOrTokenizationKey: String) {
        let request =  BTDropInRequest()
        let dropIn = BTDropInController(authorization: clientTokenOrTokenizationKey, request: request)
        { (controller, result, error) in
            if (error != nil) {
                print("ERROR")
            } else if (result?.isCancelled == true) {
                print("CANCELLED")
            } else if result != nil {
                // Use the BTDropInResult properties to update your UI
                // result.paymentOptionType
                // result.paymentMethod
                // result.paymentIcon
                // result.paymentDescription
            }
            controller.dismiss(animated: true, completion: nil)
        }
        self.present(dropIn!, animated: true, completion: nil)
    }

//This is where the social features are kept. When the user presses the share button, this function pulls up Apple's share menu where they can share the listen to almost any app ie. Facebook, Twitter, Tumblr, Snapchat, iMessage, etc.
    @IBAction func socialShare(_ sender: UIButton) {
        let textToShare = "Check out this item: " + itemTitle + " for " + "$\(itemPrice!)" + " - Check it out on: "
        
        if let myWebsite = NSURL(string: "http://www.BLAuctions.com/") {
            let objectsToShare = [textToShare, myWebsite] as [Any]
            let activityVC = UIActivityViewController(activityItems: objectsToShare, applicationActivities: nil)
            
            activityVC.popoverPresentationController?.sourceView = sender
            self.present(activityVC, animated: true, completion: nil)
        }
    }

}

