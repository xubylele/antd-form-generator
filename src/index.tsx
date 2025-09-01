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
  const { widget, placeholder, customClass, options, enumOptions, type } = f;

  if (widget === 'password') return <Input.Password placeholder={placeholder} className={customClass} />;
  if (widget === 'textarea') return <Input.TextArea placeholder={placeholder} autoSize={{ minRows: 3 }} className={customClass} />;
  if (widget === 'select') {
    if (type === 'enum') {
      return <Select options={enumOptions} mode={`${type === 'enum' ? 'multiple' : 'tags'}`} placeholder={placeholder} className={customClass} />;
    }
    return <Select options={options} placeholder={placeholder} className={customClass} />;
  }


  switch (type) {
    case 'boolean':
      return <Switch className={customClass} />;
    case 'number':
      return <InputNumber placeholder={placeholder} className={customClass} />;
    case 'string':
      return <Input placeholder={placeholder} className={customClass} />;
    case 'array':
      return <Input.TextArea placeholder={placeholder} autoSize={{ minRows: 3 }} className={customClass} />;
    case 'enum':
      return <Select options={enumOptions} mode={`${type === 'enum' ? 'multiple' : 'tags'}`} placeholder={placeholder} className={customClass} />;
    case 'options':
      return <Select options={options} placeholder={placeholder} className={customClass} />;
    default:
      return <Input placeholder={placeholder} className={customClass} />;
  }
};

export type { AntdSchemaFormProps, FormSchema, UIFormSchema };
