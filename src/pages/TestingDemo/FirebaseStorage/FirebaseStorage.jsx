import React, { useState } from 'react'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '@/firebase/config.js'
import './FirebaseStorage.css'

function FirebaseStorage() {
  const [file, setFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [downloadURL, setDownloadURL] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [isError, setIsError] = useState(false)

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setStatusMessage('')
      setIsError(false)
      setDownloadURL(null)
    }
  }

  const handleUpload = (e) => {
    e.preventDefault()
    if (!file) {
      setStatusMessage('Please select a file to upload.')
      setIsError(true)
      return
    }

    setIsUploading(true)
    setIsError(false)
    setUploadProgress(0)
    setStatusMessage('Starting upload...')

    // Create a unique file path (e.g., 'uploads/1678886400000_my-image.png')
    const filePath = `test-uploads/${Date.now()}_${file.name}`
    const storageRef = ref(storage, filePath)

    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Observe state change events (progress)
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setUploadProgress(progress)
        setStatusMessage(`Uploading... ${Math.round(progress)}%`)
      },
      (error) => {
        // Handle unsuccessful uploads
        console.error('FIREBASE UPLOAD ERROR:', error)
        setStatusMessage('Upload Failed! Check console for errors.')
        setIsError(true)
        setIsUploading(false)
      },
      () => {
        // Handle successful uploads on complete
        setStatusMessage('Upload complete! Getting download URL...')
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setDownloadURL(url)
          setIsUploading(false)
          setStatusMessage('File uploaded successfully!')
          setFile(null)
        })
      }
    )
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="p-4 border rounded-3 shadow-sm bg-light">
            <h2 className="h4 mb-4">Test Upload - Firebase Storage Check</h2>

            {statusMessage && (
              <div
                className={`alert ${isError ? 'alert-danger' : 'alert-info'}`}
                role="alert"
              >
                {statusMessage}
              </div>
            )}

            <form onSubmit={handleUpload}>
              <div className="mb-3">
                <label htmlFor="fileInput" className="form-label small">
                  Select Image
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="fileInput"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </div>

              {/* Upload Progress Bar */}
              {isUploading && (
                <div className="progress mb-3" style={{ height: '25px' }}>
                  <div
                    className="progress-bar progress-bar-striped progress-bar-animated"
                    role="progressbar"
                    style={{ width: `${uploadProgress}%` }}
                    aria-valuenow={uploadProgress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    {uploadProgress.toFixed(0)}%
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={isUploading || !file}
              >
                {isUploading ? 'Uploading...' : 'Upload Image'}
              </button>
            </form>

            {/* Success Message & Image Preview */}
            {downloadURL && (
              <div className="alert alert-success mt-4">
                <p className="mb-2">File uploaded successfully!</p>
                <img
                  src={downloadURL}
                  alt="Uploaded content"
                  className="img-fluid rounded shadow-sm"
                />
                <p className="mt-3 mb-0" style={{ wordBreak: 'break-all' }}>
                  <strong>URL:</strong>{' '}
                  <a
                    href={downloadURL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {downloadURL}
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FirebaseStorage
