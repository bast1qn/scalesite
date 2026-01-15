import { type SVGProps } from 'react';

export type IconProps = SVGProps<SVGSVGElement> & { className?: string };

export const iconProps = {
  className: "w-6 h-6",
  strokeWidth: 1.5,
};

export const smallIconProps = {
  className: "w-5 h-5",
  strokeWidth: 1.5,
};
