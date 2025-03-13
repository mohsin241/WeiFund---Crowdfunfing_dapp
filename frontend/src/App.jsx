// App.jsx
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ContributeForm from './components/ContributeForm';
import RequestList from './components/RequestList';
import RequestForm from './components/RequestForm';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import ContractABI from './assets/contractABI';

function App() {
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [isManager, setIsManager] = useState(false);
  const [campaignDetails, setCampaignDetails] = useState({
    targetGoal: 0,
    deadline: 0,
    raisedAmount: 0,
    noOfContributors: 0,
    balance: 0,
    userContribution: 0,
  });
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const contractAddress = "0xE253894794b07bc042B05242a6766dD19Feb6E2c";

  useEffect(() => {
    const init = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(provider);
          
          const accounts = await provider.send("eth_requestAccounts", []);
          setAccount(accounts[0]);
          
          const signer = await provider.getSigner();
          setSigner(signer);
          
          const contract = new ethers.Contract(contractAddress, ContractABI, signer);
          setContract(contract);
          
          await fetchContractData(contract, accounts[0]);
          
          window.ethereum.on('accountsChanged', (accounts) => {
            setAccount(accounts[0]);
            fetchContractData(contract, accounts[0]);
          });
        } else {
          toast.error("Please install MetaMask to use this dApp");
        }
      } catch (error) {
        console.error("Initialization error:", error);
        toast.error("Error connecting to blockchain");
      } finally {
        setLoading(false);
      }
    };
    
    init();
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
      }
    };
  }, []);

  const fetchContractData = async (contract, userAccount) => {
    try {
      setLoading(true);
      const manager = await contract.manager();
      setIsManager(manager.toLowerCase() === userAccount.toLowerCase());
      
      const targetGoal = await contract.targetGoal();
      const deadline = await contract.deadline();
      const raisedAmount = await contract.raisedAmount();
      const noOfContributors = await contract.noOfContributors();
      const balance = await contract.getContractBalance();
      const userContribution = await contract.contributors(userAccount);
      
      setCampaignDetails({
        targetGoal: ethers.formatEther(targetGoal),
        deadline: new Date(Number(deadline) * 1000).toLocaleString(),
        deadlineTimestamp: Number(deadline),
        raisedAmount: ethers.formatEther(raisedAmount),
        noOfContributors: Number(noOfContributors),
        balance: ethers.formatEther(balance),
        userContribution: ethers.formatEther(userContribution),
      });
      
      await fetchRequests(contract);
    } catch (error) {
      console.error("Error fetching contract data:", error);
      toast.error("Failed to load campaign data");
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async (contractInstance) => {
    try {
      const contract = contractInstance || contract;
      const numRequests = await contract.numRequests();
      
      const requestsArray = [];
      for (let i = 0; i < Number(numRequests); i++) {
        try {
          // We need to call the public mapping getter
          const request = await contract.requests(i);
          
          // Check if the current user has voted on this request
          let hasVoted = false;
          if (account) {
            // This would require a custom method in your contract
            // For now, we'll handle this on the frontend
            hasVoted = false;
          }
          
          requestsArray.push({
            id: i,
            description: request.description,
            value: ethers.formatEther(request.value),
            recipient: request.recipient,
            complete: request.isCompleted,
            approvalCount: Number(request.noOfVoters),
            hasVoted,
          });
        } catch (err) {
          console.error(`Error fetching request ${i}:`, err);
        }
      }
      
      setRequests(requestsArray);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to load funding requests");
    }
  };

  const handleContribute = async (amount) => {
    try {
      setLoading(true);
      const tx = await contract.contribute({
        value: ethers.parseEther(amount)
      });
      
      toast.info("Transaction submitted. Please wait for confirmation...");
      await tx.wait();
      
      toast.success("Contribution successful!");
      await fetchContractData(contract, account);
    } catch (error) {
      console.error("Contribution error:", error);
      toast.error(error.reason || "Contribution failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async (description, recipient, amount) => {
    try {
      if (!isManager) {
        toast.error("Only the manager can create requests");
        return;
      }
      
      setLoading(true);
      const tx = await contract.createRequest(
        description,
        recipient,
        ethers.parseEther(amount)
      );
      
      toast.info("Creating request. Please wait...");
      await tx.wait();
      
      toast.success("Request created successfully!");
      await fetchRequests();
      setActiveTab('requests');
    } catch (error) {
      console.error("Create request error:", error);
      toast.error(error.reason || "Failed to create request");
    } finally {
      setLoading(false);
    }
  };

  const handleVoteRequest = async (requestId) => {
    try {
      setLoading(true);
      const tx = await contract.voteRequest(requestId);
      
      toast.info("Processing your vote...");
      await tx.wait();
      
      toast.success("Vote recorded successfully!");
      await fetchRequests();
    } catch (error) {
      console.error("Vote error:", error);
      toast.error(error.reason || "Failed to record vote");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizeRequest = async (requestId) => {
    try {
      if (!isManager) {
        toast.error("Only the manager can finalize requests");
        return;
      }
      
      setLoading(true);
      const tx = await contract.makePayment(requestId);
      
      toast.info("Finalizing request. Please wait...");
      await tx.wait();
      
      toast.success("Request finalized successfully!");
      await fetchRequests();
    } catch (error) {
      console.error("Finalize error:", error);
      toast.error(error.reason || "Failed to finalize request");
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async () => {
    try {
      setLoading(true);
      const tx = await contract.refund();
      
      toast.info("Processing refund...");
      await tx.wait();
      
      toast.success("Refund successful!");
      await fetchContractData(contract, account);
    } catch (error) {
      console.error("Refund error:", error);
      toast.error(error.reason || "Refund failed. Check eligibility criteria.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !contract) {
    return <LoadingSpinner message="Connecting to blockchain..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-50 flex flex-col">
      <Header 
        account={account} 
        isManager={isManager} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {loading ? (
          <LoadingSpinner message="Processing transaction..." />
        ) : (
          <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
            {activeTab === 'dashboard' && (
              <>
                <Dashboard 
                  campaignDetails={campaignDetails} 
                  isManager={isManager}
                  handleRefund={handleRefund}
                />
                <div className="mt-8">
                  <ContributeForm onContribute={handleContribute} />
                </div>
              </>
            )}
            
            {activeTab === 'requests' && (
              <RequestList 
                requests={requests} 
                campaignDetails={campaignDetails}
                isManager={isManager}
                onVote={handleVoteRequest}
                onFinalize={handleFinalizeRequest}
              />
            )}
            
            {activeTab === 'createRequest' && isManager && (
              <RequestForm onCreateRequest={handleCreateRequest} />
            )}
          </div>
        )}
      </main>
      
      <Footer />
      <ToastContainer position="bottom-right" theme="colored" />
    </div>
  );
}

export default App;