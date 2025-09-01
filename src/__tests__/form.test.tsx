import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AntdSchemaForm, FormSchema, UIFormSchema } from "../index";

describe("AntdSchemaForm", () => {
  const schema: FormSchema = {
    type: "object",
    title: "Test Form",
    properties: {
      name: {
        type: "string",
        title: "Name",
      },
      age: {
        type: "number",
        title: "Age",
      },
      role: {
        type: "string",
        title: "Role",
        enum: ["admin", "user"],
      },
      active: {
        type: "boolean",
        title: "Active",
      },
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
  }

  const uiSchema: UIFormSchema = {
    "ui:layout": { cols: 12, gap: 16, fields: { name: 12, age: 12, role: 12, active: 12, color: 12 } },
    "ui:widgets": { name: "input", age: "input", role: "select", active: "switch", color: "select" },
    "ui:placeholder": { name: "Please enter name", age: "Please enter age", role: "Please enter role", active: "Please enter active", color: "Please enter color" },
    "ui:visibleIf": { name: { active: true }, age: { active: true }, role: { active: true }, color: { active: true } },
    "ui:dependencies": [
      { when: { active: true }, show: ["name", "age", "role", "color"] },
    ],
    "ui:customClass": { name: "custom-class", age: "custom-class", role: "custom-class", active: "custom-class", color: "custom-class" },
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

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Age")).toBeInTheDocument();
    expect(screen.getByLabelText("Role")).toBeInTheDocument();
    expect(screen.getByLabelText("Active")).toBeInTheDocument();
    expect(screen.getByLabelText("Color")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("should show errors when fields are invalid", () => {
    const onFinish = vi.fn();

    render(
      <AntdSchemaForm
        schema={schema}
        uiSchema={uiSchema}
        onFinish={onFinish}
      />
    );

    const nameInput = screen.getByPlaceholderText("Please enter name");
    const ageInput = screen.getByPlaceholderText("Please enter age");
    const roleInput = screen.getByPlaceholderText("Please enter role");
    const activeInput = screen.getByPlaceholderText("Please enter active");
    const colorInput = screen.getByPlaceholderText("Please enter color");

    fireEvent.change(nameInput, { target: { value: "" } });
    fireEvent.change(ageInput, { target: { value: "" } });
    fireEvent.change(roleInput, { target: { value: "" } });
    fireEvent.change(activeInput, { target: { value: "" } });
    fireEvent.change(colorInput, { target: { value: "" } });

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(screen.getByText("name is required")).toBeInTheDocument();
    expect(screen.getByText("role is required")).toBeInTheDocument();
    expect(screen.getByText("age is required")).toBeInTheDocument();
    expect(screen.getByText("active is required")).toBeInTheDocument();
    expect(screen.getByText("color is required")).toBeInTheDocument();
  });

});