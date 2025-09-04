import { describe, expect, it } from "vitest";
import type {
  ArraySchema,
  BooleanSchema,
  EnumSchema,
  FormSchema,
  NumberSchema,
  OptionsSchema,
  StringSchema
} from "../../types";
import { buildRulesFormField } from "../validators";


const baseSchema: FormSchema = {
  type: "object",
  properties: {},
  required: [],
};

describe("buildRulesFormField", () => {
  it("should return empty array when no rules are required", () => {
    const schema: FormSchema = { ...baseSchema, properties: { name: { type: "string" } as StringSchema } };
    const rules = buildRulesFormField("name", schema, schema.properties.name);
    expect(rules).toEqual([]);
  });

  it("should return required rule when property is required", () => {
    const schema: FormSchema = {
      ...baseSchema,
      required: ["name"],
      properties: {
        name: { type: "string" } as StringSchema,
      },
    };
    const rules = buildRulesFormField("name", schema, schema.properties.name);
    expect(rules).toEqual([{ required: true, message: "name is required" }]);
  });
});

describe("string rules", () => {
  it("should return minLength rule when property has minLength", () => {
    const schema: FormSchema = { ...baseSchema, properties: { name: { type: "string", minLength: 3 } as StringSchema } };
    const rules = buildRulesFormField("name", schema, schema.properties.name);
    expect(rules).toEqual([{ min: 3, message: "name must be at least 3 characters" }]);
  });

  it("should return maxLength rule when property has maxLength", () => {
    const schema: FormSchema = { ...baseSchema, properties: { name: { type: "string", maxLength: 10 } as StringSchema } };
    const rules = buildRulesFormField("name", schema, schema.properties.name);
    expect(rules).toEqual([{ max: 10, message: "name must be at most 10 characters" }]);
  });

  it("should return pattern rule when property has pattern", () => {
    const schema: FormSchema = { ...baseSchema, properties: { name: { type: "string", pattern: "^[a-z]+$" } as StringSchema } };
    const rules = buildRulesFormField("name", schema, schema.properties.name);
    expect(rules).toEqual([{ pattern: /^[a-z]+$/, message: "name must match the pattern ^[a-z]+$" }]);
  });

  it("should return url rule when property has format url", () => {
    const schema: FormSchema = { ...baseSchema, properties: { name: { type: "string", format: "url" } as StringSchema } };
    const rules = buildRulesFormField("name", schema, schema.properties.name);
    expect(rules).toEqual([{ type: "url", message: "name must be a valid url" }]);
  });

  it("should return email rule when property has format email", () => {
    const schema: FormSchema = { ...baseSchema, properties: { name: { type: "string", format: "email" } as StringSchema } };
    const rules = buildRulesFormField("name", schema, schema.properties.name);
    expect(rules).toEqual([{ type: "email", message: "name must be a valid email" }]);
  });

  it("should return empty array when property has no rules", () => {
    const schema: FormSchema = { ...baseSchema, properties: { name: { type: "string" } as StringSchema } };
    const rules = buildRulesFormField("name", schema, schema.properties.name);
    expect(rules).toEqual([]);
  });
});

describe("number rules", () => {
  it("should return minimum rule when property has minimum", () => {
    const schema: FormSchema = { ...baseSchema, properties: { name: { type: "number", minimum: 10 } as NumberSchema } };
    const rules = buildRulesFormField("name", schema, schema.properties.name);
    expect(rules).toEqual([{ min: 10, message: "name must be at least 10", type: "number" }]);
  });

  it("should return maximum rule when property has maximum", () => {
    const schema: FormSchema = { ...baseSchema, properties: { name: { type: "number", maximum: 10 } as NumberSchema } };
    const rules = buildRulesFormField("name", schema, schema.properties.name);
    expect(rules).toEqual([{ max: 10, message: "name must be at most 10", type: "number" }]);
  });

  it("should return minimum and maximum equals to 0 when property has minimum and maximum equals to 0", () => {
    const schema: FormSchema = { ...baseSchema, properties: { name: { type: "number", minimum: 0, maximum: 0 } as NumberSchema } };
    const rules = buildRulesFormField("name", schema, schema.properties.name);
    expect(rules).toEqual([{ min: 0, max: 0, message: "name must be at least 0 and at most 0", type: "number" }]);
  });

  it("should return empty array when property has no rules", () => {
    const schema: FormSchema = { ...baseSchema, properties: { name: { type: "number" } as NumberSchema } };
    const rules = buildRulesFormField("name", schema, schema.properties.name);
    expect(rules).toEqual([]);
  });
});

