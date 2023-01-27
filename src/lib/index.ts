import json2mq from 'json2mq';
import { inject, reactive } from 'vue';
import type { App } from 'vue';
import type { QueryObject } from 'json2mq';
import type {
  MediaqueryObject,
  PointbreakConfig,
  BreakpointObject,
  ActiveBreakpointObject,
} from './types';

export const TAILWIND_BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
};

const pointbreak = 'pointbreak';

// Symbol as InjectionKey does not play well with options api inject array syntax,
// Leaving here to remind myself to create an issue with Vue
// export const pointbreak = Symbol('pointbreak') as InjectionKey<ActiveBreakpointObject>;

const convertBreakpointsToMediaQueries = (
  breakpoints: BreakpointObject,
  inclusive: boolean = false,
) => {
  /*
   *  javascript media queries look quite similar to css
   *  this reduce creates these media queries with the min being the breakpoint
   *
   *  if setting inclusive to false, the media queries will be created with max and min values:
   *  min would be the breakpoint value in the lookup, and max would be the next breakpoint - 1
   *  i.e. (min-width: 640px) and (max-width: 767px)
   */
  const mediaQueries = Object.entries(breakpoints).reduce(
    (
      convertedBreakpoints: MediaqueryObject,
      [key, value],
      idx: number,
      breakpointArray,
    ) => {
      const options: QueryObject = {
        minWidth: value,
      };

      if (!inclusive) {
        const nextBreakpoint = breakpointArray.at(idx + 1);
        if (nextBreakpoint) options.maxWidth = nextBreakpoint[1] - 1;
      }

      const mediaQuery = json2mq(options);
      convertedBreakpoints[key] = mediaQuery;
      return convertedBreakpoints;
    },
    {},
  );
  return mediaQueries;
};

const installFunction = (
  app: App,
  { breakpoints, inclusive }: PointbreakConfig = {
    breakpoints: TAILWIND_BREAKPOINTS,
    inclusive: true,
  },
) => {
  let initialized = false;
  app.config.unwrapInjectedRef = true;

  const initialBreakpoints = Object.keys(breakpoints).reduce(
    (acc: ActiveBreakpointObject, curr) => {
      acc[curr] = false;
      return acc;
    },
    {},
  );

  const breakpointLookup: ActiveBreakpointObject = reactive(initialBreakpoints);

  app.provide(pointbreak, breakpointLookup);

  if (!initialized) {
    const mediaQueries = convertBreakpointsToMediaQueries(
      breakpoints,
      inclusive,
    );
    Object.entries(mediaQueries).forEach(([breakpoint, mediaQuery]) => {
      const mqCallback = (event: MediaQueryListEvent | MediaQueryList) => {
        breakpointLookup[breakpoint] = event.matches;
      };
      const mq: MediaQueryList = window.matchMedia(mediaQuery);
      mq.addEventListener('change', mqCallback);

      mqCallback(mq);
    });
    initialized = true;
  }
};

export default installFunction;

export const usePointbreak = (): ActiveBreakpointObject => inject(pointbreak, {});
