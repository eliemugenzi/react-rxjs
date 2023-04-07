import React, { useEffect } from "react";
import { from } from "rxjs";
import { map, mergeMap, delay, filter } from "rxjs/operators";

let numbersObservable = from([1, 2, 3, 4, 5]);
let squareNumbers = numbersObservable.pipe(
  filter((val) => val > 2),
  mergeMap((val) => from([val]).pipe(delay(1000 * val))),
  map((val) => val * val)
);

const useObservable = (observable, setter) => {
  useEffect(() => {
    let subscription = observable.subscribe((result) => {
      setter(result);
    });

    return () => subscription.unsubscribe();
  }, [observable, setter]);
};

const Hook = () => {
  const [currentNumber, setCurrentNumber] = React.useState(0);

  useObservable(squareNumbers, setCurrentNumber);

  return (
    <div>
      <p>The current number: {currentNumber}</p>
    </div>
  );
};

export default Hook;
