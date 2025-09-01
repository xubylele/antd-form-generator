import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Switch
} from "antd";
import { ParsedField, parseFormSchema } from './core/parser';
import { buildRulesFormField } from './core/validators';
import { AntdSchemaFormProps, FormSchema, UIFormSchema } from './types';

export const AntdSchemaForm = ({
  schema,
  uiSchema,
  initialValues,
  onFinish,
  onChange,
  form,
  submitButtonProps,
  orientation = 'vertical',
  onReset,
}: AntdSchemaFormProps) => {
  const fields: ParsedField[] = parseFormSchema(schema, uiSchema);
  const cols = uiSchema?.["ui:layout"]?.cols ?? 12;
  const gap = uiSchema?.["ui:layout"]?.gap ?? 16;

  const handleFinish = async (values: Record<string, unknown>) => {
    await onFinish(values);
  };

  const handleChange = (values: Record<string, unknown>) => {
    onChange?.(values);
  };

  const handleReset = () => {
    onReset?.();
  };

  const getFieldSpan = (field: ReturnType<typeof parseFormSchema>[number]) => {
    if (field.span) return field.span;

    if (cols === 24) return 12;
    if (cols === 12) return 12;
    if (cols === 6) return 6;
    if (cols === 4) return 4;
    if (cols === 3) return 3;
    if (cols === 2) return 2;
    if (cols === 1) return 1;

    return 12;
  };

  return (
    <Form
      form={form}
      onFinish={handleFinish}
      layout={orientation}
      onReset={handleReset}
      initialValues={initialValues}
      onValuesChange={(_, values) => handleChange(values)}
    >
      <Row gutter={gap}>
        {fields.map((field: ParsedField) => (
          <Col span={getFieldSpan(field)} key={field.name}>
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

const renderField = (f: ParsedField) => {
  if (f.widget === 'password') return <Input.Password placeholder={f.placeholder} className={f.customClass} />;
  if (f.widget === 'textarea') return <Input.TextArea placeholder={f.placeholder} autoSize={{ minRows: 3 }} className={f.customClass} />;
  if (f.widget === 'select') return <Select options={f.options} placeholder={f.placeholder} className={f.customClass} />;

  switch (f.type) {
    case 'boolean':
      return <Switch className={f.customClass} />;
    case 'number':
      return <InputNumber placeholder={f.placeholder} className={f.customClass} />;
    case 'string':
      return <Input placeholder={f.placeholder} className={f.customClass} />;
    case 'array':
      return <Input.TextArea placeholder={f.placeholder} autoSize={{ minRows: 3 }} className={f.customClass} />;
    case 'enum':
      return <Select options={f.enumOptions} mode={`${f.type === 'enum' ? 'multiple' : 'tags'}`} placeholder={f.placeholder} className={f.customClass} />;
    case 'options':
      return <Select options={f.options} placeholder={f.placeholder} className={f.customClass} />;
    default:
      return <Input placeholder={f.placeholder} className={f.customClass} />;
  }
};

export type { AntdSchemaFormProps, FormSchema, UIFormSchema };
