import { debounce } from "lodash";
import React, { createContext, useContext, useReducer, useEffect, useState } from "react"

const GlobalContext = createContext()

//actions
const LOADING = 'LOADING';
const GET_POKEMON = 'GET_POKEMON';
const GET_ALL_POKEMON = 'GET_ALL_POKEMON';
const GET_SEARCH = 'GET_SEARCH';
const GET_POKEMON_DATABASE = 'GET_POKEMON_DATABASE';
const NEXT = '';

//reducer
const reducer = (state, action) => {
  const type = action.type;
  if (type === 'LOADING') {
    return { ...state, loading: true };
  } else if (type === 'GET_ALL_POKEMON') {
    return { ...state, allPokemon: action.payload, loading: false };
  } else if (type === 'GET_POKEMON') {
    return { ...state, pokemon: action.payload, loading: false };
  } else if (type === 'GET_POKEMON_DATABASE') {
    return { ...state, pokemonDatabase: action.payload, loading: false };
  } else if (type === 'GET_SEARCH') {
    return { ...state, searchResults: action.payload, loading: false };
  }
}

export const GlobalProvider = ({ children }) => {

  const baseUrl = 'https://pokeapi.co/api/v2/'

  const initialState = {
    allPokemon: [],
    pokemon: {},
    pokemonDatabase: [],
    searchResults: [],
    next: "",
    loading: false,
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const [allPokemonData, setAllPokemonData] = useState([]);

  const allPokemon = async () => {
    dispatch({ type: "LOADING" });
    const res = await fetch(`${baseUrl}pokemon?limit=20`);
    const data = await res.json();

    // console.log(data.results);
    dispatch({ type: 'GET_ALL_POKEMON', payload: data.results })

    // fetch pokemon character data
    const allPokemonData = [];

    for (const pokemon of data.results) {
      const pokemonRes = await fetch(pokemon.url);
      const pokemonData = await pokemonRes.json();
      allPokemonData.push(pokemonData);
      // console.log(pokemon.name, pokemonData);
    }

    setAllPokemonData(allPokemonData);
  };

  const getPokemon = async (name) => {
    dispatch({ type: 'LOADING' });
    const res = await fetch(`${baseUrl}pokemon/${name}`);
    const data = await res.json();

    dispatch({ type: 'GET_POKEMON', payload: data })
  };

  const getPokemonDatabase = async () => {
    dispatch({ type: 'LOADING' });

    const res = await fetch(`${baseUrl}pokemon?limit=100000&offset=0`);
    const data = await res.json();

    dispatch({ type: "GET_POKEMON_DATABASE", payload: data.results })
  };

  // real time search with lodash debounce
  const realTimeSearch = debounce(async (search) => {
    dispatch({ type: 'LOADING' });
    // search database for pokemon
    const res = state.pokemonDatabase.filter((pokemon) => {
      return pokemon.name.includes(search.toLowerCase());
    });

    dispatch({ type: 'GET_SEARCH', payload: res })
  }, 500);

  useEffect(() => {
    getPokemonDatabase();
    allPokemon();
  }, [])

  return (
    <GlobalContext.Provider value={{
      ...state,
      allPokemonData,
      getPokemon,
      realTimeSearch,
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
}