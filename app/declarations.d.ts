declare module "*.jpg" {
  const value: any;
  export = value;
}
declare module "*.png" {
  const value: any;
  export = value;
}

declare module "*.svg" {
  const value: any;
  export = value;
}

// In built types for some reason don't show beginElement() which is actually present
declare type AnimationElement = SVGAnimationElement & {
  beginElement: () => void;
};
