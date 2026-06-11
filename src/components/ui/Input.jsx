import "./Input.css";

export default function Input({ placeholder, value, onChange, ...props }) {
  return (
    <input
      className="input-field"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...props}
    />
  );
}