import React, { Component, createElement } from "react";
import _ from "lodash";
import eases from "eases";
import Handler from "./Handler";

const cloneState = (animations, name, value) => {
  return {
    animations: {
      ...animations,
      [name]: {
        ...animations[name],
        ...value
      }
    }
  };
};

export default BaseComponent => {
  return class extends Component {
    state = { animations: this.props.animations };
    render() {
      const {
        props,
        state: { animations }
      } = this;
      return (
        <div>
          {createElement(BaseComponent, {
            ...props,
            animations
          })}
          <div style={{ position: "fixed", bottom: 0, right: 0 }}>
            {_.map(animations, (animation, name) => {
              return (
                <Handler
                  {...animation}
                  name={name}
                  slide={ms =>
                    this.setState(cloneState(animations, name, { ms }))
                  }
                  select={easingName => {
                    this.setState(
                      cloneState(animations, name, {
                        easing: eases[easingName]
                      })
                    );
                  }}
                  change={tv =>
                    this.setState(cloneState(animations, name, { tv }))
                  }
                />
              );
            })}
          </div>
        </div>
      );
    }
  };
};
