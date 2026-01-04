import {
  Eye,
  HeartStraight,
  Star,
  Fire,
  Shield,
  Sword,
  Skull,
  Wall,
  Bug,
  DoorOpen,
  Flask,
  Scroll,
  Warning,
  Tote,     // For Bag
  User,     // For Player
  Flashlight, // For Unlit Torch
  SpeakerSlash, // For Silence
  Bomb,
  BellSimpleSlash,
  BellSimpleRinging,
  Trophy,
  CaretDown,
  SignOut
} from '@phosphor-icons/react';

// Mapping requested Phosphor icons to App Component Names
export const EyeIcon = Eye;           // "eye for Eagle Eye"
export const HeartIcon = HeartStraight; // "heart-straight for Hearts"
export const StarIcon = Star;         // "star for Stars"
export const FlameIcon = Fire;        // "fire for Torches"
export const ShieldIcon = Shield;     // "shield for Armor"
export const SwordIcon = Sword;       // "sword for Attack Skill"
export const SkullIcon = Skull;       // "skull for Slain Enemy"
export const WallIcon = Wall;         // "wall for Walls"
export const EnemyIcon = Bug;         // "bug for Enemies"
export const ExitIcon = DoorOpen;     // "door-open for Doors"
export const PotionIcon = Flask;      // "flask for Potions"
export const ScrollIcon = Scroll;     // "scroll for Scrolls"
export const TrapIcon = Warning;      // "warning for Triggers"

// Extras / Fallbacks
export const BagIcon = Tote;          // "bag" -> Tote in Phosphor
export const PlayerIcon = User;       // Player -> User
export const FlashlightIcon = Flashlight; // Unlit Torch
export const SilenceIcon = SpeakerSlash; // Silence Skill
export const BombIcon = Bomb;
export const AlarmOffIcon = BellSimpleSlash;
export const AlarmOnIcon = BellSimpleRinging;
export const UserIcon = User;
export const TrophyIcon = Trophy;
export const CaretDownIcon = CaretDown;
export const SignOutIcon = SignOut;
