// Class to display each book in the list to a user


import UIKit

class Cell: UITableViewCell {

    
    @IBOutlet weak var picture: UIImageView!
    @IBOutlet weak var title: UILabel!
    @IBOutlet weak var picture1: UIImageView!
    @IBOutlet weak var title1: UILabel!
    override func awakeFromNib() {
        
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)
        
    }
    
    

}
