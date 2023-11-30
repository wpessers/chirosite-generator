export function Container ({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div className="max-w-screen-md mx-auto p-6">
          {children}
      </div>
    )
}