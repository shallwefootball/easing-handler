import React from "react";
import * as d3 from "d3";
import { Observable } from "rxjs/Observable";
import { setObservableConfig, componentFromStream } from "recompose";
import rxjsconfig from "recompose/rxjsObservableConfig";
import Arrow from "./Arrow";
import { duration$ } from "./utils";
setObservableConfig(rxjsconfig);

const WIDTH = 120;
const HEIGHT = 70;
const GRAPH_WIDTH = WIDTH + 40;
const GRAPH_HEIHGT = HEIGHT + 70;

var x = d3.scaleLinear().range([0, WIDTH]);
var y = d3.scaleLinear().range([HEIGHT, 0]);
const lineRange = d3.range(0, 1, 0.002).concat(1);

export const EasingSvg = ({ t, path, easing, strokeWidth = 1.4 }) => {
  const onlyMenu = t === undefined;
  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIHGT}`}
    >
      <g transform="translate(4, 30)">
        <path
          d={path(lineRange)}
          fill="none"
          stroke="#000"
          strokeWidth={strokeWidth}
        />
        {!onlyMenu && <circle cx={x(t)} cy={y(easing(t))} r={2} />}
        <line
          x1="0"
          y1="0"
          x2={WIDTH}
          y2="0"
          stroke="grey"
          opacity={0.4}
          strokeWidth={1.2}
        />
        <line
          x1="0"
          y1={HEIGHT}
          x2={WIDTH}
          y2={HEIGHT}
          stroke="grey"
          opacity={0.4}
          strokeWidth={1.2}
        />
      </g>
      {!onlyMenu && <Arrow x={WIDTH + 20} y={y(easing(t)) + 22} />}
    </svg>
  );
};

export const path = easing =>
  d3
    .line()
    .x(t => x(t))
    .y(t => y(easing(t)));

export default componentFromStream(props$ => {
  const event$ = props$.switchMap(props => props.stream);
  const t$ = props$
    .combineLatest(event$, ({ ms }) => ms)
    .switchMap(ms => duration$(ms))
    .startWith(0);

  return Observable.combineLatest(props$, t$, (props, t) => {
    const _props = { ...props, t };
    return (
      <EasingSvg {..._props} path={path(props.easing)} easing={props.easing} />
    );
  });
});
