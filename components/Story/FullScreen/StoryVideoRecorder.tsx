"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Camera, RotateCcw, SwitchCamera, Upload, Loader2 } from "lucide-react";
import { uploadFiles } from "@/utils/uploadthing";

interface Props {
    onUploadComplete: (url: string) => void;
}

export default function VideoRecorder({ onUploadComplete }: Props) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunks = useRef<Blob[]>([]);

    const [stream, setStream] = useState<MediaStream | null>(null);
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
    const [recording, setRecording] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
    const [timeLeft, setTimeLeft] = useState(10);

    // Inicia cámara al montar o al cambiar cámara
    useEffect(() => {
        initCamera();
        return () => stopStream();
    }, [facingMode]);

    // Timer 10s durante grabación
    useEffect(() => {
        if (recording && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
            return () => clearTimeout(timer);
        }
        if (recording && timeLeft === 0) stopRecording();
    }, [recording, timeLeft]);

    const initCamera = async () => {
        stopStream();
        try {
            const newStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: { ideal: facingMode }, // frontal o trasera
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                },
                audio: true,
            });

            setStream(newStream);
            if (videoRef.current) {
                videoRef.current.srcObject = newStream;
                videoRef.current.muted = true;
                videoRef.current.playsInline = true;
                videoRef.current.autoplay = true;
                await videoRef.current.play();
            }
        } catch (err) {
            console.error("Error accediendo a cámara:", err);
            toast.error("No se pudo acceder a la cámara");
        }
    };

    const stopStream = () => {
        stream?.getTracks().forEach((track) => track.stop());
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    };

    const startRecording = () => {
        if (!stream) return;
        setRecording(true);
        setTimeLeft(10);
        setRecordedBlob(null);
        chunks.current = [];

        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (e) => e.data.size && chunks.current.push(e.data);
        recorder.onstop = () => {
            const blob = new Blob(chunks.current, { type: "video/webm" });
            setRecordedBlob(blob);

            if (videoRef.current) {
                videoRef.current.srcObject = null;
                videoRef.current.src = URL.createObjectURL(blob);
                videoRef.current.controls = true;
                videoRef.current.play();
            }
        };
        mediaRecorderRef.current = recorder;
        recorder.start();
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        stopStream();
        setRecording(false);
    };

    const uploadVideo = async () => {
        if (!recordedBlob) return;
        try {
            setUploading(true);
            const file = new File([recordedBlob], "video.webm", { type: "video/webm" });
            const res = await uploadFiles("storyImageUploader", { files: [file] });
            const url = res?.[0]?.url;
            if (url) {
                onUploadComplete(url);
                toast.success("Video subido");
            }
        } catch {
            toast.error("Error al subir video");
        } finally {
            setUploading(false);
        }
    };

    const reset = () => {
        setRecordedBlob(null);
        setTimeLeft(10);
        setRecording(false);
        if (videoRef.current) {
            videoRef.current.src = "";
            videoRef.current.controls = false;
        }
        initCamera();
    };

    const toggleCamera = () => {
        setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    };

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            <div className="relative w-full rounded-xl overflow-hidden border border-white/20 bg-white/5 backdrop-blur-md">
                <video
                    ref={videoRef}
                    className="w-full aspect-video"
                    autoPlay
                    playsInline
                    muted
                />
                {recording && (
                    <div className="absolute bottom-2 left-2 text-sm text-white bg-black/60 px-2 py-1 rounded-full">
                        ⏳ {timeLeft}s
                    </div>
                )}
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
                {!recording && !recordedBlob && !uploading && (
                    <>
                        <button
                            onClick={startRecording}
                            className="px-5 py-2 rounded-full bg-pink-600/10 text-pink-300 border border-pink-600/30"
                        >
                            <Camera className="inline mr-1" size={18} />
                            Grabar
                        </button>

                        <button
                            onClick={toggleCamera}
                            className="px-5 py-2 rounded-full bg-blue-600/10 text-blue-300 border border-blue-600/30"
                        >
                            <SwitchCamera className="inline mr-1" size={18} />
                            Cambiar cámara
                        </button>
                    </>
                )}

                {recordedBlob && !recording && !uploading && (
                    <>
                        <button
                            onClick={uploadVideo}
                            className="px-5 py-2 rounded-full bg-green-600/10 text-green-300 border border-green-600/30"
                        >
                            <Upload className="inline mr-1" size={18} />
                            Subir video
                        </button>

                        <button
                            onClick={reset}
                            className="px-5 py-2 rounded-full bg-yellow-600/10 text-yellow-300 border border-yellow-600/30"
                        >
                            <RotateCcw className="inline mr-1" size={18} />
                            Regrabar
                        </button>
                    </>
                )}

                {uploading && (
                    <div className="flex items-center gap-2 text-white text-sm">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Subiendo...
                    </div>
                )}
            </div>
        </div>
    );
}
