//
//  MasterViewController.swift
//  BLAuctions
//
// This is the class that controls the master view controller table view
//
//  Created by Drew Patel on 12/11/16.
//  Copyright © 2016 DrafeSu. All rights reserved.
//

//Import all the necessary APIs and librarys
//In this case the regular IOS UIKit and CoreData
//and Firebase APIs which will be used for authentication
//and data storage
import UIKit
import CoreData
import FirebaseAuth
import FirebaseStorage
import FirebaseDatabase
import TagListView

//Create the class for the custom tableview cells and connect the visual elements to their respective variables
class MasterViewControllerCell: UITableViewCell{
    @IBOutlet weak var cellContent: UIView!
    @IBOutlet weak var thumbnail: UIImageView!
    @IBOutlet weak var title: UILabel!
    @IBOutlet weak var descriptionBox: UILabel!
    @IBOutlet weak var price: UILabel!
    @IBOutlet weak var condition: UILabel!
    var userID = ""
}


//Create a custom object that stores all the item listings and initializes them
//from the dictionaries retrieved from the Firebase API
class Listing {
    
    var title: String!
    var thumbnail: String!
    var description: String!
    var price: Float!
    var condition: String!
    var location: String!
    var shippingCost: Float!
    var phoneNumber: String!
    var userID: String!
    init (value: NSDictionary) {
        title = value["title"] as? String
        description = value["description"] as? String
        price = value["price"] as? Float
        condition = value["condition"] as? String
        thumbnail = value["imageURL"] as? String
        location = value["zipcode"] as? String
        shippingCost = value["shippingCost"] as? Float
        phoneNumber = value["phoneNumber"] as? String
        userID = value["userID"] as? String
    }
    
}

//This is the main class for the viewcontroller
class MasterViewController: UITableViewController, NSFetchedResultsControllerDelegate, TagListViewDelegate {
    
    @IBOutlet var tagView: TagListView!
    //initialize the global variables
    var detailViewController: DetailViewController? = nil
    var managedObjectContext: NSManagedObjectContext? = nil
    var ref: FIRDatabaseReference!
    private var databaseHandle: FIRDatabaseHandle!
    var listings = [Listing]()
    
    
    //Once the view has loaded, this function is called
    override func viewDidLoad() {
        
        //set the Firebase database reference variable to the proper location
        ref = FIRDatabase.database().reference()
        super.viewDidLoad()
        
        //initialize the split view controller as explained in the Appdelegate.swift file
        if let split = self.splitViewController {
            let controllers = split.viewControllers
            self.detailViewController = (controllers[controllers.count-1] as! UINavigationController).topViewController as? DetailViewController
        }
        
        //Check if the user is signed in, if they aren't then we will send them to the login screen
        
        
        //begin the firebase database calls
        //startObservingDatabase()
        self.refreshControl?.addTarget(self, action: #selector(MasterViewController.handleRefresh), for: UIControlEvents.valueChanged)
        
        tagView.alignment = .center // possible values are .Left, .Center, and .Right
        tagView.addTags(["Phones", "Tablets", "Cars","Antiques","Furniture"])
        tagView.delegate = self
        
       
        
    }

    //This function is called when the view appears on the screen, it's used for splitviewcontroller purposes in this case it checks if the user is signed in. If they aren't they are segued to the login screen. If they are logged in then the listview is refreshed with the latest data from Firebase
    override func viewWillAppear(_ animated: Bool) {
        self.clearsSelectionOnViewWillAppear = self.splitViewController!.isCollapsed
        super.viewWillAppear(animated)
        if FIRAuth.auth()?.currentUser != nil {
            print("Signed in")
                    startObservingDatabase();
        } else {
            print("not signed in")
            self.performSegue(withIdentifier: "goLogin", sender: self)
            
        }


    }

    //This is a default placeholder if the app utilized too much memory what would happen
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

   

    //This function is called before a view controller segues to another
    //The purpose in this app is to set the variables of the detail view controller and setup the visual elements before the user sees.
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        //if the segue that triggered the function is the one to the detailed view controller
        if segue.identifier == "showDetail" {
            //Obtain the index of the tableviewcell that was pressed
            if let indexPath = self.tableView.indexPathForSelectedRow {
                //get the listing item that cooresponds to that tableviewcell
            let item = self.listings[indexPath.row]
                //create a reference to the detail view controller
                let controller = (segue.destination as! UINavigationController).topViewController as! DetailViewController
                //set all the variables of detailview controller
                controller.itemTitle = item.title
                controller.itemDescription = item.description
                controller.itemCondition = item.condition
                controller.itemPrice = item.price
                controller.itemShippingCost = item.shippingCost
                controller.itemLocation = item.location
                controller.itemThumbnail = item.thumbnail
                controller.itemPhoneNumber = item.phoneNumber
                
                //set the buttons that will be on the detailview controller
                controller.navigationItem.leftBarButtonItem = self.splitViewController?.displayModeButtonItem
                controller.navigationItem.leftItemsSupplementBackButton = true
            }
        }
    }

