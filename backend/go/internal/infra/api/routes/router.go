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
	invoiceHandler *handlers.InvoiceHandler,
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

	allRoles := authenticated.NewRoute().Subrouter()
	allRoles.Use(middleware.Authorize("OWNER", "MANAGER", "PT", "MEMBER"))

	// Owner/Manager only routes (admin and configuration)
	ownerManager.HandleFunc("/employees", employeeHandler.Create).Methods("POST")
	ownerManager.HandleFunc("/employees", employeeHandler.GetAll).Methods("GET")
	ownerManager.HandleFunc("/employees/{id}", employeeHandler.GetByID).Methods("GET")
	ownerManager.HandleFunc("/employees/{id}", employeeHandler.Update).Methods("PUT")
	ownerManager.HandleFunc("/employees/{id}", employeeHandler.Delete).Methods("DELETE")

	ownerManager.HandleFunc("/roles", roleHandler.Create).Methods("POST")
	ownerManager.HandleFunc("/roles", roleHandler.GetAll).Methods("GET")
	ownerManager.HandleFunc("/roles/{id}", roleHandler.GetByID).Methods("GET")
	ownerManager.HandleFunc("/roles/{id}", roleHandler.Update).Methods("PUT")
	ownerManager.HandleFunc("/roles/{id}", roleHandler.Delete).Methods("DELETE")

	ownerManager.HandleFunc("/facilities", facilityHandler.Create).Methods("POST")
	ownerManager.HandleFunc("/facilities", facilityHandler.GetAll).Methods("GET")
	ownerManager.HandleFunc("/facilities/{id}", facilityHandler.GetByID).Methods("GET")
	ownerManager.HandleFunc("/facilities/{id}", facilityHandler.Update).Methods("PUT")
	ownerManager.HandleFunc("/facilities/{id}", facilityHandler.Delete).Methods("DELETE")

	ownerManager.HandleFunc("/equipments", equipmentHandler.Create).Methods("POST")
	ownerManager.HandleFunc("/equipments", equipmentHandler.GetAll).Methods("GET")
	ownerManager.HandleFunc("/equipments/{id}", equipmentHandler.GetByID).Methods("GET")
	ownerManager.HandleFunc("/equipments/{id}", equipmentHandler.Update).Methods("PUT")
	ownerManager.HandleFunc("/equipments/{id}", equipmentHandler.Delete).Methods("DELETE")

	ownerManager.HandleFunc("/accounts", accountHandler.Create).Methods("POST")
	ownerManager.HandleFunc("/accounts", accountHandler.GetAll).Methods("GET")
	ownerManager.HandleFunc("/accounts/{id}", accountHandler.GetByID).Methods("GET")
	ownerManager.HandleFunc("/accounts/{id}", accountHandler.Update).Methods("PUT")
	ownerManager.HandleFunc("/accounts/{id}", accountHandler.Delete).Methods("DELETE")

	ownerManager.HandleFunc("/service-categories", serviceCategoryHandler.Create).Methods("POST")
	ownerManager.HandleFunc("/service-categories", serviceCategoryHandler.GetAll).Methods("GET")
	ownerManager.HandleFunc("/service-categories/{id}", serviceCategoryHandler.GetByID).Methods("GET")
	ownerManager.HandleFunc("/service-categories/{id}", serviceCategoryHandler.Update).Methods("PUT")
	ownerManager.HandleFunc("/service-categories/{id}", serviceCategoryHandler.Delete).Methods("DELETE")

	ownerManager.HandleFunc("/packages", packageHandler.Create).Methods("POST")
	ownerManager.HandleFunc("/packages/{id}", packageHandler.Update).Methods("PUT")
	ownerManager.HandleFunc("/packages/{id}", packageHandler.Delete).Methods("DELETE")

	ownerManager.HandleFunc("/members", memberHandler.Create).Methods("POST")
	ownerManager.HandleFunc("/members", memberHandler.GetAll).Methods("GET")
	ownerManager.HandleFunc("/members/{id}", memberHandler.Update).Methods("PUT")
	ownerManager.HandleFunc("/members/{id}/status", memberHandler.UpdateStatus).Methods("PUT")
	ownerManager.HandleFunc("/members/{id}", memberHandler.Delete).Methods("DELETE")

	ownerManager.HandleFunc("/feedbacks", feedbackHandler.GetAll).Methods("GET")
	ownerManager.HandleFunc("/feedbacks/{id}", feedbackHandler.Update).Methods("PUT")
	ownerManager.HandleFunc("/feedbacks/{id}", feedbackHandler.Delete).Methods("DELETE")
	ownerManager.HandleFunc("/transactions", invoiceHandler.GetTransactions).Methods("GET")

	ownerManager.HandleFunc("/subscriptions", subscriptionHandler.Create).Methods("POST")
	ownerManager.HandleFunc("/subscriptions/{id}", subscriptionHandler.Update).Methods("PUT")
	ownerManager.HandleFunc("/subscriptions/{id}", subscriptionHandler.Delete).Methods("DELETE")

	ownerManager.HandleFunc("/pt-details", ptDetailHandler.Create).Methods("POST")
	ownerManager.HandleFunc("/pt-details/{employeeID}", ptDetailHandler.Update).Methods("PUT")
	ownerManager.HandleFunc("/pt-details/{employeeID}", ptDetailHandler.Delete).Methods("DELETE")

	// Staff routes (Owner/Manager/PT)
	staff.HandleFunc("/members", memberHandler.GetAll).Methods("GET")
	staff.HandleFunc("/subscriptions", subscriptionHandler.GetAll).Methods("GET")
	staff.HandleFunc("/training-bookings", trainingBookingHandler.GetAll).Methods("GET")
	staff.HandleFunc("/training-bookings/{id}", trainingBookingHandler.Update).Methods("PUT")
	staff.HandleFunc("/training-bookings/{id}", trainingBookingHandler.Delete).Methods("DELETE")
	staff.HandleFunc("/training-sessions", trainingSessionHandler.Create).Methods("POST")
	staff.HandleFunc("/training-sessions", trainingSessionHandler.GetAll).Methods("GET")
	staff.HandleFunc("/training-sessions/{id}", trainingSessionHandler.Update).Methods("PUT")
	staff.HandleFunc("/training-sessions/{id}", trainingSessionHandler.Delete).Methods("DELETE")
	staff.HandleFunc("/pt-details", ptDetailHandler.GetAll).Methods("GET")
	staff.HandleFunc("/feedbacks", feedbackHandler.GetAll).Methods("GET")
	staff.HandleFunc("/feedbacks/{id}", feedbackHandler.Update).Methods("PUT")
	staff.HandleFunc("/feedbacks/{id}", feedbackHandler.Delete).Methods("DELETE")

	// All authenticated roles (Owner/Manager/PT/Member)
	allRoles.HandleFunc("/packages", packageHandler.GetAll).Methods("GET")
	allRoles.HandleFunc("/packages/{id}", packageHandler.GetByID).Methods("GET")
	allRoles.HandleFunc("/members/{id}", memberHandler.GetByID).Methods("GET")
	allRoles.HandleFunc("/subscriptions/{id}", subscriptionHandler.GetByID).Methods("GET")
	allRoles.HandleFunc("/training-bookings", trainingBookingHandler.Create).Methods("POST")
	allRoles.HandleFunc("/training-bookings/{id}", trainingBookingHandler.GetByID).Methods("GET")
	allRoles.HandleFunc("/training-sessions/{id}", trainingSessionHandler.GetByID).Methods("GET")
	allRoles.HandleFunc("/feedbacks", feedbackHandler.Create).Methods("POST")
	allRoles.HandleFunc("/feedbacks/{id}", feedbackHandler.GetByID).Methods("GET")

	return r
}
