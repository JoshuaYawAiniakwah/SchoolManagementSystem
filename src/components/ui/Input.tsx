export function Input({ type, placeholder, value, onChange }: any) {
  return <input type={type} placeholder={placeholder} value={value} onChange={onChange} className="border p-2 w-full" />;
}
