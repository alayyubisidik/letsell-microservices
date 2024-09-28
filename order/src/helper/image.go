package helper

import (
	"order/src/exception"
	"path/filepath"

	"mime/multipart"

)

func ValidateImageFile(file *multipart.FileHeader) error {

	const maxFileSize = 5 * 1024 * 1024 
	if file.Size > maxFileSize {
		return exception.NewBadRequestError("Image file is too large")
	}

	allowedExtensions := map[string]bool{
		".jpg":  true,
		".jpeg": true,
		".png":  true,
	}
	ext := filepath.Ext(file.Filename)
	if !allowedExtensions[ext] {
		return exception.NewBadRequestError("Invalid file extension")
	}

	return nil
}

