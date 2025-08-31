import React from "react";
import { Button, ButtonProps, Col, Form, Input, InputNumber, Row, Select, Switch } from "antd";
import { FormSchema, UIFormSchema } from './core/types';
import { parseFormSchema } from './core/parser';
import { buildRulesFormField } from './core/validators';

type AntdSchemaFormProps = {
  schema: FormSchema;
  uiSchema?: UIFormSchema;
  initialValues?: Record<string, unknown>;
  onFinish: (values: Record<string, unknown>) => void;
  onChange?: (values: Record<string, unknown>) => void;
  submitButtonProps?: ButtonProps;
};

export const AntdSchemaForm = ({
  schema,
  uiSchema,
  initialValues,
  onFinish,
  onChange,
  submitButtonProps,
}: AntdSchemaFormProps) => {
  const [form] = Form.useForm();
  const fields = parseFormSchema(schema, uiSchema);
  const cols = uiSchema?.["ui:layout"]?.cols ?? 12;
  const gap = uiSchema?.["ui:layout"]?.gap ?? 16;

  const handleFinish = async (values: Record<string, unknown>) => {
    await onFinish(values);
  };

  return (
    <Form form={form} onFinish={handleFinish}>
      a
      <Row gutter={gap}>
        {fields.map((field) => (
          <Col span={field.span} key={field.name}>
            <Form.Item
              label={field.label}
              name={field.name}
              rules={buildRulesFormField(field.name, schema, schema.properties[field.name])}
            >
              {renderField(field)}
            </Form.Item>
          </Col>
        ))}
      </Row>

      <Form.Item>
        <Button {...submitButtonProps} htmlType="submit">
          {submitButtonProps?.title || "Submit"}
        </Button>
      </Form.Item>
    </Form>
  );
};

const renderField = (f: ReturnType<typeof parseFormSchema>[number]) => {
  if (f.widget === 'password') return <Input.Password placeholder={f.placeholder} />;
  if (f.widget === 'textarea') return <Input.TextArea placeholder={f.placeholder} autoSize={{ minRows: 3 }} />;
  if (f.widget === 'select' || f.type === 'enum') {
    <Select options={f.enumOptions} mode={f.type === 'enum' ? 'multiple' : 'tags'} placeholder={f.placeholder} />;
  }


  switch (f.type) {
    case 'boolean':
      return <Switch />;
    case 'number':
      return <InputNumber placeholder={f.placeholder} />;
    case 'string':
      return <Input placeholder={f.placeholder} />;
    case 'array':
      return <Input.TextArea placeholder={f.placeholder} autoSize={{ minRows: 3 }} />;
    default:
      return <Input placeholder={f.placeholder} />;
  }
}

export type { AntdSchemaFormProps, FormSchema, UIFormSchema };
