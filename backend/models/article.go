package models

import "time"

type Article struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Title     string    `gorm:"type:varchar(255);not null" json:"title"`
	Slug      string    `gorm:"type:varchar(255);unique" json:"slug"`
	Content   string    `gorm:"type:text" json:"content"`
	Status    string    `gorm:"type:enum('draft', 'published');default:'draft'" json:"status"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}