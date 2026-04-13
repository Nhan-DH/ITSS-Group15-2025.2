package main

import (
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/joho/godotenv"

	"gym-management/internal/domain/usecase/account_usecase"
	"gym-management/internal/domain/usecase/auth_usecase"
	"gym-management/internal/domain/usecase/employee_usecase"
	"gym-management/internal/domain/usecase/equipment_usecase"
	"gym-management/internal/domain/usecase/facility_usecase"
	"gym-management/internal/domain/usecase/feedback_usecase"
	"gym-management/internal/domain/usecase/member_usecase"
	"gym-management/internal/domain/usecase/package_usecase"
	"gym-management/internal/domain/usecase/pt_detail_usecase"
	"gym-management/internal/domain/usecase/role_usecase"
	"gym-management/internal/domain/usecase/service_category_usecase"
	"gym-management/internal/domain/usecase/subscription_usecase"
	"gym-management/internal/domain/usecase/training_booking_usecase"
	"gym-management/internal/domain/usecase/training_session_usecase"
	"gym-management/internal/infra/api/handlers"
	"gym-management/internal/infra/api/routes"
	"gym-management/internal/infra/postgresql"
	"gym-management/internal/repository"
)

// corsMiddleware cho phép frontend gọi backend từ origin khác (dev: localhost:5173)
func corsMiddleware(next http.Handler) http.Handler {
	// Đọc danh sách origin được phép từ env, mặc định cho phép localhost:5173
	allowedOrigins := os.Getenv("ALLOWED_ORIGINS")
	if allowedOrigins == "" {
		allowedOrigins = "http://localhost:5173"
	}
	allowed := make(map[string]bool)
	for _, o := range strings.Split(allowedOrigins, ",") {
		allowed[strings.TrimSpace(o)] = true
	}

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		if allowed[origin] {
			w.Header().Set("Access-Control-Allow-Origin", origin)
		}
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		// Trả về 200 ngay cho preflight OPTIONS request
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	// Load .env file
	if err := godotenv.Load(".env"); err != nil {
		log.Println("Warning: .env not found, using system env vars")
	}

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
	authRepo := repository.NewAuthRepository(db)
	serviceCategoryRepo := repository.NewServiceCategoryRepository(db)
	subscriptionRepo := repository.NewSubscriptionRepository(db)
	trainingBookingRepo := repository.NewTrainingBookingRepository(db)
	trainingSessionRepo := repository.NewTrainingSessionRepository(db)
	ptDetailRepo := repository.NewPTDetailRepository(db)

	// Initialize use cases
	memberUsecase := member_usecase.NewMemberUsecase(memberRepo)
	employeeUsecase := employee_usecase.NewEmployeeUsecase(employeeRepo)
	packageUsecase := package_usecase.NewPackageUsecase(packageRepo)
	equipmentUsecase := equipment_usecase.NewEquipmentUsecase(equipmentRepo)
	feedbackUsecase := feedback_usecase.NewFeedbackUsecase(feedbackRepo)
	roleUsecase := role_usecase.NewRoleUsecase(roleRepo)
	facilityUsecase := facility_usecase.NewFacilityUsecase(facilityRepo)
	accountUsecase := account_usecase.NewAccountUsecase(accountRepo)
	authUsecase := auth_usecase.NewAuthUsecase(authRepo)
	serviceCategoryUsecase := service_category_usecase.NewServiceCategoryUsecase(serviceCategoryRepo)
	subscriptionUsecase := subscription_usecase.NewSubscriptionUsecase(subscriptionRepo)
	trainingBookingUsecase := training_booking_usecase.NewTrainingBookingUsecase(trainingBookingRepo)
	trainingSessionUsecase := training_session_usecase.NewTrainingSessionUsecase(trainingSessionRepo)
	ptDetailUsecase := pt_detail_usecase.NewPTDetailUsecase(ptDetailRepo)

	// Initialize handlers
	memberHandler := handlers.NewMemberHandler(memberUsecase)
	employeeHandler := handlers.NewEmployeeHandler(employeeUsecase)
	packageHandler := handlers.NewPackageHandler(packageUsecase)
	equipmentHandler := handlers.NewEquipmentHandler(equipmentUsecase)
	feedbackHandler := handlers.NewFeedbackHandler(feedbackUsecase)
	roleHandler := handlers.NewRoleHandler(roleUsecase)
	facilityHandler := handlers.NewFacilityHandler(facilityUsecase)
	accountHandler := handlers.NewAccountHandler(accountUsecase)
	authHandler := handlers.NewAuthHandler(authUsecase)
	serviceCategoryHandler := handlers.NewServiceCategoryHandler(serviceCategoryUsecase)
	subscriptionHandler := handlers.NewSubscriptionHandler(subscriptionUsecase)
	trainingBookingHandler := handlers.NewTrainingBookingHandler(trainingBookingUsecase)
	trainingSessionHandler := handlers.NewTrainingSessionHandler(trainingSessionUsecase)
	ptDetailHandler := handlers.NewPTDetailHandler(ptDetailUsecase)

	// Setup routes
	router := routes.NewRouter(authHandler, memberHandler, employeeHandler, packageHandler, equipmentHandler, feedbackHandler, roleHandler, facilityHandler, accountHandler, serviceCategoryHandler, subscriptionHandler, trainingBookingHandler, trainingSessionHandler, ptDetailHandler)

	// Bọc router trong CORS middleware
	handler := corsMiddleware(router)

	log.Println("Server starting on :8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
