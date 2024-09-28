package helper

import (
	"product/src/models"
	"product/src/response"
)

func ToProductResponse(product models.Product) response.ProductResponse {
	productImages := make([]response.ProductImageResponse, len(product.ProductImages))

	for i, image := range product.ProductImages {
		productImages[i] = response.ProductImageResponse{
			Id:        image.ID,
			ProductId: image.ProductId,
			ImageUrl:  image.ImageUrl,
			PublicId:  image.PublicId,
			CreatedAt: image.CreatedAt,
		}
	}

	return response.ProductResponse{
		Id:          product.ID,
		Name:        product.Name,
		Slug:        product.Slug,
		Brand:       product.Brand,
		Price:       product.Price,
		Description: product.Description,
		Stock:       product.Stock,
		SoldCount:   product.SoldCount,
		AvgRating:   product.AvgRating,
		CreatedAt:   product.CreatedAt,
		Category: response.CategoryResponse{
			Id:        product.Category.ID,
			Name:      product.Category.Name,
			Slug:      product.Category.Slug,
			SvgIcon:   product.Category.SvgIcon,
			CreatedAt: product.Category.CreatedAt,
		},
		ProductImages: productImages,
	}
}

func ToProductResponses(products []models.Product) []response.ProductResponse {
	var productResponses []response.ProductResponse
	for _, product := range products {
		productResponses = append(productResponses, ToProductResponse(product))
	}
	return productResponses
}

func ToCategoryResponse(category models.Category) response.CategoryResponse {
	products := make([]response.ProductResponse, len(category.Products))

	for i, product := range category.Products {
		products[i] = response.ProductResponse{
			Id:         product.ID,
			Name:       product.Name,
			CategoryId: product.CategoryId,
			CreatedAt:  product.CreatedAt,
		}
	}

	return response.CategoryResponse{
		Id:        category.ID,
		Name:      category.Name,
		Slug:      category.Slug,
		SvgIcon:   category.SvgIcon,
		CreatedAt: category.CreatedAt,
		Products:  products,
	}
}

func ToCategoryResponses(categories []models.Category) []response.CategoryResponse {
	var categoryResponses []response.CategoryResponse
	for _, category := range categories {
		categoryResponses = append(categoryResponses, ToCategoryResponse(category))
	}
	return categoryResponses
}

func ToProductImageResponse(productImage models.ProductImage) response.ProductImageResponse {
	return response.ProductImageResponse{
		Id:        productImage.ID,
		ProductId: productImage.ProductId,
		ImageUrl:  productImage.ImageUrl,
		PublicId:  productImage.PublicId,
		CreatedAt: productImage.CreatedAt,
	}
}

func ToProductImageResponses(products []models.ProductImage) []response.ProductImageResponse {
	var productResponses []response.ProductImageResponse
	for _, product := range products {
		productResponses = append(productResponses, ToProductImageResponse(product))
	}
	return productResponses
}