describe("boolean rules", () => {
  it("should return default rule when property has default", () => {
    const schema: FormSchema = { ...baseSchema, properties: { name: { type: "boolean", default: true } as BooleanSchema } };
    const rules = buildRulesFormField("name", schema, schema.properties.name);
    expect(rules).toEqual([{ type: "boolean", default: true, message: "name must be true" }]);
  });
});

describe("enum rules", () => {
  it("should return enum rule when property has enum", () => {
    const schema: FormSchema = {
      ...baseSchema,
      properties: {
        name: {
          type: "string",
          enum: ["a", "b", "c"],
          enumOptions: [
            { label: "a", value: "a" },
            { label: "b", value: "b" },
            { label: "c", value: "c" }
          ],
        } as EnumSchema
      }
    };
    const rules = buildRulesFormField("name", schema, schema.properties.name);
    expect(rules).toEqual([{ type: "enum", enum: [{ label: "a", value: "a" }, { label: "b", value: "b" }, { label: "c", value: "c" }], message: "name must be one of a, b, c" }]);
  });

  it("should add rule for numbers enum", () => {
    const schema: FormSchema = {
      ...baseSchema,
      properties: {
        name: {
          type: "number",
          enum: [1, 2, 3],
          enumOptions: [
            { label: "1", value: 1 },
            { label: "2", value: 2 },
            { label: "3", value: 3 }
          ]
        } as EnumSchema
      }
    };
    const rules = buildRulesFormField("name", schema, schema.properties.name);
    expect(rules).toEqual([
      {
        type: "enum",
        enum: [
          { label: "1", value: 1 },
          { label: "2", value: 2 },
          { label: "3", value: 3 }
        ],
        message: "name must be one of 1, 2, 3"
      }
    ]);
  });
});

describe("array rules", () => {
  it("should return items rule when property has items", () => {
    const schema: FormSchema = { ...baseSchema, properties: { name: { type: "array", items: [{ type: "string" }] } as ArraySchema } };
    const rules = buildRulesFormField("name", schema, schema.properties.name);
    expect(rules).toEqual([{ type: "array", items: [{ type: "string" }], message: "name must be an array" }]);
  });

  it("should run if array does not have items", () => {
    const schema: FormSchema = { ...baseSchema, properties: { name: { type: "array" } as ArraySchema } };
    const rules = buildRulesFormField("name", schema, schema.properties.name);
    expect(rules).toEqual([]);
  });
});

describe("options rules", () => {
  it("should return options rule when property has options", () => {
    const schema: FormSchema = { ...baseSchema, properties: { name: { type: "options", options: [{ label: "a", value: "a" }, { label: "b", value: "b" }, { label: "c", value: "c" }] } as OptionsSchema } };
    const rules = buildRulesFormField("name", schema, schema.properties.name);
    expect(rules).toEqual([{ type: "options", options: [{ label: "a", value: "a" }, { label: "b", value: "b" }, { label: "c", value: "c" }], message: "name must be one of a, b, c" }]);
  });

  it("should return empty array when property has no rules", () => {
    const schema: FormSchema = { ...baseSchema, properties: { name: { type: "options" } as OptionsSchema } };
    const rules = buildRulesFormField("name", schema, schema.properties.name);
    expect(rules).toEqual([]);
  });

  it("should run if options does not have options", () => {
    const schema: FormSchema = { ...baseSchema, properties: { name: { type: "options" } as OptionsSchema } };
    const rules = buildRulesFormField("name", schema, schema.properties.name);
    expect(rules).toEqual([]);
  });
});