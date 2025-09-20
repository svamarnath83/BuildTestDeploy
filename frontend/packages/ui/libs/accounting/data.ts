// AR Invoice Sample Data

import { CustomerInfo, CurrencyOption, DropdownOption, ProductInfo } from './models';

export const sampleCustomers: CustomerInfo[] = [
  {
    code: "CUST001",
    name: "ABC Shipping LLC",
    email: "contact@abcshipping.com",
    phone: "+1-555-0123",
    address: "123 Harbor View Drive, Port City, PC 12345",
    country: "United States",
    paymentTerms: "Net 30",
    creditLimit: 500000
  },
  {
    code: "CUST002",
    name: "Global Maritime Corp",
    email: "info@globalmaritime.com",
    phone: "+44-20-7123-4567",
    address: "456 Thames Street, London, EC1A 1BB",
    country: "United Kingdom",
    paymentTerms: "Net 15",
    creditLimit: 750000
  },
  {
    code: "CUST003",
    name: "Pacific Trade Partners",
    email: "billing@pacifictrade.com",
    phone: "+65-6123-4567",
    address: "789 Marina Bay, Singapore 018956",
    country: "Singapore",
    paymentTerms: "Net 45",
    creditLimit: 1000000
  }
];

export const currencies: CurrencyOption[] = [
  { value: "USD", label: "US Dollar", symbol: "$", rate: 1.0 },
  { value: "EUR", label: "Euro", symbol: "€", rate: 0.85 },
  { value: "GBP", label: "British Pound", symbol: "£", rate: 0.73 },
  { value: "SGD", label: "Singapore Dollar", symbol: "S$", rate: 1.35 },
  { value: "AED", label: "UAE Dirham", symbol: "د.إ", rate: 3.67 }
];

export const processes: DropdownOption[] = [
  { value: "MANUAL", label: "Manual Entry" },
  { value: "IMPORT", label: "Import from File" },
  { value: "TEMPLATE", label: "From Template" },
  { value: "RECURRING", label: "Recurring Invoice" }
];

export const invoiceTypes: DropdownOption[] = [
  { value: "STANDARD", label: "Standard Invoice" },
  { value: "PROFORMA", label: "Pro Forma Invoice" },
  { value: "CREDIT", label: "Credit Note" },
  { value: "DEBIT", label: "Debit Note" },
  { value: "FREIGHT", label: "Freight Invoice" },
  { value: "DEMURRAGE", label: "Demurrage Invoice" }
];

export const companies: DropdownOption[] = [
  { value: "SHL001", label: "Shipnet Holdings Ltd" },
  { value: "SMC002", label: "Shipnet Maritime Corp" },
  { value: "STL003", label: "Shipnet Trading LLC" },
  { value: "SAS004", label: "Shipnet Asia Singapore" }
];

export const documentTypes: DropdownOption[] = [
  { value: "INV", label: "Invoice" },
  { value: "PRO", label: "Pro Forma" },
  { value: "CRN", label: "Credit Note" },
  { value: "DBN", label: "Debit Note" }
];

export const paymentMethods: DropdownOption[] = [
  { value: "WIRE", label: "Wire Transfer" },
  { value: "CHECK", label: "Check" },
  { value: "CARD", label: "Credit Card" },
  { value: "LC", label: "Letter of Credit" },
  { value: "CASH", label: "Cash" }
];

export const taxCodes: DropdownOption[] = [
  { value: "VAT0", label: "VAT 0%" },
  { value: "VAT5", label: "VAT 5%" },
  { value: "VAT10", label: "VAT 10%" },
  { value: "VAT15", label: "VAT 15%" },
  { value: "VAT20", label: "VAT 20%" },
  { value: "EXEMPT", label: "Tax Exempt" }
];

export const accountNumbers: DropdownOption[] = [
  { value: "4000", label: "4000 - Revenue" },
  { value: "4100", label: "4100 - Freight Revenue" },
  { value: "4200", label: "4200 - Demurrage Revenue" },
  { value: "4300", label: "4300 - Charter Hire" },
  { value: "4400", label: "4400 - Port Charges" },
  { value: "4500", label: "4500 - Bunker Sales" },
  { value: "4600", label: "4600 - Other Revenue" }
];

// Sample Products/Items for invoice lines
export const sampleProducts: DropdownOption[] = [
  { value: "FREIGHT", label: "Freight Charges" },
  { value: "PORT", label: "Port Charges" },
  { value: "DEMURRAGE", label: "Demurrage" },
  { value: "BUNKER", label: "Bunker Charges" },
  { value: "STEVEDORING", label: "Stevedoring Services" },
  { value: "PILOT", label: "Pilot Services" },
  { value: "TUG", label: "Tug Services" },
  { value: "CHARTER", label: "Charter Hire" },
  { value: "COMMISSION", label: "Commission" },
  { value: "SURVEY", label: "Survey Fees" },
  { value: "INSPECTION", label: "Inspection Charges" },
  { value: "AGENCY", label: "Agency Fees" },
  { value: "CUSTOMS", label: "Customs Clearance" },
  { value: "STORAGE", label: "Storage Charges" },
  { value: "HANDLING", label: "Cargo Handling" }
];

// Detailed Product Information
export const sampleProductDetails: ProductInfo[] = [
  {
    code: "FREIGHT",
    name: "Freight Charges",
    description: "Ocean freight charges for cargo transportation",
    unitPrice: 1000.00,
    currency: "USD",
    accountCode: "4100",
    category: "Revenue",
    isActive: true
  },
  {
    code: "PORT",
    name: "Port Charges",
    description: "Port handling and terminal charges",
    unitPrice: 500.00,
    currency: "USD",
    accountCode: "4400",
    category: "Revenue",
    isActive: true
  },
  {
    code: "DEMURRAGE",
    name: "Demurrage",
    description: "Demurrage charges for delayed vessel operations",
    unitPrice: 2000.00,
    currency: "USD",
    accountCode: "4200",
    category: "Revenue",
    isActive: true
  },
  {
    code: "BUNKER",
    name: "Bunker Charges",
    description: "Bunker fuel supply charges",
    unitPrice: 750.00,
    currency: "USD",
    accountCode: "4500",
    category: "Revenue",
    isActive: true
  },
  {
    code: "STEVEDORING",
    name: "Stevedoring Services",
    description: "Cargo loading and unloading services",
    unitPrice: 300.00,
    currency: "USD",
    accountCode: "4600",
    category: "Revenue",
    isActive: true
  }
];

// Default line item
export const defaultLineItem = {
  id: "",
  lineCode: "",
  accountNumber: "",
  description: "",
  quantity: 1,
  rate: 0,
  currencyCode: "USD",
  roeRate: 1.0,
  currencyAmount: 0,
  baseAmount: 0,
  vatRate: 0,
  vatAmount: 0,
  totalAmount: 0,
  comments: ""
};
