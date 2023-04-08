import React, {useEffect, useState} from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from '../utils/Constants';


export const TransactionContext = React.createContext();



const {ethereum}  = window;
// const getEthereumContract = () => {


// const {ethereum}  = window;

const getEthereumContract = () => {
  if (typeof ethereum === 'undefined' || !ethereum) {
    console.error('Please install and enable MetaMask to access this feature!');
    return;
  }

  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);

  console.log({
    signer,
    provider,
    transactionsContract
  });
};

// const provider = new ethers.providers.Web3Provider(ethereum);
// const signer = provider.getSigner();
// const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);
//  console.log({
//         signer,
//         provider,
//         transactionsContract})

    // try {
    //   const provider = new ethers.providers.Web3Provider(ethereum);
    //   const signer = provider.getSigner();
    //   const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);
    //   return transactionsContract;
    // } catch (error) {
    //   console.error(error);
    //   alert('Error: Please install and enable a web3-enabled wallet such as MetaMask to use this functionality.');
    //   return null;
    // }


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

    // const checkIfTransactionsExist = async() =>{
    //     try {
    //         const transactionsContract =getEthereumContract();
    //     } catch (error) {
            
    //     }
    // }

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
            // console.log(error);
            // throw new Error ("No obects found");
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