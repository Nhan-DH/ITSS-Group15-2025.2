package http

import (
	"github.com/gorilla/mux"
)

func NewRouter(
	memberHandler *MemberHandler,
	employeeHandler *EmployeeHandler,
	packageHandler *PackageHandler,
	equipmentHandler *EquipmentHandler,
	feedbackHandler *FeedbackHandler,
	roleHandler *RoleHandler,
	facilityHandler *FacilityHandler,
	accountHandler *AccountHandler,
	serviceCategoryHandler *ServiceCategoryHandler,
	subscriptionHandler *SubscriptionHandler,
	trainingBookingHandler *TrainingBookingHandler,
	trainingSessionHandler *TrainingSessionHandler,
	ptDetailHandler *PTDetailHandler,
) *mux.Router {
	r := mux.NewRouter()

	// Member routes
	r.HandleFunc("/members", memberHandler.Create).Methods("POST")
	r.HandleFunc("/members", memberHandler.GetAll).Methods("GET")
	r.HandleFunc("/members/{id}", memberHandler.GetByID).Methods("GET")
	r.HandleFunc("/members/{id}", memberHandler.Update).Methods("PUT")
	r.HandleFunc("/members/{id}", memberHandler.Delete).Methods("DELETE")

	// Employee routes
	r.HandleFunc("/employees", employeeHandler.Create).Methods("POST")
	r.HandleFunc("/employees", employeeHandler.GetAll).Methods("GET")
	r.HandleFunc("/employees/{id}", employeeHandler.GetByID).Methods("GET")
	r.HandleFunc("/employees/{id}", employeeHandler.Update).Methods("PUT")
	r.HandleFunc("/employees/{id}", employeeHandler.Delete).Methods("DELETE")

	// Package routes
	r.HandleFunc("/packages", packageHandler.Create).Methods("POST")
	r.HandleFunc("/packages", packageHandler.GetAll).Methods("GET")
	r.HandleFunc("/packages/{id}", packageHandler.GetByID).Methods("GET")
	r.HandleFunc("/packages/{id}", packageHandler.Update).Methods("PUT")
	r.HandleFunc("/packages/{id}", packageHandler.Delete).Methods("DELETE")

	// Equipment routes
	r.HandleFunc("/equipments", equipmentHandler.Create).Methods("POST")
	r.HandleFunc("/equipments", equipmentHandler.GetAll).Methods("GET")
	r.HandleFunc("/equipments/{id}", equipmentHandler.GetByID).Methods("GET")
	r.HandleFunc("/equipments/{id}", equipmentHandler.Update).Methods("PUT")
	r.HandleFunc("/equipments/{id}", equipmentHandler.Delete).Methods("DELETE")

	// Feedback routes
	r.HandleFunc("/feedbacks", feedbackHandler.Create).Methods("POST")
	r.HandleFunc("/feedbacks", feedbackHandler.GetAll).Methods("GET")
	r.HandleFunc("/feedbacks/{id}", feedbackHandler.GetByID).Methods("GET")
	r.HandleFunc("/feedbacks/{id}", feedbackHandler.Update).Methods("PUT")
	r.HandleFunc("/feedbacks/{id}", feedbackHandler.Delete).Methods("DELETE")

	// Role routes
	r.HandleFunc("/roles", roleHandler.Create).Methods("POST")
	r.HandleFunc("/roles", roleHandler.GetAll).Methods("GET")
	r.HandleFunc("/roles/{id}", roleHandler.GetByID).Methods("GET")
	r.HandleFunc("/roles/{id}", roleHandler.Update).Methods("PUT")
	r.HandleFunc("/roles/{id}", roleHandler.Delete).Methods("DELETE")

	// Facility routes
	r.HandleFunc("/facilities", facilityHandler.Create).Methods("POST")
	r.HandleFunc("/facilities", facilityHandler.GetAll).Methods("GET")
	r.HandleFunc("/facilities/{id}", facilityHandler.GetByID).Methods("GET")
	r.HandleFunc("/facilities/{id}", facilityHandler.Update).Methods("PUT")
	r.HandleFunc("/facilities/{id}", facilityHandler.Delete).Methods("DELETE")

	// Account routes
	r.HandleFunc("/accounts", accountHandler.Create).Methods("POST")
	r.HandleFunc("/accounts", accountHandler.GetAll).Methods("GET")
	r.HandleFunc("/accounts/{id}", accountHandler.GetByID).Methods("GET")
	r.HandleFunc("/accounts/{id}", accountHandler.Update).Methods("PUT")
	r.HandleFunc("/accounts/{id}", accountHandler.Delete).Methods("DELETE")

	// ServiceCategory routes
	r.HandleFunc("/service-categories", serviceCategoryHandler.Create).Methods("POST")
	r.HandleFunc("/service-categories", serviceCategoryHandler.GetAll).Methods("GET")
	r.HandleFunc("/service-categories/{id}", serviceCategoryHandler.GetByID).Methods("GET")
	r.HandleFunc("/service-categories/{id}", serviceCategoryHandler.Update).Methods("PUT")
	r.HandleFunc("/service-categories/{id}", serviceCategoryHandler.Delete).Methods("DELETE")

	// Subscription routes
	r.HandleFunc("/subscriptions", subscriptionHandler.Create).Methods("POST")
	r.HandleFunc("/subscriptions", subscriptionHandler.GetAll).Methods("GET")
	r.HandleFunc("/subscriptions/{id}", subscriptionHandler.GetByID).Methods("GET")
	r.HandleFunc("/subscriptions/{id}", subscriptionHandler.Update).Methods("PUT")
	r.HandleFunc("/subscriptions/{id}", subscriptionHandler.Delete).Methods("DELETE")

	// TrainingBooking routes
	r.HandleFunc("/training-bookings", trainingBookingHandler.Create).Methods("POST")
	r.HandleFunc("/training-bookings", trainingBookingHandler.GetAll).Methods("GET")
	r.HandleFunc("/training-bookings/{id}", trainingBookingHandler.GetByID).Methods("GET")
	r.HandleFunc("/training-bookings/{id}", trainingBookingHandler.Update).Methods("PUT")
	r.HandleFunc("/training-bookings/{id}", trainingBookingHandler.Delete).Methods("DELETE")

	// TrainingSession routes
	r.HandleFunc("/training-sessions", trainingSessionHandler.Create).Methods("POST")
	r.HandleFunc("/training-sessions", trainingSessionHandler.GetAll).Methods("GET")
	r.HandleFunc("/training-sessions/{id}", trainingSessionHandler.GetByID).Methods("GET")
	r.HandleFunc("/training-sessions/{id}", trainingSessionHandler.Update).Methods("PUT")
	r.HandleFunc("/training-sessions/{id}", trainingSessionHandler.Delete).Methods("DELETE")

	// PTDetail routes
	r.HandleFunc("/pt-details", ptDetailHandler.Create).Methods("POST")
	r.HandleFunc("/pt-details", ptDetailHandler.GetAll).Methods("GET")
	r.HandleFunc("/pt-details/{employeeID}", ptDetailHandler.GetByID).Methods("GET")
	r.HandleFunc("/pt-details/{employeeID}", ptDetailHandler.Update).Methods("PUT")
	r.HandleFunc("/pt-details/{employeeID}", ptDetailHandler.Delete).Methods("DELETE")

	return r
}
