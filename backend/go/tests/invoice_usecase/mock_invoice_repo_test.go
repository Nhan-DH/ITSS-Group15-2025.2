package invoice_test

import "gym-management/internal/domain/entity"

type mockInvoiceRepo struct {
	GetAllTransactionsFn func() ([]*entity.InvoiceTransaction, error)
	CreateInvoiceFn      func(invoice *entity.Invoice) error
}

func (m *mockInvoiceRepo) GetAllTransactions() ([]*entity.InvoiceTransaction, error) {
	if m.GetAllTransactionsFn != nil {
		return m.GetAllTransactionsFn()
	}
	return nil, nil
}

func (m *mockInvoiceRepo) CreateInvoice(invoice *entity.Invoice) error {
	if m.CreateInvoiceFn != nil {
		return m.CreateInvoiceFn(invoice)
	}
	return nil
}
