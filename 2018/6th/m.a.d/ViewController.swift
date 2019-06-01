//
//  ViewController.swift
//
//
//  Created by Devansh Yerpude on 04/30/18.
//  Copyright © 2018 Devansh Yerpude. All rights reserved.
//

import AVFoundation
import UIKit
import Vision

class ViewController: UIViewController {

override func viewDidLoad() {
    super.viewDidLoad()
    // Do any additional setup after loading the view, typically from a nib.
    tesseract?.pageSegmentationMode = .sparseText
    // Recognize only these characters
    tesseract?.charWhitelist = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890()-+*!/?.,@#$%&"
    if isAuthorized() {
        configureTextDetection()
        configureCamera()
    }
}
    
    @IBAction func exit(_ sender: Any) {
        performSegue(withIdentifier: "exitSeg", sender: self)
    }
    
    
    

override func didReceiveMemoryWarning() {
    super.didReceiveMemoryWarning()
    // Dispose of any resources that can be recreated.
}
    //detects any "boxes"
private func configureTextDetection() {
    textDetectionRequest = VNDetectTextRectanglesRequest(completionHandler: handleDetection)
    textDetectionRequest?.reportCharacterBoxes = true
}
    //configures camera
private func configureCamera() {
    cameraView.session = session
    //sets up so that the back camera is used, since front camera doesn't have a high enough resolution
    let cameraDevices = AVCaptureDevice.DiscoverySession(deviceTypes: [.builtInWideAngleCamera], mediaType: AVMediaType.video, position: .back)
    var cameraDevice: AVCaptureDevice?
    for device in cameraDevices.devices {
        if device.position == .back {
            cameraDevice = device
            break
        }
    }
    do {
        let captureDeviceInput = try AVCaptureDeviceInput(device: cameraDevice!)
        if session.canAddInput(captureDeviceInput) {
            session.addInput(captureDeviceInput)
        }
    }
    catch {
        print("Error occured \(error)")
        return
    }
    //starts the video feed to work with
    session.sessionPreset = .high
    let videoDataOutput = AVCaptureVideoDataOutput()
    videoDataOutput.setSampleBufferDelegate(self, queue: DispatchQueue(label: "Buffer Queue", qos: .userInteractive, attributes: .concurrent, autoreleaseFrequency: .inherit, target: nil))
    if session.canAddOutput(videoDataOutput) {
        session.addOutput(videoDataOutput)
    }
    cameraView.videoPreviewLayer.videoGravity = .resize
    session.startRunning()
}
    //handles after text has been detected
private func handleDetection(request: VNRequest, error: Error?) {
    
    guard let detectionResults = request.results else {
        print("No detection results")
        return
    }
    let textResults = detectionResults.map() {
        return $0 as? VNTextObservation
    }
    if textResults.isEmpty {
        return
    }
    textObservations = textResults as! [VNTextObservation]
    DispatchQueue.main.async {
        
        guard let sublayers = self.view.layer.sublayers else {
            return
        }
        for layer in sublayers[1...] {
            if (layer as? CATextLayer) == nil {
                layer.removeFromSuperlayer()
            }
        }
        let viewWidth = self.view.frame.size.width
        let viewHeight = self.view.frame.size.height
        for result in textResults {
//takes detected text and puts a box around it, not yet putting text in the field.
            if let textResult = result {
                
                let layer = CALayer()
                var rect = textResult.boundingBox
                rect.origin.x *= viewWidth
                rect.size.height *= viewHeight
                rect.origin.y = ((1 - rect.origin.y) * viewHeight) - rect.size.height
                rect.size.width *= viewWidth

                layer.frame = rect
                layer.borderWidth = 2
                layer.borderColor = UIColor(red:1.00, green:0.44, blue:0.35, alpha:1.0).cgColor
                self.view.layer.addSublayer(layer)
            }
        }
    }
}
private var cameraView: CameraView {
    return view as! CameraView
}
    
    //figures out authorization (privacy settings) for camera
private func isAuthorized() -> Bool {
    let authorizationStatus = AVCaptureDevice.authorizationStatus(for: AVMediaType.video)
    switch authorizationStatus {
    case .notDetermined:
        AVCaptureDevice.requestAccess(for: AVMediaType.video,
                                      completionHandler: { (granted:Bool) -> Void in
                                        if granted {
                                            DispatchQueue.main.async {
                                                self.configureTextDetection()
                                                self.configureCamera()
                                            }
                                        }
        })
        return true
    case .authorized:
        return true
    case .denied, .restricted: return false
    }
}
private var textDetectionRequest: VNDetectTextRectanglesRequest?
private let session = AVCaptureSession()
private var textObservations = [VNTextObservation]()
private var tesseract = G8Tesseract(language: "eng", engineMode: .tesseractOnly)
private var font = CTFontCreateWithName("Helvetica" as CFString, 18, nil)
}

