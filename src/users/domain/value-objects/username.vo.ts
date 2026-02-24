export class Username {
  private readonly value: string;

  constructor(value: string) {
    const trimmedValue = value.trim();

    if (trimmedValue.length < 3 || trimmedValue.length > 20) {
      throw new Error('Username must be between 3 and 20 characters');
    }

    if (!/^[a-zA-Z0-9_]+$/.test(trimmedValue)) {
      throw new Error('Username contains symbols that are not allowed');
    }

    this.value = trimmedValue;
  }

  public getValue(): string {
    return this.value;
  }

  public equals(otherUsername: Username): boolean {
    return this.value === otherUsername.getValue();
  }
}
