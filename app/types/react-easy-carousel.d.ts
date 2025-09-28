// types/react-easy-carousel.d.ts
declare module "react-easy-carousel" {
  import * as React from "react";

  export interface CarouselProps {
    active?: number;
    auto?: number;
    animation?: "slide" | "fade";
    animationDuration?: number;
    background?: string;
    dots?: boolean;
    dotColor?: string;
    dotActiveColor?: string;
    dotSize?: number;
    buttons?: React.ReactNode[];
    style?: React.CSSProperties;
    className?: string;
    children?: React.ReactNode;
  }

  const Carousel: React.FC<CarouselProps>;
  export default Carousel;
}
