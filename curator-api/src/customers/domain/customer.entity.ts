export interface CustomerProps {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export class Customer {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly phone: string;

  constructor(props: CustomerProps) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.phone = props.phone;
  }
}
