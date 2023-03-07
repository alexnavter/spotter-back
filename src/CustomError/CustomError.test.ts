import { CustomError } from "./CustomError";

describe("Given a CustomError class", () => {
  describe("When a new error instance is created", () => {
    test("Then it should have the property message and show 'Endpoint not found' message", () => {
      const expectedError = new CustomError(
        "Endpoint not found",
        404,
        "Page not found"
      );
      expect(expectedError).toHaveProperty("message", "Endpoint not found");
    });
    test("Then it should have the property statusCode and show 404 as status code", () => {
      const expectedError = new CustomError(
        "Endpoint not found",
        404,
        "Page not found"
      );
      expect(expectedError).toHaveProperty("statusCode", 404);
    });
    test("Then it should have the property publicMessage and show 'Page not found' message", () => {
      const expectedError = new CustomError(
        "Endpoint not found",
        404,
        "Page not found"
      );
      expect(expectedError).toHaveProperty("publicMessage", "Page not found");
    });
  });
});
