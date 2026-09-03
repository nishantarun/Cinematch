const Card = ({ children }) => {
  return (
    <section className="rounded-2xl border border-border bg-surface p-6">
      {children}
    </section>
  );
};

export default Card;
