// src/app/api/submit-project/route.ts

import { NextRequest, NextResponse } from 'next/server';
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

export async function POST(request: NextRequest) {
  try {
    // --- 1. Get the data from the mobile app's form ---
    const data = await request.formData();
    const projectName = data.get('projectName') as string;
    const location = data.get('location') as string;
    const implementingBody = data.get('implementingBody') as string;
    const areaHectares = Number(data.get('areaHectares'));
    const startDate = data.get('startDate') as string;
    const projectType = data.get('projectType') as string;

    // Convert date to a Unix timestamp (seconds)
    const startDateTimestamp = Math.floor(new Date(startDate).getTime() / 1000);

    // --- 2. Connect to the Blockchain ---
    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const wallet = new ethers.Wallet(process.env.OWNER_PRIVATE_KEY!, provider);
    const contract = new ethers.Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!, contractABI, wallet);

    // --- 3. Call the Smart Contract to Register the Project ---
    const tx = await contract.registerProject(
      projectName,
      location,
      implementingBody,
      areaHectares,
      startDateTimestamp,
      projectType
    );

    // Wait for the transaction to be confirmed on the blockchain
    await tx.wait();

    // --- 4. Send a Success Response Back ---
    return NextResponse.json({
      status: 'success',
      message: 'Project registered successfully on the blockchain!',
      transactionHash: tx.hash,
    });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}