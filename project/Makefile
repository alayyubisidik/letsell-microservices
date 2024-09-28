SHELL=cmd.exe
AUTH_BINARY=authApp
PRODUCT_BINARY=productApp
CART_BINARY=cartApp
ORDER_BINARY=orderApp
RATING_BINARY=ratingApp

build_auth:
	@echo Building auth binary...
	chdir ..\auth && set GOOS=linux&& set GOARCH=amd64&& set CGO_ENABLED=0 && go build -o ${AUTH_BINARY} ./src
	chdir ..\auth && docker build -t alayyubi/auth . && docker push alayyubi/auth
	kubectl delete deploy auth-depl
	kubectl apply -f k8s
	@echo Done!

build_client:
	@echo Building client...
	chdir ..\client && docker build -t alayyubi/client . && docker push alayyubi/client
	kubectl delete deploy client-depl
	kubectl apply -f k8s
	@echo Done!

build_product:
	@echo Building product...
	chdir ..\product && set GOOS=linux&& set GOARCH=amd64&& set CGO_ENABLED=0 && go build -o ${PRODUCT_BINARY} ./src
	chdir ..\product && docker build -t alayyubi/product . && docker push alayyubi/product
	kubectl delete deploy product-depl
	kubectl apply -f k8s
	@echo Done!

build_cart:
	@echo Building cart...
	chdir ..\cart && set GOOS=linux&& set GOARCH=amd64&& set CGO_ENABLED=0 && go build -o ${CART_BINARY} ./src
	chdir ..\cart && docker build -t alayyubi/cart . && docker push alayyubi/cart
	kubectl delete deploy cart-depl
	kubectl apply -f k8s
	@echo Done!

build_order:
	@echo Building order...
	chdir ..\order && set GOOS=linux&& set GOARCH=amd64&& set CGO_ENABLED=0 && go build -o ${ORDER_BINARY} ./src
	chdir ..\order && docker build -t alayyubi/order . && docker push alayyubi/order
	kubectl delete deploy order-depl
	kubectl apply -f k8s
	@echo Done!

build_rating:
	@echo Building rating...
	chdir ..\rating && set GOOS=linux&& set GOARCH=amd64&& set CGO_ENABLED=0 && go build -o ${RATING_BINARY} ./src
	chdir ..\rating && docker build -t alayyubi/rating . && docker push alayyubi/rating
	kubectl delete deploy rating-depl
	kubectl apply -f k8s
	@echo Done!


build_together: build_cart build_order build_product

