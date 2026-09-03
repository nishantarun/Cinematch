const Input = ({ id, name, value, onChange, placeholder, maxLength }) => {
  return (
    <input
      type="text"
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      className="w-full rounded-lg border border-border bg-background px-4 py-3 text-text outline-none transition placeholder:text-text-muted focus:border-primary"
    />
  );
};

export default Input;
