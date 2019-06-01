//
//  bookView.swift
//  m.a.d
//
//  Created by Devansh Yerpude on 2/11/18.
//  Copyright © 2018 Devansh Yerpude. All rights reserved.
//
//import libraries
import UIKit
import FirebaseDatabase
import FirebaseAuth
import FirebaseStorage
import PopupDialog

class bookView: UIViewController {
    //creates data reference
    var ref: DatabaseReference!
    var handle:DatabaseHandle!
    var bookTitle2 = ""
    @IBOutlet weak var bookPic: UIImageView!
    @IBOutlet weak var bookTitle: UILabel!
    @IBOutlet weak var author: UILabel!
    @IBOutlet weak var genre: UILabel!
    @IBOutlet weak var status: UILabel!
    @IBOutlet weak var summary: UITextView!
    var imageRef:StorageReference{
        return Storage.storage().reference()
    }
    var title1 = ""
    var desc = ""
    var image1 = #imageLiteral(resourceName: "SUCCESS-1")
    var date1 = ""
    
    override func viewDidLoad() {
        super.viewDidLoad()
    self.bookTitle.text = bookTitle2
        getInfo()
        }
 
  //function to check out book. changes state of book to checked out on server, and records the date at which it was checked out
    @IBAction func checkOut(_ sender: UIButton) {
        let ref = Database.database().reference()
        let cal = Calendar.current
        let date = Date()
        let day = cal.component(.day, from: date)
        let month = cal.component(.month, from: date)
       
        let day1 = String(day)
     ref.child("books").child(bookTitle2).child("status").observeSingleEvent(of: .value) { (snapshot) in
            let m = snapshot.value as?String
            if(m?.elementsEqual("Checked In"))!{
                self.title1 = "Success!"
                
                
          
                ref.child("books").child(self.bookTitle2).child("status").setValue("Checked Out")
                 ref.child("books").child(self.bookTitle2).child("user").setValue(Auth.auth().currentUser?.uid)
                
                if(month==1){
                    ref.child("books").child(self.bookTitle2).child("date").setValue("January " + day1)
                    self.date1 = "January " + day1
                }
                else if(month==2){
                    ref.child("books").child(self.bookTitle2).child("date").setValue("February " + day1)
                    self.date1 = "February " + day1
                }
                else if(month==3){
                    ref.child("books").child(self.bookTitle2).child("date").setValue("March " + day1)
                    self.date1 = "March " + day1
                }
                else if(month==4){
                    ref.child("books").child(self.bookTitle2).child("date").setValue("April " + day1)
                    self.date1 = "April " + day1
                }
                else if(month==5){
                    ref.child("books").child(self.bookTitle2).child("date").setValue("May " + day1)
                    self.date1 = "May " + day1
                }
                else if(month==6){
                    ref.child("books").child(self.bookTitle2).child("date").setValue("June " + day1)
                    self.date1 = "June " + day1
                }
                else if(month==7){
                    ref.child("books").child(self.bookTitle2).child("date").setValue("July " + day1)
                    self.date1 = "July " + day1
                }
                else if(month==8){
                    ref.child("books").child(self.bookTitle2).child("date").setValue("August " + day1)
                    self.date1 = "August " + day1
                }
                else if(month==9){
                    ref.child("books").child(self.bookTitle2).child("date").setValue("September " + day1)
                    self.date1 = "September " + day1
                }
                else if(month==10){
                    ref.child("books").child(self.bookTitle2).child("date").setValue("October " + day1)
                    self.date1 = "October " + day1
                }
                else if(month==11){
                    ref.child("books").child(self.bookTitle2).child("date").setValue("November " + day1)
                    self.date1 = "November " + day1
                }
                else {
                    ref.child("books").child(self.bookTitle2).child("date").setValue("December " + day1)
                    self.date1 = "December " + day1
                }
                self.desc = " Congratulations! You have succesfully checked out " + self.bookTitle2 + ". Remember that it will be due two weeks from today's date, \(self.date1)."
                self.showImageDialog(animated: true)
                
            }
            else{
                self.title1 = "Error"
                self.desc = "Unfortunately, " + self.bookTitle2 + " has been checked out. Please try looking for another book."
                self.showImageDialog(animated: true)
        }
            
     let ref = Database.database().reference()
 
        ref.child("users").setValue((Auth.auth().currentUser?.uid)!)
        ref.child("users").child((Auth.auth().currentUser?.uid)!).childByAutoId().setValue(self.bookTitle2)
        
        }
    }
    //function to reserve a book. changes state of book to reserve on server, and records the date at which it was checked out
    
    @IBAction func reserve(_ sender: UIButton) {
        let cal = Calendar.current
        let date = Date()
        let day = cal.component(.day, from: date)
        let month = cal.component(.month, from: date)
        let ref = Database.database().reference()

        
        let day1 = String(day)
        ref.child("books").child(self.bookTitle2).child("date").setValue(self.date1
        )
        
        ref.child("books").child(self.bookTitle2).child("status").setValue("Reserved")
        
        title1 = "Success"
        desc = "You have succesfully reserved " + self.bookTitle2 + " We'll send you an email once it's ready!"
        showImageDialog(animated: true)
        
        
    }
    
    func getInfo(){
        //reference to firebase database
        //uses "books" cateogry in database to search for the image for each book, then loads onto imageView
        let ref = Database.database().reference()
        ref.child("books").child(bookTitle2).child("image").observeSingleEvent(of: .value) { (snapshot) in
            let m = snapshot.value as?String
            let downloadRef = self.imageRef.child(m!)
            _ = downloadRef.getData(maxSize: 1024*1024*12) { (data, error) in
                if let data = data {
                    let image = UIImage(data:data)
                    self.bookPic.image = image
                    self.image1 = image!
                }
            }
            
        }
        
        ref.child("books").child(bookTitle2).child("author").observeSingleEvent(of: .value) { (snapshot) in
            let m = snapshot.value as?String
            self.author.text = m
            
        
        }
    
        ref.child("books").child(bookTitle2).child("genre").observeSingleEvent(of: .value) { (snapshot) in
            let m = snapshot.value as?String
            self.genre.text = m
            
            
        }
        
        ref.child("books").child(bookTitle2).child("status").observeSingleEvent(of: .value) { (snapshot) in
            let m = snapshot.value as?String
            print(snapshot)
            self.status.text = m
            
            
            
        }
        ref.child("books").child(bookTitle2).child("summary").observeSingleEvent(of: .value) { (snapshot) in
            let m = snapshot.value as?String
            self.summary.text = m
            
            
            
        }}
    
    
    
    func showImageDialog(animated: Bool = true) {
        
        // Prepare the popup assets
        let title = self.title1
        let message = self.desc
        let image = self.image1
        
        // Create the dialog
        let popup = PopupDialog(title: title, message: message, image: image, preferredWidth: 580)
        
        // Create first button
        let buttonOne = DefaultButton(title: "OK") { [weak self] in
            
        }
        
        
        // Add buttons to dialog
        popup.addButtons([buttonOne])
        
        // Present dialog
        self.present(popup, animated: animated, completion: nil)
    }
    
    
    
    
    
    }
    
    




        

            

   



