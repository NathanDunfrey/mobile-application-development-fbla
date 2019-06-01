//
//  hot.swift
//  m.a.d
//
//  Created by Devansh Yerpude on 2/12/18.
//  Copyright © 2018 Devansh Yerpude. All rights reserved.
//

import UIKit
import FirebaseStorage
import FirebaseCore
import FirebaseAuth
import FirebaseDatabase


class hot: UIViewController {
    //creates the different image and label views for "hot" books
    @IBOutlet weak var book1: UIImageView!
    @IBOutlet weak var author1: UILabel!
    @IBOutlet weak var genre1: UILabel!
    @IBOutlet weak var author2: UILabel!
    @IBOutlet weak var genre2: UILabel!
    @IBOutlet weak var author3: UILabel!
    @IBOutlet weak var genre3: UILabel!
    @IBOutlet weak var author4: UILabel!
    @IBOutlet weak var genre4: UILabel!
    @IBOutlet weak var title1: UILabel!
    @IBOutlet weak var title2: UILabel!
    @IBOutlet weak var title3: UILabel!
    @IBOutlet weak var title4: UILabel!
    
    var bookTitle = "hello"
    
    override func viewDidLoad() {
        super.viewDidLoad()
        download()
        getDate()
        getInfo()

        // Do any additional setup after loading the view.
    }
    //transfers title to bookView to handle checking out and other requests
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "book1Seg" {
            if let destination = segue.destination as? bookView {
                destination.bookTitle2 = "Percy Jackson and the Lightning Thief"
            }
        }
       else if segue.identifier == "book2Seg" {
            if let destination = segue.destination as? bookView {
                destination.bookTitle2 = "In Cold Blood"
        }
    }
        else if segue.identifier == "book3Seg" {
            if let destination = segue.destination as? bookView {
                destination.bookTitle2 = "The World As I See It"
            }
        }
        
        else  {
            if let destination = segue.destination as? bookView {
                destination.bookTitle2 = "7 Habits of Highly Effective People"
            }
        }
    }
    
    
    @IBOutlet weak var book3: UIImageView!
    @IBOutlet weak var book2: UIImageView!
    @IBOutlet weak var dateUpdate: UILabel!
    @IBOutlet weak var book4: UIImageView!
    var imageRef: StorageReference{
        return Storage.storage().reference()
        //downloads images for imageView
    }
    func download(){
        var downloadRef = imageRef.child("Lightning.jpg")
        var downloadTask = downloadRef.getData(maxSize: 1024*1024*12) { (data, error) in
            if let data = data {
                let image = UIImage(data:data)
            self.book1.image = image
            }
        }
        downloadRef = imageRef.child("Cold Blood.jpg")
        downloadTask = downloadRef.getData(maxSize: 1024*1024*12) { (data, error) in
            if let data = data {
                let image = UIImage(data:data)
                self.book2.image = image
            }
        }
        downloadRef = imageRef.child("Einstein.jpg")
        downloadTask = downloadRef.getData(maxSize: 1024*1024*12) { (data, error) in
            if let data = data {
                let image = UIImage(data:data)
                self.book3.image = image
        
        
    }
        }
        downloadRef = imageRef.child("Habits.jpg")
        downloadTask = downloadRef.getData(maxSize: 1024*1024*12) { (data, error) in
            if let data = data {
                let image = UIImage(data:data)
                self.book4.image = image
            }
        }
    
    }
    //gets the title, author, and genre for each book, and sets the current month and day
    func getDate(){
        let date = Date()
        let cal = Calendar.current
        
        
        let day = cal.component(.day,from:date)
        let month = cal.component(.month, from:date)
        var day1 = String(day)
        if(month==1){
            self.dateUpdate.text = "January " + day1
        }
        else if(month==2){
            self.dateUpdate.text = "February " + day1
        }
        else if(month==3){
        self.dateUpdate.text = "March " + day1
        }
        else if(month==4){
            self.dateUpdate.text = "April " + day1
        }
        else if(month==5){
            self.dateUpdate.text = "May " + day1
        }
        else if(month==6){
            self.dateUpdate.text = "June " + day1
        }
        else if(month==7){
            self.dateUpdate.text = "July " + day1
        }
        else if(month==8){
            self.dateUpdate.text = "August " + day1
        }
        else if(month==9){
            self.dateUpdate.text = "September " + day1
        }
        else if(month==10){
            self.dateUpdate.text = "October " + day1
        }
        else if(month==11){
            self.dateUpdate.text = "November " + day1
        }
        else {
            self.dateUpdate.text = "December " + day1
        }
    
}
    @IBAction func book1(_ sender: UIButton) {
        
    }
    @IBAction func book2(_ sender: UIButton) {
    }
    @IBAction func book3(_ sender: UIButton) {
    }
    @IBAction func book4(_ sender: UIButton) {
    }
    func getInfo(){
        let ref = Database.database().reference()
        
        ref.child("books").child("Percy Jackson and the Lightning Thief").child("author").observeSingleEvent(of: .value) { (snapshot) in
            print(snapshot)
            let m = snapshot.value as? String
            self.author1.text = m
            
        }
        ref.child("books").child("Percy Jackson and the Lightning Thief").child("genre").observeSingleEvent(of: .value) { (snapshot) in
            print(snapshot)
            let m = snapshot.value as? String
            self.genre1.text = m
        
        
        
    }
        ref.child("books").child("Percy Jackson and the Lightning Thief").child("title").observeSingleEvent(of: .value) { (snapshot) in
            print(snapshot)
            let m = snapshot.value as? String
            self.title1.text = m
        }
        
        ref.child("books").child("In Cold Blood").child("title").observeSingleEvent(of: .value) { (snapshot) in
            print(snapshot)
            let m = snapshot.value as? String
            self.title2.text = m
        
    }
        ref.child("books").child("In Cold Blood").child("author").observeSingleEvent(of: .value) { (snapshot) in
            print(snapshot)
            let m = snapshot.value as? String
            self.author2.text = m
        }
        
        ref.child("books").child("In Cold Blood").child("genre").observeSingleEvent(of: .value) { (snapshot) in
            print(snapshot)
            let m = snapshot.value as? String
            self.genre2
                .text = m
        }
        ref.child("books").child("The World As I See It").child("author").observeSingleEvent(of: .value) { (snapshot) in
            print(snapshot)
            let m = snapshot.value as? String
            self.author3.text = m
        }
        ref.child("books").child("The World As I See It").child("title").observeSingleEvent(of: .value) { (snapshot) in
            print(snapshot)
            let m = snapshot.value as? String
            self.title3.text = m
        }
        ref.child("books").child("The World As I See It").child("genre").observeSingleEvent(of: .value) { (snapshot) in
            print(snapshot)
            let m = snapshot.value as? String
            self.genre3.text = m
        }
        ref.child("books").child("7 Habits of Highly Effective People").child("author").observeSingleEvent(of: .value) { (snapshot) in
            print(snapshot)
            let m = snapshot.value as? String
            self.author4.text = m
        }
        ref.child("books").child("7 Habits of Highly Effective People").child("title").observeSingleEvent(of: .value) { (snapshot) in
            print(snapshot)
            let m = snapshot.value as? String
            self.title4.text = m
        }
        ref.child("books").child("7 Habits of Highly Effective People").child("genre").observeSingleEvent(of: .value) { (snapshot) in
            print(snapshot)
            let m = snapshot.value as? String
            self.genre4.text = m
        }
        
    }
}
