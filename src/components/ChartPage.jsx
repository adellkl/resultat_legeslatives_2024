import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { Link } from 'react-router-dom';

const ChartPage = () => {
    const [results, setResults] = useState([]);
    const [selectedNuance, setSelectedNuance] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 5; 

    useEffect(() => {
        fetch('/results.json')
            .then(response => response.json())
            .then(data => {
                setResults(data);
            })
            .catch(error => {
                console.error('Error loading data:', error);
            });
    }, []);

    const colorPalette = [
        '#1F77B4', '#FF7F0E', '#2CA02C', '#D62728', '#9467BD', '#8C564B', '#E377C2', '#7F7F7F', '#BCBD22', '#17BECF',
        '#AEC7E8', '#FFBB78', '#98DF8A', '#FF9896', '#C5B0D5', '#C49C94', '#F7B6D2', '#C7C7C7', '#DBDB8D', '#9EDAE5'
    ];

    const getColorForNuance = (nuance) => {
        const index = [...new Set(results.map(result => result.libelleNuance))].indexOf(nuance);
        return colorPalette[index % colorPalette.length];
    };

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

        const candidateCounts = {};
        results.forEach(result => {
            const key = result.libelleNuance;
            if (candidateCounts[key]) {
                candidateCounts[key]++;
            } else {
                candidateCounts[key] = 1;
            }
        });

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

    const handleNuanceChange = (event) => {
        setSelectedNuance(event.target.value);
        setCurrentPage(1);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const filteredCandidates = results.filter(result => 
        (!selectedNuance || result.libelleNuance === selectedNuance) &&
        (result.nomCandidat.toLowerCase().includes(searchTerm.toLowerCase()) || 
         result.prenomCandidat.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const indexOfLastResult = currentPage * resultsPerPage;
    const indexOfFirstResult = indexOfLastResult - resultsPerPage;
    const currentCandidates = filteredCandidates.slice(indexOfFirstResult, indexOfLastResult);

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
        },
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(filteredCandidates.length / resultsPerPage);
    const visiblePages = 5;
    const startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    const endPage = Math.min(totalPages, startPage + visiblePages - 1);

    const pages = [...Array(endPage - startPage + 1)].map((_, i) => startPage + i);

    return (
        <div className="flex h-screen overflow-hidden">
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
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Rechercher un candidat (Nom)"
                        className="p-2 border border-gray-300 rounded mb-4 focus:outline-none bg-white text-gray-800 w-full"
                    />
                    <div className="flex flex-col">
                        <Link to="/" className="p-2 bg-blue-600 text-white rounded mb-2 text-center hover:bg-blue-700 transition duration-300">Home</Link>
                    </div>
                </div>
            </nav>

            <main className="flex-1 p-4 overflow-y-auto">
                <div style={{ height: '500px', width: '900px' }}>
                    <Bar data={prepareBarChartData()} options={barOptions} />
                </div>
                <div className="mt-8" style={{ marginTop: '30px' }}>
                    <h2 className="text-xl font-bold mb-4 ml-6">Candidats pour le parti : {selectedNuance}</h2>
                    <ul>
                        {currentCandidates.map(candidate => (
                            <li key={candidate.id} className="mb-1 ml-6">
                                {candidate.prenomCandidat} {candidate.nomCandidat} ({candidate.civiliteCandidat}) - {candidate.departement}, {candidate.circonscription}
                            </li>
                        ))}
                    </ul>

                    <div className="mt-4 flex justify-center">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            className={`p-2 mx-1 rounded ${currentPage === 1 ? 'bg-gray-700 text-gray-300' : 'bg-blue-600 text-white hover:bg-blue-700 hover:text-white'}`}
                            disabled={currentPage === 1}
                        >
                            Précédent
                        </button>

                        {pages.map((page, index) => (
                            <button
                                key={index}
                                onClick={() => paginate(page)}
                                className={`p-2 mx-1 rounded ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'}`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => paginate(currentPage + 1)}
                            className={`p-2 mx-1 rounded ${currentPage === totalPages ? 'bg-gray-700 text-gray-300' : 'bg-blue-600 text-white hover:bg-blue-700 hover:text-white'}`}
                            disabled={currentPage === totalPages}
                        >
                            Suivant
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ChartPage;
