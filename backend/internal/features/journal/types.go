package journal

type Entry struct {
	Date string `json:"date"`
	Text string `json:"text"`
}

type UpsertEntryRequest struct {
	Text string `json:"text" validate:"required,min=1,max=2000"`
}
