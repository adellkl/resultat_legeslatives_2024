import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { Link } from 'react-router-dom';

const ChartPage = () => {
    const [results, setResults] = useState([]);
    const [selectedNuance, setSelectedNuance] = useState(''); // État pour le code de nuance sélectionné
    const [searchQuery, setSearchQuery] = useState(''); // État pour la recherche de candidats

    useEffect(() => {
        // Chargement des données depuis results.json (exemple)
        fetch('/results.json')
            .then(response => response.json())
            .then(data => {
                console.log('Data from results.json:', data); // Vérifiez les données reçues
                setResults(data);
            })
            .catch(error => {
                console.error('Error loading data:', error);
            });
    }, []);

    // Couleurs distinctes pour chaque libelleNuance
    const colorPalette = [
        '#1F77B4', '#FF7F0E', '#2CA02C', '#D62728', '#9467BD', '#8C564B', '#E377C2', '#7F7F7F', '#BCBD22', '#17BECF',
        '#AEC7E8', '#FFBB78', '#98DF8A', '#FF9896', '#C5B0D5', '#C49C94', '#F7B6D2', '#C7C7C7', '#DBDB8D', '#9EDAE5'
    ];

    const getColorForNuance = (nuance) => {
        const index = [...new Set(results.map(result => result.libelleNuance))].indexOf(nuance);
        return colorPalette[index % colorPalette.length];
    };

    // Fonction pour préparer les données du graphique en barres par libelleNuance
    const prepareBarChartData = () => {
        if (!results || results.length === 0) {
            return {
                labels: [],
                datasets: [{
                    label: 'Nombre de candidats',
                    data: [],
                    backgroundColor: [],
                }],
            };
        }

        // Calculer le nombre de candidats par libelleNuance
        const candidateCounts = {};
        results.forEach(result => {
            const key = result.libelleNuance;
            if (candidateCounts[key]) {
                candidateCounts[key]++;
            } else {
                candidateCounts[key] = 1;
            }
        });

        // Créer les labels et les données pour le graphique
        const labels = Object.keys(candidateCounts);
        const data = Object.values(candidateCounts);
        const backgroundColors = labels.map(label => getColorForNuance(label));

        return {
            labels: labels,
            datasets: [
                {
                    label: 'Nombre de candidats',
                    data: data,
                    backgroundColor: backgroundColors,
                },
            ],
        };
    };

    // Gérer le changement du code de nuance sélectionné
    const handleNuanceChange = (event) => {
        setSelectedNuance(event.target.value);
        setSearchQuery(''); // Réinitialiser le champ de recherche
    };

    // Gérer le changement de la recherche
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // Filtrer les candidats par libelleNuance sélectionné et recherche
    const filteredCandidates = results.filter(result => {
        const matchesNuance = selectedNuance ? result.libelleNuance === selectedNuance : true;
        const matchesSearch = searchQuery ? `${result.prenomCandidat} ${result.nomCandidat}`.toLowerCase().includes(searchQuery.toLowerCase()) : true;
        return matchesNuance && matchesSearch;
    });

    // Options pour le graphique en barres
    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
        },
    };

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Navbar à gauche pour les filtres */}
            <nav className="w-1/4 bg-gray-800 p-4 overflow-y-auto text-white">
                <h2 className="text-lg font-bold mb-4"> Filtre</h2>
                <div className="mb-4">
                    <select
                        value={selectedNuance}
                        onChange={handleNuanceChange}
                        className="p-2 border border-gray-300 rounded mb-4 focus:outline-none bg-white text-gray-800 w-full"
                    >
                        <option value="">Choisir un parti</option>
                        {results && results.length > 0 && (
                            [...new Set(results.map(result => result.libelleNuance))].map((nuance, index) => (
                                <option key={index} value={nuance}>{nuance}</option>
                            ))
                        )}
                    </select>
                    {selectedNuance && (
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Rechercher un candidat dans le parti"
                            className="p-2 border border-gray-300 rounded mb-4 focus:outline-none bg-white text-gray-800 w-full"
                        />
                    )}
                    <div className="flex flex-col">
                        <Link to="/" className="p-2 bg-blue-600 text-white rounded mb-2 text-center hover:bg-blue-700 transition duration-300">Home</Link>
                    </div>
                </div>
            </nav>

            {/* Contenu principal avec le graphique */}
            <main className="flex-1 p-4 overflow-y-auto">
                <div style={{ height: '500px', width: '900px' }}>
                    <Bar data={prepareBarChartData()} options={barOptions} />
                </div>
                <div className="mt-8" style={{ marginTop: '50px', marginLeft:"50vh" }}>
                    <h2 className="text-xl font-bold mb-4">Candidats pour le parti : {selectedNuance}</h2>
                    <ul>
                        {filteredCandidates.map(candidate => (
                            <li key={candidate.id} className="mb-2">
                                {candidate.prenomCandidat} {candidate.nomCandidat} ({candidate.civiliteCandidat}) - {candidate.departement}, {candidate.circonscription}
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
        </div>
    );
};

export default ChartPage;
