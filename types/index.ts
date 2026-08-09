import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface Track {
  name: string;
  artists: string;
  album: string;
  albumImageUrl: string;
  progress_ms: number;
  duration_ms: number;
  url: string;
  is_playing: boolean;
}
