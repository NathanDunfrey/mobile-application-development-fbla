//
//  FireBaseUIImageCacheExtension.swift
//  Picket
//
//  Created by Yash Kakodkar on 2/5/17.
//  Copyright © 2017 Yash Kakodkar. All rights reserved.
//

import UIKit

//create a cache
let imageCache =  NSCache<AnyObject, AnyObject>()

class CustomImageView: UIImageView {
    
    var imageUrlString: String?
    
    //load image from an url (from Firebase Storage)
    func loadImageUsingUrlString(urlString: String) {
        
        imageUrlString = urlString
        
        let url = NSURL(string: urlString)
        
        image = nil
        
        if let imageFromCache = imageCache.object(forKey: urlString as AnyObject) as? UIImage {
            self.image = imageFromCache
            return
        }
        
        //get image
        URLSession.shared.dataTask(with: url! as URL, completionHandler: { (data, respones, error) in
            
            if error != nil {
                return
            }
            
            //switch back to main thread
            DispatchQueue.main.async(execute: {
                
                let imageToCache = UIImage(data: data!)
                
                if self.imageUrlString == urlString {
                    self.image = imageToCache
                }
                
                imageCache.setObject(imageToCache!, forKey: urlString as AnyObject)
            })
            
        }).resume()
    }
    
}

