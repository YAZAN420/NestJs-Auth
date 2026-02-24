export class Email {
  private readonly value: string;

  constructor(value: string) {
    const trimmedValue = value.trim().toLowerCase();

    if (!this.isValidEmail(trimmedValue)) {
      throw new Error('Invalid email format');
    }

    this.value = trimmedValue;
  }

  private isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(otherEmail: Email): boolean {
    return this.value === otherEmail.getValue();
  }
}
