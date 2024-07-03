import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const [results, setResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');

    useEffect(() => {
        fetch('/results.json')
            .then(response => response.json())
            .then(data => setResults(data));
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleDepartmentChange = (event) => {
        setSelectedDepartment(event.target.value);
    };

    const filteredResults = results.filter(result =>
        result.nomCandidat.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedDepartment === '' || result.departement === selectedDepartment)
    );

    const departments = results.reduce((acc, curr) => {
        if (!acc.includes(curr.departement)) {
            acc.push(curr.departement);
        }
        return acc;
    }, []);

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
                    <Link to="/" className="p-2 bg-blue-600 text-white rounded mb-2 text-center hover:bg-blue-700 transition duration-300">Home</Link>
                    <Link to="/chart" className="p-2 bg-blue-600 text-white rounded mb-2 text-center hover:bg-blue-700 transition duration-300">Voir le Graphique</Link>
                </div>
            </nav>


            <div className="flex-1 overflow-y-auto bg-gray-900 p-4">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredResults.map((result, index) => (
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
                </div>
            </div>
        </div>
    );
};

export default HomePage;
