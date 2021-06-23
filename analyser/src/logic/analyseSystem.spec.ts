import analyseSystem from "./analyseSystem";

describe("analyseSystem", () => {
  let mockDS: any;
  let publish: any;
  let name: string;

  beforeEach(() => {
    name = "example";
    mockDS = { getDBperService: jest.fn() };
    publish = jest.fn();
  });

  it("delegates to the dataservice", async () => {
    await analyseSystem({ name }, mockDS, jest.fn());

    expect(mockDS.getDBperService).toHaveBeenCalledWith(name);
  });

  it("publishes the right event", async () => {
    const result = { foo: "baz" };

    const expectedEvent = {
      type: "System Analysed",
      payload: {
        name,
        result,
      },
    };

    mockDS.getDBperService.mockReturnValueOnce(result);

    await analyseSystem({ name }, mockDS, publish);

    expect(publish).toHaveBeenCalledWith(expectedEvent);
  });
});
