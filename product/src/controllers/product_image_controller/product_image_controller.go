package productimagecontroller

import (
	"log"
	"os"
	"product/src/database"
	"product/src/event"
	"product/src/exception"
	"product/src/helper"
	"product/src/models"
	"product/src/request"
	"product/src/response"
	"strconv"

	"net/http"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"gorm.io/gorm"
)

var urlCloudinary = os.Getenv("CLOUDINARY_URL")

func GetByProduct(ctx *gin.Context) {
	var images []models.ProductImage

	productId := ctx.Param("productId")
	id, _ := strconv.Atoi(productId)

	err := database.DB.Transaction(func(tx *gorm.DB) error {
		var existingProduct models.Product
		err := tx.Take(&existingProduct, "id = ?", id).Error
		if err != nil {
			return exception.NewNotFoundError("product not found")
		}

		err = tx.Where("product_id = ?", id).Find(&images).Error
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
		Data: helper.ToProductImageResponses(images),
	})
}

func Create(ctx *gin.Context) {
	var productImageCreateRequest request.ProductImageCreateRequest
	if err := ctx.ShouldBindWith(&productImageCreateRequest, binding.FormMultipart); err != nil {
		ctx.Error(err)
		return
	}

	log.Println("request = ", productImageCreateRequest)

	err := helper.ValidateImageFile(productImageCreateRequest.Image)
	if err != nil {
		ctx.Error(err)
		return
	}

	productImage := models.ProductImage{
		ProductId: productImageCreateRequest.ProductId,
	}

	log.Println("productId = ", productImage.ProductId)
	var existingProduct models.Product
	err = database.DB.Take(&existingProduct, "id = ?", productImage.ProductId).Error
	if err != nil {
		ctx.Error(exception.NewNotFoundError("product not found"))
		return
	}

	cldService, _ := cloudinary.NewFromURL(urlCloudinary)
	resp, _ := cldService.Upload.Upload(ctx, productImageCreateRequest.Image, uploader.UploadParams{
		Folder: "product-image",
	})

	productImage.ImageUrl = resp.SecureURL
	productImage.PublicId = resp.PublicID

	err = database.DB.Transaction(func(tx *gorm.DB) error {
		err := tx.Save(&productImage).Error
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
		Data: helper.ToProductImageResponse(productImage),
	})
}

func Delete(ctx *gin.Context) {
	productImageId := ctx.Param("productImageId")
	id, _ := strconv.Atoi(productImageId)
	var productImage models.ProductImage
	var product models.Product
	var productImageForEvent models.ProductImage
	err := database.DB.Transaction(func(tx *gorm.DB) error {
		err := tx.Take(&productImage, "id = ?", id).Error
		if err != nil {
			return exception.NewNotFoundError("product image not found")
		}

		err = tx.Take(&product, "id = ?", productImage.ProductId).Error
		if err != nil {
			return exception.NewNotFoundError("product not found")
		}

		var productImageCount int64
		err = tx.Model(&models.ProductImage{}).Where("product_id = ?", product.ID).Count(&productImageCount).Error
		if err != nil {
			return err // Tangani kesalahan dari query count
		}

		if productImageCount == 1 {
			return exception.NewConflictError("can't delete the last image")
		}

		cldService, _ := cloudinary.NewFromURL(urlCloudinary)
		cldService.Upload.Destroy(ctx, uploader.DestroyParams{
			PublicID: productImage.PublicId,
		})

		err = tx.Delete(productImage).Error
		if err != nil {
			return err
		}

		err = tx.Where("product_id = ?", product.ID).First(&productImageForEvent).Error; 
		if err != nil {
			return exception.NewNotFoundError("product image not found")
		}

		return nil
	})

	if err != nil {
		ctx.Error(err)
		return
	}

	productUpdatedEvent := event.ProductUpdatedEvent{
		Id: product.ID,
		Name: product.Name,
		Slug: product.Slug,
		Price: product.Price,
		Stock: product.Stock,
		ImageUrl: productImageForEvent.ImageUrl,
		CreatedAt: product.CreatedAt,
		Event: "product.updated",
	}

	event.PublishEvent(productUpdatedEvent, "product.updated")

	ctx.JSON(http.StatusOK, response.WebResponse{
		Data: "Delete product successfully",
	})
}

func Update(ctx *gin.Context) {
	var productImageUpdateRequest request.ProductImageUpdateRequest

	if err := ctx.ShouldBindWith(&productImageUpdateRequest, binding.FormMultipart); err != nil {
		ctx.Error(err)
		return
	}

	err := helper.ValidateImageFile(productImageUpdateRequest.Image)
	if err != nil {
		ctx.Error(err)
		return
	}
	
	productImageIdParam := ctx.Param("productImageId")
	productImageId, _ := strconv.Atoi(productImageIdParam)

	var existingProductImage models.ProductImage
	var product models.Product
	var productImageForEvent models.ProductImage
	err = database.DB.Transaction(func(tx *gorm.DB) error {

		err := tx.Where("id = ?", productImageId).First(&existingProductImage).Error
		if err != nil {
			return exception.NewNotFoundError("product image not found")
		}

		cldService, _ := cloudinary.NewFromURL(urlCloudinary)

		cldService.Upload.Destroy(ctx, uploader.DestroyParams{
			PublicID: existingProductImage.PublicId,
		})

		resp, _ := cldService.Upload.Upload(ctx, productImageUpdateRequest.Image, uploader.UploadParams{
			Folder: "product-image",
		})

		existingProductImage.ImageUrl = resp.SecureURL
		existingProductImage.PublicId = resp.PublicID

		err = tx.Save(&existingProductImage).Error
		if err != nil {
			return err
		}

		err = tx.Take(&product, "id = ?", existingProductImage.ProductId).Error
		if err != nil {
			return exception.NewNotFoundError("product not found")
		}

		err = tx.Where("product_id = ?", product.ID).First(&productImageForEvent).Error; 
		if err != nil {
			return exception.NewNotFoundError("product image not found")
		}


		return nil
	})

	if err != nil {
		ctx.Error(err)
		return
	}

	productUpdatedEvent := event.ProductUpdatedEvent{
		Id: product.ID,
		Name: product.Name,
		Slug: product.Slug,
		Price: product.Price,
		Stock: product.Stock,
		ImageUrl: productImageForEvent.ImageUrl,
		CreatedAt: product.CreatedAt,
		Event: "product.updated",
	}

	event.PublishEvent(productUpdatedEvent, "product.updated")

	ctx.JSON(http.StatusOK, response.WebResponse{
		Data: helper.ToProductImageResponse(existingProductImage),
	})
}
