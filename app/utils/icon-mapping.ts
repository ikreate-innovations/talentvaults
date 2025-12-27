// app/utils/icon-mapping.ts - COMPLETE VERSION

export const materialToLucideMap: Record<string, string> = {
  // Navigation & Arrows
  'arrow_back': 'ArrowLeft',
  'arrow_forward': 'ArrowRight',
  'arrow_left': 'ArrowLeft',
  'arrow_right': 'ArrowRight',
  'menu': 'Menu',
  'close': 'X',
  
  // Communication
  'mail': 'Mail',
  'email': 'Mail',
  
  // Work & Business
  'work': 'Briefcase',
  'verified': 'BadgeCheck',
  'verified_user': 'ShieldCheck',
  'account_balance': 'Building',
  'hub': 'Network',
  'build': 'Wrench',
  'business': 'Building',
  'domain': 'Globe',
  
  // UI & Actions
  'check_circle': 'CheckCircle',
  'check': 'CheckCircle',
  'paid': 'CreditCard',
  'attach_money': 'CreditCard',
  'schedule': 'Clock',
  'access_time': 'Clock',
  'search': 'Search',
  'school': 'GraduationCap',
  'health_and_safety': 'Heart',
  'favorite': 'Heart',
  'trending_up': 'TrendingUp',
  'auto_awesome': 'Sparkles',
  'cancel': 'XCircle',
  'shield': 'Shield',
  'security': 'ShieldCheck',
  
  // Files & Content
  'description': 'FileText',
  'article': 'FileText',
  
  // Media
  'image': 'Image',
  'photo': 'Image',
  
  // Status
  'star': 'Star',
  'error': 'AlertCircle',
  'warning': 'AlertTriangle',
  'info': 'Info',
  
  // Network
  'network': 'Network',
  'lan': 'Network',
  'wifi': 'Wifi',
  
  // Default fallback
  'help': 'HelpCircle',
  'question_mark': 'HelpCircle',
  'help_outline': 'HelpCircle',
};

/**
 * Get Lucide icon name from Material Symbols name
 */
export function getLucideIconName(materialIconName: string): string {
  return materialToLucideMap[materialIconName] || 'HelpCircle';
}

/**
 * Check if we have mapping for an icon
 */
export function hasMapping(materialIconName: string): boolean {
  return materialIconName in materialToLucideMap;
}