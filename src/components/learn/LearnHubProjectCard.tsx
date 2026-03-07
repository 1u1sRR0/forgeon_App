'use client';

import Link from 'next/link';

interface LearnHubProjectCardProps {
  project: {
    id: string;
    name: string;
    state: string;
    progress: number;
    updatedAt: string;
  };
}

export function LearnHubProjectCard({ project }: LearnHubProjectCardProps) {
  const stateColors = {
    IDEA: 'bg-blue-500/20 text-blue-400',
    VALIDATED: 'bg-yellow-500/20 text-yellow-400',
    MVP_READY: 'bg-green-500/20 text-green-400',
    LIVE: 'bg-purple-500/20 text-purple-400',
  };

  const stateColor = stateColors[project.state as keyof typeof stateColors] || stateColors.IDEA;

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div className="group bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors line-clamp-2 flex-1">
          {project.name}
        </h3>
        <span className={`px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${stateColor}`}>
          {project.state.replace('_', ' ')}
        </span>
      </div>

      {/* Progress Ring */}
      <div className="flex items-center justify-center mb-4">
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              className="text-gray-700"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - project.progress / 100)}`}
              className="text-purple-500 transition-all duration-500"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{project.progress}%</span>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-center mb-4">
        <p className="text-sm text-gray-400">Last updated {getRelativeTime(project.updatedAt)}</p>
      </div>

      {/* Continue Button */}
      <Link
        href={`/dashboard/projects/${project.id}/course`}
        className="block w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-center font-medium"
      >
        Continue Learning
      </Link>
    </div>
  );
}
