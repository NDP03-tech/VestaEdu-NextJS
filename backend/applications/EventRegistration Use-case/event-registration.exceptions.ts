export class EventRegistrationNotFoundException extends Error {
  constructor(id: string | number) {
    super(`EventRegistration ${String(id)} not found`);
    this.name = "EventRegistrationNotFoundException";
  }
}
