package exception

type UnAuthorizedError struct {
	Message string `json:"message"`
}

func (err *UnAuthorizedError) Error() string {
	return err.Message
}

func NewUnAuthorizedError(message string) *UnAuthorizedError {
	return &UnAuthorizedError{
		Message: message,
	}
}