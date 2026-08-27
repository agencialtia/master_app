import React from 'react';
import { 
  Sparkles, 
  Bot, 
  Code2, 
  HeartHandshake, 
  Zap, 
  Cpu, 
  Boxes, 
  Layers, 
  Terminal, 
  Globe,
  MessageSquare,
  Compass,
  GitBranch
} from 'lucide-react';
import { PRESET_PLATFORMS } from '../types';

interface PlatformBadgeProps {
  platform: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const PlatformBadge: React.FC<PlatformBadgeProps> = ({
  platform,
  size = 'md',
  showIcon = true,
  className = ''
}) => {
  const matched = PRESET_PLATFORMS.find(
    p => p.name.toLowerCase() === (platform || '').toLowerCase()
  );

  const getIcon = () => {
    const iconName = matched?.icon || 'Globe';
    const iconSize = size === 'sm' ? 12 : size === 'lg' ? 15 : 13;

    switch (iconName) {
      case 'Sparkles':
        return <Sparkles size={iconSize} className="text-blue-600 shrink-0" />;
      case 'Bot':
        return <Bot size={iconSize} className="text-amber-700 shrink-0" />;
      case 'Code2':
        return <Code2 size={iconSize} className="text-violet-600 shrink-0" />;
      case 'HeartHandshake':
        return <HeartHandshake size={iconSize} className="text-pink-600 shrink-0" />;
      case 'Zap':
        return <Zap size={iconSize} className="text-cyan-600 shrink-0" />;
      case 'Cpu':
        return <Cpu size={iconSize} className="text-indigo-600 shrink-0" />;
      case 'Boxes':
        return <Boxes size={iconSize} className="text-emerald-600 shrink-0" />;
      case 'MessageSquare':
        return <MessageSquare size={iconSize} className="text-teal-600 shrink-0" />;
      case 'Layers':
        return <Layers size={iconSize} className="text-slate-800 shrink-0" />;
      case 'Compass':
        return <Compass size={iconSize} className="text-sky-600 shrink-0" />;
      case 'GitBranch':
        return <GitBranch size={iconSize} className="text-purple-600 shrink-0" />;
      case 'Terminal':
        return <Terminal size={iconSize} className="text-orange-600 shrink-0" />;
      default:
        return <Globe size={iconSize} className="text-slate-600 shrink-0" />;
    }
  };

  const bgClass = matched?.bg || 'bg-slate-100';
  const borderClass = matched?.border || 'border-slate-200';
  const textClass = matched?.color || 'text-slate-700';

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1 font-semibold',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-xs sm:text-sm px-3 py-1.5 gap-2 font-bold'
  };

  return (
    <span
      className={`inline-flex items-center rounded-lg border transition-colors whitespace-nowrap ${bgClass} ${borderClass} ${textClass} ${sizeClasses[size]} ${className}`}
    >
      {showIcon && getIcon()}
      <span className="truncate">{platform || 'Otra'}</span>
    </span>
  );
};
