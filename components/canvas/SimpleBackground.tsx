export default function SimpleBackground() {
  return (
    <div className="pointer-events-none absolute left-0 top-0 -z-10 h-full w-full overflow-hidden">
      <div className="absolute -left-[10%] -top-[20%] h-[50%] w-[50%] rounded-full bg-accent-soft/60 blur-[120px]" />
      <div className="absolute -right-[10%] top-[40%] h-[40%] w-[40%] rounded-full bg-rule/40 blur-[100px]" />
    </div>
  );
}
