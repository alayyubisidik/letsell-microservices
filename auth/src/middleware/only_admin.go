package middleware

import (
	"auth/src/helper"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Onlydmin(ctx *gin.Context) {
	tokenCookie, err := ctx.Cookie("jwt")
	helper.PanicIfError(err)
	
    claims, _ := helper.VerifyToken(tokenCookie)
	helper.PanicIfError(err)
    if claims.Role != "admin" {
        ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"errors": []gin.H{{"message": "Unauthorized"}}})
        return
    }

    ctx.Next()
}
