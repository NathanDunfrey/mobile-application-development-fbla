
// This class shows the user the featured book in the library

import UIKit

class Featured: UIViewController {

    @IBOutlet weak var image: UIImageView!
    @IBOutlet weak var checkOut: UIButton!
    override func viewDidLoad() {
        super.viewDidLoad()
        // Make button have curved edges
        self.checkOut.layer.cornerRadius = 4
        
        // If ios 11 is available, make the title large
        if #available(iOS 11.0, *) {
            navigationController?.navigationBar.prefersLargeTitles = true
            navigationController?.navigationBar.largeTitleTextAttributes =
                [NSAttributedStringKey.foregroundColor : UIColor.white]
        } else {
            
        }
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
    // When the user trys to check out the featured book, segue to the details page of the book
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        let test = segue.destination as! BookDetail
        test.test = "Eragon"
        test.please = self.image.image
        test.authorName = "Christopher Paolini"
        test.genre = "Fantasy"
    }
    

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
