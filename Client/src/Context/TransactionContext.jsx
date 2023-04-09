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

    return transactionsContract;
}
//   console.log({
//     signer,
//     provider,
//     transactionsContract
//   });
;

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
    const [isLoading, setIsLoading] =useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));
    const [transactions, setTransactions] = useState([])

    const handleChange = (e, name) =>{
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
    }

    const getAllTransaction = async() => {
        try {
            if(!ethereum) return alert ("Please install metamask");
            const transactionsContract =getEthereumContract();
            const availableTransactions= await transactionsContract.getAllTransaction();

            // console.log(availableTransactions);

            const structuredTransactions = availableTransactions.map((transaction) => ({
                addressTo: transaction.receiver,
                addressFrom: transaction.sender,
                timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
                message: transaction.message,
                keyword: transaction.keyword,
                amount:parseInt(transaction.amount._hex) / (10 ** 18)
            }))
            console.log(structuredTransactions)
            
            setTransactions(structuredTransactions);

            

        } catch (error) {
            console.log(error);
            const errorMessage = error.message || "Could not  connect to wallet. Please try again later.";
            alert(errorMessage);
        }
    }


    const checkIfWalletIsConnected = async () => {
    try {
        if(!ethereum) return alert ("Please install metamask");

        const accounts = await ethereum.request( {method: 'eth_accounts'});

        if(accounts.length) {
            setCurrentAccount(accounts[0]);
        
        getAllTransaction()
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

    const checkIfTransactionsExist = async() =>{
        try {
            const transactionsContract = getEthereumContract();
            const transactionCount = await transactionsContract.getTransactionCount();

            window.localStorage.setItem("transactionCount", transactionCount);
        } catch (error) {
            console.log(error);

            throw new Error("No Ethereum object.");
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
            const transactionsContract = getEthereumContract();
            const parsedAmount = ethers.utils.parseEther(amount);

            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas:'0x5208', //21000 GWEI
                    value: parsedAmount._hex
                }
                ]
            });

            const transactionHash = await transactionsContract.addToBlockchain(addressTo, parsedAmount, message, keyword); 
            
            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait();
            setIsLoading(false);
            console.log(`Success - ${transactionHash.hash}`);

            const transactionCount = await transactionsContract.getTransactionCount();

            setTransactionCount(transactionCount.toNumber())


        } catch (error) {
            // console.log(error);
            // throw new Error ("No obects found");
            const errorMessage = error.message || "Could not connect to wallet. Please try again later.";
            alert(errorMessage); 
        }
    };

    

     useEffect(() => {
       checkIfWalletIsConnected();
       checkIfTransactionsExist();
     }, []);
   

    return (
        <TransactionContext.Provider value ={{connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction, transactions, isLoading}}>
            {children}
        </TransactionContext.Provider>);
}