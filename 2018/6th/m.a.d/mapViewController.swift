//
//  mapViewController.swift
//  m.a.d
//
//  Created by Devansh Yerpude on 5/1/18.
//  Copyright © 2018 Devansh Yerpude. All rights reserved.
//

//imports pop up implementer

import UIKit
import PopupDialog


class mapViewController: UIViewController {
   
   //local variables for title, description and image
    var x = ""
    var y = ""
    var z = #imageLiteral(resourceName: "sorry")
    
    //repeated per genre of book
    
    
    @IBAction func fiction(_ sender: Any) {
        
        //popup assets
        
        x = "Fiction Books"
        y = "Fiction books are one of the widest enjoyed books around the world. With their mesmirizing storylines and intericate characters, fiction books are a fan favorite. If you're looking for a good read, head over to the search page, switch to genre search and look up fiction!"
        z = #imageLiteral(resourceName: "fantasy")
        // call popup function
        showImageDialog(animated: true)
    }
    
    @IBAction func comics(_ sender: Any) {
        
        x = "Comics"
        y = "Comic books are a great way to unwind from a long stressful school day. With classics such as Captain America, Superman, and Thor lurking within the pages, comic books promise to be a pleasure for everyone. In correlation, we have just recently stocked up on comic book pending the release of Avengers: Infity War!"
        z = #imageLiteral(resourceName: "comics")

       
        showImageDialog(animated: true)
    }
    
    @IBAction func manga(_ sender: Any) {
        
        x = "Manga"
        y = "Manga are classic Japanese novels, and are often confused with anime, the animated version of them. Manga books are read from right to left, and feature a wide variety of content, from ninja fighting warriors to cute little kittens. If you're looking to venture of the traditional book trend, this is the place to go.  "
        z = #imageLiteral(resourceName: "manga")
        
        showImageDialog(animated: true
        )
    }

        
    
    
    @IBAction func biblio(_ sender: Any) {
      
            
            x = "Bibliography"
            y = "The greatest minds across history culminate in this section, describing their growth from ordinary to extraordinary. Featuring works from notables such as Albert Einstein, this is definetely the section to go to if you're looking for some enlightment."
            z = #imageLiteral(resourceName: "einstein")
           
        showImageDialog(animated: true)
        
        
    
    }
    
    @IBAction func reference(_ sender: Any) {
        
      
            
            x = "Reference"
            y  = "These books are the holy grail of our society. If not for encyclopedias or dictionaries, how would we function everyday? This section features full sets of encyclopedias, which have been updated this year! If you ever need to begin any research, this is the section to start with! "
            z = #imageLiteral(resourceName: "books")
        
        showImageDialog(animated: true)
    }
    
    @IBAction func mystery(_ sender: Any) {
        
       
            
            x = "Mystery"
            y = "Sherlock Holmes and Doctor Watson are just a few names thrown around this genre. With its suspensful storylines and relentless pursuit of thrills, this genre promises to excite in a way no other. Bewarned, once you pick one of these books up, its hard to put them down!"
            z = #imageLiteral(resourceName: "mystery")
        
        showImageDialog(animated: true)
    }
    
    @IBAction func foreign(_ sender: Any) {
        
       
            x = "Foreign"
            y = "Some may confuse this section for manga like works, but it might as well be the opposite. This section focuses on cultural pieces from foreign languages taught here at Northview. Our high achieving foreign language students, turn your heads here for the next level in your cultural exploration!"
            z = #imageLiteral(resourceName: "culture")
        
        showImageDialog(animated: true)
    }
    
    @IBAction func nonfic(_ sender: Any) {
        
       
            
            // Prepare the popup assets
         
            x = "Non Fiction"
            y = "These books are often misunderstood as collections of facts and no deemable plot lines, but taking a look at In Cold Blood and such will prove otherwise. With realistic plot lines and relatable characters, non fiction books make an impact that no other genre can. "
            z = #imageLiteral(resourceName: "non")
        
        showImageDialog(animated: true)
    }
    
    @IBAction func fbla(_ sender: Any) {
        
        
            
            // Prepare the popup assets
          
            x = "FBLA"
            y = "Members of all kind, look no further than this section for all your FBLA needs. Whether it be binders filled with old practice tests for competetive events, or archives of chapter meetings, this section has it all. With a wide variety of study materials, chapter archives, and business textbooks, this section promises to be a FBLA student's dream come true"
            z = #imageLiteral(resourceName: "logo")
        
        showImageDialog()
    }
    
    @IBAction func tech(_ sender: Any) {
     
         
            x = "Technology"
            y = "Technology is rapidly changing, and so this section of one of the most virbant. If you're looking to catch up on today's biggest discoveries, take a quick stop here, and start your own path in technology. If you took a look at our Live Text and Snapshot pages, they were all developed with concepts learned in the book Machine Learning!"
            z = #imageLiteral(resourceName: "tech")
            
        
        showImageDialog(animated: true)
        
    }
    

    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func showImageDialog(animated: Bool = true) {
        
        // Prepare the popup assets
        let title = x
        let message = y
        let image = z
        
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
