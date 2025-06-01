import React from "react";

export function Checkbox(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" {...props} />
  );
}
export default Checkbox;
