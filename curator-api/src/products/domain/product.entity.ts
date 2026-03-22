export interface ProductProps {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images?: string[];
}

export class Product {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly price: number;
  private _stock: number;
  readonly images: string[];

  constructor(props: ProductProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.price = props.price;
    this._stock = props.stock;
    this.images = props.images ?? [];
  }

  get stock(): number {
    return this._stock;
  }

  hasStock(): boolean {
    return this._stock >= 0;
  }

  decrementStock(): void {
    if (this._stock <= 0) throw new Error('No hay stock disponible');
    this._stock--;
  }
}