    // MARK: - Table View

    //return the number of sections in the tableview, necessary for UITableViewControllers
    override func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }

    //return the number of rows in a section, this returns the number of items in the listing dictionary
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
       return self.listings.count
    }

    //this function populates the tableView
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        //create new reference to the custom cell we created in the storyboard
        let cell = tableView.dequeueReusableCell(withIdentifier: "customCell", for: indexPath) as! MasterViewControllerCell
        //create variable of the listing's index depending on which cell is being created
        let item = self.listings[indexPath.row]
        //set all the values of the visual elements from the listing variable
        cell.title?.text = item.title
        cell.descriptionBox?.text = item.description
        cell.price?.text = "$\(String(item.price))"
        cell.condition?.text = item.condition
        
        
        //This part of code checks if the listing was created by the current user. If it is, then the cell color will be green.
        cell.userID = item.userID;
        let authID = (FIRAuth.auth()?.currentUser?.uid)!
        
        print(item.userID);
        if(authID == item.userID){
            print("yessir")
        cell.backgroundColor = UIColor(red: 38/255.0, green: 179/255.0, blue: 140/255.0, alpha: 1)
        }else{
            cell.backgroundColor = UIColor.white
        }
        
        
        //reference Firebase image storage
            let storage = FIRStorage.storage()
        //get the image from Firebase given the url
        storage.reference(forURL: item.thumbnail).data(withMaxSize: 25 * 1024 * 1024, completion: { (data, error) -> Void in
            let image = UIImage(data: data!)
            //apply the image to the UIimageview to show the user the image
            cell.thumbnail?.image = image
        })
        //return the cell to the parent function
        return cell
    }

    
    //This function checks if a certain listing in the tableview is a listing created by the current user. If it is, then the user can delete that row.
    override func tableView(_ tableView: UITableView, canEditRowAt indexPath: IndexPath) -> Bool {
        let item = self.listings[indexPath.row]

        if(item.userID == (FIRAuth.auth()?.currentUser?.uid)!){
            return true
        }
        return false
    }

    //Placeholder function for the next following function
    func configureCell(_ cell: UITableViewCell, withEvent event: Event) {
        
    }

    // MARK: - Fetched results controller


//This is a function consisting of cases to control how the app reacts to tableview functions such as edit, delete, and update
    func controller(_ controller: NSFetchedResultsController<NSFetchRequestResult>, didChange anObject: Any, at indexPath: IndexPath?, for type: NSFetchedResultsChangeType, newIndexPath: IndexPath?) {
        switch type {
            case .insert:
                tableView.insertRows(at: [newIndexPath!], with: .fade)
            case .delete:
                tableView.deleteRows(at: [indexPath!], with: .fade)
            case .update:
                self.configureCell(tableView.cellForRow(at: indexPath!)!, withEvent: anObject as! Event)
            case .move:
                tableView.moveRow(at: indexPath!, to: newIndexPath!)
        }
    }
//this is the function that is called when the tableview sees updated data
    func controllerDidChangeContent(_ controller: NSFetchedResultsController<NSFetchRequestResult>) {
        startObservingDatabase()
        self.tableView.endUpdates()
    }

    @IBAction func logout(_ sender: Any) {
        
        let firebaseAuth = FIRAuth.auth()
        do {
            try firebaseAuth?.signOut()
        } catch let signOutError as NSError {
            print ("Error signing out: %@", signOutError)
        }
        
        if FIRAuth.auth()?.currentUser != nil {
            print("Signed in")
            
        } else {
            performSegue(withIdentifier: "goLogin", sender: nil)
            
        }
        
    
}
    
    override func tableView(_ tableView: UITableView, commit editingStyle: UITableViewCellEditingStyle, forRowAt indexPath: IndexPath) {
        if (editingStyle == UITableViewCellEditingStyle.delete) {
            // handle delete (by removing the data from your array and updating the tableview)
        }
    }

    
    func handleRefresh(sender: AnyObject) {
        
        startObservingDatabase()
        self.refreshControl?.endRefreshing()

    }
    
    //This function begins observing the Firebase database and obtains all the information in the listings child and sets it into the Listing dictionary.
    func startObservingDatabase () {
        listings.removeAll()
        tableView.reloadData()
        databaseHandle = ref.child("listings").observe(.value, with: { (snapshot) in
            let value = snapshot.value as? NSDictionary
            for item in (value?.allValues)!
            {

                let thisList = Listing(value: item as! NSDictionary)
                self.listings.append(thisList)
            }
            //Tells the tableview to reload/refresh since new data has been obtained
            self.tableView.reloadData()
        })

    }
    
    //This is where the tag selection is handled when a tag is selected.
    func tagPressed(_ title: String, tagView: TagView, sender: TagListView) {
        print(title);
    }

    
   

}
