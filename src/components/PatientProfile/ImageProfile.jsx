import { useState, useRef } from 'react'
import { auth } from '@/libs/firebase'
import { ref as dbRef, update } from 'firebase/database'
import { db } from '@/libs/firebase'
import { useUser } from '@/contexts/UserContext'
import Alert from '@/components/Alert'
import ImageProfileForm from '@/components/Forms/ImageProfileForm'
import { validateImageFile } from '@/utils/image-file'
import { updateProfileImage } from '@/services/patientService'
import { PROFILE_IMAGE_ERRORS } from '@/constants/error-messages'
import DefaultProfile from '@/assets/images/default-profile.png'
import './ImageProfile.css'

function ImageProfile({ userData, action = 'edit' }) {
  const { refreshUserData } = useUser()
  const fileInputRef = useRef(null)

  const [selectedFile, setSelectedFile] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [fileError, setFileError] = useState('')
  const [imageLoadError, setImageLoadError] = useState(false)

  const { AlertComponent, showAlert } = Alert()

  const handleImageError = () => {
    setImageLoadError(true)

    // Clean up the broken reference in the database
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
    setImageLoadError(false)

    if (!file) {
      setSelectedFile(null)
      setPreviewImage(null)
      return
    }

    const error = validateImageFile(file)
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
    setImageLoadError(false)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setFileError('')

    if (!selectedFile) {
      setFileError(PROFILE_IMAGE_ERRORS.FILE_REQUIRED)
      showAlert(PROFILE_IMAGE_ERRORS.FILE_REQUIRED, 'danger', { persist: true })
      return
    }

    const validationError = validateImageFile(selectedFile)
    if (validationError) {
      setFileError(validationError)
      showAlert(validationError, 'danger', { persist: true })
      return
    }

    setIsUploading(true)

    try {
      const user = auth.currentUser
      if (!user) {
        showAlert(PROFILE_IMAGE_ERRORS.NO_USER, 'danger', { persist: true })
        setIsUploading(false)
        return
      }

      const result = await updateProfileImage(user.uid, selectedFile, {
        oldImagePath: userData?.profileImagePath
      })

      if (result.success) {
        await refreshUserData()
        showAlert(PROFILE_IMAGE_ERRORS.SUCCESS, 'success')

        setSelectedFile(null)
        setPreviewImage(null)
        setImageLoadError(false)

        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        let errorMessage = PROFILE_IMAGE_ERRORS.UPLOAD_FAILED

        if (result.error.code === 'storage/unauthorized') {
          errorMessage = PROFILE_IMAGE_ERRORS.UNAUTHORIZED
        } else if (result.error.code === 'storage/canceled') {
          errorMessage = PROFILE_IMAGE_ERRORS.UPLOAD_CANCELED
        } else if (result.error.code === 'storage/unknown') {
          errorMessage = PROFILE_IMAGE_ERRORS.UNKNOWN_ERROR
        }

        showAlert(errorMessage, 'danger', { persist: true })
      }
    } catch (error) {
      console.error('Error uploading profile image:', error)
      showAlert(PROFILE_IMAGE_ERRORS.UPLOAD_FAILED, 'danger', { persist: true })
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
      <AlertComponent />

      <ImageProfileForm
        displayImage={displayImage}
        selectedFile={selectedFile}
        fileError={fileError}
        fileInputRef={fileInputRef}
        isUploading={isUploading}
        action={action}
        onFileChange={handleFileChange}
        onImageError={handleImageError}
        onRemove={handleRemove}
      />

      {action === 'edit' && selectedFile && (
        <div className="profile-upload-actions mt-3">
          <button
            type="button"
            className="btn btn-primary save-file-btn me-2"
            onClick={handleSubmit}
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

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleRemove}
            disabled={isUploading}
          >
            Remove
          </button>
        </div>
      )}
    </div>
  )
}

export default ImageProfile
