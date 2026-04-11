package equipment_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type EquipmentUsecase interface {
	CreateEquipment(equipment *entity.Equipment) error
	GetEquipmentByID(id int) (*entity.Equipment, error)
	GetAllEquipments() ([]*entity.Equipment, error)
	UpdateEquipment(equipment *entity.Equipment) error
	DeleteEquipment(id int) error
}

type equipmentUsecase struct {
	create ICreateEquipmentUseCase
	get    IGetEquipmentUseCase
	list   IListEquipmentsUseCase
	update IUpdateEquipmentUseCase
	delete IDeleteEquipmentUseCase
}

func NewEquipmentUsecase(repo adapter.EquipmentRepository) EquipmentUsecase {
	return &equipmentUsecase{
		create: NewCreateEquipmentUseCase(repo),
		get:    NewGetEquipmentUseCase(repo),
		list:   NewListEquipmentsUseCase(repo),
		update: NewUpdateEquipmentUseCase(repo),
		delete: NewDeleteEquipmentUseCase(repo),
	}
}

func (u *equipmentUsecase) CreateEquipment(equipment *entity.Equipment) error {
	created, err := u.create.Execute(context.Background(), equipment)
	if err != nil {
		return err
	}
	*equipment = *created
	return nil
}

func (u *equipmentUsecase) GetEquipmentByID(id int) (*entity.Equipment, error) {
	return u.get.Execute(context.Background(), id)
}

func (u *equipmentUsecase) GetAllEquipments() ([]*entity.Equipment, error) {
	return u.list.Execute(context.Background())
}

func (u *equipmentUsecase) UpdateEquipment(equipment *entity.Equipment) error {
	updated, err := u.update.Execute(context.Background(), equipment)
	if err != nil {
		return err
	}
	*equipment = *updated
	return nil
}

func (u *equipmentUsecase) DeleteEquipment(id int) error {
	return u.delete.Execute(context.Background(), id)
}
