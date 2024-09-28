package exception

type ConflictError struct {
	Message string `json:"message"`
}

func (err *ConflictError) Error() string {
	return err.Message
}

func NewConflictError(message string) *ConflictError {
	return &ConflictError{
		Message: message,
	}
}