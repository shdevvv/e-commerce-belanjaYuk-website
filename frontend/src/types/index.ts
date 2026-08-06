export interface User {
  idUser: string;
  userName: string;
  emailOrPhone: string;
  fullName: string;
}

export interface AuthResponse {
  token: string;
  idUser: string;
  userName: string;
  emailOrPhone: string;
  fullName: string;
}

export interface Product {
  idProduct: string;
  productName: string;
  productDesc: string;
  idCategory: string;
  categoryName: string;
  price: number; // Original price
  discountProduct: number; // Discount amount in IDR
  discountedPrice: number; // Price after discount
  discountPercentage: number;
  qty: number; // Stock
  imageUrl: string;
}

export interface CartItem {
  idBuyerCart: string;
  idProduct: string;
  productName: string;
  imageUrl: string;
  price: number;
  discountProduct: number;
  discountedPrice: number;
  qty: number;
  subtotalOriginal: number;
  subtotalDiscounted: number;
}

export interface CartSummary {
  items: CartItem[];
  totalItems: number;
  totalOriginalAmount: number;
  totalDiscountAmount: number;
  totalFinalAmount: number;
}

export interface PaymentMethod {
  idPayment: string;
  paymentName: string;
}

export interface TransactionDetail {
  idBuyerTransactionDetail: string;
  idProduct: string;
  productName: string;
  priceProduct: number;
  discountProduct: number;
  unitPrice: number;
  qty: number;
  totalPrice: number;
}

export interface Transaction {
  idBuyerTransaction: string;
  paymentName: string;
  totalOriginalAmount: number;
  totalDiscountAmount: number;
  finalPrice: number;
  dateIn: string;
  details: TransactionDetail[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}
