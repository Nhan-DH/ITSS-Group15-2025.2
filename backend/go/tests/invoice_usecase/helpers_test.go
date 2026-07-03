package invoice_test

import (
	"errors"
	"testing"
	"time"

	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase/invoice_usecase"
)

func newTestUsecase(repo *mockInvoiceRepo) invoice_usecase.InvoiceUsecase {
	return invoice_usecase.NewInvoiceUsecase(repo)
}

func makeInvoice(id int) *entity.Invoice {
	return &entity.Invoice{
		ID:             id,
		MemberID:       5,
		SubscriptionID: 3,
		InvoiceDate:    time.Now(),
		TotalAmount:    500000,
		PaymentStatus:  "paid",
		PaymentMethod:  "cash",
	}
}

func makeTransaction(id int) *entity.InvoiceTransaction {
	return &entity.InvoiceTransaction{
		ID:           id,
		Type:         "subscription",
		CustomerName: "Nguyen Van A",
		Phone:        "0901234567",
		PackageName:  "Basic",
		Date:         time.Now(),
		Amount:       300000,
		Status:       "completed",
	}
}

func assertNoError(t *testing.T, err error) {
	t.Helper()
	if err != nil {
		t.Errorf("expected no error, got: %v", err)
	}
}

func assertErrorMsg(t *testing.T, got error, wantMsg string) {
	t.Helper()
	if got == nil {
		t.Errorf("expected error %q, got nil", wantMsg)
		return
	}
	if got.Error() != wantMsg {
		t.Errorf("expected error %q, got %q", wantMsg, got.Error())
	}
}

func assertErrorIs(t *testing.T, got, want error) {
	t.Helper()
	if got == nil {
		t.Errorf("expected error %v, got nil", want)
		return
	}
	if !errors.Is(got, want) {
		t.Errorf("expected errors.Is(%v), got: %v", want, got)
	}
}
