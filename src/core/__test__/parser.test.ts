import { describe, it, expect } from "vitest";
import { parseFormSchema, type ParsedField } from "../parser";
import type {
  FormSchema,
  UIFormSchema,
  EnumFormatSchema,
  OptionsSchema,
  FormSchemaProperty,
  EnumSchema,
} from "../../types";

const baseSchema: FormSchema = {
  title: "Base Schema",
  type: "object",
  properties: {
    name: { type: "string", title: "Nombre", minLength: 2 } as FormSchemaProperty,
    age: { type: "number", title: "Edad", minimum: 0 } as FormSchemaProperty,
    active: { type: "boolean", title: "Activo" } as FormSchemaProperty,
    role: {
      type: "string",
      title: "Rol",
      enum: ["admin", "editor", "viewer"],
    } as EnumSchema,
    tags: {
      type: "array",
      title: "Etiquetas",
      items: [{ type: "string", title: "Tag" } as FormSchemaProperty],
    } as FormSchemaProperty,
    color: {
      type: "options",
      title: "Color",
      options: [
        { label: "Rojo", value: "red" },
        { label: "Azul", value: "blue" },
      ],
    } as OptionsSchema,
  },
  required: ["name", "role"],
};

const baseUI: UIFormSchema = {
  "ui:layout": {
    cols: 12,
    fields: {
      age: 6,
    },
  },
};

describe("parseFormSchema", () => {
  it("should parse the base schema", () => {
    const result = parseFormSchema(baseSchema, baseUI);

    const byName = result.reduce((acc, field) => {
      acc[field.name] = field;
      return acc;
    }, {} as Record<string, ParsedField>);

    expect(byName.name).toBeDefined();
    expect(byName.age).toBeDefined();
    expect(byName.active).toBeDefined();
    expect(byName.role).toBeDefined();
    expect(byName.tags).toBeDefined();
    expect(byName.color).toBeDefined();
  });

  it("should generate enumOptions for enum schema", () => {
    const fields = parseFormSchema(baseSchema, baseUI);

    const role = fields.find(field => field.name === "role");

    expect(role?.enumOptions).toBeDefined();
    expect(role?.enumOptions).toEqual([
      { label: "admin", value: "admin" },
      { label: "editor", value: "editor" },
      { label: "viewer", value: "viewer" },
    ]);
  });

  it("should generate options for options schema", () => {
    const fields = parseFormSchema(baseSchema, baseUI);

    const color = fields.find(field => field.name === "color");

    expect(color?.options).toBeDefined();
    expect(color?.options).toEqual([
      { label: "Rojo", value: "red" },
      { label: "Azul", value: "blue" },
    ]);
  });

  it("should generate span and clamp span", () => {
    const fields = parseFormSchema(baseSchema, baseUI);

    expect(fields.find(field => field.name === "name")?.span).toEqual(12);
    expect(fields.find(field => field.name === "age")?.span).toEqual(6);
    expect(fields.find(field => field.name === "active")?.span).toEqual(12);
    expect(fields.find(field => field.name === "role")?.span).toEqual(12);
    expect(fields.find(field => field.name === "tags")?.span).toEqual(12);
    expect(fields.find(field => field.name === "color")?.span).toEqual(12);
  });

  it("should place placeholder", () => {
    const fields = parseFormSchema(baseSchema, baseUI);

    expect(fields.find(field => field.name === "name")?.placeholder).toEqual("Please enter Nombre");
    expect(fields.find(field => field.name === "age")?.placeholder).toEqual("Please enter Edad");
    expect(fields.find(field => field.name === "active")?.placeholder).toEqual("Please enter Activo");
    expect(fields.find(field => field.name === "role")?.placeholder).toEqual("Please enter Rol");
    expect(fields.find(field => field.name === "tags")?.placeholder).toEqual("Please enter Etiquetas");
    expect(fields.find(field => field.name === "color")?.placeholder).toEqual("Please enter Color");
  });

  it("should place custom class", () => {
    const baseUI: UIFormSchema = {
      "ui:customClass": {
        name: "custom-class",
      },
    };

    const fields = parseFormSchema(baseSchema, baseUI);

    expect(fields.find(field => field.name === "name")?.customClass).toEqual("custom-class");
  });

  it("should place visibleIf", () => {
    const baseUI: UIFormSchema = {
      "ui:visibleIf": {
        name: { active: true },
      },
    };

    const fields = parseFormSchema(baseSchema, baseUI);

    expect(fields.find(field => field.name === "name")?.visibleIf).toEqual({ active: true });
  });

  it('should always display label', () => {
    const fields = parseFormSchema(baseSchema, baseUI);

    expect(fields.find(field => field.name === "name")?.label).toBeDefined();
    expect(fields.find(field => field.name === "age")?.label).toBeDefined();
    expect(fields.find(field => field.name === "active")?.label).toBeDefined();
    expect(fields.find(field => field.name === "role")?.label).toBeDefined();
    expect(fields.find(field => field.name === "tags")?.label).toBeDefined();
    expect(fields.find(field => field.name === "color")?.label).toBeDefined();
  });

  it("should set default span = cols when ui:layout is not set", () => {
    const fields = parseFormSchema(baseSchema, {});

    expect(fields.find(field => field.name === "name")?.span).toEqual(12);
    expect(fields.find(field => field.name === "age")?.span).toEqual(12);
    expect(fields.find(field => field.name === "active")?.span).toEqual(12);
    expect(fields.find(field => field.name === "role")?.span).toEqual(12);
  });

  it("should enumOptions and options be empty when not set", () => {
    const fields = parseFormSchema(baseSchema, baseUI);

    expect(fields.find(field => field.name === "name")?.enumOptions).toEqual([]);
    expect(fields.find(field => field.name === "name")?.options).toEqual([]);
  });
});
