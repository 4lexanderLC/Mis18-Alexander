import AVFoundation
import AppKit

// Uso: swift portadas-video.swift entrada.mp4 salida.jpg
let args = CommandLine.arguments
guard args.count == 3 else { fatalError("Indica el video y la portada de salida") }
let asset = AVURLAsset(url: URL(fileURLWithPath: args[1]))
let generator = AVAssetImageGenerator(asset: asset)
generator.appliesPreferredTrackTransform = true
generator.maximumSize = CGSize(width: 640, height: 640)
let frame = try generator.copyCGImage(at: CMTime(seconds: 0.1, preferredTimescale: 600), actualTime: nil)
let bitmap = NSBitmapImageRep(cgImage: frame)
let data = bitmap.representation(using: .jpeg, properties: [.compressionFactor: 0.8])!
try data.write(to: URL(fileURLWithPath: args[2]))
