export default function SimpleBackground() {
  return (
    <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
      {/* Soft Orange Glow (Top Left) */}
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-orange-100/40 rounded-full blur-[120px]" />
      
      {/* Soft Blue/Grey Glow (Bottom Right) */}
      <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-zinc-200/40 rounded-full blur-[100px]" />
    </div>
  );
}
