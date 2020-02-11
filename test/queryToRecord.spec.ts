import expect from "./expect"
import queryToRecord from "../src"

const fixture = {
  address: "win@sent.com",
  "Demographic.appVersion": "1.0",
  "user.userAttributes.Gender": "m",
  CreatedAt: new Date().toString(),
  updatedAt: new Date(),
}

describe("queryToRecord", () => {
  it("creates a capitalized record", () => {
    expect(
      queryToRecord.record(fixture, { capital: true })
    ).toEqual({
      Address: "win@sent.com",
      Demographic: { AppVersion: "1.0" },
      User: { UserAttributes: { Gender: "m" } },
      CreatedAt: expect.any(Date),
      UpdatedAt: expect.any(Date),
    })
  })

  it("creates a camelcase record with stringify and filter", () => {
    expect(
      queryToRecord.record(fixture, {
        camel: true,
        filter: ["Address", "Demographic"],
        stringify: true,
      })
    ).toEqual([
      {
        address: "win@sent.com",
        demographic: '{"appVersion":"1.0"}',
      },
      {
        user: '{"userAttributes":{"gender":"m"}}',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    ])
  })
})
