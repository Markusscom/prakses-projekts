import styles from "./Button.module.css";

export default function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled = false,
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        styles.btn,
        styles[variant],
        disabled ? styles.disabled : ""
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}