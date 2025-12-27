// app/components/Icon.tsx - COMPLETE VERSION
'use client';

import { 
  ArrowLeft, ArrowRight, Mail, X, Menu, Briefcase, BadgeCheck, ShieldCheck, 
  CheckCircle, CreditCard, Clock, Search, Building, GraduationCap, 
  Heart, TrendingUp, Wrench, Sparkles, XCircle, Shield,
  Network, HelpCircle, Check, AlertCircle, AlertTriangle, Info,
  Star, FileText, Image, Globe, Wifi
} from 'lucide-react';
import { getLucideIconName } from '@/app/utils/icon-mapping';

// Map icon names to components
const iconComponents = {
  'ArrowLeft': ArrowLeft,
  'ArrowRight': ArrowRight,
  'Mail': Mail,
  'X': X,
  'Menu': Menu,
  'Briefcase': Briefcase,
  'BadgeCheck': BadgeCheck,
  'ShieldCheck': ShieldCheck,
  'CheckCircle': CheckCircle,
  'Check': Check,
  'CreditCard': CreditCard,
  'Clock': Clock,
  'Search': Search,
  'Building': Building,
  'GraduationCap': GraduationCap,
  'Heart': Heart,
  'TrendingUp': TrendingUp,
  'Wrench': Wrench,
  'Sparkles': Sparkles,
  'XCircle': XCircle,
  'Shield': Shield,
  'Network': Network,
  'HelpCircle': HelpCircle,
  'AlertCircle': AlertCircle,
  'AlertTriangle': AlertTriangle,
  'Info': Info,
  'Star': Star,
  'FileText': FileText,
  'Image': Image,
  'Globe': Globe,
  'Wifi': Wifi,
} as const;

type IconName = keyof typeof iconComponents;

interface IconProps {
  name: string; // Material Symbols icon name
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

export default function Icon({ name, className = '', size = 'md' }: IconProps) {
  // Get Lucide icon name
  const lucideIconName = getLucideIconName(name) as IconName;
  
  // Get the icon component
  const IconComponent = iconComponents[lucideIconName] || HelpCircle;
  
  // Size classes
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8',
    '2xl': 'h-10 w-10',
    '3xl': 'h-12 w-12',
  };
  
  const sizeClass = sizeClasses[size];
  const combinedClasses = `${sizeClass} ${className}`.trim();
  
  return <IconComponent className={combinedClasses} />;
}