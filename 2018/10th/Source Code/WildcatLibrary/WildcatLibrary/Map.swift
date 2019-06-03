

import UIKit

class Map: UIViewController {
    
    @IBOutlet weak var map: UIImageView!
    @IBOutlet weak var switchControl: UISegmentedControl!
    override func viewDidLoad() {
        super.viewDidLoad()
        // Set the default image displayed as the school map
        map.image = UIImage(named: "floor1")
        
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
    // Function to switch between school map and library map
    @IBAction func switchAction(_ sender: Any) {
        let title = switchControl.titleForSegment(at: switchControl.selectedSegmentIndex)
        
        // set image to school map if user selects school
        if title == "School" {
            map.image = UIImage(named: "floor1")
            let frame = self.switchControl.frame
            self.switchControl.frame = CGRect(x: frame.origin.x, y: frame.origin.y, width: frame.size.width, height: 29)
        }
        
        // otherwise set image to library map
        else {
            map.image = UIImage(named: "placeholder map")
            let frame = self.switchControl.frame
            self.switchControl.frame = CGRect(x: frame.origin.x, y: frame.origin.y, width: frame.size.width, height: 29)
        }
    }

}
