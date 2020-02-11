export class QueryToRecord {
  apiRecord(
    query: Record<string, string>
  ): Record<string, any> {
    const data = {}

    for (const key in query) {
      const attrs = key.split(".")

      attrs.reduce((memo, attr, index) => {
        memo[attr] = memo[attr] || {}

        if (index === attrs.length - 1) {
          memo[attr] = query[key]

          if (
            (attr.match(/Timestamp/) || attr.match(/At/)) &&
            typeof memo[attr] === "string"
          ) {
            memo[attr] = new Date(memo[attr])
          }
        }

        return memo[attr]
      }, data)
    }

    return data
  }

  bigQueryRecord(
    query: Record<string, string>
  ): Record<string, any> {
    const record = this.apiRecord(query)
    const data = this.camelKeys(record)

    for (const key in data) {
      if (
        typeof data[key] === "object" &&
        !(data[key] instanceof Date)
      ) {
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
      if (
        typeof record[key] === "object" &&
        !(record[key] instanceof Date)
      ) {
        data[this.jsonKey(key)] = this.camelKeys(
          record[key]
        )
      } else {
        data[this.jsonKey(key)] = record[key]
      }
    }

    return data
  }

  extras(
    columns: string[],
    query: Record<string, any>
  ): Record<string, any> {
    const extras = {}

    for (const col in query) {
      if (!columns.includes(col)) {
        extras[col] = query[col]
      }
    }

    return extras
  }

  jsonKey(key: string): string {
    return key.replace(/^\w/, c => c.toLowerCase())
  }
}

export default new QueryToRecord()
