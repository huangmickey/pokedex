import { useGlobalContext } from "@/context/global"
import Router from "next/router";
import { useState } from "react";
import styles from '@/styles/form.module.css';

export default function Home() {
  const { g, allPokemonData, searchResults, getPokemon, loading, realTimeSearch } = useGlobalContext()
  // console.log(allPokemonData);

  const [search, setSearch] = useState("");

  const handleChange = (e) => {
    setSearch(e.target.value);

    realTimeSearch(search);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    realTimeSearch(search);
  };

  const displaySearchResults = () => {
    return searchResults.map((pokemon) => {
      return (
        <div
          key={pokemon.id}
          onClick={() => {
            Router.push(`/pokemon/${pokemon.name}`);
          }}
          className='pokemon_name'
        >
          {pokemon.name}
        </div>
      );
    });
  };

  return (

    <main>
      <img src='/pokedex.png'></img>
      <form action="" className={styles.search_form} onSubmit={handleSearch}>
        <div className={styles.input_control}>
          <input
            type="text"
            value={search}
            onChange={handleChange}
            placeholder="Search for a Pokemon..."
          />
          <button className={styles.submit_btn} type="submit">
            Search
          </button>
        </div>
      </form>

      {search && searchResults.length > 0 && <div className={styles.search_results}>{displaySearchResults()}</div>}

      <div className="pokemon-grid">
        {allPokemonData ? (allPokemonData.map((pokemon) => {
          return (
            <div key={pokemon.id} className="pokemon-card" onClick={() => {
              Router.push(`/pokemon/${pokemon.name}`);
            }}
            >
              <div className="pokemon-card-image">
                <img
                  src={pokemon.sprites.other.home.front_shiny}
                  alt={pokemon.name}>
                </img>
              </div>
              <div className="pokemon-card-body">
                <h3>{pokemon.name}</h3>
                <p>More Details &nbsp; &rarr;</p>
              </div>
            </div>
          );
        })
        ) : (
          <h1>Loading...</h1>
        )}
      </div>
    </main>
  );
}
