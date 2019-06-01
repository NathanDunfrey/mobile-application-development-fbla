//
//  search.swift
//  m.a.d
//
//  Created by Devansh Yerpude on 2/11/18.
//  Copyright © 2018 Devansh Yerpude. All rights reserved.
//

import UIKit
import FirebaseStorage

class search: UIViewController  {
    override func viewDidLoad() {
        super.viewDidLoad()
        update()

        // Do any additional setup after loading the view.
    }
    //creates images and buttons for the orignal books on search page
    @IBOutlet weak var book33: UIImageView!
    @IBOutlet weak var book11: UIImageView!
    @IBOutlet weak var book1: UIButton!
    @IBOutlet weak var book44: UIImageView!
    @IBOutlet weak var book22: UIImageView!
    @IBOutlet weak var book2: UIButton!
    @IBOutlet weak var book3: UIButton!
    @IBOutlet weak var book4: UIButton!
    //transfers title of book over to bookView to handle checking out and reserving
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "searchSeg1" {
            if let destination = segue.destination as? bookView
            {
                destination.bookTitle2 = "The Great Gatsby"
            }
        }
            if segue.identifier == "searchSeg2" {
                if let destination = segue.destination as? bookView
                {
                    destination.bookTitle2 = "The Fault in Our Stars"
                }
            }
                
                if segue.identifier == "searchSeg3" {
                    if let destination = segue.destination as? bookView
                    {
                        destination.bookTitle2 = "Long Walk to Freedom"
                    }
    }
        
        if segue.identifier == "searchSeg4" {
            if let destination = segue.destination as? bookView
            {
                destination.bookTitle2 = "Into the Wild"
            }
        }
    }
    //storage reference from Firebase
    var imageRef: StorageReference{
        return Storage.storage().reference()
    }
    func update(){
        //downloads image from Firebase Storage
        var downloadRef = imageRef.child("Gatsby.jpg")
        var downloadTask = downloadRef.getData(maxSize: 1024*1024*12) { (data, error) in
            if let data = data {
                let image = UIImage(data:data)
                self.book11.image = image
            }
        }
        downloadRef = imageRef.child("Stars.jpg")
        downloadTask = downloadRef.getData(maxSize: 1024*1024*12) { (data, error) in
            if let data = data {
                let image = UIImage(data:data)
                self.book22.image = image
            }
        }
        downloadRef = imageRef.child("Freedom.jpg")
        downloadTask = downloadRef.getData(maxSize: 1024*1024*12) { (data, error) in
            if let data = data {
                let image = UIImage(data:data)
                self.book33.image = image
                
                
            }
        }
        downloadRef = imageRef.child("Wild.jpg")
        downloadTask = downloadRef.getData(maxSize: 1024*1024*12) { (data, error) in
            if let data = data {
                let image = UIImage(data:data)
                self.book44.image = image
            }
        }
        
    }
   

}
