import {
  BarChart3Icon,
  BellIcon,
  BriefcaseIcon,
  Building2Icon,
  CalendarIcon,
  Code2Icon,
  CoinsIcon,
  FileTextIcon,
  HandshakeIcon,
  HardHatIcon,
  HomeIcon,
  KeyRoundIcon,
  LockIcon,
  MapIcon,
  MessageCircleIcon,
  NewspaperIcon,
  PlusIcon,
  ShieldCheckIcon,
  SproutIcon,
  TagIcon,
  UserIcon,
  UsersIcon,
  WalletIcon,
  WrenchIcon,
  type LucideIcon,
} from 'lucide-react';

/** Icons referenced by name from content/nav.ts so content stays serialisable. */
const icons = {
  home: HomeIcon,
  building: Building2Icon,
  map: MapIcon,
  sprout: SproutIcon,
  plus: PlusIcon,
  bell: BellIcon,
  calendar: CalendarIcon,
  wallet: WalletIcon,
  'file-text': FileTextIcon,
  users: UsersIcon,
  wrench: WrenchIcon,
  'message-circle': MessageCircleIcon,
  'bar-chart': BarChart3Icon,
  code: Code2Icon,
  coins: CoinsIcon,
  lock: LockIcon,
  key: KeyRoundIcon,
  'hard-hat': HardHatIcon,
  user: UserIcon,
  handshake: HandshakeIcon,
  tag: TagIcon,
  briefcase: BriefcaseIcon,
  newspaper: NewspaperIcon,
  'shield-check': ShieldCheckIcon,
} satisfies Record<string, LucideIcon>;

export type NavIconName = keyof typeof icons;

export function NavIcon({ name, className }: { name: NavIconName; className?: string }) {
  const Icon = icons[name];
  return <Icon className={className} aria-hidden="true" strokeWidth={1.75} />;
}

/** iris-100 badge with the icon in iris-700, as drawn on the canvas. */
export function NavIconBadge({ name, size = 40 }: { name: NavIconName; size?: 40 | 48 }) {
  return (
    <span
      className={
        size === 48
          ? 'inline-flex size-12 shrink-0 items-center justify-center rounded-[12px] bg-iris-100 text-iris-700'
          : 'inline-flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-iris-100 text-iris-700'
      }
    >
      <NavIcon name={name} className="size-5" />
    </span>
  );
}
