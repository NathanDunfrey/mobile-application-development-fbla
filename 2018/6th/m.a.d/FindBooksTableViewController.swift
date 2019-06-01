//
//  FindBooksTableViewController.swift
//  m.a.d
//
//  Created by Devansh Yerpude on 2/12/18.
//  Copyright © 2018 Devansh Yerpude. All rights reserved.
//

import UIKit
import FirebaseDatabase
import FirebaseStorage


class FindBooksTableViewController: UITableViewController, UISearchResultsUpdating{
    //creates two arrays, one for full object list, and one for shortened list as we search
    var booksArray = [NSDictionary?]()
    var filteredArray = [NSDictionary?]()
    var ref = Database.database().reference()
    let searchController = UISearchController(searchResultsController:nil)
    //changes search paramater var
    var picker = "title"
    
    @IBOutlet weak var segmenter: UISegmentedControl!
 

    
   //created tableView
    @IBOutlet var bookFinder: UITableView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        ref.child("books").queryOrdered(byChild: picker).observe(.childAdded) { (snapshot) in
            self.booksArray.append(snapshot.value as? NSDictionary)
        }
        print(booksArray)
        self.bookFinder.insertRows(at: [IndexPath(row:self.booksArray.count-1,section:0)], with: UITableViewRowAnimation.automatic)
        searchController.searchResultsUpdater = self
        searchController.dimsBackgroundDuringPresentation = false
        definesPresentationContext = true
        tableView.tableHeaderView = searchController.searchBar
        // Uncomment the following line to preserve selection between presentations
        // self.clearsSelectionOnViewWillAppear = false

        // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
        // self.navigationItem.rightBarButtonItem = self.editButtonItem
    }

    //depending on what user selects, changes search parameters
    @IBAction func segment(_ sender: UISegmentedControl) {
        switch segmenter.selectedSegmentIndex {
        case 0:
            picker = "title"
            tableView.reloadData()
        case 1:
            picker = "author"
            tableView.reloadData()
        case 2:
            picker = "genre"
            tableView.reloadData()
        default:
            tableView.reloadData()
            break;
        }
        

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
//sets number of rows to the number of books left
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // #warning Incomplete implementation, return the number of rows
        if searchController.isActive && searchController.searchBar.text != ""{
            return filteredArray.count
        }
        else{
            return booksArray.count
            
        }
    }

    var imageRef: StorageReference{
        return Storage.storage().reference()
    }
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        //sets the values for the cell, including author, title, and the title cover for image.
        let cell = tableView.dequeueReusableCell(withIdentifier: "Cell", for: indexPath)
        
        let book : NSDictionary
        
        if searchController.isActive && searchController.searchBar.text != ""{
            book = filteredArray[indexPath.row]!
        }
        else {
            book = self.booksArray[indexPath.row]!
        }
        if(picker == "title"){
        cell.textLabel?.text = book["title"] as? String
        cell.detailTextLabel?.text = book["author"] as?
            String}
        
        else if(picker == "author"){
            
            cell.textLabel?.text = book["author"] as? String
            cell.detailTextLabel?.text = book["title"] as?
            String}
        
        else{
            cell.textLabel?.text = book["genre"] as? String
            cell.detailTextLabel?.text = book["title"] as?
            String}
        
        
        
        
        
    
        var download = imageRef.child((book["image"] as? String)!)
        var task = download.getData(maxSize: 1024*1024*12) { (data,error) in
            if let data = data {
                let image = UIImage(data:data)
                cell.imageView?.image = image
            }
            
            
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
    @IBAction func exit(_ sender: Any) {
        dismiss(animated: true, completion: nil)
    }
    //updates results as we search
    func updateSearchResults(for searchController : UISearchController){
        filterContent(searchText: self.searchController.searchBar.text!)
        }
    //filters content as we search
    func filterContent(searchText:String){
        self.filteredArray = self.booksArray.filter{ user in
            
            let bookName = user![picker] as? String
            return (bookName?.lowercased().contains(searchText.lowercased()))!
        }
        tableView.reloadData()
    }
    // transfers title for every cell inside tableView
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if let indexPath = tableView.indexPathForSelectedRow{
        let destination = segue.destination as? bookView
        let book = booksArray[indexPath.row]
        
            
            destination?.bookTitle2 = (book!["title"] as? String)!
            
    }
    }
            
    
    }
    
    

