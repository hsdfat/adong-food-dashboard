export interface Kitchen {
  kitchenId: string;
  kitchenName: string;
  address: string;
  phone: string;
  active?: boolean | null;
  createdDate: string;
  modifiedDate: string;
}

export interface CreateKitchenInput {
  kitchenId: string;
  kitchenName: string;
  address?: string;
  phone?: string;
  active?: boolean;
}

export interface UpdateKitchenInput {
  kitchenName?: string;
  address?: string;
  phone?: string;
  active?: boolean;
}
