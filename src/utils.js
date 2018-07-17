import { Observable, Scheduler } from "rxjs";

const schedular = Scheduler.animationFrame;

export const msElapsedFn$ = (_schedular = Scheduler.animationFrame) =>
  Observable.defer(() => {
    const start = _schedular.now();
    return Observable.interval(0, _schedular).map(
      () => _schedular.now() - start
    );
  });

export const durationTime$ = ms =>
  msElapsedFn$(schedular)
    .takeWhile(t => t <= ms)
    .concat(Observable.of(ms));

export const duration$ = ms =>
  msElapsedFn$(schedular)
    .map(ems => ems / ms)
    .takeWhile(t => t <= 1)
    .concat(Observable.of(1));

export const goal = d => t => d * t;

export const animation$ = ({ ms, tv, easing }) =>
  duration$(ms)
    .map(easing)
    .map(goal(tv));

// require('eases/back-in-out')
// require('eases/back-in')
// require('eases/back-out')
// require('eases/bounce-in-out')
// require('eases/bounce-in')
// require('eases/bounce-out')
// require('eases/circ-in-out')
// require('eases/circ-in')
// require('eases/circ-out')
// require('eases/cubic-in-out')
// require('eases/cubic-in')
// require('eases/cubic-out')
// require('eases/elastic-in-out')
// require('eases/elastic-in')
// require('eases/elastic-out')
// require('eases/expo-in-out')
// require('eases/expo-in')
// require('eases/expo-out')
// require('eases/linear')
// require('eases/quad-in-out')
// require('eases/quad-in')
// require('eases/quad-out')
// require('eases/quart-in-out')
// require('eases/quart-in')
// require('eases/quart-out')
// require('eases/quint-in-out')
// require('eases/quint-in')
// require('eases/quint-out')
// require('eases/sine-in-out')
// require('eases/sine-in')
// require('eases/sine-out')
