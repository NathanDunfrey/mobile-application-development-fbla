//
//  Loading.swift
//  m.a.d
//
//  Created by Devansh Yerpude on 4/26/18.
//  Copyright © 2018 Devansh Yerpude. All rights reserved.
//

import UIKit

class Loading: UIViewController {
    //sets up image view as outlet for GIF load
    @IBOutlet var GifView: UIImageView!
    

    

    override func viewDidLoad() {
        super.viewDidLoad()
        //call premade gif function
        GifView.loadGif(name: "screen")
        // after a time of seven seconds, automatically segue to next screen
        let timer = Timer.scheduledTimer(timeInterval: 7, target: self, selector: #selector(timeToMove), userInfo: nil, repeats: false)
        

        // Do any additional setup after loading the view.
    }
    //defines "time to move called for segue"
    @objc func timeToMove(){
        self.performSegue(withIdentifier: "loadingSeg", sender: self)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    

}
