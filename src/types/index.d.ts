import { ButtonProps, FormInstance } from 'antd';

export type AntdSchemaFormProps = {
  schema: FormSchema;
  uiSchema?: UIFormSchema;
  initialValues?: Record<string, unknown>;
  onFinish: (values: Record<string, unknown>) => void;
  onChange?: (values: Record<string, unknown>) => void;
  submitButtonProps?: ButtonProps;
  form?: FormInstance;
  orientation?: 'vertical' | 'horizontal';
  onReset?: () => void;
};

export type StringSchema = {
  type: "string";
  title?: string;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: "email" | "url";
};

export type NumberSchema = {
  type: "number";
  title?: string;
  minimum?: number;
  maximum?: number;
};

export type BooleanSchema = {
  type: "boolean";
  title?: string;
  default?: boolean;
};

export type OptionsSchema = {
  type: "options";
  title?: string;
  options: { label: string, value: string }[];
};

export type EnumSchema = {
  type: "string" | "number";
  title?: string;
  enum: (string | number)[];
};

export type ArraySchema = {
  type: "array";
  title?: string;
  items: FormSchemaProperty[];
};

export type FormSchemaProperty =
  | StringSchema
  | NumberSchema
  | BooleanSchema
  | EnumSchema
  | ArraySchema
  | OptionsSchema;

export type FormSchema = {
  title?: string;
  type: "object";
  properties: Record<string, FormSchemaProperty>;
  required?: string[];
};

export type UIFormSchema = {
  "ui:layout"?: {
    cols?: number,
    gap?: number,
    fields?: Record<string, number>,
  };
  "ui:widgets"?: Record<string, string>;
  "ui:placeholder"?: Record<string, string>;
  "ui:visibleIf"?: Record<string, Record<string, unknown>>;
  "ui:dependencies"?: Array<{ when: Record<string, unknown>; show: string[] }>;
  "ui:customClass"?: Record<string, string>;
};
