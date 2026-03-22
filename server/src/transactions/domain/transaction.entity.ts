export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface TransactionProps {
  id: string;
  customerId: string;
  productId: string;
  quantity: number;
  productAmount: number;
  baseFee: number;
  deliveryFee: number;
  totalAmount: number;
  status: TransactionStatus;
  wompiTransactionId: string;
  createdAt: Date;
}

export class Transaction {
  readonly id: string;
  readonly customerId: string;
  readonly productId: string;
  readonly quantity: number;
  readonly productAmount: number;
  readonly baseFee: number;
  readonly deliveryFee: number;
  readonly totalAmount: number;
  private _status: TransactionStatus;
  private _wompiTransactionId: string;
  readonly createdAt: Date;

  constructor(props: TransactionProps) {
    this.id = props.id;
    this.customerId = props.customerId;
    this.productId = props.productId;
    this.quantity = props.quantity;
    this.productAmount = props.productAmount;
    this.baseFee = props.baseFee;
    this.deliveryFee = props.deliveryFee;
    this.totalAmount = props.totalAmount;
    this._status = props.status;
    this._wompiTransactionId = props.wompiTransactionId;
    this.createdAt = props.createdAt;
  }

  approve(): void {
    if (this._status !== TransactionStatus.PENDING) {
      throw new Error('Transaction not pending');
    }

    this._status = TransactionStatus.COMPLETED;
  }

  decline(): void {
    if (this._status !== TransactionStatus.PENDING) {
      throw new Error('Transaction not pending');
    }

    this._status = TransactionStatus.FAILED;
  }

  get status(): TransactionStatus {
    return this._status;
  }

  get wompiTransactionId(): string {
    return this._wompiTransactionId;
  }

  set wompiTransactionId(wompiTransactionId: string) {
    this._wompiTransactionId = wompiTransactionId;
  }
}
