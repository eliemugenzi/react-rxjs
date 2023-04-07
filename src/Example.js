import React from "react";
import { BehaviorSubject, from } from "rxjs";
import {
  debounceTime,
  filter,
  distinctUntilChanged,
  mergeMap
} from "rxjs/operators";

const getPokemonByName = async (name) => {
  const { results: allPokens } = await fetch(
    "https://pokeapi.co/api/v2/pokemon/?limit=1000"
  ).then((res) => res.json());

  return allPokens.filter((pokemon) => pokemon.name.includes(name));
};

let searchSubject = new BehaviorSubject("");

let searchResultObservable = searchSubject.pipe(
  filter((val) => val.length > 1),
  debounceTime(750),
  distinctUntilChanged(),
  mergeMap((val) => from(getPokemonByName(val)))
);

const useObservable = (observable, setter) => {
  React.useEffect(() => {
    let subscription = observable.subscribe((result) => {
      setter(result);
    });

    return () => subscription.unsubscribe();
  }, [observable, setter]);
};

const Example = () => {
  const [search, setSearch] = React.useState("");
  const [results, setResults] = React.useState([]);

  useObservable(searchResultObservable, setResults);

  const handleSearchChange = (e) => {
    const { value: newValue } = e.target;
    setSearch(newValue);
    searchSubject.next(newValue);
  };

  return (
    <>
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={handleSearchChange}
      />
      <p>{JSON.stringify(results, null, 2)}</p>
    </>
  );
};

export default Example;
