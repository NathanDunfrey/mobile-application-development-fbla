

import UIKit

//Stores all the images in an NSCache to make loading faster
let imageCache =  NSCache<AnyObject, AnyObject>()


// Custom image View class with a function to load images with url
class CustomImageView: UIImageView {
    
    var urlStr: String?
    
    func loadImageUsingUrlString(urlString: String) {
        
        urlStr = urlString
        
        let url = NSURL(string: urlString)
        
        image = nil
        
        //If image was already loaded and is in cache, return that image
        if let cachedImage = imageCache.object(forKey: urlString as AnyObject) as? UIImage {
            self.image = cachedImage
            return
        }
        
        //If need to download a new image
        URLSession.shared.dataTask(with: url! as URL, completionHandler: { (data, respones, error) in
            
            if error != nil {
                return
            }
            
            //go to main thread
            DispatchQueue.main.async(execute: {
                let cashedImage = UIImage(data: data!)
                
                if self.urlStr == urlString {
                    //set image
                    self.image = cashedImage
                }
                imageCache.setObject(cashedImage!, forKey: urlString as AnyObject)
            })
            
        }).resume()
    }
    
}
