from flask import Flask, jsonify, request
from flask_cors import CORS
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import random
import requests

app = Flask(__name__)
CORS(app)  # Enable CORS for communication with React

# Database setup
engine = create_engine("sqlite:///pokemon.db")
Base = declarative_base()

class Pokemon(Base):
    __tablename__ = "pokemon"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    image = Column(String, nullable=False)

Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()

# Fetch a random Pokémon
@app.route("/get-random-pokemon", methods=["GET"])
def get_random_pokemon():
    pokemon_id = random.randint(1, 1010)  # PokéAPI supports IDs up to 1010
    response = requests.get(f"https://pokeapi.co/api/v2/pokemon/{pokemon_id}")
    data = response.json()
    name = data["name"]
    image = data["sprites"]["other"]["official-artwork"]["front_default"]
    return jsonify({"name": name, "image": image})

# Save Pokémon to the database
@app.route("/save-pokemon", methods=["POST"])
def save_pokemon():
    data = request.json
    new_pokemon = Pokemon(name=data["name"], image=data["image"])
    session.add(new_pokemon)
    session.commit()
    return jsonify({"message": "Pokemon saved successfully!"})

# Get Pokémon library
@app.route("/get-library", methods=["GET"])
def get_library():
    pokemon_list = session.query(Pokemon).all()
    return jsonify([{"name": p.name, "image": p.image} for p in pokemon_list])

@app.route('/get-total-pokemon', methods=['GET'])
def get_total_pokemon():
    # Query the database to count the total number of Pokémon
    total_pokemon = session.query(Pokemon).count()
    return jsonify({"total_pokemon": total_pokemon})


if __name__ == "__main__":
    app.run(debug=True)
