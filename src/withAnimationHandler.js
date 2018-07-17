import React, { Component, createElement } from "react";
import { mapPropsStream } from "recompose";
import _ from "lodash";
import eases from "eases";
import Handler from "./Handler";

export default (initProps, stream) => BaseComponent => {
  return class extends Component {
    state = { ...initProps };
    render() {
      const { props, state } = this;
      return (
        <div>
          {createElement(mapPropsStream(stream)(BaseComponent), {
            ...props,
            ...state
          })}
          <div style={{ position: "fixed", bottom: 0, right: 0 }}>
            {_.map(props, (animation, name) => {
              return (
                <Handler
                  {...props[name]}
                  {...state[name]}
                  name={name}
                  click={fire =>
                    this.setState({ [name]: { ...state[name], fire } })
                  }
                  slide={ms =>
                    this.setState({ [name]: { ...state[name], ms } })
                  }
                  select={easingName => {
                    console.log(
                      "eases[easingName]",
                      eases[easingName],
                      easingName,
                      eases
                    );
                    this.setState({
                      [name]: { ...state[name], easing: eases[easingName] }
                    });
                  }}
                  change={tv => this.setState({ tv })}
                />
              );
            })}
          </div>
        </div>
      );
    }
  };
};
