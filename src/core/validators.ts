/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ArraySchema,
  BooleanSchema,
  EnumFormatSchema,
  FormSchema,
  FormSchemaProperty,
  NumberSchema,
  OptionsSchema,
  StringSchema
} from '../types';

export const buildRulesFormField = (
  name: string,
  shcema: FormSchema,
  prop: FormSchemaProperty,
) => {
  const rules: any[] = [];

  if (shcema.required?.includes(name)) {
    rules.push({ required: true, message: `${name} is required` });
  };

  if ((prop as StringSchema).type === 'string') {
    const s = prop as StringSchema;

    if (s.minLength) rules.push({ min: s.minLength, message: `${name} must be at least ${s.minLength} characters` });
    if (s.maxLength) rules.push({ max: s.maxLength, message: `${name} must be at most ${s.maxLength} characters` });
    if (s.pattern) rules.push({ pattern: new RegExp(s.pattern), message: `${name} must match the pattern ${s.pattern}` });
    if (s.format === 'email') rules.push({ type: 'email', message: `${name} must be a valid email` });
    if (s.format === 'url') rules.push({ type: 'url', message: `${name} must be a valid url` });
  }

  if ((prop as NumberSchema).type === 'number') {
    const n = prop as NumberSchema;

    if (n.minimum !== undefined && n.maximum !== undefined) {
      rules.push({
        type: 'number',
        min: n.minimum,
        max: n.maximum,
        message: `${name} must be at least ${n.minimum} and at most ${n.maximum}`
      });
    } else {
      if (n.minimum !== undefined) rules.push({ type: 'number', min: n.minimum, message: `${name} must be at least ${n.minimum}` });
      if (n.maximum !== undefined) rules.push({ type: 'number', max: n.maximum, message: `${name} must be at most ${n.maximum}` });
    }
  }

  if ((prop as BooleanSchema).type === 'boolean') {
    const b = prop as BooleanSchema;

    if (b.default) rules.push({ type: 'boolean', default: b.default, message: `${name} must be ${b.default}` });
  }

  if ((prop as EnumFormatSchema).type === 'string' || (prop as EnumFormatSchema).type === 'number') {
    const e = prop as EnumFormatSchema;

    if (e.enumOptions) rules.push({ type: 'enum', enum: e.enumOptions, message: `${name} must be one of ${e.enumOptions.map(option => option.label).join(', ')}` });
  }

  if ((prop as EnumFormatSchema).type === 'object') {
    const e = prop as EnumFormatSchema;
    if (e.enumOptions) rules.push({ type: 'enum', enum: e.enumOptions, message: `${name} must be one of ${e.enumOptions.map(option => option.label).join(', ')}` });
  }

  if ((prop as ArraySchema).type === 'array') {
    const a = prop as ArraySchema;

    if (a.items) rules.push({ type: 'array', items: a.items, message: `${name} must be an array` });
  }

  if ((prop as OptionsSchema).type === 'options') {
    const o = prop as OptionsSchema;

    if (o.options) {
      const values = o.options.map(option => option.value);
      rules.push({ type: 'options', options: o.options, message: `${name} must be one of ${values.join(', ')}` });
    }
  }

  return rules;
};
