package response

type WebResponse struct {
	Data any `json:"data"`
	Meta any `json:"meta,omitempty"`
}
