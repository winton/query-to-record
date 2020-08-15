import expect from "./expect"
import queryToRecord from "../src"

const fixture = {
  address: "win@sent.com",
  "Demographic.appVersion": "1.0",
  "user.userAttributes.Gender": "m",
  "user.UserAttributes.source_utm": "onsite",
  count: 0,
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
      User: {
        UserAttributes: {
          Gender: "m",
          SourceUtm: "onsite",
        },
      },
      Count: 0,
      CreatedAt: expect.any(Date),
      UpdatedAt: expect.any(Date),
    })
  })

  it("creates a camelcase record with stringify and filter", () => {
    expect(
      queryToRecord.record(fixture, {
        camel: true,
        filter: [
          "address",
          "count",
          "demographic",
          "user.userAttributes.sourceUtm",
          "doesntExist",
        ],
        stringify: true,
      })
    ).toEqual({
      record: {
        address: "win@sent.com",
        demographic: '{"appVersion":"1.0"}',
        sourceUtm: "onsite",
        count: 0,
      },
      extras: expect.stringContaining(
        '{"user":{"userAttributes":{"gender":"m"}}'
      ),
    })
  })
})
