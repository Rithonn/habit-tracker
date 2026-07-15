package validate

import (
	"fmt"
	"strings"

	"github.com/go-playground/validator/v10"
)

var structValidator = validator.New()

func Struct(input any) string {
	err := structValidator.Struct(input)
	if err == nil {
		return ""
	}

	validationErrors, ok := err.(validator.ValidationErrors)
	if !ok || len(validationErrors) == 0 {
		return "request validation failed"
	}

	fieldError := validationErrors[0]
	field := strings.ToLower(fieldError.Field())

	switch fieldError.Tag() {
	case "required":
		return fmt.Sprintf("%s is required", field)
	case "email":
		return fmt.Sprintf("%s must be a valid email address", field)
	case "min":
		return fmt.Sprintf("%s is too short", field)
	case "max":
		return fmt.Sprintf("%s is too long", field)
	default:
		return fmt.Sprintf("%s is invalid", field)
	}
}
