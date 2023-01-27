
export interface BreakpointObject {
  [breakpoint: string]: number;
}

export interface MediaqueryObject {
  [breakpoint: string]: string;
}

export interface ActiveBreakpointObject {
  [breakpoint: string]: boolean | null;
}

export interface PointbreakConfig {
  breakpoints: BreakpointObject;
  inclusive: boolean;
}
