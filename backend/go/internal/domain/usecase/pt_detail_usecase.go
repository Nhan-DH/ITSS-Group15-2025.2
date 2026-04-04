package usecase

import "gym-management/internal/domain/entity"

type PTDetailUsecase interface {
	CreatePTDetail(ptd *entity.PTDetail) error
	GetPTDetailByID(id int) (*entity.PTDetail, error)
	GetAllPTDetails() ([]*entity.PTDetail, error)
	UpdatePTDetail(ptd *entity.PTDetail) error
	DeletePTDetail(id int) error
}
