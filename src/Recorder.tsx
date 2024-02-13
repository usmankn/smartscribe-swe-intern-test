import React, { useState, useEffect, useRef } from "react";
import { UploadManager } from "./UploadManager";

// Define props interface for RecordingComponent
interface RecordingProps {
  onDownloadRecording?: () => void; // Optional callback function for when a recording is downloaded
}

// RecordingComponent functional component
const RecordingComponent: React.FC<RecordingProps> = ({
  onDownloadRecording,
}) => {
  // State variables to manage recording process
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingName, setRecordingName] = useState<string>("");
  const [progressTime, setProgressTime] = useState<number>(0);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [downloadStatus, setDownloadStatus] = useState<string>("");
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [hasMicrophoneAccess, setHasMicrophoneAccess] = useState<boolean>(false);

  // Reference for MediaRecorder and progress interval
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const progressInterval = useRef<number | null>(null);

  // Effect to request microphone access and set up MediaRecorder
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        setHasMicrophoneAccess(true);
        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.ondataavailable = (event) => {
          setAudioChunks((prev) => [...prev, event.data]);
        };
      })
      .catch(() => setHasMicrophoneAccess(false));
  }, []);

  // Effect to update audio URL when recording ends
  useEffect(() => {
    if (!isRecording && audioChunks.length > 0) {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm; codecs=opus" });
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
    }
  }, [audioChunks, isRecording]);

  // Function to start recording
  const handleStartRecording = () => {
    if (!mediaRecorder.current || !hasMicrophoneAccess || recordingName === "") return;
    setAudioChunks([]);
    setAudioUrl("");
    setDownloadStatus("");
    mediaRecorder.current.start();
    setIsRecording(true);
    setProgressTime(0);
    progressInterval.current = setInterval(() => {
      setProgressTime((prevTime) => prevTime + 1);
    }, 1000);
  };

  // Function to stop recording
  const handleStopRecording = () => {
    if (mediaRecorder.current && progressInterval.current) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  };

  // Function to handle downloading the recording
  const handleDownload = () => {
    if (audioUrl) {
      const link = document.createElement("a");
      link.href = audioUrl;
      link.download = recordingName || "new_recording";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadStatus("Download completed");
      onDownloadRecording?.();
    }
  };

  // Function to handle uploading the recording
  const handleUpload = () => {
    const audioBlob = new Blob(audioChunks, { type: "audio/webm; codecs=opus" });
    setUploadStatus("Uploading...");
    UploadManager.upload(audioBlob).then((result) => {
      setUploadStatus(`Upload successful: Transcript - "${result.transcript}"`);
    }).catch((error) => {
      setUploadStatus("Upload failed: " + error.message);
    });
  };

  // Render UI components based on microphone access
  return (
    <div>
      {hasMicrophoneAccess ? (
        <>
          <input
            type="text"
            value={recordingName}
            onChange={(e) => setRecordingName(e.target.value)}
            placeholder="Name your recording"
            disabled={isRecording}
          />
          <button onClick={handleStartRecording} disabled={isRecording || recordingName === ""}>Start Recording</button>
          <button onClick={handleStopRecording} disabled={!isRecording}>Stop Recording</button>
          {audioUrl && (
            <>
              <button onClick={handleDownload}>Download Recording</button>
              <button onClick={handleUpload} disabled={isRecording || uploadStatus === "Uploading..."}>Upload</button>
            </>
          )}
          <div>Progress Time: {progressTime} seconds</div>
          <div>{downloadStatus}</div>
          <div>{uploadStatus}</div>
        </>
      ) : (
        <p>Please grant microphone access to start recording.</p>
      )}
    </div>
  );
};

export default RecordingComponent;