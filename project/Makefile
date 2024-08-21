SHELL=cmd.exe
AUTH_BINARY=authApp

build_auth:
	@echo Building auth binary...
	chdir ..\auth && set GOOS=linux&& set GOARCH=amd64&& set CGO_ENABLED=0 && go build -o ${AUTH_BINARY} ./src
	chdir ..\auth && docker build -t alayyubi/auth . && docker push alayyubi/auth
	kubectl delete deploy auth-depl
	kubectl apply -f k8s
	@echo Done!
