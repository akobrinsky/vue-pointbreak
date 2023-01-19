export interface BreakpointObject {
  [breakpoint: string]: number;
}

export interface MediaqueryObject {
  [breakpoint: string]: string;
}

export interface ActiveBreakpointObject {
  active?: string
  [breakpoint: string]: boolean | string | undefined;
}

export interface PointbreakConfig {
  breakpoints: BreakpointObject;
  inclusive: boolean;
}
