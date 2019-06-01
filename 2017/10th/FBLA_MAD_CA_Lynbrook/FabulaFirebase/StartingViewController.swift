//
//  ViewController.swift
//  Fabula
//
//  Created by Raghav Sreeram on 1/9/17.
//  Copyright © 2017 Raghav Sreeram. All rights reserved.
//

import UIKit
import FirebaseAuth
import Firebase

//Global Varialbes to hold screen width and height
var screenW: CGFloat!
var screenH: CGFloat!

//Holds Fabula Theme Colors
var fabRedColor: UIColor = UIColor.init(red: 255/255.0, green: 25/255.0, blue: 25/255.0, alpha: 1.0)
var fabWhiteColor: UIColor = UIColor.init(red: 237/255.0, green: 237/255.0, blue: 237/255.0, alpha: 1.0)


//Starting screen
class StartingViewController: UIViewController {
    
    var bgImage: UIImageView!
    var loginButt: UIButton!
    var signUpButt: UIButton!
    var logoImage: UIImageView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.navigationItem.backBarButtonItem = UIBarButtonItem(title: "", style: UIBarButtonItemStyle.plain, target: nil, action: nil)
        
        //If User is Logged in, Go to app delegate and take user to home page
        if(FIRAuth.auth()?.currentUser?.uid != nil){
            let appDelegate : AppDelegate = UIApplication.shared.delegate as! AppDelegate
            appDelegate.login()
        }
        
        //Get screen size and set the global variables
        let screenSize: CGRect = UIScreen.main.bounds
        screenW = screenSize.width
        screenH = screenSize.height
        
        //Creates Background Image
        bgImage = UIImageView()
        bgImage.frame = CGRect(x: 0, y: 0, width: screenW, height: screenH)
        self.view.addSubview(bgImage)
        
        
        //Adds filter and sets Background Image
        let coreImage = CIImage(cgImage: (UIImage(named: "clothesBG.png")?.cgImage)!)
        let filter = CIFilter(name: "CISepiaTone")
        filter?.setValue(coreImage, forKey: kCIInputImageKey)
        filter?.setValue(0.80, forKey: kCIInputIntensityKey)
        if let output = filter?.value(forKey: kCIOutputImageKey) as? CIImage {
            let filteredImage = UIImage(ciImage: output)
            self.bgImage?.image = filteredImage
            self.bgImage?.contentMode = .scaleToFill
            self.bgImage?.alpha = 0.92
            
        }
        
        //Sets up Login Button
        loginButt = UIButton()
        loginButt.frame = CGRect(x: 0, y: screenH - 65, width: screenW/2, height: 65)
        loginButt.setTitle("Login", for: UIControlState.normal)
        loginButt.setTitleColor(UIColor.red, for: .normal)
        loginButt.backgroundColor = fabWhiteColor
        loginButt.addTarget(self, action: #selector(loginTapped), for: UIControlEvents.touchDown)
        self.view.addSubview(loginButt)
        
        //Sets up sign Up Button
        signUpButt = UIButton()
        signUpButt.frame = CGRect(x: screenW/2, y: screenH - 65, width: screenW/2, height: 65)
        signUpButt.setTitle("Sign Up", for: UIControlState.normal)
        signUpButt.setTitleColor(UIColor.white, for: .normal)
        signUpButt.backgroundColor = fabRedColor
        signUpButt.addTarget(self, action: #selector(signUpTapped), for: UIControlEvents.touchDown)
        self.view.addSubview(signUpButt)
        
        //Adds logo Image
        logoImage = UIImageView()
        logoImage.image = UIImage(named: "fabNav.png")
        logoImage.frame = CGRect(x: 0, y: 0, width: 110 * 2, height: 36 * 2 )
        logoImage.center = CGPoint(x: screenW/2, y: 100)
        self.view.addSubview(logoImage)
        
    }
    
    
    //Takes user to login page
    func loginTapped(){
        
        let vc = self.storyboard?.instantiateViewController(withIdentifier: "loginVC") as! LoginViewController
        self.navigationController?.pushViewController(vc, animated: false)
    }
    
    //Takes user to signup page
    func signUpTapped(){
        
        let vc = self.storyboard?.instantiateViewController(withIdentifier: "signUp") as! SignUpViewController
        self.navigationController?.pushViewController(vc, animated: false)
        
    }
    
    //Hides nav bar when view appears
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        
        self.navigationController?.setNavigationBarHidden(true, animated: animated)
        
    }
    
    //Shows nav bar when view appears
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        
        self.navigationController?.setNavigationBarHidden(false, animated: animated)
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
}


