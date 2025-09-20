import { InvoiceForm, InvoiceDetail, InvoiceExplorerModel, ApiResponse, PaginatedResponse } from './models';

// Mock data services (similar to operations pattern)
export async function getInvoices(): Promise<{ data: InvoiceExplorerModel[] }> {
  // Mock data for invoice explorer
  return Promise.resolve({
    data: [
      {
        ID: 1,
        InvoiceNo: 'INV-001',
        Status: 'Draft',
        CreatedDate: '2025-08-01T12:00:00Z',
        Description: 'Service Invoice for ABC Company',
        CustomerName: 'ABC Corporation',
        Amount: 15000.00,
        Currency: 'USD',
      },
      {
        ID: 2,
        InvoiceNo: 'INV-002',
        Status: 'Sent',
        CreatedDate: '2025-08-02T12:00:00Z',
        Description: 'Monthly Subscription Invoice',
        CustomerName: 'XYZ Ltd',
        Amount: 2500.00,
        Currency: 'EUR',
      },
      {
        ID: 3,
        InvoiceNo: 'INV-003',
        Status: 'Paid',
        CreatedDate: '2025-08-03T12:00:00Z',
        Description: 'Consulting Services Invoice',
        CustomerName: 'DEF Industries',
        Amount: 8750.00,
        Currency: 'GBP',
      },
    ],
  });
}

export async function getInvoiceById(id: number): Promise<InvoiceDetail> {
  // Mock data for invoice detail page
  return {
    ID: id,
    InvoiceNo: `INV-${String(id).padStart(3, '0')}`,
    CustomerId: 1,
    CompanyId: 1,
    CurrencyId: 1,
    Status: 'Draft',
    Description: 'Service Invoice for Client',
    InvoiceDate: '2025-08-25T00:00:00Z',
    DueDate: '2025-09-25T00:00:00Z',
    TotalAmount: 15000.00,
    CustomerName: 'ABC Corporation',
    Currency: 'USD',
    CreatedBy: 'admin',
    CreatedDate: '2025-08-25T12:00:00Z',
    UpdatedBy: 'admin',
    UpdatedDate: '2025-08-25T12:00:00Z',
    Lines: [
      {
        ID: 1,
        InvoiceId: id,
        LineCode: 'LINE001',
        AccountNumber: '4000',
        Description: 'Consulting Services',
        Quantity: 1,
        Rate: 12000.00,
        Amount: 12000.00,
        VatRate: 20,
        VatAmount: 2400.00,
        TotalAmount: 14400.00,
      },
      {
        ID: 2,
        InvoiceId: id,
        LineCode: 'LINE002',
        AccountNumber: '4001',
        Description: 'Additional Services',
        Quantity: 1,
        Rate: 600.00,
        Amount: 600.00,
        VatRate: 20,
        VatAmount: 120.00,
        TotalAmount: 720.00,
      },
    ],
  };
}

export async function createInvoice(invoice: InvoiceForm): Promise<ApiResponse<InvoiceDetail>> {
  // Mock create invoice
  console.log('Creating invoice:', invoice);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newInvoice: InvoiceDetail = {
    ID: Math.floor(Math.random() * 1000) + 100,
    InvoiceNo: `INV-${String(Math.floor(Math.random() * 1000) + 100).padStart(3, '0')}`,
    CustomerId: 1,
    CompanyId: 1,
    CurrencyId: 1,
    Status: 'Draft',
    Description: invoice.invoiceComments || 'New Invoice',
    InvoiceDate: invoice.invoiceDate,
    DueDate: invoice.dueDate,
    TotalAmount: invoice.invoiceAmount,
    CustomerName: invoice.customer,
    Currency: invoice.currency,
    CreatedBy: invoice.createdBy,
    CreatedDate: new Date().toISOString(),
    UpdatedBy: invoice.updatedBy,
    UpdatedDate: new Date().toISOString(),
    Lines: invoice.lines.map((line, index) => ({
      ID: index + 1,
      InvoiceId: 0, // Will be set after creation
      LineCode: line.lineCode,
      AccountNumber: line.accountNumber,
      Description: line.description,
      Quantity: line.quantity,
      Rate: line.rate,
      Amount: line.currencyAmount,
      VatRate: line.vatRate,
      VatAmount: line.vatAmount,
      TotalAmount: line.totalAmount,
    })),
  };

  return {
    success: true,
    data: newInvoice,
    message: 'Invoice created successfully',
  };
}

