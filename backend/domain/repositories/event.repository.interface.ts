export interface eventRepository {
  deleteEvent(id: string): Promise<void>;
}
