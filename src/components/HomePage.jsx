import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const [results, setResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTerm, setSelectedTerm] = useState('');
    const [definitions, setDefinitions] = useState([]);
    const resultsPerPage = 9;
    const pagesToShow = 10;

    useEffect(() => {
        fetch('/results.json')
            .then(response => response.json())
            .then(data => setResults(data));
    }, []);

    useEffect(() => {
        // Exemple de définitions pour les termes politiques
        const politicsTerms = [
            { term: 'Parti politique', definition: 'Un parti politique est une organisation politique qui a pour but de participer au processus politique en proposant des programmes et en présentant des candidats lors des élections.' },
            { term: 'Circonscription électorale', definition: 'Une circonscription électorale est une division géographique utilisée pour l\'élection de représentants politiques dans un système électoral.' },
            { term: 'Triangulaire', definition: 'Dans le contexte politique électoral en France, une triangulaire se produit lorsqu\'il y a trois candidats ou plus ayant chacun une chance de l\'emporter dans une élection.' },
            { term: 'Mandat', definition: 'Un mandat politique désigne la période pendant laquelle un individu élu occupe une fonction publique, généralement pour représenter une circonscription ou un territoire donné.' },
            { term: 'Député', definition: 'Un député est un représentant élu au parlement d\'un pays, chargé de représenter les citoyens de sa circonscription et de participer à l\'élaboration des lois.' },
            { term: 'Sénateur', definition: 'Un sénateur est un membre du Sénat, la chambre haute du parlement dans certains systèmes politiques, chargé de représenter les intérêts des États, provinces ou régions.' },
        ];

        // Initialiser les définitions avec tous les termes au début
        setDefinitions(politicsTerms);
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleDepartmentChange = (event) => {
        setSelectedDepartment(event.target.value);
        setCurrentPage(1);
    };

    const handleTermChange = (event) => {
        const selectedTerm = event.target.value;
        setSelectedTerm(selectedTerm);

        // Trouver la définition du terme sélectionné
        const foundDefinition = definitions.find(def => def.term === selectedTerm);

        // Mettre à jour les définitions trouvées
        setDefinitions(foundDefinition ? [foundDefinition] : []);
    };

    const filteredResults = results.filter(result =>
        result.nomCandidat.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedDepartment === '' || result.departement === selectedDepartment)
    );

    const indexOfLastResult = currentPage * resultsPerPage;
    const indexOfFirstResult = indexOfLastResult - resultsPerPage;
    const currentResults = filteredResults.slice(indexOfFirstResult, indexOfLastResult);

    const departments = results.reduce((acc, curr) => {
        if (!acc.includes(curr.departement)) {
            acc.push(curr.departement);
        }
        return acc;
    }, []);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(filteredResults.length / resultsPerPage);
    const visiblePages = Math.min(pagesToShow, totalPages);
    const startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    const endPage = Math.min(totalPages, startPage + visiblePages - 1);

    const pages = [...Array(endPage - startPage + 1)].map((_, i) => startPage + i);

    return (
        <div className="flex h-screen bg-gray-900 text-white">
            <nav className="w-1/4 bg-gray-800 p-4 overflow-y-auto">
                <h1 className="text-2xl mb-4">Résultats des législatives 2024</h1>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Rechercher par nom"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="p-2 w-full bg-gray-700 text-white border border-gray-600 rounded focus:outline-none"
                    />
                </div>
                <div className="mb-4">
                    <select
                        value={selectedDepartment}
                        onChange={handleDepartmentChange}
                        className="p-2 w-full bg-gray-700 text-white border border-gray-600 rounded focus:outline-none"
                    >
                        <option value="">Tous les départements</option>
                        {departments.map((department, index) => (
                            <option key={index} value={department}>{department}</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col">
                    <Link to="/chart" className="p-2 bg-blue-600 text-white rounded mb-2 text-center hover:bg-blue-700 transition duration-300">Voir Data Graphique</Link>
                </div> <br></br>
                <div className="mb-4">
                    <select
                        value={selectedTerm}
                        onChange={handleTermChange}
                        className="p-2 w-full bg-gray-700 text-white border border-gray-600 rounded focus:outline-none"
                    >
                        <option value="">Choisir un terme politique</option>
                        {definitions.map((def, index) => (
                            <option key={index} value={def.term}>{def.term}</option>
                        ))}
                    </select>
                    <ul className="mt-2">
                        {definitions.map((def, index) => (
                            <li key={index} className="mb-1">
                                <strong>{def.term}: </strong>{def.definition}
                            </li>
                        ))}
                    </ul>
                </div>
               
            </nav>

            <div className="flex-1 overflow-y-auto bg-gray-900 p-4">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {currentResults.map((result, index) => (
                            <div key={index} className="p-4 border rounded shadow bg-gray-800 text-white">
                                <h2 className="text-xl font-bold">{result.nomCandidat} {result.prenomCandidat}</h2>
                                <p><strong>Département:</strong> {result.departement}</p>
                                <p><strong>Circonscription:</strong> {result.circonscription}</p>
                                <p><strong>Numéro de Panneau:</strong> {result.numPanneau}</p>
                                <p><strong>Civilité:</strong> {result.civiliteCandidat}</p>
                                <p><strong>Code Nuance:</strong> {result.codeNuance}</p>
                                <p><strong>Libellé Nuance:</strong> {result.libelleNuance}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex justify-center">
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
            </div>
        </div>
    );
};

export default HomePage;
