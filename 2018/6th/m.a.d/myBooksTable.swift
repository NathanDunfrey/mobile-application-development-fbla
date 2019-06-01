//
//  myBooksTable.swift
//  m.a.d
//
//  Created by Devansh Yerpude on 2/13/18.
//  Copyright © 2018 Devansh Yerpude. All rights reserved.
//

import UIKit
import FirebaseDatabase
import FirebaseStorage
import FirebaseAuth

class myBooksTable: UITableViewController,UISearchResultsUpdating {
  
    func updateSearchResults(for searchController: UISearchController) {
        filterContent(searchText:self.searchController.searchBar.text!)
    }
    //creates two arrays, one for searching and one for all values
    
   var booksArray = [NSDictionary?]()
    var filteredArray = [NSDictionary?]()
    @IBOutlet var checkOut: UITableView!
    var ref = Database.database().reference()
    let searchController = UISearchController(searchResultsController:nil)
    override func viewDidLoad() {
        super.viewDidLoad()
        ref.child("books").queryOrdered(byChild: "title").observe(.childAdded) { (snapshot) in
            self.booksArray.append(snapshot.value as? NSDictionary)

            }
        
        
        
//inserts array into tableView
        self.checkOut.insertRows(at: [IndexPath(row:self.booksArray.count-1,section:0)], with: UITableViewRowAnimation.automatic)
        searchController.searchResultsUpdater = self
        definesPresentationContext = true
        searchController.dimsBackgroundDuringPresentation = false
        tableView.tableHeaderView = searchController.searchBar
        
      
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    // MARK: - Table view data source

    override func numberOfSections(in tableView: UITableView) -> Int {
        // #warning Incomplete implementation, return the number of sections
        return 1
    }
    
    var imageRef: StorageReference{
        return Storage.storage().reference()
    }
    //sets the size of the tableView
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // #warning Incomplete implementation, return the number of rows
        if searchController.isActive && searchController.searchBar.text != ""{
            return filteredArray.count
        }
        else{
            return booksArray.count
            
        }
    }
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        //sets the various cells for the tableView, depending on which book we are on
        let cell = tableView.dequeueReusableCell(withIdentifier: "cell", for: indexPath)
        
        let book : NSDictionary
        
        if searchController.isActive && searchController.searchBar.text != ""{
            book = filteredArray[indexPath.row]!
        }
        else {
            book = self.booksArray[indexPath.row]!
        }
        //compares the current user, and the user listed as the owner for the book. if it matches, displays the book and its details on the View Controller, alongside its due date.
        // if it doesnt match, gives the user to add a book to their library
        let compare1 = book["user"] as? String
        let compare2 = Auth.auth().currentUser?.uid
        if(compare1?.elementsEqual(compare2!))!{
            cell.textLabel?.text = book["title"] as? String
        var String1 = book["date"] as? String
            //due date of book
            cell.detailTextLabel?.text = "Due 2 weeks from " + String1!
            
        var download = imageRef.child((book["image"] as? String)!)
        var task = download.getData(maxSize: 1024*1024*12) { (data,error) in
            if let data = data {
                let image = UIImage(data:data)
                cell.imageView?.image = image
            }
            
            
            }}
        
        else {
            cell.textLabel?.text = "+"
            cell.detailTextLabel?.text = "Add book"
        }
        
        
        return cell
    }

    /*
    // Override to support conditional editing of the table view.
    override func tableView(_ tableView: UITableView, canEditRowAt indexPath: IndexPath) -> Bool {
        // Return false if you do not want the specified item to be editable.
        return true
    }
    */

    /*
    // Override to support editing the table view.
    override func tableView(_ tableView: UITableView, commit editingStyle: UITableViewCellEditingStyle, forRowAt indexPath: IndexPath) {
        if editingStyle == .delete {
            // Delete the row from the data source
            tableView.deleteRows(at: [indexPath], with: .fade)
        } else if editingStyle == .insert {
            // Create a new instance of the appropriate class, insert it into the array, and add a new row to the table view
        }    
    }
    */

    /*
    // Override to support rearranging the table view.
    override func tableView(_ tableView: UITableView, moveRowAt fromIndexPath: IndexPath, to: IndexPath) {

    }
    */

    /*
    // Override to support conditional rearranging of the table view.
    override func tableView(_ tableView: UITableView, canMoveRowAt indexPath: IndexPath) -> Bool {
        // Return false if you do not want the item to be re-orderable.
        return true
    }
    */

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */
    //filters the array, if you are searching for a certain book you own
    func filterContent(searchText:String){
        self.filteredArray = self.booksArray.filter{ user in
            
            let bookName = user!["title"] as? String
            return (bookName?.lowercased().contains(searchText.lowercased()))!
        }
        tableView.reloadData()
    }
    //transfers title to bookView to handle checking out and adding new book.
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if let indexPath = tableView.indexPathForSelectedRow{
            let destination = segue.destination as? bookView
            let book = booksArray[indexPath.row]
            
            
            destination?.bookTitle2 = (book!["title"] as? String)!
            tableView.reloadData()
        }
    }


}
