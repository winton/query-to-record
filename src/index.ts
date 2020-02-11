export const pinpointColumns = [
  "Address",
  "Attributes",
  "ChannelType",
  "Demographic",
  "EffectiveDate",
  "Id",
  "Location",
  "Metrics",
  "OptOut",
  "RequestId",
  "User",
]

export class QueryToRecord {
  apiRecord(
    columns: string[],
    query: Record<string, string>
  ): Record<string, any> {
    const data = {}

    for (const key in query) {
      for (const col of columns) {
        const match = key.match(
          new RegExp(`^(${col})\\.?(.*)`, "i")
        )
        if (match) {
          const attrs = [
            match[1],
            ...match[2].split("."),
          ].filter(attr => attr)

          attrs.reduce((memo, attr, index) => {
            memo[attr] = memo[attr] || {}

            if (index === attrs.length - 1) {
              memo[attr] = query[key]
            }

            return memo[attr]
          }, data)
        }
      }
    }

    return data
  }

  bigQueryRecord(
    columns: string[],
    query: Record<string, string>
  ): Record<string, any> {
    const record = this.apiRecord(columns, query)
    const data = this.camelKeys(record)

    for (const key in data) {
      if (typeof data[key] === "object") {
        data[key] = JSON.stringify(data[key])
      }
    }

    return data
  }

  camelKeys(
    record: Record<string, any>
  ): Record<string, any> {
    const data = {}

    for (const key in record) {
      if (typeof record[key] === "object") {
        data[this.jsonKey(key)] = this.camelKeys(
          record[key]
        )
      } else {
        data[this.jsonKey(key)] = record[key]
      }
    }

    return data
  }

  jsonKey(key: string): string {
    return key.replace(/^\w/, c => c.toLowerCase())
  }
}

export default new QueryToRecord()
