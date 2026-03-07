interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div
      className="
        group relative p-6 rounded-2xl
        bg-white/5 backdrop-blur-md
        border border-white/10
        hover:bg-white/10 hover:border-white/20
        hover:scale-105
        transition-all duration-300
        shadow-lg hover:shadow-2xl hover:shadow-blue-500/20
      "
    >
      {/* Icon */}
      <div className="mb-4 text-blue-400 group-hover:text-blue-300 transition-colors">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-white mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-white/70 text-sm leading-relaxed">
        {description}
      </p>

      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300 pointer-events-none" />
    </div>
  );
}