export async function updateInvoice(id: number, invoice: InvoiceForm): Promise<ApiResponse<InvoiceDetail>> {
  // Mock update invoice
  console.log('Updating invoice:', id, invoice);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const updatedInvoice = await getInvoiceById(id);
  
  return {
    success: true,
    data: {
      ...updatedInvoice,
      Description: invoice.invoiceComments || updatedInvoice.Description,
      TotalAmount: invoice.invoiceAmount,
      UpdatedBy: invoice.updatedBy,
      UpdatedDate: new Date().toISOString(),
    },
    message: 'Invoice updated successfully',
  };
}

export async function deleteInvoice(id: number): Promise<ApiResponse<boolean>> {
  // Mock delete invoice
  console.log('Deleting invoice:', id);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    data: true,
    message: 'Invoice deleted successfully',
  };
}

export async function getInvoicesPaginated(
  pageNumber: number = 1,
  pageSize: number = 10,
  searchTerm?: string
): Promise<PaginatedResponse<InvoiceExplorerModel>> {
  const { data } = await getInvoices();
  
  // Filter by search term if provided
  let filteredData = data;
  if (searchTerm) {
    filteredData = data.filter(invoice => 
      invoice.InvoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.CustomerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.Description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  const totalCount = filteredData.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const items = filteredData.slice(startIndex, endIndex);
  
  return {
    items,
    totalCount,
    pageNumber,
    pageSize,
    totalPages,
  };
}

// InvoiceService class (similar to what was expected in CreateAR component)
export class InvoiceService {
  static generateInvoiceNumber(): string {
    // Generate a unique invoice number
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `INV-${timestamp}-${random}`;
  }

  static calculateLineTotal(line: any): any {
    // Calculate line totals
    const currencyAmount = line.quantity * line.rate;
    const vatAmount = currencyAmount * (line.vatRate / 100);
    const totalAmount = currencyAmount + vatAmount;
    
    return {
      ...line,
      currencyAmount,
      baseAmount: currencyAmount * (line.roeRate || 1),
      vatAmount,
      totalAmount
    };
  }

  static calculateInvoiceTotals(lines: any[]): { 
    subtotal: number;
    totalVat: number;
    grandTotal: number;
  } {
    // Calculate invoice totals from line items
    const subtotal = lines.reduce((sum, line) => {
      const lineAmount = (line.quantity || 0) * (line.rate || 0);
      return sum + lineAmount;
    }, 0);

    const totalVat = lines.reduce((sum, line) => {
      const lineAmount = (line.quantity || 0) * (line.rate || 0);
      const vatAmount = lineAmount * ((line.vatRate || 0) / 100);
      return sum + vatAmount;
    }, 0);

    const grandTotal = subtotal + totalVat;

    return {
      subtotal,
      totalVat,
      grandTotal
    };
  }

  static async saveInvoice(invoiceData: InvoiceForm): Promise<{ success: boolean; invoiceId?: string; message?: string }> {
    try {
      console.log('Saving invoice:', invoiceData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful save
      const invoiceId = `INV-${Date.now()}`;
      
      return {
        success: true,
        invoiceId,
        message: 'Invoice saved successfully'
      };
    } catch (error) {
      console.error('Error saving invoice:', error);
      return {
        success: false,
        message: 'Failed to save invoice'
      };
    }
  }

  static async loadInvoice(id: string): Promise<InvoiceForm | null> {
    try {
      console.log('Loading invoice:', id);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return mock data
      const mockInvoice: InvoiceForm = {
        process: 'STANDARD',
        invoiceType: 'SERVICE',
        companyCode: 'SHL001',
        customer: 'CUST001',
        invoiceDate: '2025-08-25',
        dueDate: '2025-09-25',
        entryDate: '2025-08-25',
        currencyDate: '2025-08-25',
        currency: 'USD',
        invoiceNumber: id,
        invoiceAmount: 15000,
        customerReference: 'REF-001',
        batchName: 'BATCH-2025-08',
        documentType: 'INVOICE',
        voucherStyle: 'STANDARD',
        voucherType: 'INV',
        voucherNo: id,
        isEInvoice: false,
        invoiceComments: 'Service invoice for consulting',
        referenceNumber: 'REF-001',
        taxCode: 'VAT20',
        taxRate: 20,
        paymentMethod: 'WIRE',
        bankAccount: 'ACC-001',
        shippingAddress: '123 Main St',
        billingAddress: '123 Main St',
        terms: 'Net 30',
        notes: 'Please pay within 30 days',
        attachments: [],
        approvalStatus: 'Draft',
        createdBy: 'Admin User',
        createdDate: '2025-08-25',
        updatedBy: 'Admin User',
        updatedDate: '2025-08-25',
        lines: []
      };
      
      return mockInvoice;
    } catch (error) {
      console.error('Error loading invoice:', error);
      return null;
    }
  }
}
