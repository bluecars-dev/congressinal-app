import React, { useRef, useState, useEffect } from 'react';
import { X, HelpCircle, SwitchCamera, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface CameraScannerProps {
  onCapture: (base64Image: string, mimeType: string) => void;
  onClose: () => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [guidanceTip, setGuidanceTip] = useState<string>('Hold steady');
  const [showTipsModal, setShowTipsModal] = useState<boolean>(false);
  const [isShutterActive, setIsShutterActive] = useState<boolean>(false);

  // Dynamic guidance tips cycling
  useEffect(() => {
    const tips = ['Hold steady', 'Position product inside frame', 'Ensure label is visible', 'Good lighting detected'];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % tips.length;
      setGuidanceTip(tips[idx]);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  // Initialize camera stream
  useEffect(() => {
    let currentStream: MediaStream | null = null;

    async function startCamera() {
      try {
        setCameraError(null);
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }

        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        };

        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        currentStream = mediaStream;
        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(() => {});
        }
      } catch (err: any) {
        console.warn('Camera access unavailable:', err);
        setCameraError(
          err.name === 'NotAllowedError'
            ? 'Camera permission was denied. You can still upload a photo from your gallery.'
            : 'Camera stream could not be started. You can upload an image from your gallery.'
        );
      }
    }

    startCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleCapture = () => {
    setIsShutterActive(true);
    setTimeout(() => setIsShutterActive(false), 200);

    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64 = canvas.toDataURL('image/jpeg', 0.92);
        onCapture(base64, 'image/jpeg');
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64 = uploadEvent.target?.result as string;
        if (base64) {
          onCapture(base64, file.type || 'image/jpeg');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0C0E] flex flex-col justify-between select-none overflow-hidden max-w-md mx-auto">
      {/* Top Bar */}
      <div className="relative z-20 flex items-center justify-between px-6 pt-6 pb-4">
        <button
          onClick={onClose}
          type="button"
          aria-label="Close scanner"
          className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-[#F5F5F5] active:scale-95 transition-transform"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="text-xs  tracking-widest text-[#A6A7AB] uppercase">
          Scanner
        </span>

        <button
          onClick={() => setShowTipsModal(true)}
          type="button"
          aria-label="Scanning tips"
          className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-[#F5F5F5] active:scale-95 transition-transform"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>

      {/* Main Viewport */}
      <div className="relative flex-1 w-full flex flex-col items-center justify-center px-6">
        {/* Live Camera Video */}
        {!cameraError ? (
          <div className="absolute inset-0 overflow-hidden">
            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              className="w-full h-full object-cover"
            />
            {/* Dark vignette overlay */}
            <div className="absolute inset-0 bg-black/40 pointer-events-none" />
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-[#0B0C0E]">
            <AlertCircle className="w-8 h-8 text-[#A6A7AB] mb-3" />
            <p className="text-sm text-[#F5F5F5] font-medium mb-1">Live Preview Inactive</p>
            <p className="text-xs text-[#A6A7AB] leading-relaxed max-w-xs mb-6">{cameraError}</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 rounded-full glass-panel text-xs text-[#F5F5F5] font-medium hover:bg-white/10"
            >
              Choose from Gallery
            </button>
          </div>
        )}

        {/* Reticle Framing Box */}
        <div className="relative z-10 w-full max-w-[300px] aspect-[4/5] pointer-events-none flex flex-col items-center justify-between p-4">
          {/* Subtle Corner Brackets */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/60 rounded-tl-xl" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/60 rounded-tr-xl" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/60 rounded-bl-xl" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/60 rounded-br-xl" />

          {/* Framing Guidance Label */}
          <div className="pt-2 text-center">
            <span className="text-[11px]  tracking-wider text-white/80 uppercase px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
              Position product inside frame
            </span>
          </div>

          {/* Center Crosshair Marker */}
          <div className="w-3 h-3 border border-white/40 rounded-full opacity-60" />

          {/* Dynamic Feedback */}
          <div className="pb-2 text-center">
            <span className="text-xs text-white/90 font-medium px-3.5 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15 animate-fade-in">
              {guidanceTip}
            </span>
          </div>
        </div>

        {/* Shutter flash animation */}
        {isShutterActive && (
          <div className="absolute inset-0 bg-white/40 pointer-events-none z-30 transition-opacity duration-150" />
        )}
      </div>

      {/* Bottom Controls */}
      <div className="relative z-20 px-6 pb-10 pt-4 flex flex-col items-center gap-4 bg-gradient-to-t from-[#0B0C0E] via-[#0B0C0E]/90 to-transparent">
        <div className="w-full flex items-center justify-between max-w-xs">
          {/* Switch Camera */}
          <button
            type="button"
            onClick={toggleCamera}
            disabled={Boolean(cameraError)}
            className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-[#F5F5F5] active:scale-95 transition-transform disabled:opacity-30"
            title="Switch front/back camera"
          >
            <SwitchCamera className="w-5 h-5 text-[#A6A7AB]" />
          </button>

          {/* Shutter Capture Button */}
          <button
            type="button"
            onClick={handleCapture}
            disabled={Boolean(cameraError)}
            aria-label="Capture product image"
            className="w-20 h-20 rounded-full border-2 border-white/80 p-1 flex items-center justify-center active:scale-90 transition-transform disabled:opacity-40"
          >
            <div className="w-full h-full rounded-full bg-white active:bg-white/80 transition-colors shadow-lg" />
          </button>

          {/* Upload from Gallery Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-[#F5F5F5] active:scale-95 transition-transform"
            title="Upload from gallery"
          >
            <ImageIcon className="w-5 h-5 text-[#A6A7AB]" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-xs text-[#A6A7AB] hover:text-[#F5F5F5] transition-colors underline underline-offset-4 decoration-white/20 pt-1"
        >
          Upload from gallery
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Hidden rendering canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Guidance Tips Modal */}
      {showTipsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="w-full max-w-sm glass-panel rounded-2xl p-6 border border-white/15 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm text-[#F5F5F5]">Best Scanning Results</h3>
              <button
                onClick={() => setShowTipsModal(false)}
                className="text-[#A6A7AB] hover:text-[#F5F5F5] text-xs "
              >
                &times; Close
              </button>
            </div>
            <ul className="text-xs text-[#A6A7AB] space-y-2.5 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-[#F5F5F5] ">1.</span>
                <span>Include brand logos, model markings, tags, or serial numbers in clear focus.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#F5F5F5] ">2.</span>
                <span>Avoid glare and harsh reflections on glossy plastic or packaging foil.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#F5F5F5] ">3.</span>
                <span>Ensure packaging barcodes and nutrition/drug facts tables are fully legible.</span>
              </li>
            </ul>
            <button
              onClick={() => setShowTipsModal(false)}
              className="w-full py-2.5 rounded-xl bg-white text-black font-medium text-xs hover:bg-[#eaeaea] transition-colors mt-2"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
