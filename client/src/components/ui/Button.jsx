const Button = ({
  children,
  type = "button",
  variant = "primary",
  onClick,
  fullWidth = true,
}) => {
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover",
    secondary:
      "border border-border bg-transparent text-text hover:bg-surface-hover",
    ghost: "text-text-muted hover:text-text",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${fullWidth ? "w-full" : ""} rounded-lg px-4 py-3 font-medium transition ${variants[variant]}`}
    >
      {children}
    </button>
  );
};

export default Button;
