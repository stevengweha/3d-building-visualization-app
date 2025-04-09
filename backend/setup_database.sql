-- Création de la base de données
CREATE DATABASE geo_visualization;

-- Connexion à la base de données
\c geo_visualization;

-- Création de la table buildings
CREATE TABLE buildings (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    dpe VARCHAR(10),
    energy_consumption DOUBLE PRECISION,
    co2_emissions DOUBLE PRECISION
);

-- Insertion de données d'exemple
INSERT INTO buildings (name, latitude, longitude, dpe, energy_consumption, co2_emissions)
VALUES
    ('Building A', 48.8566, 2.3522, 'A', 120.5, 30.2),
    ('Building B', 45.7640, 4.8357, 'C', 200.0, 50.0);