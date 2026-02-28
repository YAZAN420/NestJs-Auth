/* eslint-disable @typescript-eslint/no-unused-vars */
export interface UpdateProductPayload {
  name?: string;
  description?: string;
  price?: number;
}
export class Product {
  constructor(
    public id: string,
    private name: string,
    private description: string,
    private price: number,
    private _createdBy: string,
    private createdAt: Date,
    private updatedAt: Date,
  ) {}
  public getId(): string {
    return this.id;
  }
  public getName(): string {
    return this.name;
  }
  public getDescription(): string {
    return this.description;
  }
  public getPrice(): number {
    return this.price;
  }
  get createdBy(): string {
    return this._createdBy;
  }
  public getCreatedAt(): Date {
    return this.createdAt;
  }
  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public updateDetails(payload: UpdateProductPayload): void {
    const cleanData = Object.fromEntries(
      Object.entries(payload).filter(([_, value]) => value !== undefined),
    );
    Object.assign(this, cleanData);
    this.updatedAt = new Date();
  }
}
