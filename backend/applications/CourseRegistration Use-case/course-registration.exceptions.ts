export class CourseRegistrationNotFoundException extends Error {
  constructor(id: string | number) {
    super(`CourseRegistration ${String(id)} not found`);
    this.name = "CourseRegistrationNotFoundException";
  }
}
