import { unwrapApiData, unwrapApiList } from "./apiResponse";

describe("API response helpers", () => {
  it("unwraps the standard data envelope and supports raw payloads", () => {
    expect(unwrapApiData({ data: { id: 1 } })).toEqual({ id: 1 });
    expect(unwrapApiData({ id: 1 })).toEqual({ id: 1 });
  });

  it("returns list payloads and rejects non-list data", () => {
    expect(unwrapApiList({ data: [{ id: 1 }] })).toEqual([{ id: 1 }]);
    expect(() => unwrapApiList({ data: { id: 1 } })).toThrow(
      "Expected API response data to be an array",
    );
  });
});
