export const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg']
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

//Validates an image file ex: Please select an image file.
export const validateImageFile = (file) => {
  if (!file) {
    return 'Please select an image file.'
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'Invalid file type. Please select a valid image file (PNG, JPG, or JPEG).'
  }

  if (file.size > MAX_FILE_SIZE) {
    return 'File size too large. Maximum size is 5MB.'
  }

  return null
}

//Generates a unique filename for profile image ex: profile_uid_timestamp.extension
export const generateProfileImageFileName = (uid, file) => {
  const timestamp = Date.now()
  const fileExtension = file.name.split('.').pop()
  return `profile_${uid}_${timestamp}.${fileExtension}`
}

export const getProfileImageStoragePath = (uid, fileName) => {
  return `profile-images/${uid}/${fileName}`
}
