package invoice_test

import (
	"errors"
	"testing"

	"gym-management/internal/domain/entity"
)

// ─── GetAllTransactions ───────────────────────────────────────────────────────

func TestGetAllTransactions(t *testing.T) {
	t.Run("lỗi repo trả về lỗi gốc", func(t *testing.T) {
		repo := &mockInvoiceRepo{
			GetAllTransactionsFn: func() ([]*entity.InvoiceTransaction, error) {
				return nil, errors.New("db error")
			},
		}
		_, err := newTestUsecase(repo).GetAllTransactions()
		assertErrorMsg(t, err, "db error")
	})

	t.Run("trả về danh sách rỗng khi không có transaction", func(t *testing.T) {
		repo := &mockInvoiceRepo{
			GetAllTransactionsFn: func() ([]*entity.InvoiceTransaction, error) {
				return []*entity.InvoiceTransaction{}, nil
			},
		}
		result, err := newTestUsecase(repo).GetAllTransactions()
		assertNoError(t, err)
		if len(result) != 0 {
			t.Errorf("expected empty list, got %d items", len(result))
		}
	})

	t.Run("trả về đúng số lượng transaction", func(t *testing.T) {
		txns := []*entity.InvoiceTransaction{makeTransaction(1), makeTransaction(2)}
		repo := &mockInvoiceRepo{
			GetAllTransactionsFn: func() ([]*entity.InvoiceTransaction, error) {
				return txns, nil
			},
		}
		result, err := newTestUsecase(repo).GetAllTransactions()
		assertNoError(t, err)
		if len(result) != 2 {
			t.Errorf("expected 2 transactions, got %d", len(result))
		}
	})
}

// ─── CreateInvoice ────────────────────────────────────────────────────────────

func TestCreateInvoice(t *testing.T) {
	t.Run("lỗi repo trả về lỗi gốc", func(t *testing.T) {
		repo := &mockInvoiceRepo{
			CreateInvoiceFn: func(_ *entity.Invoice) error {
				return errors.New("db insert error")
			},
		}
		err := newTestUsecase(repo).CreateInvoice(makeInvoice(0))
		assertErrorMsg(t, err, "db insert error")
	})

	t.Run("tạo invoice thành công", func(t *testing.T) {
		repo := &mockInvoiceRepo{}
		err := newTestUsecase(repo).CreateInvoice(makeInvoice(1))
		assertNoError(t, err)
	})

	t.Run("repo nhận đúng invoice", func(t *testing.T) {
		var captured *entity.Invoice
		repo := &mockInvoiceRepo{
			CreateInvoiceFn: func(inv *entity.Invoice) error {
				captured = inv
				return nil
			},
		}
		inv := makeInvoice(3)
		inv.TotalAmount = 999000
		err := newTestUsecase(repo).CreateInvoice(inv)
		assertNoError(t, err)
		if captured == nil {
			t.Fatal("expected repo to receive invoice")
		}
		if captured.TotalAmount != 999000 {
			t.Errorf("TotalAmount: got %v, want 999000", captured.TotalAmount)
		}
	})
}
