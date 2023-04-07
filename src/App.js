import React from "react";
import { from } from "rxjs";
import { map, filter, delay, mergeMap } from "rxjs/operators";
import "./styles.css";
import Hook from "./Hook";
import Example from "./Example";

let numbersObservable = from([1, 2, 3, 4, 5]);
let squareNumbers = numbersObservable.pipe(
  filter((val) => val > 2),
  mergeMap((val) => from([val]).pipe(delay(1000 * val))),
  map((val) => val * val)
);
export default class App extends React.Component {
  constructor() {
    super();
    this.state = { currentNumber: 0 };
  }

  componentDidMount() {
    this.subscription = squareNumbers.subscribe((result) => {
      this.setState({
        currentNumber: result
      });
    });
  }
  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  render() {
    return (
      <div className="App">
        <p>Current Number: {this.state.currentNumber}</p>
        <Hook />
        <Example />
      </div>
    );
  }
}
