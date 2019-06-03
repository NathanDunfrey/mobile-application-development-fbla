
// This is the class that displays the list for the Reserved or Checked Out books of the signed in user

import UIKit
import FirebaseAuth
import FirebaseDatabase

class UserBookList: UITableViewController {

    @IBOutlet weak var loadCircle: UIActivityIndicatorView!
    var listName : String!
    var ref : DatabaseReference!
    //var objects = [AnyObject]()
    var titles = [String]()
    var images = [UIImage]()
    var authors = [String]()
    var genres = [String]()
    var dict = [String : NSDictionary]()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // If ios 11 is available, use large title
        if #available(iOS 11.0, *) {
            navigationController?.navigationBar.prefersLargeTitles = true
            navigationController?.navigationBar.largeTitleTextAttributes =
                [NSAttributedStringKey.foregroundColor : UIColor.white]
        } else {
            
        }
        
        // Set the title of the navigation bar to Checked Out or Reserved
        self.title = listName
        
        // load in all the Reserved or Checked Out books
        self.navigationController?.setNavigationBarHidden(false, animated: true)
        ref = Database.database().reference().child("Users/" + (Auth.auth().currentUser?.email?.replacingOccurrences(of: ".", with: "_"))! + "/" + self.listName)
        ref.observe(DataEventType.value, with: { (snapshot) in
            let data = snapshot.value as? [String : AnyObject] ?? [:]
            for (key,value) in data {
                self.dict[key] = value as? NSDictionary
            }
            self.loadData()
        })
        // Uncomment the following line to preserve selection between presentations
        // self.clearsSelectionOnViewWillAppear = false

        // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
        // self.navigationItem.rightBarButtonItem = self.editButtonItem
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }


    override func numberOfSections(in tableView: UITableView) -> Int {
        // the number of sections in the list
        return 1
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // the number of rows in the list
        return dict.count
    }

    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        // Configure how each cell in the list looks
        let cell = tableView.dequeueReusableCell(withIdentifier: "Cell", for: indexPath) as? Cell
        let title = self.titles[indexPath.row]
        let image = self.images[indexPath.row]
        cell?.title1.text = title
        cell?.picture1.image = image
        return cell!
    }
    
    // Function to load in all the data into arrays that will be used to create the list of books
    private func loadData(){
        for (key,value) in self.dict{
            // add the title of each book to array
            self.titles.append(key)
            
            // add the genre of each book to array
            self.genres.append(value["Genre"] as! String)
            
            // add the author of each book to array
            self.authors.append(value["Author"] as! String)
            
            // Decode the base64 String from the database into a UIImage and add it to array
            let dataDecoded : Data = Data(base64Encoded: value["Image"] as! String, options: .ignoreUnknownCharacters)!
            let decodedimage = UIImage(data: dataDecoded)
            self.images.append(decodedimage!)
        }
        loadCircle.stopAnimating()
        self.tableView.reloadData()
    }
    
    // Go to  page with all the details of the book that the user clicks on
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        let index = self.tableView.indexPathForSelectedRow![1]
        let test = segue.destination as! BookDetail
        test.test = self.titles[index]
        test.please = self.images[index]
        test.authorName = self.authors[index]
        test.genre = self.genres[index]
        
    }

}
