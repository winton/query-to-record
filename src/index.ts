export interface QueryToRecordOptions {
  camel?: boolean
  capital?: boolean
  filter?: string[]
  stringify?: boolean
}

export class QueryToRecord {
  record(
    query: Record<string, any>,
    options: QueryToRecordOptions = {}
  ):
    | Record<string, any>
    | [Record<string, any>, Record<string, any>] {
    const { camel, capital, filter, stringify } = options
    const record = this.objectify(query)

    let data = capital ? this.capKeys(record) : record

    data = camel ? this.camelKeys(record) : data

    if (stringify) {
      data = this.stringify(data)
    }

    if (filter) {
      return this.filter(filter, data)
    }

    return data
  }

  camelKeys(
    record: Record<string, any>
  ): Record<string, any> {
    const data = {}

    for (const key in record) {
      if (this.isObject(record[key])) {
        data[this.camelKey(key)] = this.camelKeys(
          record[key]
        )
      } else {
        data[this.camelKey(key)] = record[key]
      }
    }

    return data
  }

  camelKey(key: string): string {
    return key.replace(/^\w/, c => c.toLowerCase())
  }

  capKeys(
    record: Record<string, any>
  ): Record<string, any> {
    const data = {}

    for (const key in record) {
      if (this.isObject(record[key])) {
        data[this.capKey(key)] = this.capKeys(record[key])
      } else {
        data[this.capKey(key)] = record[key]
      }
    }

    return data
  }

  capKey(key: string): string {
    return key.replace(/^\w/, c => c.toUpperCase())
  }

  isObject(value: any): boolean {
    return (
      typeof value === "object" && !(value instanceof Date)
    )
  }

  filter(
    columns: string[],
    query: Record<string, any>
  ): [Record<string, any>, Record<string, any>] {
    const og = {}
    const extras = {}

    for (const key in query) {
      const match = columns.find(
        col => col.toLowerCase() === key.toLowerCase()
      )
      if (match) {
        og[key] = query[key]
      } else {
        extras[key] = query[key]
      }
    }

    return [og, extras]
  }

  objectify(
    query: Record<string, any>
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

  stringify(
    record: Record<string, any>
  ): Record<string, any> {
    const data = {}
    for (const key in record) {
      if (this.isObject(record[key])) {
        data[key] = JSON.stringify(record[key])
      } else {
        data[key] = record[key]
      }
    }
    return data
  }
}

export default new QueryToRecord()
