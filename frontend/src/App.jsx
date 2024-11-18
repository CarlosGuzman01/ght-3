import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
    const [pokemon, setPokemon] = useState(null);
    const [library, setLibrary] = useState([]);
    const [totalPokemon, setTotalPokemon] = useState(0);

    // Fetch library
    useEffect(() => {
        axios.get("http://localhost:5000/get-library")
            .then((response) => setLibrary(response.data))
            .catch((error) => console.error("Error fetching library:", error));

            axios.get("http://localhost:5000/get-total-pokemon")
            .then((response) => setTotalPokemon(response.data.total_pokemon))
            .catch((error) => console.error("Error fetching total Pokémon:", error));

           

        }, []);



    // Get random Pokémon
    const getRandomPokemon = () => {
        axios.get("http://localhost:5000/get-random-pokemon")
            .then((response) => setPokemon(response.data))
            .catch((error) => console.error("Error fetching Pokémon:", error));
    };

    // Save Pokémon to the library
    const savePokemon = () => {
        if (pokemon) {
            axios.post("http://localhost:5000/save-pokemon", pokemon)
                .then(() => {
                    setLibrary((prevLibrary) => [...prevLibrary, pokemon]);
                    setPokemon(null);

                    axios.get("http://localhost:5000/get-total-pokemon")
                    .then((response) => setTotalPokemon(response.data.total_pokemon))
                    .catch((error) => console.error("Error fetching total Pokémon:", error));

                })
                .catch((error) => console.error("Error saving Pokémon:", error));
        }

       
    };

    return (
        <div>

            <h2>Total:</h2>
            <h2>{totalPokemon}</h2>
          
            <button onClick={getRandomPokemon}>Get Random Pokémon</button>
            {pokemon && (
                <div>
                    <h2>{pokemon.name}</h2>
                    <img src={pokemon.image} alt={pokemon.name} />
                    <button onClick={savePokemon}>Save Pokémon</button>
                </div>
            )}
            
            <h2>Library</h2>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
                {library.map((p, index) => (
                    <div key={index} style={{ margin: "10px", textAlign: "center" }}>
                        <img src={p.image} alt={p.name} style={{ width: "100px" }} />
                        <p>{p.name}</p>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default App;
