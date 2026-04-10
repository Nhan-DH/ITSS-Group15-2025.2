package main

import (
	"log"
	"net/http"

	handlers "gym-management/internal/infra/api/handlers"
	"gym-management/internal/infra/api/routes"
	"gym-management/internal/infra/postgresql"
	"gym-management/internal/repository"
	"gym-management/internal/usecase"
)

func main() {
	// Initialize database
	db := postgresql.NewDB()

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
	memberHandler := handlers.NewMemberHandler(memberUsecase)
	employeeHandler := handlers.NewEmployeeHandler(employeeUsecase)
	packageHandler := handlers.NewPackageHandler(packageUsecase)
	equipmentHandler := handlers.NewEquipmentHandler(equipmentUsecase)
	feedbackHandler := handlers.NewFeedbackHandler(feedbackUsecase)
	roleHandler := handlers.NewRoleHandler(roleUsecase)
	facilityHandler := handlers.NewFacilityHandler(facilityUsecase)
	accountHandler := handlers.NewAccountHandler(accountUsecase)
	serviceCategoryHandler := handlers.NewServiceCategoryHandler(serviceCategoryUsecase)
	subscriptionHandler := handlers.NewSubscriptionHandler(subscriptionUsecase)
	trainingBookingHandler := handlers.NewTrainingBookingHandler(trainingBookingUsecase)
	trainingSessionHandler := handlers.NewTrainingSessionHandler(trainingSessionUsecase)
	ptDetailHandler := handlers.NewPTDetailHandler(ptDetailUsecase)

	// Setup routes
	router := routes.NewRouter(memberHandler, employeeHandler, packageHandler, equipmentHandler, feedbackHandler, roleHandler, facilityHandler, accountHandler, serviceCategoryHandler, subscriptionHandler, trainingBookingHandler, trainingSessionHandler, ptDetailHandler)

	log.Println("Server starting on :8080")
	log.Fatal(http.ListenAndServe(":8080", router))
}
