package feedback_test

import "gym-management/internal/domain/entity"

type mockFeedbackRepo struct {
	CreateFn          func(feedback *entity.Feedback) error
	GetByIDFn         func(id int) (*entity.Feedback, error)
	GetAllFn          func() ([]*entity.Feedback, error)
	GetAllPaginatedFn func(page, limit int, status string) ([]*entity.Feedback, int, error)
	GetByMemberIDFn   func(memberID int) ([]*entity.Feedback, error)
	UpdateFn          func(feedback *entity.Feedback) error
	DeleteFn          func(id int) error
}

func (m *mockFeedbackRepo) Create(feedback *entity.Feedback) error {
	if m.CreateFn != nil {
		return m.CreateFn(feedback)
	}
	return nil
}

func (m *mockFeedbackRepo) GetByID(id int) (*entity.Feedback, error) {
	if m.GetByIDFn != nil {
		return m.GetByIDFn(id)
	}
	return nil, nil
}

func (m *mockFeedbackRepo) GetAll() ([]*entity.Feedback, error) {
	if m.GetAllFn != nil {
		return m.GetAllFn()
	}
	return nil, nil
}

func (m *mockFeedbackRepo) GetAllPaginated(page, limit int, status string) ([]*entity.Feedback, int, error) {
	if m.GetAllPaginatedFn != nil {
		return m.GetAllPaginatedFn(page, limit, status)
	}
	return nil, 0, nil
}

func (m *mockFeedbackRepo) GetByMemberID(memberID int) ([]*entity.Feedback, error) {
	if m.GetByMemberIDFn != nil {
		return m.GetByMemberIDFn(memberID)
	}
	return nil, nil
}

func (m *mockFeedbackRepo) Update(feedback *entity.Feedback) error {
	if m.UpdateFn != nil {
		return m.UpdateFn(feedback)
	}
	return nil
}

func (m *mockFeedbackRepo) Delete(id int) error {
	if m.DeleteFn != nil {
		return m.DeleteFn(id)
	}
	return nil
}
