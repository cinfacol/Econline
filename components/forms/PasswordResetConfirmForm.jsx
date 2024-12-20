"use client";

import { useResetPasswordConfirm } from "@/hooks";
import { Form } from "@/components/forms";

export default function PasswordResetConfirmForm({ uid, token }) {
  const { new_password, re_new_password, isLoading, onChange, onSubmit } =
    useResetPasswordConfirm(uid, token);

  const config = [
    {
      labelText: "New password",
      labelId: "new_password",
      type: "password",
      onChange,
      value: new_password,
      placeholder: "Enter a new password *",
      required: true,
    },
    {
      labelText: "Confirm new password",
      labelId: "re_new_password",
      type: "password",
      onChange,
      value: re_new_password,
      placeholder: "Repeat a preview password *",
      required: true,
    },
  ];

  return (
    <Form
      config={config}
      isLoading={isLoading}
      btnText="Request password reset"
      onChange={onChange}
      onSubmit={onSubmit}
    />
  );
}
