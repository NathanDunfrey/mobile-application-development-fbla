
import UIKit

class Genres: UIViewController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // if ios 11 is available, display large title
        if #available(iOS 11.0, *) {
            navigationController?.navigationBar.prefersLargeTitles = true
            navigationController?.navigationBar.largeTitleTextAttributes =
                [NSAttributedStringKey.foregroundColor : UIColor.white]
        } else {
            
        }
        
    }

    // When the user clicks on a genre, segue to a list of all the books in that genre
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        let final = segue.destination as! List
        let senderButton = sender as! UIButton
        final.genre = senderButton.title(for: .normal)
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }

}
