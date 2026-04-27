package routes

import (
	"gym-management/internal/infra/api/handlers"
	"gym-management/internal/infra/api/middleware"

	"github.com/gorilla/mux"
)

func NewRouter(
	authHandler *handlers.AuthHandler,
	memberHandler *handlers.MemberHandler,
	employeeHandler *handlers.EmployeeHandler,
	packageHandler *handlers.PackageHandler,
	equipmentHandler *handlers.EquipmentHandler,
	feedbackHandler *handlers.FeedbackHandler,
	roleHandler *handlers.RoleHandler,
	facilityHandler *handlers.FacilityHandler,
	accountHandler *handlers.AccountHandler,
	serviceCategoryHandler *handlers.ServiceCategoryHandler,
	subscriptionHandler *handlers.SubscriptionHandler,
	trainingBookingHandler *handlers.TrainingBookingHandler,
	trainingSessionHandler *handlers.TrainingSessionHandler,
	ptDetailHandler *handlers.PTDetailHandler,
) *mux.Router {
	r := mux.NewRouter()
	r.Use(middleware.LoggingMiddleware)
	r.Use(middleware.RecoveryMiddleware)
	RegisterAuthRoutes(r, authHandler)

	authenticated := r.PathPrefix("").Subrouter()
	authenticated.Use(middleware.AuthJWTMiddleware)

	ownerManager := authenticated.NewRoute().Subrouter()
	ownerManager.Use(middleware.Authorize("OWNER", "MANAGER"))

	staff := authenticated.NewRoute().Subrouter()
	staff.Use(middleware.Authorize("OWNER", "MANAGER", "PT"))

	memberOnly := authenticated.NewRoute().Subrouter()
	memberOnly.Use(middleware.Authorize("MEMBER"))

	allRoles := authenticated.NewRoute().Subrouter()
	allRoles.Use(middleware.Authorize("OWNER", "MANAGER", "PT", "MEMBER"))

	// Owner/Manager only routes (admin and configuration)
	ownerManager.HandleFunc("/employees", employeeHandler.Create).Methods("POST")
	ownerManager.HandleFunc("/employees", employeeHandler.GetAll).Methods("GET")
	ownerManager.HandleFunc("/employees/{id:[0-9]+}", employeeHandler.GetByID).Methods("GET")
	ownerManager.HandleFunc("/employees/{id:[0-9]+}", employeeHandler.Update).Methods("PUT")
	ownerManager.HandleFunc("/employees/{id:[0-9]+}", employeeHandler.Delete).Methods("DELETE")

	ownerManager.HandleFunc("/roles", roleHandler.Create).Methods("POST")
	ownerManager.HandleFunc("/roles", roleHandler.GetAll).Methods("GET")
	ownerManager.HandleFunc("/roles/{id:[0-9]+}", roleHandler.GetByID).Methods("GET")
	ownerManager.HandleFunc("/roles/{id:[0-9]+}", roleHandler.Update).Methods("PUT")
	ownerManager.HandleFunc("/roles/{id:[0-9]+}", roleHandler.Delete).Methods("DELETE")

	ownerManager.HandleFunc("/facilities", facilityHandler.Create).Methods("POST")
	ownerManager.HandleFunc("/facilities", facilityHandler.GetAll).Methods("GET")
	ownerManager.HandleFunc("/facilities/{id:[0-9]+}", facilityHandler.GetByID).Methods("GET")
	ownerManager.HandleFunc("/facilities/{id:[0-9]+}", facilityHandler.Update).Methods("PUT")
	ownerManager.HandleFunc("/facilities/{id:[0-9]+}", facilityHandler.Delete).Methods("DELETE")

	ownerManager.HandleFunc("/equipments", equipmentHandler.Create).Methods("POST")
	ownerManager.HandleFunc("/equipments", equipmentHandler.GetAll).Methods("GET")
	ownerManager.HandleFunc("/equipments/{id:[0-9]+}", equipmentHandler.GetByID).Methods("GET")
	ownerManager.HandleFunc("/equipments/{id:[0-9]+}", equipmentHandler.Update).Methods("PUT")
	ownerManager.HandleFunc("/equipments/{id:[0-9]+}", equipmentHandler.Delete).Methods("DELETE")

	ownerManager.HandleFunc("/accounts", accountHandler.Create).Methods("POST")
	ownerManager.HandleFunc("/accounts", accountHandler.GetAll).Methods("GET")
	ownerManager.HandleFunc("/accounts/{id:[0-9]+}", accountHandler.GetByID).Methods("GET")
	ownerManager.HandleFunc("/accounts/{id:[0-9]+}", accountHandler.Update).Methods("PUT")
	ownerManager.HandleFunc("/accounts/{id:[0-9]+}", accountHandler.Delete).Methods("DELETE")

	ownerManager.HandleFunc("/service-categories", serviceCategoryHandler.Create).Methods("POST")
	ownerManager.HandleFunc("/service-categories", serviceCategoryHandler.GetAll).Methods("GET")
	ownerManager.HandleFunc("/service-categories/{id:[0-9]+}", serviceCategoryHandler.GetByID).Methods("GET")
	ownerManager.HandleFunc("/service-categories/{id:[0-9]+}", serviceCategoryHandler.Update).Methods("PUT")
	ownerManager.HandleFunc("/service-categories/{id:[0-9]+}", serviceCategoryHandler.Delete).Methods("DELETE")

	ownerManager.HandleFunc("/packages", packageHandler.Create).Methods("POST")
	ownerManager.HandleFunc("/packages/{id:[0-9]+}", packageHandler.Update).Methods("PUT")
	ownerManager.HandleFunc("/packages/{id:[0-9]+}", packageHandler.Delete).Methods("DELETE")

	ownerManager.HandleFunc("/members", memberHandler.Create).Methods("POST")
	ownerManager.HandleFunc("/members", memberHandler.GetAll).Methods("GET")
	ownerManager.HandleFunc("/members/{id:[0-9]+}", memberHandler.Update).Methods("PUT")
	ownerManager.HandleFunc("/members/{id:[0-9]+}/status", memberHandler.UpdateStatus).Methods("PUT")
	ownerManager.HandleFunc("/members/{id:[0-9]+}", memberHandler.Delete).Methods("DELETE")

	ownerManager.HandleFunc("/feedbacks", feedbackHandler.GetAll).Methods("GET")
	ownerManager.HandleFunc("/feedbacks/{id:[0-9]+}", feedbackHandler.Update).Methods("PUT")
	ownerManager.HandleFunc("/feedbacks/{id:[0-9]+}", feedbackHandler.Delete).Methods("DELETE")

	ownerManager.HandleFunc("/subscriptions", subscriptionHandler.Create).Methods("POST")
	ownerManager.HandleFunc("/subscriptions/{id:[0-9]+}", subscriptionHandler.Update).Methods("PUT")
	ownerManager.HandleFunc("/subscriptions/{id:[0-9]+}", subscriptionHandler.Delete).Methods("DELETE")

	ownerManager.HandleFunc("/pt-details", ptDetailHandler.Create).Methods("POST")
	ownerManager.HandleFunc("/pt-details/{employeeID:[0-9]+}", ptDetailHandler.Update).Methods("PUT")
	ownerManager.HandleFunc("/pt-details/{employeeID:[0-9]+}", ptDetailHandler.Delete).Methods("DELETE")

	// Staff routes (Owner/Manager/PT)
	staff.HandleFunc("/members", memberHandler.GetAll).Methods("GET")
	staff.HandleFunc("/subscriptions", subscriptionHandler.GetAll).Methods("GET")
	staff.HandleFunc("/training-bookings", trainingBookingHandler.GetAll).Methods("GET")
	staff.HandleFunc("/training-bookings/{id:[0-9]+}", trainingBookingHandler.Update).Methods("PUT")
	staff.HandleFunc("/training-bookings/{id:[0-9]+}", trainingBookingHandler.Delete).Methods("DELETE")
	staff.HandleFunc("/training-sessions", trainingSessionHandler.Create).Methods("POST")
	staff.HandleFunc("/training-sessions", trainingSessionHandler.GetAll).Methods("GET")
	staff.HandleFunc("/training-sessions/{id:[0-9]+}", trainingSessionHandler.Update).Methods("PUT")
	staff.HandleFunc("/training-sessions/{id:[0-9]+}", trainingSessionHandler.Delete).Methods("DELETE")
	staff.HandleFunc("/pt-details", ptDetailHandler.GetAll).Methods("GET")
	staff.HandleFunc("/feedbacks", feedbackHandler.GetAll).Methods("GET")
	staff.HandleFunc("/feedbacks/{id:[0-9]+}", feedbackHandler.Update).Methods("PUT")
	staff.HandleFunc("/feedbacks/{id:[0-9]+}", feedbackHandler.Delete).Methods("DELETE")
	staff.HandleFunc("/feedbacks/{id:[0-9]+}/status", feedbackHandler.UpdateStatus).Methods("PATCH")

	// Member self-service routes (phải đăng ký TRƯỚC các route có {id} để tránh conflict)
	memberOnly.HandleFunc("/members/me", memberHandler.GetMe).Methods("GET")
	memberOnly.HandleFunc("/members/me", memberHandler.UpdateMe).Methods("PUT")
	memberOnly.HandleFunc("/members/me/packages", memberHandler.GetMyPackages).Methods("GET")
	memberOnly.HandleFunc("/members/me/packages/register", memberHandler.RegisterMyPackage).Methods("POST")
	memberOnly.HandleFunc("/members/me/packages/renew", memberHandler.RenewMyPackage).Methods("POST")
	memberOnly.HandleFunc("/members/me/training-history", memberHandler.GetMyTrainingHistory).Methods("GET")
	memberOnly.HandleFunc("/members/me/schedule", memberHandler.GetMySchedule).Methods("GET")
	memberOnly.HandleFunc("/members/me/feedbacks", memberHandler.GetMyFeedbacks).Methods("GET")

	// All authenticated roles (Owner/Manager/PT/Member)
	allRoles.HandleFunc("/packages", packageHandler.GetAll).Methods("GET")
	allRoles.HandleFunc("/packages/{id:[0-9]+}", packageHandler.GetByID).Methods("GET")
	allRoles.HandleFunc("/members/{id:[0-9]+}", memberHandler.GetByID).Methods("GET")
	allRoles.HandleFunc("/subscriptions/{id:[0-9]+}", subscriptionHandler.GetByID).Methods("GET")
	allRoles.HandleFunc("/training-bookings", trainingBookingHandler.Create).Methods("POST")
	allRoles.HandleFunc("/training-bookings/{id:[0-9]+}", trainingBookingHandler.GetByID).Methods("GET")
	allRoles.HandleFunc("/training-sessions/{id:[0-9]+}", trainingSessionHandler.GetByID).Methods("GET")
	allRoles.HandleFunc("/feedbacks", feedbackHandler.Create).Methods("POST")
	allRoles.HandleFunc("/feedbacks/{id:[0-9]+}", feedbackHandler.GetByID).Methods("GET")

	return r
}
