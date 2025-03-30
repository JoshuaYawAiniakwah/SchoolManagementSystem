export function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-white p-4 shadow-md rounded">{children}</div>;
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
