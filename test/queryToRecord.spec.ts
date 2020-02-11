import expect from "./expect"
import queryToRecord from "../src"

const fixture = {
  Address: "win@sent.com",
  "Demographic.AppVersion": "1.0",
  "User.UserAttributes.gender": "m",
}

describe("PinpointEndpoint", () => {
  it("creates an apiRecord", () => {
    expect(queryToRecord.apiRecord(fixture)).toEqual({
      Address: "win@sent.com",
      Demographic: { AppVersion: "1.0" },
      User: { UserAttributes: { gender: "m" } },
    })
  })

  it("creates a bigQueryRecord", () => {
    expect(queryToRecord.bigQueryRecord(fixture)).toEqual({
      address: "win@sent.com",
      demographic: '{"appVersion":"1.0"}',
      user: '{"userAttributes":{"gender":"m"}}',
    })
  })
})
