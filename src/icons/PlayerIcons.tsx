import Svg, { Path } from "react-native-svg";

type IconProps = {
    size?: number;
    color?: string;
};

export const PlayIcon = ({ size = 24, color = "#fff" }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d="M8 5v14l11-7z" fill={color} />
    </Svg>
);

export const PauseIcon = ({ size = 24, color = "#fff" }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d="M6 5h4v14H6zM14 5h4v14h-4z" fill={color} />
    </Svg>
);

export const NextIcon = ({ size = 24, color = "#fff" }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d="M6 18l8.5-6L6 6v12zM16 6h2v12h-2z" fill={color} />
    </Svg>
);

export const PrevIcon = ({ size = 24, color = "#fff" }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d="M18 6l-8.5 6L18 18V6zM6 6h2v12H6z" fill={color} />
    </Svg>
);

export const SearchIcon = ({ size = 20, color = "#000" }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
            d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
            stroke={color}
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
        />
    </Svg>
);

export const SunIcon = ({ size = 20, color = "#000" }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
            d="M12 4V2M12 22v-2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42
         M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42
         M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10z"
            stroke={color}
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
        />
    </Svg>
);

export const MoonIcon = ({ size = 20, color = "#000" }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" fill={color} />
    </Svg>
);

export const HomeIcon = ({
    size = 24,
    color = "#000",
    filled = false,
}: IconProps & { filled?: boolean }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
            d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"
            fill={filled ? color : "none"}
            stroke={color}
            strokeWidth={2}
            strokeLinejoin="round"
        />
    </Svg>
);

export const SearchIconTab = ({ size = 24, color = "#000" }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
            d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
            stroke={color}
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
        />
    </Svg>
);

export const SettingsIcon = ({ size = 24, color = "#000" }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
            d="M12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7zm7.4-3.5a7.4 7.4 0 0 0-.1-1l2.1-1.6-2-3.4-2.5 1a7.8 7.8 0 0 0-1.7-1l-.4-2.7H9.2l-.4 2.7a7.8 7.8 0 0 0-1.7 1l-2.5-1-2 3.4 2.1 1.6a7.4 7.4 0 0 0 0 2l-2.1 1.6 2 3.4 2.5-1a7.8 7.8 0 0 0 1.7 1l.4 2.7h5.6l.4-2.7a7.8 7.8 0 0 0 1.7-1l2.5 1 2-3.4-2.1-1.6c.1-.3.1-.7.1-1z"
            fill="none"
            stroke={color}
            strokeWidth={2}
        />
    </Svg>
);

export const MusicIcon = ({ size = 22, color = "#1DB954" }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
            d="M9 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm10-1V6a1 1 0 0 0-1.2-1l-10 2A1 1 0 0 0 7 8v9.2A3 3 0 1 0 9 20V9.8l8-1.6V17.2A3 3 0 1 0 19 20a3 3 0 0 0 0-6z"
            fill={color}
        />
    </Svg>
);

export const BackIcon = ({ size = 24, color = "#000" }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
            d="M15 18l-6-6 6-6"
            stroke={color}
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export const MoreIcon = ({ size = 22, color = "#000" }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
            d="M12 5h.01M12 12h.01M12 19h.01"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
        />
    </Svg>
);

export const ShuffleIcon = ({ size = 22, color = "#000" }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
            d="M16 3h5v5M4 20l16-16M16 16h5v5M4 4l6 6M4 14l6-6"
            stroke={color}
            strokeWidth={2}
            fill="none"
        />
    </Svg>
);

export const RepeatIcon = ({ size = 22, color = "#000" }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
            d="M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3"
            stroke={color}
            strokeWidth={2}
            fill="none"
        />
    </Svg>
);

export const ListIcon = ({ size = 22, color = "#000" }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d="M4 6h16M4 12h16M4 18h16" stroke={color} strokeWidth={2} />
    </Svg>
);

export const ChevronUp = ({ size = 18, color = "#000" }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d="M18 15l-6-6-6 6" stroke={color} strokeWidth={2} fill="none" />
    </Svg>
);

export const ChevronDown = ({ size = 28, color = "#000" }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d="M6 9l6 6 6-6" stroke={color} strokeWidth={2} fill="none" />
    </Svg>
);
export const ChevronUpIcon = ({ size = 18, color = "#000" }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
            d="M18 15l-6-6-6 6"
            stroke={color}
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export const ChevronDownIcon = ({ size = 18, color = "#000" }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
            d="M6 9l6 6 6-6"
            stroke={color}
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export const TrashIcon = ({ size = 18, color = "#888" }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
            d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"
            stroke={color}
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);
