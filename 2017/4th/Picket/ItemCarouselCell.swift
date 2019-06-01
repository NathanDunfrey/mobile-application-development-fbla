//
//  ItemCarouselCell.swift
//  Picket
//
//  Created by Yash Kakodkar on 2/10/17.
//  Copyright © 2017 Yash Kakodkar. All rights reserved.
//

import UIKit

class ItemCarouselCell: UITableViewCell, UIScrollViewDelegate {
    
    // outlets to user interface items in the view controller
    @IBOutlet weak var container: UIScrollView!
    @IBOutlet weak var pager: UIPageControl!
    
    var count = 0
    
    func setUpCell(imageURLs: [String]) {
        
        //setup paging
        count = imageURLs.count
        container.delegate = self
        pager.size(forNumberOfPages: count)
        
        let scrollViewWidth:CGFloat = self.container.frame.width
        
        container.isPagingEnabled = true
        container.contentSize = CGSize(width: UIScreen.main.bounds.width, height: 200)
        container.showsHorizontalScrollIndicator = false
        
        //add images
        for (index, url) in imageURLs.enumerated() {
            let image = CustomImageView()
            image.loadImageUsingUrlString(urlString: url)
            image.contentMode = .scaleAspectFill
            self.container.addSubview(image)
            image.frame.size.width = scrollViewWidth
            image.frame.origin.x = CGFloat(index) * UIScreen.main.bounds.width
            
        }
    }
    
    func scrollViewDidScroll(_ scrollView: UIScrollView) {
        //enable the user to scroll through images
        let page = container.contentOffset.x/container.frame.size.width
        pager.currentPage = Int(page)
    }
    
}
