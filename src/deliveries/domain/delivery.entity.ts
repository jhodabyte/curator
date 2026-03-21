export enum DeliveryStatus {
  PENDING = 'pending',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
}

export interface DeliveryProps {
  id: string;
  transactionId: string;
  customerId: string;
  productId: string;
  quantity: number;
  address: string;
  city: string;
  status: DeliveryStatus;
  createdAt: Date;
}

export class Delivery {
  readonly id: string;
  readonly transactionId: string;
  readonly customerId: string;
  readonly productId: string;
  readonly quantity: number;
  readonly address: string;
  readonly city: string;
  private _status: DeliveryStatus;
  readonly createdAt: Date;

  constructor(props: DeliveryProps) {
    this.id = props.id;
    this.transactionId = props.transactionId;
    this.customerId = props.customerId;
    this.productId = props.productId;
    this.quantity = props.quantity;
    this.address = props.address;
    this.city = props.city;
    this._status = props.status;
    this.createdAt = props.createdAt;
  }

  get status(): DeliveryStatus {
    return this._status;
  }

  ship(): void {
    if (this._status !== DeliveryStatus.PENDING) {
      throw new Error('Delivery is not pending');
    }
    this._status = DeliveryStatus.SHIPPED;
  }

  deliver(): void {
    if (this._status !== DeliveryStatus.SHIPPED) {
      throw new Error('Delivery is not shipped');
    }
    this._status = DeliveryStatus.DELIVERED;
  }
}
