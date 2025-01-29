export type FilterType = { value: string; operator: string; field: string };

export const parseFilters = (params: Array<FilterType>): Array<Map<string, string>> => {
  return params.map(filter => {
    const field = filter.field;
    const value = filter.value;
    const operator = filter.operator;

    return new Map([
      ['field', field],
      ['value', value],
      ['operator', operator],
    ]);
  });
};
