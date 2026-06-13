import styles from "./Input.module.css";

export default function Input({ placeholder, value, onChange, ...props }) {
  return (
    <input
      className={styles.inputField}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...props}
    />
  );
}