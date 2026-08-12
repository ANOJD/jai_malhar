import { motion } from 'framer-motion';
import styles from './Button.module.css';

// Reusable button with variants: primary, gold, outline, ghost, danger, glass
// Sizes: sm, md, lg
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  isLoading = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  ...rest
}) {
  const classes = [
    styles.btn,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    isLoading ? styles.loading : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.button
      type={type}
      className={classes}
      disabled={disabled || isLoading}
      onClick={onClick}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.03 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {isLoading && <span className={styles.spinner} />}
      {!isLoading && LeftIcon && <LeftIcon className={styles.iconLeft} size={18} />}
      <span>{children}</span>
      {!isLoading && RightIcon && <RightIcon className={styles.iconRight} size={18} />}
    </motion.button>
  );
}
