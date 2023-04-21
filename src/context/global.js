import React, { createContext, useContext, useReducer, useEffect, useState } from "react"

const GlobalContext = createContext()

//actions
const LOADING = 'LOADING';
const GET_POKEMON = 'GET_POKEMON';
const GET_ALL_POKEMON = 'GET_ALL_POKEMON';
const GET_ALL_POKEMON_DATA = '';
const GET_SEARCH = '';
const GET_POKEMON_DATABASE = '';
const NEXT = '';

//reducer
const reducer = (state, action) => {
  const type = action.type;
  if (type === 'LOADING') {
    return { ...state, loading: true };
  } else if (type === 'GET_ALL_POKEMON') {
    return { ...state, allPokemon: action.payload, loading: false };
  }
}

export const GlobalProvider = ({ children }) => {

  const baseUrl = 'https://pokeapi.co/api/v2/'

  const initialState = {
    allPokemon: [],
    pokemon: {},
    pokemonDataBase: [],
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
  }

  useEffect(() => {
    allPokemon();
  }, [])

  return (
    <GlobalContext.Provider value={{
      ...state,
      allPokemonData,
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
}