Recording Component changes README


## Stage I - Fix the problems
- Timer Issue: The timer keeps going up after pressing stop.
    Solution: In the handleStopRecording function, added a line to reset the progress time (setProgressTime(0)) when stopping the recording.

- Download Status: The app does not update the download status message after the user downloads the audio.
    Solution: Introduced a new state variable downloadStatus to manage the download status message. Updated the handleDownload function to set the download status message after the audio is downloaded.

## Stage II - Improve the UX
- Microphone Permission: Don't show the start recording button unless the user has granted microphone permissions.
    Solution: Utilized the hasMicrophoneAccess state to conditionally render the start recording button based on microphone permission.

- Recording Name Validation: Don't let the user start the recording unless they have named the recording already.
    Solution: Disabled the start recording button (disabled={recordingName === ""}) until the user inputs a recording name.

- Dynamic Download Name: Make the name of the downloaded file the same as the name of the recording.
    Solution: Modified the download link generation in the handleDownload function to use the recordingName as the filename (link.download = recordingName || "new_recording";).

## Stage III - Implement a new feature
Upload Feature: Added an "Upload" button to trigger the handleUpload function, simulating a transcription process.
    Solution: Introduced a new button and implemented the handleUpload function to upload the recorded audio. Utilized a UploadManager module to handle the upload process asynchronously.

Added UI to indicate uploading status.
    Solution: Utilized a state variable uploadStatus to manage the upload status message and displayed it in the UI.

Added UI to handle upload success and failure, displaying relevant messages.
    Solution: Updated the handleUpload function to set appropriate messages in the uploadStatus state based on the upload result (success or failure).

## BONUS: Stage IV - Indicate Microphone Input Volume
Microphone Input Volume: Optional feature to provide feedback on microphone input volume while recording.
    Solution: Not addressed in the provided code. This feature would require additional implementation, possibly utilizing Web Audio API to analyze input volume and provide visual feedback in the UI.
    - unfortanuetly I did not have enough time to implement this, however this implementation should be fairly easy and concise.

## Notes:
- The focus was primarily on functionality, code clarity, and efficiency.
- I have added comments to easily understand and edit the code.
- Valid TypeScript was used throughout the implementation.
- The UI enhancements were considered, but the primary emphasis was on functionality.
- The component utilizes MediaRecorder for recording audio and manages states and effects for various functionalities.
- Future improvements could include additional features such as audio playback, editing options, and real-time transcription.


## Authors
This README and the corresponding code enhancements were implemented by Usman Khan for smartscribe-swe-intern-test.
