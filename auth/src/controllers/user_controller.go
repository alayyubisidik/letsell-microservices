package controllers

import (
	"auth/src/database"
	"auth/src/event"
	"auth/src/exception"
	"auth/src/helper"
	"auth/src/models"
	"auth/src/request"
	"auth/src/response"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"gorm.io/gorm"
)

var urlCloudinary = os.Getenv("CLOUDINARY_URL")

func SignUp(ctx *gin.Context) {
	var userSignUpRequest request.UserSignUpRequest

	if err := ctx.ShouldBindWith(&userSignUpRequest, binding.FormMultipart); err != nil {
		ctx.Error(err)
		return
	}

	if userSignUpRequest.ProfilePicture != nil {
		err := helper.ValidateImageFile(ctx)
		if err != nil {
			ctx.Error(err)
			return
		}
	}

	hashedPassword, err := helper.HashPassword(userSignUpRequest.Password)
	helper.PanicIfError(err)

	user := models.User{
		Username:    userSignUpRequest.Username,
		FullName:    userSignUpRequest.FullName,
		Password:    hashedPassword,
		Email:       userSignUpRequest.Email,
		PhoneNumber: userSignUpRequest.PhoneNumber,
		DateOfBirth: userSignUpRequest.DateOfBirth,
		Gender:      userSignUpRequest.Gender,
	}

	if user.Username == "admin" {
		user.Role = "admin"
	}

	var existingUser models.User

	err = database.DB.Take(&existingUser, "username = ?", user.Username).Error
	if err == nil && existingUser.ID != 0 {
		ctx.Error(exception.NewConflictError("username already exists"))
		return
	}

	err = database.DB.Take(&existingUser, "email = ?", user.Email).Error
	if err == nil && existingUser.ID != 0 {
		ctx.Error(exception.NewConflictError("email already exists"))
		return
	}

	if userSignUpRequest.ProfilePicture != nil {
		cldService, _ := cloudinary.NewFromURL(urlCloudinary)
		resp, _ := cldService.Upload.Upload(ctx, userSignUpRequest.ProfilePicture, uploader.UploadParams{
			Folder: "profile-picture",
		})

		user.ProfilePicture = resp.SecureURL
		user.ImageId = resp.PublicID
	}

	err = database.DB.Transaction(func(tx *gorm.DB) error {
		err := tx.Save(&user).Error
		if err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		ctx.Error(err)
		return
	}

	authCreatedEvent := event.AuthCreatedEvent{
		Id:  user.ID,
		FullName: user.FullName,
		Username: user.Username,
		Email: user.Email,
		Role: user.Role,
		PhoneNumber: user.PhoneNumber,
		CreatedAt: user.CreatedAt,
		Event: "auth.created",
	}

	event.PublishEvent(authCreatedEvent, "auth.created")

	token, err := helper.CreateToken(user)
	helper.PanicIfError(err)

	http.SetCookie(ctx.Writer, &http.Cookie{
		Name:     "jwt",
		Value:    token,
		Path:     "/",
		HttpOnly: true,
	})

	ctx.JSON(http.StatusCreated, response.WebResponse{
		Data: helper.ToUserResponse(user),
	})
}

func SignIn(ctx *gin.Context) {
	var userSignInRequest request.UserSignInRequest

	if err := ctx.ShouldBind(&userSignInRequest); err != nil {
		ctx.Error(err)
		return
	}

	var user models.User

	err := database.DB.Transaction(func(tx *gorm.DB) error {
		err := tx.Take(&user, "username = ?", userSignInRequest.Username).Error
		if err != nil {
			return exception.NewUnAuthorizedError("Invalid credentials")
		}

		return nil
	})

	if err != nil {
		ctx.Error(err)
		return
	}

	if user.Status == false {
		ctx.Error(exception.NewUnAuthorizedError("Your account is blocked"))
		return
	}

	if err := helper.ComparePassword(user.Password, userSignInRequest.Password); err != nil {
		err = exception.NewUnAuthorizedError("Invalid credentials")
		ctx.Error(err)
		return
	}

	token, err := helper.CreateToken(user)
	helper.PanicIfError(err)

	http.SetCookie(ctx.Writer, &http.Cookie{
		Name:     "jwt",
		Value:    token,
		Path:     "/",
		HttpOnly: true,
	})

	ctx.JSON(http.StatusCreated, response.WebResponse{
		Data: helper.ToUserResponse(user),
	})
}

func CurrentUser(ctx *gin.Context) {
	tokenCookie, err := ctx.Cookie("jwt")
	if err != nil {
		ctx.JSON(200, gin.H{
			"data": nil,
		})
		return
	}

	claims, err := helper.VerifyToken(tokenCookie)
	if err != nil {
		ctx.JSON(200, gin.H{
			"data": nil,
		})
		return
	}

	userResponse := response.UserResponse{
		Id:             claims.ID,
		Username:       claims.Username,
		FullName:       claims.FullName,
		Email:          claims.Email,
		Role:           claims.Role,
		ProfilePicture: claims.ProfilePicture,
		PhoneNumber:    claims.PhoneNumber,
		DateOfBirth:    claims.DateOfBirth,
		Gender:         claims.Gender,
		CreatedAt:      claims.CreatedAt,
	}

	webResponse := response.WebResponse{
		Data: userResponse,
	}

	ctx.JSON(http.StatusOK, webResponse)
}

func SignOut(ctx *gin.Context) {
	http.SetCookie(ctx.Writer, &http.Cookie{
		Name:     "jwt",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		Expires:  time.Unix(0, 0),
	})

	webResponse := response.WebResponse{
		Data: "Sign out successfully",
	}

	ctx.JSON(http.StatusOK, webResponse)
}

func Update(ctx *gin.Context) {
	var userUpdateRequest request.UserUpdateRequest

	if err := ctx.ShouldBindWith(&userUpdateRequest, binding.FormMultipart); err != nil {
		ctx.Error(err)
		return
	}

	if userUpdateRequest.ProfilePicture != nil {
		err := helper.ValidateImageFile(ctx)
		if err != nil {
			ctx.Error(err)
			return
		}
	}

	userId := ctx.Param("userId")
	id, err := strconv.Atoi(userId)
	helper.PanicIfError(err)

	var existingUser models.User
	err = database.DB.Transaction(func(tx *gorm.DB) error {

		if err := tx.Take(&existingUser, "id = ?", id).Error; err != nil {
			return exception.NewNotFoundError("user not found")
		}

		var conflictUser models.User
		err := tx.Where("username = ? AND id != ?", userUpdateRequest.Username, existingUser.ID).First(&conflictUser).Error
		if err == nil {
			return exception.NewConflictError("username is already exists")
		}

		err = tx.Where("email = ? AND id != ?", userUpdateRequest.Email, existingUser.ID).First(&conflictUser).Error
		if err == nil {
			return exception.NewConflictError("email is already exists")
		}

		return nil
	})

	if err != nil {
		ctx.Error(err)
		return
	}

	if userUpdateRequest.ProfilePicture != nil {
		cldService, _ := cloudinary.NewFromURL(urlCloudinary)

		if existingUser.ImageId != "profile-picture/tvrg2tuayakndkpoldqj" {
			cldService.Upload.Destroy(ctx, uploader.DestroyParams{
				PublicID: existingUser.ImageId,
			})
		}

		resp, _ := cldService.Upload.Upload(ctx, userUpdateRequest.ProfilePicture, uploader.UploadParams{
			Folder: "profile-picture",
		})

		existingUser.ProfilePicture = resp.SecureURL
		existingUser.ImageId = resp.PublicID
	}

	existingUser.Username = userUpdateRequest.Username
	existingUser.FullName = userUpdateRequest.FullName
	existingUser.Email = userUpdateRequest.Email
	existingUser.PhoneNumber = userUpdateRequest.PhoneNumber
	existingUser.Gender = userUpdateRequest.Gender
	existingUser.DateOfBirth = userUpdateRequest.DateOfBirth

	err = database.DB.Transaction(func(tx *gorm.DB) error {
		err := tx.Save(&existingUser).Error
		if err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		ctx.Error(err)
		return
	}

	authUpdatedEvent := event.AuthUpdatedEvent{
		Id:  existingUser.ID,
		FullName: existingUser.FullName,
		Username: existingUser.Username,
		Email: existingUser.Email,
		Role: existingUser.Role,
		PhoneNumber: existingUser.PhoneNumber,
		CreatedAt: existingUser.CreatedAt,
		Event: "auth.updated",
	}

	event.PublishEvent(authUpdatedEvent, "auth.updated")


	token, err := helper.CreateToken(existingUser)
	helper.PanicIfError(err)

	http.SetCookie(ctx.Writer, &http.Cookie{
		Name:     "jwt",
		Value:    token,
		Path:     "/",
		HttpOnly: true,
		SameSite: http.SameSiteStrictMode,
	})

	ctx.JSON(http.StatusOK, response.WebResponse{
		Data: helper.ToUserResponse(existingUser),
	})
}

func GetAll(ctx *gin.Context) {
	var users []models.User
	err := database.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("role <> ?", "admin").Find(&users).Error; err != nil {
			return err
		}
		return nil
	})	

	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, response.WebResponse{
		Data: helper.ToUserResponses(users),
	})
}

func ChangeStatus(ctx *gin.Context) {
	id := ctx.Param("userId")
	userId, err := strconv.Atoi(id)

	var user models.User
	err = database.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Take(&user, "id = ?", userId).Error; err != nil {
			return exception.NewNotFoundError("User not found")
		}

		user.Status = !user.Status

		if err := tx.Save(&user).Error; err != nil {
			return err 
		}

		return nil
	})

	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, response.WebResponse{
		Data: "Change status success!",
	})
}

