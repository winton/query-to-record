import dotProp from "dot-prop"

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
  ): Record<string, any> {
    const { camel, capital, filter, stringify } = options

    let data = capital ? this.capKeys(query) : query
    data = camel ? this.camelKeys(query) : data
    data = this.objectify(data)

    if (filter) {
      let { record, extras } = this.filter(
        filter,
        data,
        options
      )

      if (stringify) {
        record = this.stringify(record)

        if (this.isObject(extras)) {
          extras = JSON.stringify(extras)
        }
      }

      return { record, extras }
    }

    if (stringify) {
      data = this.stringify(data)
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
    return key
      .replace(/^\w/, c => c.toLowerCase())
      .replace(/\.\w/g, c => c.toLowerCase())
      .replace(/[-_]\w/g, c => c.slice(1).toUpperCase())
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
    return key
      .replace(/^\w/, c => c.toUpperCase())
      .replace(/\.\w/g, c => c.toUpperCase())
      .replace(/[-_]\w/g, c => c.slice(1).toUpperCase())
  }

  convertToArrays(
    attr: Record<string, any>
  ): Record<string, any> {
    const data = {}
    if (attr) {
      for (const key in attr) {
        if (Array.isArray(attr[key])) {
          data[key] = attr[key]
        } else {
          data[key] = [attr[key]]
        }
      }
    }
    return data
  }

  isObject(value: any): boolean {
    return (
      typeof value === "object" && !(value instanceof Date)
    )
  }

  filter(
    columns: string[],
    query: Record<string, any>,
    options: QueryToRecordOptions
  ): Record<string, any> {
    const { camel, capital } = options
    const record = {}
    const extras = {}

    for (const col of columns) {
      const value = dotProp.get(query, col)
      let lastCol = col.match(/[^.]+$/)[0]

      if (value !== undefined) {
        lastCol = camel ? this.camelKey(lastCol) : lastCol
        lastCol = capital ? this.capKey(lastCol) : lastCol

        record[lastCol] = value
        dotProp.delete(query, col)
      }
    }

    for (const key in query) {
      if (record[key] === undefined) {
        extras[key] = query[key]
      }
    }

    return { record, extras }
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
            ["number", "string"].includes(typeof memo[attr])
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
