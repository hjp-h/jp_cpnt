import React from "react";
import styles from "./Button.module.scss";

export interface ButtonProps {
  /**
   * 按钮类型
   */
  type?: "primary" | "default" | "dashed" | "text" | "link";
  /**
   * 按钮大小
   */
  size?: "large" | "middle" | "small";
  /**
   * 按钮文字
   */
  children?: React.ReactNode;
  /**
   * 点击事件
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * 是否禁用
   */
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  type = "default",
  size = "middle",
  children,
  onClick,
  disabled = false,
}) => {
  const buttonClass = [
    styles.button,
    styles[`button-${type}`],
    styles[`button-${size}`],
    disabled && styles["button-disabled"],
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={buttonClass} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
