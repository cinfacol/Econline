"use client";

import { useRegister } from "@/hooks";
import { Form } from "@/components/forms";

export default function RegisterForm() {
  const {
    username,
    first_name,
    last_name,
    email,
    password,
    re_password,
    isLoading,
    onChange,
    onSubmit,
  } = useRegister();

  const config = [
    {
      labelText: "Username",
      labelId: "username",
      type: "text",
      value: username,
      placeholder: "Enter your Nickname *",
      required: true,
    },
    {
      labelText: "First name",
      labelId: "first_name",
      type: "text",
      value: first_name,
      placeholder: "Enter your first name *",
      required: true,
    },
    {
      labelText: "Last name",
      labelId: "last_name",
      type: "text",
      value: last_name,
      placeholder: "Enter your last name *",
      required: true,
    },
    {
      labelText: "Email address",
      labelId: "email",
      type: "email",
      value: email,
      placeholder: "Enter a valid email *",
      required: true,
    },
    {
      labelText: "Password",
      labelId: "password",
      type: "password",
      value: password,
      placeholder: "******** *",
      required: true,
    },
    {
      labelText: "Confirm password",
      labelId: "re_password",
      type: "password",
      value: re_password,
      placeholder: "******** *",
      required: true,
    },
  ];

  return (
    <Form
      config={config}
      isLoading={isLoading}
      btnText="Sign up"
      onChange={onChange}
      onSubmit={onSubmit}
    />
  );
}
