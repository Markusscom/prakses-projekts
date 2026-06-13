import styles from "./Button.module.css";

export default function Button({ children, onClick, variant = "primary", ...props }) {
  const variantClass = variant === "primary" ? styles.btnPrimary : styles.btnDanger;
  return (
    <button className={`${styles.btn} ${variantClass}`} onClick={onClick} {...props}>
      {children}
    </button>
  );
}