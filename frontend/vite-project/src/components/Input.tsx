import { useState } from "react";
import { EyeIcon } from "../assets/Eye";
import { EyeOffIcon } from "../assets/EyeOff";

interface InputProps {
  placeholder: string;
  inputref?: any;
  fullwidth?: boolean;
  type?: string;
}

export const Input = (props: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = props.type === "password";

  return (
    <div className={`relative ${props.fullwidth ? "w-full" : "w-full"}`}>
      <input
        ref={props.inputref}
        placeholder={props.placeholder}
        type={
          isPassword
            ? showPassword
              ? "text"
              : "password"
            : props.type || "text"
        }
        className={`
          w-full
          px-4 py-2
          pr-12
          border
          rounded
        `}
      />

      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
        >
          {showPassword ? <EyeIcon /> : <EyeOffIcon />}
        </button>
      )}
    </div>
  );
};