

// Class that defines how each list of books will look


import UIKit
import FirebaseDatabase

class List: UITableViewController {

    @IBOutlet weak var loadCircle: UIActivityIndicatorView!
    var genre : String!
    var ref : DatabaseReference!
    var titles = [String]()
    var images = [UIImage]()
    var authors = [String]()
    var dict = [String : NSDictionary]()
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // if ios 11 is available, use a large title
        if #available(iOS 11.0, *) {
            navigationController?.navigationBar.prefersLargeTitles = true
            navigationController?.navigationBar.largeTitleTextAttributes =
                [NSAttributedStringKey.foregroundColor : UIColor.white]
        } else {
            
        }
        
        // Set title to the genre that the user is currently browsing
        self.title = genre
        self.navigationController?.setNavigationBarHidden(false, animated: true)
        
        // Get a reference to the database section that contains all the books for this genre
        ref = Database.database().reference().child(genre)
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
        // Configure the cells in the list
        let cell = tableView.dequeueReusableCell(withIdentifier: "Cell", for: indexPath) as? Cell
        let title = self.titles[indexPath.row]
        let image = self.images[indexPath.row]
        cell?.title.text = title
        cell?.picture.image = image
        return cell!
    }

    // Navigate to the page with all the sepcific details of the book
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        let index = self.tableView.indexPathForSelectedRow![1]
        let test = segue.destination as! BookDetail
        test.test = self.titles[index]
        test.please = self.images[index]
        test.authorName = self.authors[index]
        test.genre = self.genre
    }

    
    // Function to load in all the data into the arrays that will be used to create the list
    private func loadData(){
        for (key,value) in self.dict{
            // Add title of each book to array
            self.titles.append(key)
            
            // Add author of each book to array
            self.authors.append(value["Author"] as! String)
            
            // Parse base64 String that is stored in databse into a UIImage that can be displayed
            var encoded64 = value["Image"] as! String
            encoded64 = base64PaddingWithEqual(encoded64 : encoded64)
            let decodedData = NSData                    (base64Encoded: encoded64, options: .ignoreUnknownCharacters)
            var decodedImage = UIImage(data: decodedData! as Data)
            
            // Add UIImage to array
            self.images.append(decodedImage!)
        }
        loadCircle.stopAnimating()
        self.tableView.reloadData()
    }
    
    // Add characters to end of the base64 String to make it parseable into a UIImage
    private func base64PaddingWithEqual(encoded64: String) -> String {
        let remainder = encoded64.characters.count % 4
        if remainder == 0 {
            return encoded64
        } else {
            let newLength = encoded64.characters.count + (4 - remainder)
            return encoded64.padding(toLength: newLength, withPad: "=", startingAt: 0)
        }
    }

}
