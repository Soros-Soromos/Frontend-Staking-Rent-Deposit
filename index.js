import {ethers} from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";

//var contractAddress;
//var connected = false;
//var released = false;

const connectButton = document.getElementById("connectButton");
connectButton.onclick = connect;

const balanceButton = document.getElementById("balanceButton");
balanceButton.onclick = getBalance;

const payButton = document.getElementById("payButton");
payButton.onclick = pay;

const withdrawButton = document.getElementById("withdrawButton");
withdrawButton.onclick = withdraw;

//const contractAddress = document.getElementById("AdressInput");

async function connect() {
    if (typeof window.ethereum !== "undefined") {
      try {
        await ethereum.request({ method: "eth_requestAccounts" })
      } catch (error) {
        console.log(error)
      }
      connectButton.innerHTML = "Connected"
      const accounts = await ethereum.request({ method: "eth_accounts" })
    } else {
      connectButton.innerHTML = "Please install MetaMask"
    }
  }


async function pay() {
    const ethAmount = document.getElementById("payAmount").value
  console.log(`Funding with ${ethAmount}...`)
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      })
      await listenForTransactionMine(transactionResponse, provider)
    } 
    catch (error) {
      console.log(error)
    }
  } 
  else {
    fundButton.innerHTML = "Please install MetaMask"
  }
}

async function withdraw() {
    console.log(`Withdrawing...`)
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const transactionResponse = await contract.withdraw()
      await listenForTransactionMine(transactionResponse, provider)
    } 
    catch (error) {
      console.log(error)
    }
  } 
  else {
    withdrawButton.innerHTML = "Please install MetaMask"
  }
}


async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      try {
        const balance = await provider.getAddressToAmountFunded(contractAddress)
        
      } 
      
      catch (error) {
        console.log(error)
      }
      balanceLabel.innerHTML(`${balance} Eth `)
    } 
    else {
      balanceButton.innerHTML = "Please install MetaMask"
    }
  }


/*function getBalance () {
   const _xcontractAddress = document.getElementById("AdressInput");
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        try {
          const balance = await contract.getAddressToAmountFunded(_xcontractAddress);
          console.log(ethers.utils.formatEther(balance))
        } catch (error) {
          console.log(error)
        }
      } 
      else {
        balanceButton.innerHTML = "Please install MetaMask"
      }
  
}*/

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}`)
    return new Promise((resolve, reject) => {
      provider.once(transactionResponse.hash, (transactionReceipt) => {
        console.log(
          `Completed with ${transactionReceipt.confirmations} confirmations. `
        )
        resolve()
      })
    })
  }