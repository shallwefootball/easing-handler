import React from "react";
import _ from "lodash";
import { Observable } from "rxjs/Observable";
import Slider from "@material-ui/lab/Slider";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ListItemText from "@material-ui/core/ListItemText";
import eases from "eases";
import {
  compose,
  mapPropsStream,
  createEventHandler,
  withStateHandlers,
  lifecycle
} from "recompose";
import Easing, { EasingSvg, path } from "./Easing";
import { animation$ } from "./utils";

console.log("eases", eases);

const Handler = props => {
  const {
    slide,
    select,
    change,
    ms,
    easing,
    tv,
    name,
    handleToggle,
    toggle,
    setRef,
    opacity,
    height,
    done
  } = props;
  // console.log("easing", easing);
  return (
    <Paper
      style={{
        position: "relative",
        display: "inline-block",
        padding: 10,
        width: 200,
        margin: "10px"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <Typography variant="subheading">{name}</Typography>
        <IconButton onClick={() => handleToggle(!toggle)}>
          {" "}
          {toggle ? "👆" : "👇"}{" "}
        </IconButton>
      </div>
      <div
        ref={ref => setRef(ref)}
        style={{
          height,
          opacity,
          position: done ? "relative" : "absolute",
          zIndex: height === 0 ? -1 : 1
        }}
      >
        <Typography>easing</Typography>
        <Select
          style={{ width: "100%" }}
          value={easing.name}
          onChange={e => select(e.target.value)}
          renderValue={str => str}
        >
          {_.map(eases, (f, name) => {
            return (
              <MenuItem value={name}>
                <span style={{ width: 20, height: 20 }}>
                  <EasingSvg path={path(f)} easing={f} strokeWidth={5} />
                </span>
                <ListItemText>{name}</ListItemText>
              </MenuItem>
            );
          })}
        </Select>
        <br />
        <br />
        <br />
        <div>
          <Typography>
            duration <strong>{ms}</strong> ms
          </Typography>
          <Slider
            value={ms}
            max={5000}
            aria-labelledby="label"
            onChange={(e, v) => slide(v)}
          />
        </div>
        <br />
        <TextField
          value={tv}
          onChange={e => change(e.target.value)}
          label="target value"
          fullWidth={true}
          defaultValue={0}
        />
      </div>
      <Easing {...props} />
    </Paper>
  );
};

export default compose(
  withStateHandlers(
    () => ({ handlerRef: null, handlerHeight: 0, done: false }),
    {
      setRef: () => ref => {
        return { handlerRef: ref };
      },
      getRef: state => () => {
        return { handlerHeight: state.handlerRef.offsetHeight, done: true };
      }
    }
  ),
  mapPropsStream(props$ => {
    const { handler: handleToggle, stream: toggle$ } = createEventHandler();
    const showOpacity$ = animation$({
      tv: 1,
      ms: 400,
      easing: eases["expoIn"]
    });
    const hideOpacity$ = animation$({
      tv: 1,
      ms: 100,
      easing: eases["quadInOut"]
    });
    const heightAnimation$ = height =>
      animation$({ tv: height, ms: 300, easing: eases["quadInOut"] });

    const calHeightProps$ = props$.take(2);
    const opacity$ = toggle$
      .combineLatest(calHeightProps$, toggle => {
        return toggle;
      })
      .switchMap(toggle => {
        return toggle ? showOpacity$ : hideOpacity$.map(v => 1 - v);
      })
      .startWith(0);

    const calHeight$ = calHeightProps$
      .combineLatest(toggle$, (props, toggle) => {
        return { toggle, height: props.handlerHeight };
      })
      .switchMap(({ toggle, height }) => {
        return toggle
          ? heightAnimation$(height)
          : heightAnimation$(height).map(v => {
              return height - v;
            });
      })
      .startWith("0");

    const [cal$, noneCal$] = calHeightProps$.partition(props => {
      return props.done;
    });
    const initHeight$ = Observable.merge(cal$.mapTo(0), noneCal$.mapTo("100%"));

    const height$ = Observable.merge(initHeight$, calHeight$);

    return props$.combineLatest(
      toggle$.startWith(false),
      opacity$,
      height$,
      (props, toggle, opacity, height) => {
        return { ...props, toggle, opacity, height, handleToggle };
      }
    );
  }),
  lifecycle({
    componentDidMount() {
      this.props.getRef();
    }
  })
)(Handler);
