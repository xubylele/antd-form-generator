# antd-form-generator

A powerful React form generator for Ant Design v5 based on JSON Schema and UI Schema. Generate dynamic forms with validation, layout control, and custom styling using simple configuration objects.

## Donations

If you find this extension helpful, consider supporting the developer by buying them a coffee:

<a href="https://www.buymeacoffee.com/xubylelec" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

## Features

- 🚀 **JSON Schema Driven**: Define forms using standard JSON Schema
- 🎨 **UI Schema Support**: Customize layout, widgets, and styling
- ✅ **Built-in Validation**: Automatic validation rules from schema
- 📱 **Responsive Layout**: Flexible grid system with customizable columns
- 🎯 **TypeScript Support**: Full type safety and IntelliSense
- 🔧 **Customizable**: Support for custom widgets, placeholders, and CSS classes
- 📦 **Tree Shakeable**: Optimized bundle size with tree shaking
- 🧪 **Well Tested**: Comprehensive test coverage

## Playground

Try out the form generator in our interactive playground:

🔗 **[Live Playground](https://www.antdformbuilder.dev)** - Experiment with different schemas and see real-time results

## Installation

```bash
npm install antd-form-generator
# or
yarn add antd-form-generator
# or
pnpm add antd-form-generator
```

## Peer Dependencies

This library requires the following peer dependencies:

```bash
npm install antd react react-dom
```

## Quick Start

```tsx
import React from 'react';
import { AntdSchemaForm, FormSchema, UIFormSchema } from 'antd-form-generator';

const schema: FormSchema = {
  type: "object",
  title: "User Registration",
  properties: {
    name: {
      type: "string",
      title: "Full Name",
      minLength: 2,
      maxLength: 50
    },
    email: {
      type: "string",
      title: "Email",
      format: "email"
    },
    age: {
      type: "number",
      title: "Age",
      minimum: 18,
      maximum: 100
    },
    role: {
      type: "string",
      title: "Role",
      enum: ["admin", "user", "guest"]
    },
    active: {
      type: "boolean",
      title: "Active Account"
    }
  },
  required: ["name", "email", "role"]
};

const uiSchema: UIFormSchema = {
  "ui:layout": {
    cols: 12,
    gap: 16,
    fields: {
      name: 12,
      email: 12,
      age: 6,
      role: 6,
      active: 12
    }
  },
  "ui:widgets": {
    email: "input",
    role: "select"
  },
  "ui:placeholder": {
    name: "Enter your full name",
    email: "Enter your email address",
    age: "Enter your age",
    role: "Select your role"
  }
};

function App() {
  const handleSubmit = (values: Record<string, unknown>) => {
    console.log('Form submitted:', values);
  };

  const handleChange = (values: Record<string, unknown>) => {
    console.log('Form changed:', values);
  };

  return (
    <AntdSchemaForm
      schema={schema}
      uiSchema={uiSchema}
      onFinish={handleSubmit}
      onChange={handleChange}
      initialValues={{ active: true }}
      submitButtonProps={{ 
        title: "Register User",
        type: "primary",
        size: "large"
      }}
    />
  );
}
```

## API Reference

### AntdSchemaForm Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `schema` | `FormSchema` | ✅ | JSON Schema defining the form structure |
| `uiSchema` | `UIFormSchema` | ❌ | UI Schema for layout and styling customization |
| `onFinish` | `(values: Record<string, unknown>) => void` | ✅ | Callback when form is submitted |
| `onChange` | `(values: Record<string, unknown>) => void` | ❌ | Callback when form values change |
| `onReset` | `() => void` | ❌ | Callback when form is reset |
| `initialValues` | `Record<string, unknown>` | ❌ | Initial form values |
| `form` | `FormInstance` | ❌ | Ant Design form instance |
| `orientation` | `'vertical' \| 'horizontal'` | ❌ | Form layout orientation (default: 'vertical') |
| `submitButtonProps` | `ButtonProps` | ❌ | Submit button properties |

### FormSchema

The main schema type that defines your form structure:

```tsx
type FormSchema = {
  title?: string;
  type: "object";
  properties: Record<string, FormSchemaProperty>;
  required?: string[];
};
```

#### Supported Field Types

- **String**: Text input with validation
- **Number**: Number input with min/max validation
- **Boolean**: Switch component
- **Enum**: Select dropdown with predefined options
- **Options**: Select dropdown with custom options
- **Array**: Textarea for array input

#### Field Schema Examples

```tsx
// String field with validation
{
  type: "string",
  title: "Username",
  minLength: 3,
  maxLength: 20,
  pattern: "^[a-zA-Z0-9_]+$"
}

// Number field with range
{
  type: "number",
  title: "Age",
  minimum: 0,
  maximum: 120
}

// Email field
{
  type: "string",
  title: "Email",
  format: "email"
}

// Enum field
{
  type: "string",
  title: "Status",
  enum: ["active", "inactive", "pending"]
}

// Options field
{
  type: "options",
  title: "Country",
  options: [
    { label: "United States", value: "us" },
    { label: "Canada", value: "ca" },
    { label: "Mexico", value: "mx" }
  ]
}

// Boolean field
{
  type: "boolean",
  title: "Subscribe to newsletter",
  default: false
}
```

### UIFormSchema

Customize the appearance and behavior of your form:

```tsx
type UIFormSchema = {
  "ui:layout"?: {
    cols?: number;           // Grid columns (1-24)
    gap?: number;            // Gap between fields
    fields?: Record<string, number>; // Custom span for specific fields
  };
  "ui:widgets"?: Record<string, string>;     // Custom widgets
  "ui:placeholder"?: Record<string, string>; // Custom placeholders
  "ui:visibleIf"?: Record<string, Record<string, unknown>>; // Conditional visibility
  "ui:dependencies"?: Array<{               // Field dependencies
    when: Record<string, unknown>;
    show: string[];
  }>;
  "ui:customClass"?: Record<string, string>; // Custom CSS classes
};
```

#### Layout Configuration

```tsx
const uiSchema: UIFormSchema = {
  "ui:layout": {
    cols: 12,        // 12-column grid
    gap: 16,         // 16px gap between fields
    fields: {
      name: 12,      // Full width
      email: 12,     // Full width
      age: 6,        // Half width
      role: 6        // Half width
    }
  }
};
```

#### Widget Customization

```tsx
const uiSchema: UIFormSchema = {
  "ui:widgets": {
    password: "password",    // Password input
    description: "textarea", // Textarea
    country: "select"        // Select dropdown
  }
};
```

#### Custom Styling

```tsx
const uiSchema: UIFormSchema = {
  "ui:customClass": {
    name: "custom-input",
    email: "email-field",
    submit: "submit-button"
  }
};
```

## Advanced Examples

### Conditional Fields

```tsx
const schema: FormSchema = {
  type: "object",
  properties: {
    hasAddress: {
      type: "boolean",
      title: "Has Address"
    },
    address: {
      type: "string",
      title: "Address"
    }
  }
};

const uiSchema: UIFormSchema = {
  "ui:dependencies": [
    {
      when: { hasAddress: true },
      show: ["address"]
    }
  ]
};
```

### Custom Validation Messages

```tsx
const schema: FormSchema = {
  type: "object",
  properties: {
    username: {
      type: "string",
      title: "Username",
      minLength: 3,
      pattern: "^[a-zA-Z0-9_]+$"
    }
  },
  required: ["username"]
};
```

### Form with Custom Submit Button

```tsx
<AntdSchemaForm
  schema={schema}
  uiSchema={uiSchema}
  onFinish={handleSubmit}
  submitButtonProps={{
    title: "Create Account",
    type: "primary",
    size: "large",
    loading: isSubmitting,
    icon: <UserOutlined />
  }}
/>
```

## Development

### Prerequisites

- Node.js 18+
- pnpm 8+

### Setup

```bash
# Clone the repository
git clone https://github.com/xubylele/antd-form-generator.git
cd antd-form-generator

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test

# Build the library
pnpm build

# Lint code
pnpm lint
```

### Scripts

- `pnpm dev` - Start development with watch mode
- `pnpm build` - Build the library for production
- `pnpm test` - Run test suite
- `pnpm test:watch` - Run tests in watch mode
- `pnpm lint` - Lint code with ESLint
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm release` - Build and publish to npm

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT © [Xuby](https://github.com/xubylele/antd-form-generator/blob/main/license)

## Support

If you find this library helpful, please consider giving it a ⭐ on GitHub!

For issues and feature requests, please use the [GitHub Issues](https://github.com/xubylele/antd-form-generator/issues) page.
