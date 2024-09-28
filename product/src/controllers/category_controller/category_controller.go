package categorycontroller

import (
	"product/src/database"
	"product/src/exception"
	"product/src/helper"
	"product/src/models"
	"product/src/request"
	"product/src/response"

	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/gosimple/slug"
	"gorm.io/gorm"
)

func Create(ctx *gin.Context) {
	var categoryCreateRequest request.CategoryCreateRequest
	if err := ctx.ShouldBindWith(&categoryCreateRequest, binding.FormMultipart); err != nil {
		ctx.Error(err)
		return
	}
 
	category := models.Category{
		Name: categoryCreateRequest.Name,
		Slug: slug.Make(categoryCreateRequest.Name),
		SvgIcon: categoryCreateRequest.SvgIcon,
	}

	var existingCategory models.Category
	err := database.DB.Transaction(func(tx *gorm.DB) error {
		err := database.DB.Take(&existingCategory, "slug = ?", category.Slug).Error
		if err == nil && existingCategory.ID != 0 {
			return exception.NewConflictError("category already exists")
		}
		
		err = tx.Save(&category).Error
		if err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusCreated, response.WebResponse{
		Data: helper.ToCategoryResponse(category),
	})
}

func GetAll(ctx *gin.Context) {
	var categories []models.Category

	err := database.DB.Transaction(func(tx *gorm.DB) error {
		err := tx.Preload("Products").Find(&categories).Error
		if err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, response.WebResponse{
		Data: helper.ToCategoryResponses(categories),
	})
}

func GetBySlug(ctx *gin.Context) {
	categorySlug := ctx.Param("categorySlug")
	var category models.Category
	err := database.DB.Transaction(func(tx *gorm.DB) error {
		err := tx.Where("slug = ?", categorySlug).First(&category).Error
		if err != nil {
			return exception.NewNotFoundError("category not found")
		}

		return nil
	})
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, response.WebResponse{
		Data: helper.ToCategoryResponse(category),
	})
}

func Update(ctx *gin.Context) {
	var categoryUpdateRequest request.CategoryUpdateRequest

	if err := ctx.ShouldBindWith(&categoryUpdateRequest, binding.FormMultipart); err != nil {
		ctx.Error(err)
		return
	}

	categorySlugParam := ctx.Param("categorySlug")
	categorySlug := slug.Make(categoryUpdateRequest.Name)

	var existingCategory models.Category
	err := database.DB.Transaction(func(tx *gorm.DB) error {

		if err := tx.Take(&existingCategory, "slug = ?", categorySlugParam).Error; err != nil {
			return exception.NewNotFoundError("category not found")
		}

		var conflictCategory models.Category
		err := tx.Where("slug = ? AND id != ?", categorySlug, existingCategory.ID).First(&conflictCategory).Error
		if err == nil {
			return exception.NewConflictError("category is already exists")
		}

		return nil
	})

	if err != nil {
		ctx.Error(err)
		return
	}

	existingCategory.Name = categoryUpdateRequest.Name
	existingCategory.Slug = categorySlug
	existingCategory.SvgIcon = categoryUpdateRequest.SvgIcon

	err = database.DB.Transaction(func(tx *gorm.DB) error {
		err := tx.Save(&existingCategory).Error
		if err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, response.WebResponse{
		Data: helper.ToCategoryResponse(existingCategory),
	})
}
 

func Delete(ctx *gin.Context) {
	categorySlug := ctx.Param("categorySlug")
	var existingCategory models.Category
	err := database.DB.Transaction(func(tx *gorm.DB) error {
		err := tx.Take(&existingCategory, "slug = ?", categorySlug).Error
		if err != nil {
			return exception.NewNotFoundError("category not found")
		}

		var existingProduct models.Product
		err = tx.Where("category_id", existingCategory.ID).First(&existingProduct).Error
		if err == nil {
			return exception.NewBadRequestError("category is used, can't delete")
		}

		err = tx.Delete(existingCategory).Error
		if err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, response.WebResponse{
		Data: "Delete category successfully",
	})
}