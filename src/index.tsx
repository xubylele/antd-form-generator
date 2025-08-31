import React from "react";

import { Form, Input } from "antd";

export const AntdSchemaForm = () => {
  return <Form>
    <Form.Item label="Name" name="name">
      <Input />
    </Form.Item>
  </Form>;
};
