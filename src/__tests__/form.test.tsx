import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AntdSchemaForm } from "../index";
import type { FormSchema, UIFormSchema } from "../types";

describe("AntdSchemaForm", () => {
  const schema: FormSchema = {
    type: "object",
    title: "Test Form",
    properties: {
      name: { type: "string", title: "Name" },
      age: { type: "number", title: "Age" },
      role: { type: "string", title: "Role", enum: ["admin", "user"] },
      active: { type: "boolean", title: "Active" },
      color: {
        type: "options",
        title: "Color",
        options: [
          { label: "Red", value: "red" },
          { label: "Blue", value: "blue" },
        ],
      },
    },
    required: ["name", "role"],
  };

  const uiSchema: UIFormSchema = {
    "ui:layout": {
      cols: 12,
      gap: 16,
      fields: { name: 12, age: 12, role: 12, active: 12, color: 12 },
    },
    "ui:widgets": {
      name: "input",
      age: "input",
      role: "select",
      active: "switch",
      color: "select",
    },
    "ui:placeholder": {
      name: "Please enter name",
      age: "Please enter age",
      role: "Please enter role",
      active: "Please enter active",
      color: "Please enter color",
    },
    "ui:visibleIf": {
      name: { active: true },
      age: { active: true },
      role: { active: true },
      color: { active: true },
    },
    "ui:dependencies": [
      { when: { active: true }, show: ["name", "age", "role", "color"] },
    ],
    "ui:customClass": {
      name: "custom-class",
      age: "custom-class",
      role: "custom-class",
      active: "custom-class",
      color: "custom-class",
    },
  };

  it("should render fields", () => {
    const onFinish = vi.fn();

    render(
      <AntdSchemaForm
        schema={schema}
        uiSchema={uiSchema}
        onFinish={onFinish}
        initialValues={{ active: true }}
        submitButtonProps={{ title: "Submit" }}
      />
    );

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Age")).toBeInTheDocument();
    expect(screen.getByText("Role")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Color")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("should show required errors when submitting empty", async () => {
    const onFinish = vi.fn();

    render(
      <AntdSchemaForm
        schema={schema}
        uiSchema={uiSchema}
        onFinish={onFinish}
        initialValues={{ active: true }}
        submitButtonProps={{ title: "Submit" }}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(await screen.findByText("name is required")).toBeInTheDocument();
    expect(await screen.findByText("role is required")).toBeInTheDocument();
    expect(onFinish).not.toHaveBeenCalled();
  });
});
