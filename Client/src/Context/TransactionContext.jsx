import React, {useEffect, useState} from "react";
import {ethers} from "ethers";

import { contractABI, contractAddress } from '../utils/Constants';

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);

    console.log({
        signer,
        provider,
        transactionsContract})
}

export const TransactionProvider =({children})=>{

    const [currentAccount, setCurrentAccount] = useState()


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

     useEffect(() => {
       checkIfWalletIsConnected();
     }, []);
   

    return (
        <TransactionContext.Provider value ={{connectWallet, currentAccount}}>
            {children}
        </TransactionContext.Provider>);
}