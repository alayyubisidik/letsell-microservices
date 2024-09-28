package middleware

import (
	"order/src/helper"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func VerifyOwner(ctx *gin.Context) {
	userId := ctx.Param("userId")
	id, err := strconv.Atoi(userId)
	helper.PanicIfError(err)

	tokenCookie, err := ctx.Cookie("jwt")

    claims, err := helper.VerifyToken(tokenCookie)
    if id != claims.ID {
        ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"errors": []gin.H{{"message": "Unauthorized"}}})
        return
    }

    ctx.Next()
}
