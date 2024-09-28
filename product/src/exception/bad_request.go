package exception

type BadRequestError struct {
	Message string `json:"message"`
}

func (err *BadRequestError) Error() string {
	return err.Message
}

func NewBadRequestError(message string) *BadRequestError {
	return &BadRequestError{
		Message: message,
	}
}