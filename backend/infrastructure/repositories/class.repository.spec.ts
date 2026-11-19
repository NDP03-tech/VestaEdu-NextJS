jest.mock("../persistence/Class", () => ({ Class: class Class {} }));
jest.mock("../persistence/classStudents", () => ({
  ClassStudent: class ClassStudent {},
}));
jest.mock("../persistence/ClassQuiz", () => ({
  ClassQuiz: class ClassQuiz {},
}));
jest.mock("../mapper/class.mapper", () => ({ ClassMapper: {} }));

import { ClassRepository } from "./class.repository";

describe("ClassRepository class quiz membership", () => {
  it("deactivates an assignment instead of deleting its history", async () => {
    const update = jest.fn().mockResolvedValue({ affected: 1 });
    const repository = new ClassRepository(
      {} as never,
      {} as never,
      { update } as never,
    );

    await repository.removeQuiz("4", 12);

    expect(update).toHaveBeenCalledWith(
      { class_id: 4, quiz_id: 12, isActive: true },
      { isActive: false },
    );
  });
});
