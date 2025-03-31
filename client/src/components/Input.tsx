import { UseFormRegister } from "react-hook-form";
import { forwardRef, InputHTMLAttributes } from "react";

interface formData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  profilePic: string;
}

interface inputPropType extends ReturnType<UseFormRegister<formData>> {
  label: string;
  placeholder: string;
  type: string;
  className: string;
}

// forwardRef captures the ref and makes it available inside the function.
// ref={ref} ensures that the input element is connected to React Hook Form.
// Now, react-hook-form can control and validate the input field.

const Input = forwardRef<HTMLInputElement, inputPropType>(
  ({ onChange, name, label, placeholder, type, className }, ref) => {
    return (
      <div
        className={`w-full flex flex-col gap-y-2 bg-gray-200 px-6 pt-2 pb-4 rounded-md ${className}`}
      >
        {label && <label>{label}</label>}
        <input
          name={name}
          ref={ref}
          type={type}
          onChange={onChange}
          className={`w-full py-3 bg-gray-700  text-white  px-4 rounded-md placeholder:text-white `}
          placeholder={placeholder}
        />
      </div>
    );
  }
);

export default Input;