extension ViewController: AVCaptureVideoDataOutputSampleBufferDelegate {
// MARK: - Camera Delegate and Setup
func captureOutput(_ output: AVCaptureOutput, didOutput sampleBuffer: CMSampleBuffer, from connection: AVCaptureConnection) {
    guard let pixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else {
        return
    }
    var imageRequestOptions = [VNImageOption: Any]()
    if let cameraData = CMGetAttachment(sampleBuffer, kCMSampleBufferAttachmentKey_CameraIntrinsicMatrix, nil) {
        imageRequestOptions[.cameraIntrinsics] = cameraData
    }
    let imageRequestHandler = VNImageRequestHandler(cvPixelBuffer: pixelBuffer, orientation: CGImagePropertyOrientation(rawValue: 6)!, options: imageRequestOptions)
    do {
        try imageRequestHandler.perform([textDetectionRequest!])
    }
    catch {
        print("Error occured \(error)")
    }
    var ciImage = CIImage(cvPixelBuffer: pixelBuffer)
    let transform = ciImage.orientationTransform(for: CGImagePropertyOrientation(rawValue: 6)!)
    ciImage = ciImage.transformed(by: transform)
    let size = ciImage.extent.size
    var recognizedTextPositionTuples = [(rect: CGRect, text: String)]()
    for textObservation in textObservations {
        guard let rects = textObservation.characterBoxes else {
            continue
        }
        var xMin = CGFloat.greatestFiniteMagnitude
        var xMax: CGFloat = 0
        var yMin = CGFloat.greatestFiniteMagnitude
        var yMax: CGFloat = 0
        for rect in rects {
            
            xMin = min(xMin, rect.bottomLeft.x)
            xMax = max(xMax, rect.bottomRight.x)
            yMin = min(yMin, rect.bottomRight.y)
            yMax = max(yMax, rect.topRight.y)
        }
        //creates smaller and smaller images within the live video stream so that text is easy to handle. 
        let imageRect = CGRect(x: xMin * size.width, y: yMin * size.height, width: (xMax - xMin) * size.width, height: (yMax - yMin) * size.height)
        let context = CIContext(options: nil)
        guard let cgImage = context.createCGImage(ciImage, from: imageRect) else {
            continue
        }
        let uiImage = UIImage(cgImage: cgImage)
        tesseract?.image = uiImage
        tesseract?.recognize()
        guard var text = tesseract?.recognizedText else {
            continue
        }
        text = text.trimmingCharacters(in: CharacterSet.newlines)
        
        if !text.isEmpty {
            let x = xMin
            let y = 1 - yMax
            let width = xMax - xMin
            let height = yMax - yMin
            recognizedTextPositionTuples.append((rect: CGRect(x: x, y: y, width: width, height: height), text: text))
        }
    }
    textObservations.removeAll()
    DispatchQueue.main.async {
        let viewWidth = self.view.frame.size.width
        let viewHeight = self.view.frame.size.height
        guard let sublayers = self.view.layer.sublayers else {
            return
        }
        for layer in sublayers[1...] {
            
            if let _ = layer as? CATextLayer {
                layer.removeFromSuperlayer()
            }
        }
        //takes array of recognized text and puts it into the boxes
        for tuple in recognizedTextPositionTuples {
            let textLayer = CATextLayer()
            
            textLayer.backgroundColor = UIColor.clear.cgColor
            textLayer.font = self.font
            var rect = tuple.rect

            rect.origin.x *= viewWidth
            rect.size.width *= viewWidth
            rect.origin.y *= viewHeight
            rect.size.height *= viewHeight
            
            // Increase the size of text layer to show text of large lengths
            rect.size.width += 100
            rect.size.height += 100
          
        
            
            textLayer.frame = rect
            textLayer.string = tuple.text
            textLayer.foregroundColor = UIColor(red:0.38, green:0.85, blue:0.79, alpha:1.0).cgColor
            self.view.layer.addSublayer(textLayer)
            
        }
    }
}
    @objc func action(sender:UIButton!){
        self.performSegue(withIdentifier: "visionSeg", sender: self)
        
        
    }
}
