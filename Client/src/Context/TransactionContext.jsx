import React, {useEffect, useState} from "react";
import {ethers} from "ethers";

import { contractABI, contractAddress } from '../utils/Constants';


export const TransactionContext = React.createContext();

const {ethereum}  = window;

// const getEthereumContract = () => {
    
//     // if (typeof ethereum !== 'undefined') {
//     //     // const provider = new ethers.providers.Web3Provider(ethereum);
//     //     // Your code for provider and signer
//     //     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     //     const signer = provider.getSigner();
//     //   } else {
//     //     console.log('Web3Provider not available. Please install and enable a web3-enabled wallet such as MetaMask.');
//     //   }
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const signer = provider.getSigner();
//     const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);

const getEthereumContract = () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);
      return transactionsContract;
    } catch (error) {
      console.error(error);
      alert('Error: Please install and enable a web3-enabled wallet such as MetaMask to use this functionality.');
      return null;
    }

   
    console.log({
        signer,
        provider,
        transactionsContract})
}

export const TransactionProvider =({children})=>{

    const [currentAccount, setCurrentAccount] = useState('');
    const [formData, setFormData] = useState ({addressTo: '', amount: '', keywod: '', message: ''});

    const handleChange = (e, name) =>{
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
    }


     const checkIfWalletIsConnected = async () => {
    try {
        if(!ethereum) return alert ("Please install metamask");

        const accounts = await ethereum.request( {method: 'eth_accounts'});

        if(accounts.length) {
            setCurrentAccount(accounts[0]);
        
        // getAllTransactions(0;)
        }
        else {
            console.log ('No accounts found');
        }  
    } catch (error) {
        console.log(error);
            const errorMessage = error.message || "Could not connect to wallet. Please try again later.";
            alert(errorMessage);
        
    }   
        }

    const connectWallet = async() =>  {

        try {

            if(!ethereum) return alert ("Please install metamask");

            const accounts = await ethereum.request( {method: 'eth_requestAccounts'});

            setCurrentAccount(accounts[0]);     
        } catch (error) {
            // console.log(error);

            // throw new Error("No Ethereum object.");

            console.log(error);
            const errorMessage = error.message || "Could not connect to wallet. Please try again later.";
            alert(errorMessage);

        }

    }

    const sendTransaction = async () => {
        try {
            if(!ethereum) return alert ("Please install metamask");

            const { addressTo, amount, keyword, message} = formData;
            getEthereumContract();

        } catch (error) {
            console.log(error);
            const errorMessage = error.message || "Could not connect to wallet. Please try again later.";
            alert(errorMessage); 
        }
    };

    

     useEffect(() => {
       checkIfWalletIsConnected();
     }, []);
   

    return (
        <TransactionContext.Provider value ={{connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction}}>
            {children}
        </TransactionContext.Provider>);
}