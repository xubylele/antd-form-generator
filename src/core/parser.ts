import { EnumSchema, FormSchema, FormSchemaProperty, UIFormSchema } from './types';

export type ParsedFiled = {
  name: string;
  label?: string;
  type: "string" | "number" | "boolean" | "enum" | "array";
  widget?: string;
  enumOptions?: { label: string, value: string }[];
  span?: number;
  placeholder?: string;
};

export const parseFormSchema = (schema: FormSchema, uiSchema: UIFormSchema = {}) => {
  const fields: ParsedFiled[] = [];

  const layoutCols = uiSchema["ui:layout"]?.cols ?? 12;
  const layoutMap = uiSchema["ui:layout"]?.fields ?? {};

  const widgets = uiSchema['ui:widgets'] || {};
  const placeholder = uiSchema['ui:placeholder'] || {};
  const visibleIf = uiSchema['ui:visibleIf'] || {};
  const dependencies = uiSchema['ui:dependencies'] || [];

  for (const [name, property] of Object.entries(schema.properties)) {
    const base: ParsedFiled = {
      name,
      label: property.title,
      type: resolveType(property),
      span: clampSpan(layoutMap[name], layoutCols),
      widget: widgets[name],
      placeholder: placeholder[name],
      enumOptions: resolveEnumOptions(property),
    }

    const visibleIf = uiSchema["ui:visibleIf"]?.[name];
    if (visibleIf) {
      // TODO: Implement visibleIf
    }

    const dependency = dependencies.find(d => d.show.includes(name));
    if (dependency) {
      // TODO: Implement dependency
    }

    fields.push(base);
  }

  return fields;
};

const resolveType = (property: FormSchemaProperty) => {
  if (property.type === "string") return "string";
  if (property.type === "number") return "number";
  if (property.type === "boolean") return "boolean";
  if ((property as EnumSchema).type === "string" || (property as EnumSchema).type === "number") return "enum";
  if (property.type === "array") return "array";
  return "string";
};

const clampSpan = (span: number | undefined, cols: number) => {
  if (span === undefined) return cols;
  return Math.min(span, cols);
};

const resolveEnumOptions = (property: FormSchemaProperty) => {
  if ((property as EnumSchema).type === "string" || (property as EnumSchema).type === "number") {
    return (property as EnumSchema).enum?.map(value => ({ label: value.toString(), value: value.toString() }));
  }

  return [];
};