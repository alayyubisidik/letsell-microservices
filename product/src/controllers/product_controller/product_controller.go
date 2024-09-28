package productcontroller

import (
	"os"
	"product/src/database"
	"product/src/event"
	"product/src/exception"
	"product/src/helper"
	"product/src/models"
	"product/src/request"
	"product/src/response"
	"strconv"
	"strings"

	"net/http"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/gosimple/slug"
	"gorm.io/gorm"
)

var urlCloudinary = os.Getenv("CLOUDINARY_URL")

func Create(ctx *gin.Context) {
	var productCreateRequest request.ProductCreateRequest
	if err := ctx.ShouldBindWith(&productCreateRequest, binding.FormMultipart); err != nil {
		ctx.Error(err)
		return
	}

	if len(productCreateRequest.Images) > 6 {
		ctx.Error(exception.NewBadRequestError("maximum number of images is only 6"))
	}

	for _, image := range productCreateRequest.Images {
		err := helper.ValidateImageFile(image)
		if err != nil {
			ctx.Error(err)
			return
		}
	}

	product := models.Product{
		CategoryId:  productCreateRequest.CategoryId,
		Name:        productCreateRequest.Name,
		Slug:        slug.Make(productCreateRequest.Name),
		Brand:       productCreateRequest.Brand,
		Price:       productCreateRequest.Price,
		Description: productCreateRequest.Description,
		Stock:       productCreateRequest.Stock,
	}

	var productImageForEvent models.ProductImage
	err := database.DB.Transaction(func(tx *gorm.DB) error {
		var existingCategory models.Category
		if err := tx.Take(&existingCategory, "id = ?", product.CategoryId).Error; err != nil {
			return exception.NewNotFoundError("category not found")
		}

		var conflictProduct models.Product
		err := tx.Take(&conflictProduct, "slug = ?", product.Slug).Error
		if err == nil && conflictProduct.ID != 0 {
			return exception.NewConflictError("product already exists")
		}

		if err := tx.Save(&product).Error; err != nil {
			return err
		}

		cldService, _ := cloudinary.NewFromURL(urlCloudinary)
		for _, image := range productCreateRequest.Images {
			resp, err := cldService.Upload.Upload(ctx, image, uploader.UploadParams{
				Folder: "product-image",
			})
			if err != nil {
				return err
			}

			productImage := models.ProductImage{
				ProductId: product.ID,
				ImageUrl:  resp.SecureURL,
				PublicId:  resp.PublicID,
			}

			if err := tx.Create(&productImage).Error; err != nil {
				return err
			}
		}

		if err := tx.Preload("ProductImages").Preload("Category").First(&product, product.ID).Error; err != nil {
			return err
		}

		if err := tx.Where("product_id = ?", product.ID).First(&productImageForEvent).Error; err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		ctx.Error(err)
		return
	}

	productCreatedEvent := event.ProductCreatedEvent{
		Id: product.ID,
		Name: product.Name,
		Slug: product.Slug,
		Price: product.Price,
		Stock: product.Stock,
		ImageUrl: productImageForEvent.ImageUrl,
		CreatedAt: product.CreatedAt,
		Event: "product.created",
	}

	event.PublishEvent(productCreatedEvent, "product.created")

	ctx.JSON(http.StatusCreated, response.WebResponse{
		Data: helper.ToProductResponse(product),
	})
}

func GetAll(ctx *gin.Context) {
	page, _ := strconv.Atoi(ctx.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(ctx.DefaultQuery("limit", "10"))
	search := ctx.Query("search") // Ambil query search dari ctx

	offset := (page - 1) * limit

	var products []models.Product
	err := database.DB.Transaction(func(tx *gorm.DB) error {
		query := tx.Preload("ProductImages").Preload("Category")

		// Jika ada query search, tambahkan kondisi LIKE yang case-insensitive
		if search != "" {
			likeQuery := "%" + strings.ToLower(search) + "%"

			// Join categories dan tambahkan kondisi search
			query = query.Joins("JOIN categories ON categories.id = products.category_id").
				Where("LOWER(products.name) LIKE ? OR LOWER(products.brand) LIKE ? OR LOWER(categories.name) LIKE ?", likeQuery, likeQuery, likeQuery)
		}

		// Join ratings dan hitung rata-rata rating, bulatkan ke integer
		query = query.Joins("LEFT JOIN ratings ON ratings.product_id = products.id").
			Select("products.*, COALESCE(FLOOR(AVG(ratings.rating)), 0) as avg_rating"). // Menggunakan FLOOR untuk membulatkan
			Group("products.id")

		// Lanjutkan dengan pagination
		err := query.Limit(limit).Offset(offset).Find(&products).Error
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
		Data: helper.ToProductResponses(products),
		Meta: map[string]interface{}{
			"page":  page,
			"limit": limit,
		},
	})
}




func GetBySlug(ctx *gin.Context) {
	productSlug := ctx.Param("productSlug")
	var product models.Product

	err := database.DB.Transaction(func(tx *gorm.DB) error {
		// Preload data yang diperlukan dan hitung avg_rating
		err := tx.Preload("ProductImages").Preload("Category").
			// LEFT JOIN ratings untuk menghitung avg_rating
			Joins("LEFT JOIN ratings ON ratings.product_id = products.id").
			Select("products.*, COALESCE(FLOOR(AVG(ratings.rating)), 0) as avg_rating"). // FLOOR untuk membulatkan rata-rata
			Where("slug = ?", productSlug).
			Group("products.id").
			First(&product).Error

		if err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		ctx.Error(err)
		return
	}

	// Kirim hasil respons dengan avg_rating
	ctx.JSON(http.StatusOK, response.WebResponse{
		Data: helper.ToProductResponse(product),
	})
}


func Delete(ctx *gin.Context) {
	productSlug := ctx.Param("productSlug")

	err := database.DB.Transaction(func(tx *gorm.DB) error {
		var product models.Product
		if err := tx.Where("slug = ?", productSlug).Take(&product).Error; err != nil {
			return err
		}

		var productImages []models.ProductImage
		if err := tx.Where("product_id = ?", product.ID).Find(&productImages).Error; err != nil {
			return err
		}

		cldService, _ := cloudinary.NewFromURL(urlCloudinary)
		for _, image := range productImages {
			if _, err := cldService.Upload.Destroy(ctx, uploader.DestroyParams{
				PublicID: image.PublicId,
			}); err != nil {
				return err
			}
		}

		if err := tx.Where("product_id = ?", product.ID).Delete(&productImages).Error; err != nil {
			return err
		}

		if err := tx.Delete(&product).Error; err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		ctx.Error(err)
		return
	}

	productDeletedEvent := event.ProductDeletedEvent{
		Slug: productSlug,
		Event: "product.deleted",
	}

	event.PublishEvent(productDeletedEvent, "product.deleted")

	ctx.JSON(http.StatusOK, response.WebResponse{
		Data: "Delete product successfully",
	})
}

func Update(ctx *gin.Context) {
	var productUpdateRequest request.ProductUpdateRequest
	if err := ctx.ShouldBind(&productUpdateRequest); err != nil {
		ctx.Error(err)
		return
	}

	productSlugParam := ctx.Param("productSlug")
	productSlug := slug.Make(productUpdateRequest.Name)
	var existingProduct models.Product
	var productImageForEvent models.ProductImage
	err := database.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Take(&existingProduct, "slug = ?", productSlugParam).Error; err != nil {
			return exception.NewNotFoundError("product not found")
		}

		var existingCategory models.Category
		if err := tx.Take(&existingCategory, "id = ?", existingProduct.CategoryId).Error; err != nil {
			return exception.NewNotFoundError("category not found")
		}

		var conflictProduct models.Product
		err := tx.Where("slug = ? AND id != ?", productSlug, existingProduct.ID).First(&conflictProduct).Error
		if err == nil {
			return exception.NewConflictError("product already exists")
		}

		existingProduct.Name = productUpdateRequest.Name 
		existingProduct.Slug = productSlug
		existingProduct.Brand = productUpdateRequest.Brand 
		existingProduct.Price  = productUpdateRequest.Price  
		existingProduct.CategoryId = productUpdateRequest.CategoryId 
		existingProduct.Description = productUpdateRequest.Description 
		existingProduct.Stock = productUpdateRequest.Stock 

		if err := tx.Save(&existingProduct).Error; err != nil {
			return err
		}

		if err := tx.Preload("ProductImages").Preload("Category").First(&existingProduct, existingProduct.ID).Error; err != nil {
			return err
		}

		if err := tx.Where("product_id = ?", existingProduct.ID).First(&productImageForEvent).Error; err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		ctx.Error(err)
		return
	}

	productUpdatedEvent := event.ProductUpdatedEvent{
		Id: existingProduct.ID,
		Name: existingProduct.Name,
		Slug: existingProduct.Slug,
		Price: existingProduct.Price,
		Stock: existingProduct.Stock,
		ImageUrl: productImageForEvent.ImageUrl,
		CreatedAt: existingProduct.CreatedAt,
		Event: "product.updated",
	}

	event.PublishEvent(productUpdatedEvent, "product.updated")

	ctx.JSON(http.StatusCreated, response.WebResponse{
		Data: helper.ToProductResponse(existingProduct),
	})
}