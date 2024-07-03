import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { Link } from 'react-router-dom';

const ChartPage = () => {
    const [results, setResults] = useState([]);
    const [selectedNuance, setSelectedNuance] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');

    useEffect(() => {

        fetch('/results.json')
            .then(response => response.json())
            .then(data => {
                console.log('Data from results.json:', data);
                setResults(data);
            })
            .catch(error => {
                console.error('Error loading data:', error);
            });
    }, []);


    const getRandomColor = () => {
        const colors = ['#3182CE', '#34D399', '#FBBF24', '#F87171', '#A78BFA', '#6EE7B7', '#F472B6', '#60A5FA', '#FCD34D', '#9CA3AF'];
        return colors[Math.floor(Math.random() * colors.length)];
    };


    const prepareChartData = () => {
        if (!results || results.length === 0) {
            return {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [],
                }],
            };
        }


        let filteredResults = results;
        if (selectedNuance) {
            filteredResults = results.filter(result => result.codeNuance === selectedNuance);
        }
        if (selectedDepartment) {
            filteredResults = filteredResults.filter(result => result.departement === selectedDepartment);
        }


        const voteCounts = {};
        filteredResults.forEach(result => {
            const key = `${result.departement}_${result.codeNuance}`;
            if (voteCounts[key]) {
                voteCounts[key]++;
            } else {
                voteCounts[key] = 1;
            }
        });


        const labels = Object.keys(voteCounts);
        const data = Object.values(voteCounts);
        const backgroundColors = labels.map(() => getRandomColor());

        return {
            labels: labels,
            datasets: [
                {
                    data: data,
                    backgroundColor: backgroundColors,
                    hoverOffset: 4,
                },
            ],
        };
    };


    const handleNuanceChange = (event) => {
        setSelectedNuance(event.target.value);
    };


    const handleDepartmentChange = (event) => {
        setSelectedDepartment(event.target.value);
    };


    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
        },

        elements: {
            arc: {
                borderWidth: 0,
                borderColor: '#ffffff',
            },
        },
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gray-900">

            <nav className="w-1/4 bg-gray-800 p-4 overflow-y-auto text-white ">
                <h2 className="text-lg font-bold mb-4">Filtrer par département et par Partie </h2>
                <div className="mb-4">
                    <select
                        value={selectedNuance}
                        onChange={handleNuanceChange}
                        className="p-2 border border-gray-300 rounded mb-4 focus:outline-none bg-white text-gray-800 w-full"
                    >
                        <option value="">Choisir un partie </option>
                        {results && results.length > 0 && (
                            [...new Set(results.map(result => result.codeNuance))].map((nuance, index) => (
                                <option key={index} value={nuance}>{nuance}</option>
                            ))
                        )}
                    </select>
                    <select
                        value={selectedDepartment}
                        onChange={handleDepartmentChange}
                        className="p-2 border border-gray-300 rounded mb-4 focus:outline-none bg-white text-gray-800 w-full"
                    >
                        <option value="">Choisir un département</option>
                        {results && results.length > 0 && (
                            [...new Set(results.map(result => result.departement))].map((department, index) => (
                                <option key={index} value={department}>{department}</option>
                            ))
                        )}
                    </select>
                    <div className="flex flex-col">
                        <Link to="/" className="p-2 bg-blue-600 text-white rounded mb-2 text-center hover:bg-blue-700 transition duration-300">Home</Link>

                    </div>
                </div>
            </nav>


            <main className="flex-1 p-4 overflow-y-auto">
                <h1 className="text-2xl mb-4 text-white">Répartition des votes par département et par partie "{selectedNuance}"</h1>
                <div className="mb-4">
                    <div style={{ height: '500px', width: '900px' }}>
                        <Pie data={prepareChartData()} options={pieOptions} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ChartPage;
