//
//  Preview.swift
//
//
//  Created by Devansh Yerpude on 04/30/2018.
//  Copyright © 2018 Devansh Yerpude. All rights reserved.
//
//import various tools
import UIKit
import AVFoundation

//creates the UIView
class CameraView: UIView {
var videoPreviewLayer: AVCaptureVideoPreviewLayer {
    //safeguard against wrong type of view
    guard let layer = layer as? AVCaptureVideoPreviewLayer else {
        fatalError("Expected `AVCaptureVideoPreviewLayer` type for layer. Check PreviewView.layerClass implementation.")
    }
    return layer
}
var session: AVCaptureSession? {
    get {
        return videoPreviewLayer.session
    }
    set {
        videoPreviewLayer.session = newValue
    }
}
// MARK: UIView
override class var layerClass: AnyClass {
    return AVCaptureVideoPreviewLayer.self
}
}
