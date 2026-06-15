import styles from "./Input.module.css";

export default function Input({
  placeholder,
  value,
  onChange,
  type = "text",
  disabled = false,
  ...props
}) {
  return (
    <input
      className={styles.inputField}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      type={type}
      disabled={disabled}
      {...props}
    />
  );
}