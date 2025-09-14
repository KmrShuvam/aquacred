// src/app/dashboard/page.tsx
'use client'; // This also runs in the browser

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// This is the "manual" for our smart contract
const contractABI = `[
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "projectId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "projectName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "implementingBody",
				"type": "string"
			}
		],
		"name": "ProjectRegistered",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_projectName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_location",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_implementingBody",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_areaHectares",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_startDate",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_projectType",
				"type": "string"
			}
		],
		"name": "registerProject",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "projectId",
				"type": "uint256"
			}
		],
		"name": "getProject",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "projectId",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "projectName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "location",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "implementingBody",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "areaHectares",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "startDate",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "projectType",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "isInitialized",
						"type": "bool"
					}
				],
				"internalType": "struct AquaCredRegistry.Project",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getProjectCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "projectCounter",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "projects",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "projectId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "projectName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "location",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "implementingBody",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "areaHectares",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "startDate",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "projectType",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "isInitialized",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]`;
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

export default function DashboardPage() {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [projects, setProjects] = useState<any>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // We need to check if window.ethereum is available (i.e., if MetaMask is installed)
      if (typeof window.ethereum!== 'undefined') {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const contract = new ethers.Contract(contractAddress, contractABI, provider);

          const projectCountBigInt = await contract.getProjectCount();
          const projectCount = Number(projectCountBigInt);
          
          const fetchedProjects =[];

          for (let i = 1; i <= projectCount; i++) {
            const project = await contract.getProject(i);
            fetchedProjects.push({
              id: Number(project.projectId),
              name: project.projectName,
              location: project.location,
              hectares: Number(project.areaHectares)
            });
          }
          setProjects(fetchedProjects);
        } catch (error) {
          console.error("Failed to fetch projects:", error);
        } finally {
          setLoading(false);
        }
      } else {
        console.log('MetaMask is not installed!');
        setLoading(false);
      }
    }

    fetchData();
  },);

  if (loading) return <p className="text-center p-10">Loading dashboard data from the blockchain...</p>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900">AquaCred Dashboard</h1>
      <p className="text-gray-600 mb-8">Your Blue Carbon, Verified.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500">Total Projects Registered</h3>
          <p className="text-4xl font-bold text-blue-600">{projects.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500">Total Hectares</h3>
          <p className="text-4xl font-bold text-green-600">{projects.reduce((sum, p) => sum + p.hectares, 0)}</p>
        </div>
        {/* Add other KPI cards here */}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Project Registry</h2>
        <ul>
          {projects.map(project => (
            <li key={project.id} className="border-b py-3">
              <p className="font-bold text-lg">{project.name}</p>
              <p className="text-sm text-gray-500">{project.location} - {project.hectares} Hectares</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}