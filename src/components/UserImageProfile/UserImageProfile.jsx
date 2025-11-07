import { useState, useRef } from 'react'
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage'
import { ref as dbRef, update } from 'firebase/database'
import { storage, db, auth } from '@/libs/firebase'
import { useUser } from '@/contexts/UserContext'
import './UserImageProfile.css'
import DefaultProfile from '@/assets/images/default-profile.png'

function UserImageProfile({ userData }) {
  const { refreshUserData } = useUser()
  const fileInputRef = useRef(null)

  const [selectedFile, setSelectedFile] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [fileError, setFileError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [generalError, setGeneralError] = useState('')
  const [imageLoadError, setImageLoadError] = useState(false)

  const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg']
  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

  const validateFile = (file) => {
    if (!file) {
      return 'Please select an image file.'
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Invalid file type. Please select a valid image file.'
    }

    if (file.size > MAX_FILE_SIZE) {
      return 'File size too large. Maximum size is 5MB.'
    }

    return null
  }

  const handleImageError = () => {
    setImageLoadError(true)

    //clean up the broken reference in the database
    const user = auth.currentUser
    if (user && userData?.profileImage) {
      const userRef = dbRef(db, `users/${user.uid}`)
      update(userRef, {
        profileImage: null,
        profileImagePath: null
      }).catch((err) =>
        console.error('Error clearing broken image reference:', err)
      )
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]

    setFileError('')
    setSuccessMessage('')
    setGeneralError('')
    setImageLoadError(false)

    if (!file) {
      setSelectedFile(null)
      setPreviewImage(null)
      return
    }

    const error = validateFile(file)
    if (error) {
      setFileError(error)
      setSelectedFile(null)
      setPreviewImage(null)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }

    setSelectedFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewImage(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleRemove = () => {
    setSelectedFile(null)
    setPreviewImage(null)
    setFileError('')
    setSuccessMessage('')
    setGeneralError('')
    setImageLoadError(false)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setSuccessMessage('')
    setGeneralError('')
    setFileError('')

    if (!selectedFile) {
      setFileError('Please select an image file.')
      return
    }

    const validationError = validateFile(selectedFile)
    if (validationError) {
      setFileError(validationError)
      return
    }

    setIsUploading(true)

    try {
      const user = auth.currentUser
      if (!user) {
        setGeneralError('No authenticated user found. Please log in again.')
        setIsUploading(false)
        return
      }

      const timestamp = Date.now()
      const fileExtension = selectedFile.name.split('.').pop()
      const fileName = `profile_${user.uid}_${timestamp}.${fileExtension}`

      const imageRef = storageRef(
        storage,
        `profile-images/${user.uid}/${fileName}`
      )

      //delete old profile image if exists
      if (userData?.profileImage && userData?.profileImagePath) {
        try {
          const oldImageRef = storageRef(storage, userData.profileImagePath)
          await deleteObject(oldImageRef)
        } catch (deleteError) {
          console.warn('Could not delete old image:', deleteError)
          //continue anyway, pedeng old image might not exist
        }
      }

      await uploadBytes(imageRef, selectedFile)

      const downloadURL = await getDownloadURL(imageRef)

      const userRef = dbRef(db, `users/${user.uid}`)
      await update(userRef, {
        profileImage: downloadURL,
        profileImagePath: `profile-images/${user.uid}/${fileName}`,
        updatedAt: Date.now()
      })

      await refreshUserData()

      setSuccessMessage('Your profile image has been updated successfully.')

      setSelectedFile(null)
      setPreviewImage(null)
      setImageLoadError(false)

      setTimeout(() => {
        setSuccessMessage('')
      }, 5000)

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Error uploading profile image:', error)

      if (error.code === 'storage/unauthorized') {
        setGeneralError('You do not have permission to upload images.')
      } else if (error.code === 'storage/canceled') {
        setGeneralError('Upload was canceled.')
      } else if (error.code === 'storage/unknown') {
        setGeneralError('An unknown error occurred during upload.')
      } else {
        setGeneralError(
          'Failed to update. Something went wrong, please try again later.'
        )
      }
    } finally {
      setIsUploading(false)
    }
  }

  const displayImage =
    previewImage ||
    (!imageLoadError && userData?.profileImage) ||
    DefaultProfile

  return (
    <div className="profile-image-section">
      {/* Success Message */}
      {successMessage && (
        <div
          className="alert alert-success d-flex align-items-center w-100"
          role="alert"
        >
          <i className="fa-solid fa-circle-check bi flex-shrink-0 me-2"></i>
          <div>{successMessage}</div>
        </div>
      )}

      {/* Error Message */}
      {generalError && (
        <div
          className="alert alert-danger d-flex align-items-center w-100"
          role="alert"
        >
          <i className="fa-solid fa-triangle-exclamation bi flex-shrink-0 me-2"></i>
          <div>{generalError}</div>
        </div>
      )}

      <form
        className="profile-image-form d-flex flex-column align-items-center"
        encType="multipart/form-data"
        onSubmit={handleSubmit}
      >
        <div className="profile-image-wrapper mb-3">
          <img
            src={displayImage}
            alt="Profile"
            className="profile-img"
            onError={handleImageError}
          />
        </div>
        <small className="text-muted d-block mb-1">
          Update profile with accepted formats (e.g., .png, .jpg, .jpeg)
        </small>
        <div className="profile-upload-controls">
          <input
            ref={fileInputRef}
            type="file"
            className="form-control file-select-input"
            placeholder="Select file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleFileChange}
            disabled={isUploading}
          />

          {!selectedFile ? (
            <button
              type="submit"
              className="btn btn-primary save-file-btn"
              disabled
              style={{ display: 'none' }}
            >
              Save
            </button>
          ) : (
            <button
              type="submit"
              className="btn btn-primary save-file-btn"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </button>
          )}

          {selectedFile && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleRemove}
              disabled={isUploading}
            >
              Remove
            </button>
          )}
        </div>

        {fileError && <small className="text-danger">{fileError}</small>}
      </form>
    </div>
  )
}

export default UserImageProfile
