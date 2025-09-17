import React, { useCallback } from "react";

export const Input: React.FC<{
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  type?: React.HTMLInputTypeAttribute;
}> = ({ text, setText, disabled, placeholder, className, type = "text" }) => {
  const onChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      setText(e.currentTarget.value);
    },
    [setText],
  );

  return (
    <input
      className={`leading-[1.7] block w-full rounded-geist bg-background p-geist-half text-foreground text-sm border border-unfocused-border-color transition-colors duration-150 ease-in-out focus:border-focused-border-color outline-none ${className ?? ""}`}
      type={type}
      disabled={disabled}
      name="title"
      placeholder={placeholder}
      value={text}
      onChange={onChange}
    />
  );
};
