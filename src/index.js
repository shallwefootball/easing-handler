import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Observable } from "rxjs/Observable";
import eases from "eases";
import {
  mapPropsStream,
  setObservableConfig,
  createEventHandler,
  compose
} from "recompose";
import rxjsconfig from "recompose/rxjsObservableConfig";
import withAnimationHandler from "./withAnimationHandler";
import { animation$ } from "./utils";

setObservableConfig(rxjsconfig);

const AppearRect = props => {
  const { opacity, show, hide } = props;
  return (
    <div>
      <h1 style={{ opacity }}>change properties! </h1>
      <button onClick={show}>show</button>
      <button onClick={hide}>hide</button>
    </div>
  );
};

const stream = props$ => {
  const show$ = props$.switchMap(({ appear: { stream: $ } }) => $);
  const hide$ = props$.switchMap(({ disappear: { stream: $ } }) => $);

  const appear$ = props$
    .combineLatest(show$, props => props.appear)
    .switchMap(option => animation$(option));

  const disappear$ = props$
    .combineLatest(hide$, props => props.disappear)
    .switchMap(option => animation$(option))
    .map(v => 1 - v);

  const showhide$ = Observable.merge(appear$, disappear$).startWith(0);

  return props$.combineLatest(showhide$, (props, opacity) => {
    const { appear: { handler: show }, disappear: { handler: hide } } = props;
    return { show, hide, opacity };
  });
};

const props = {
  appear: {
    ms: 1400,
    easing: eases["expoIn"],
    tv: 1,
    ...createEventHandler()
  },
  disappear: {
    ms: 1000,
    easing: eases["quadInOut"],
    tv: 1,
    ...createEventHandler()
  }
};

const AppearStreamRect = compose(
  // mapPropsStream(stream)
  withAnimationHandler(props, stream)
)(AppearRect);

const rootElement = document.getElementById("root");
ReactDOM.render(<AppearStreamRect {...props} />, rootElement);
