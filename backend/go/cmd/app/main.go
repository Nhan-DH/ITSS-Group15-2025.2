package main

import (
	"log"
	"net/http"

	httpHandler "gym-management/internal/delivery/http"
	"gym-management/internal/infrastructure"
	"gym-management/internal/repository"
	"gym-management/internal/usecase"
)

func main() {
	// Initialize database
	db := infrastructure.NewDB()

	// Initialize repositories
	memberRepo := repository.NewMemberRepository(db)
	employeeRepo := repository.NewEmployeeRepository(db)
	packageRepo := repository.NewPackageRepository(db)
	equipmentRepo := repository.NewEquipmentRepository(db)
	feedbackRepo := repository.NewFeedbackRepository(db)
	roleRepo := repository.NewRoleRepository(db)
	facilityRepo := repository.NewFacilityRepository(db)
	accountRepo := repository.NewAccountRepository(db)
	serviceCategoryRepo := repository.NewServiceCategoryRepository(db)
	subscriptionRepo := repository.NewSubscriptionRepository(db)
	trainingBookingRepo := repository.NewTrainingBookingRepository(db)
	trainingSessionRepo := repository.NewTrainingSessionRepository(db)
	ptDetailRepo := repository.NewPTDetailRepository(db)

	// Initialize use cases
	memberUsecase := usecase.NewMemberUsecase(memberRepo)
	employeeUsecase := usecase.NewEmployeeUsecase(employeeRepo)
	packageUsecase := usecase.NewPackageUsecase(packageRepo)
	equipmentUsecase := usecase.NewEquipmentUsecase(equipmentRepo)
	feedbackUsecase := usecase.NewFeedbackUsecase(feedbackRepo)
	roleUsecase := usecase.NewRoleUsecase(roleRepo)
	facilityUsecase := usecase.NewFacilityUsecase(facilityRepo)
	accountUsecase := usecase.NewAccountUsecase(accountRepo)
	serviceCategoryUsecase := usecase.NewServiceCategoryUsecase(serviceCategoryRepo)
	subscriptionUsecase := usecase.NewSubscriptionUsecase(subscriptionRepo)
	trainingBookingUsecase := usecase.NewTrainingBookingUsecase(trainingBookingRepo)
	trainingSessionUsecase := usecase.NewTrainingSessionUsecase(trainingSessionRepo)
	ptDetailUsecase := usecase.NewPTDetailUsecase(ptDetailRepo)

	// Initialize handlers
	memberHandler := httpHandler.NewMemberHandler(memberUsecase)
	employeeHandler := httpHandler.NewEmployeeHandler(employeeUsecase)
	packageHandler := httpHandler.NewPackageHandler(packageUsecase)
	equipmentHandler := httpHandler.NewEquipmentHandler(equipmentUsecase)
	feedbackHandler := httpHandler.NewFeedbackHandler(feedbackUsecase)
	roleHandler := httpHandler.NewRoleHandler(roleUsecase)
	facilityHandler := httpHandler.NewFacilityHandler(facilityUsecase)
	accountHandler := httpHandler.NewAccountHandler(accountUsecase)
	serviceCategoryHandler := httpHandler.NewServiceCategoryHandler(serviceCategoryUsecase)
	subscriptionHandler := httpHandler.NewSubscriptionHandler(subscriptionUsecase)
	trainingBookingHandler := httpHandler.NewTrainingBookingHandler(trainingBookingUsecase)
	trainingSessionHandler := httpHandler.NewTrainingSessionHandler(trainingSessionUsecase)
	ptDetailHandler := httpHandler.NewPTDetailHandler(ptDetailUsecase)

	// Setup routes
	router := httpHandler.NewRouter(memberHandler, employeeHandler, packageHandler, equipmentHandler, feedbackHandler, roleHandler, facilityHandler, accountHandler, serviceCategoryHandler, subscriptionHandler, trainingBookingHandler, trainingSessionHandler, ptDetailHandler)

	log.Println("Server starting on :8080")
	log.Fatal(http.ListenAndServe(":8080", router))
}
