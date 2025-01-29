import { CustomError } from '../errors/custom.error';
import { Operator } from './operator';

export class Filter {
  readonly field: string;
  readonly operator: Operator;
  readonly value: string;

  constructor(field: string, operator: Operator, value: string) {
    this.field = field;
    this.operator = operator;
    this.value = value;
  }

  static fromValues(values: Map<string, string>): Filter {
    const field = values.get('field');
    const operator = values.get('operator') as Operator;
    const value = values.get('value');

    if (!field || !operator || !value) throw CustomError.badRequest('Invalid filter');

    return new Filter(field, operator, value);
  }
}
