interface SectionHeaderProps {
  title: string
  subtitle?: string
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-castello-black mb-2 tracking-tight">{title}</h1>
      {subtitle && <p className="text-base text-castello-neutral-600 font-normal">{subtitle}</p>}
      <div className="relative mt-3 h-0.5 w-24">
        <div className="absolute inset-0 bg-castello-gold rounded-full" />
      </div>
    </div>
  )
}

