import './ImageProfileForm.css'

export default function ImageProfileForm({
  displayImage,
  selectedFile,
  fileError,
  fileInputRef,
  isUploading = false,
  action = 'edit',
  onFileChange = () => {},
  onImageError = () => {},
  onRemove = () => {}
}) {
  return (
    <form
      className="profile-image-form d-flex flex-column align-items-center"
      encType="multipart/form-data"
    >
      <div className="profile-image-wrapper mb-3">
        <img
          src={displayImage}
          alt="Profile"
          className="profile-img"
          loading="eager"
          fetchPriority="high"
          onError={onImageError}
        />
      </div>

      {action === 'edit' && (
        <>
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
              onChange={onFileChange}
              disabled={isUploading}
            />
          </div>

          {fileError && <small className="text-danger">{fileError}</small>}
        </>
      )}
    </form>
  )
}
