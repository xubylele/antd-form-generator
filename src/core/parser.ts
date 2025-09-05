import {
  EnumSchema,
  FormSchema,
  FormSchemaProperty,
  OptionsSchema,
  UIFormSchema,
} from '../types';

export type ParsedField = {
  name: string;
  label?: string;
  type: "string" | "number" | "boolean" | "enum" | "array" | "options";
  widget?: string;
  enumOptions?: { label: string, value: string }[];
  span?: number;
  placeholder?: string;
  customClass?: string;
  visibleIf?: Record<string, unknown>;
  options?: { label: string, value: string }[];
};

export const parseFormSchema = (schema: FormSchema, uiSchema: UIFormSchema = {}) => {
  const fields: ParsedField[] = [];

  const layoutCols = uiSchema["ui:layout"]?.cols ?? 12;
  const layoutMap = uiSchema["ui:layout"]?.fields ?? {};

  const widgets = uiSchema['ui:widgets'] || {};
  const placeholder = uiSchema['ui:placeholder'] || {};
  const visibleIf = uiSchema['ui:visibleIf'] || {};
  const dependencies = uiSchema['ui:dependencies'] || [];
  const customClass = uiSchema['ui:customClass'] || {};

  for (const [name, property] of Object.entries(schema.properties)) {
    const base: ParsedField = {
      name,
      label: property.title,
      type: resolveType(property),
      span: clampSpan(layoutMap[name], layoutCols),
      widget: widgets[name],
      placeholder: placeholder[name] ?? `Please enter ${property.title}`,
      enumOptions: resolveEnumOptions(property),
      options: resolveOptions(property),
      customClass: customClass[name] ?? '',
    }

    if (visibleIf?.[name]) {
      base.visibleIf = visibleIf?.[name] ?? {};
    }

    fields.push(base);
  }

  return fields;
};

const resolveType = (property: FormSchemaProperty) => {
  if (property.type === "string" && !('enum' in property) && !('options' in property)) return "string";
  if (property.type === "number") return "number";
  if (property.type === "boolean") return "boolean";
  if (property.type === "array") return "array";
  if ((property as EnumSchema).type === "string" || (property as EnumSchema).type === "number" && 'enum' in property) return "enum";
  if ((property as OptionsSchema).type === "options" && 'options' in property) return "options";
  return "string";
};

const clampSpan = (span: number | undefined, cols: number) => {
  if (span === undefined) return cols;
  return Math.min(span, cols);
};

const resolveEnumOptions = (property: FormSchemaProperty) => {
  if ((property as EnumSchema).type === "string" || (property as EnumSchema).type === "number") {
    return (property as EnumSchema).enum?.map(value => ({ label: value.toString(), value: value.toString() })) || [];
  }

  return [];
};

const resolveOptions = (property: FormSchemaProperty) => {
  if ((property as OptionsSchema).type === "options") {
    return (property as OptionsSchema).options;
  }

  return [];
};
