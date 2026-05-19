import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Activity, ArrowDownCircle, ArrowUpCircle, RefreshCw } from 'lucide-react';
import { useWeb3 } from './context/Web3Context';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './constants/contract';
import { handleTransaction } from './utils/txHelper';
import { WalletButton } from './components/web3/WalletButton';
import { Footer } from './components/ui/Footer';
import { Toast } from './components/ui/Toast';
import { HowItWorks } from './pages/HowItWorks';

function App() {
  const { provider, signer, address } = useWeb3();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [status, setStatus] = useState({ loading: false, error: null, success: false });
  
  // Protocol State
  const [ethPrice, setEthPrice] = useState('0');
  const [maxLtv, setMaxLtv] = useState('0');
  
  // User State
  const [collateral, setCollateral] = useState('0');
  const [debt, setDebt] = useState('0');
  const [dusdBalance, setDusdBalance] = useState('0');

  // Inputs
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [borrowAmount, setBorrowAmount] = useState('');
  const [repayAmount, setRepayAmount] = useState('');

  const loadData = async () => {
    if (!provider) return;
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      
      // Load Protocol Data
      const price = await contract.ETH_PRICE();
      const ltv = await contract.MAX_LTV();
      setEthPrice(ethers.formatEther(price));
      setMaxLtv(Number(ltv).toString());

      // Load User Data if connected
      if (address) {
        const userCollateral = await contract.collateral(address);
        const userDebt = await contract.debt(address);
        const userBalance = await contract.balanceOf(address);
        
        setCollateral(ethers.formatEther(userCollateral));
        setDebt(ethers.formatEther(userDebt));
        setDusdBalance(ethers.formatEther(userBalance));
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, [provider, address]);

  // Actions
  const onDeposit = async () => {
    if (!signer || !depositAmount) return;
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    const success = await handleTransaction(
      contract.deposit({ value: ethers.parseEther(depositAmount) }),
      setStatus
    );
    if (success) {
      setDepositAmount('');
      loadData();
    }
  };

  const onWithdraw = async () => {
    if (!signer || !withdrawAmount) return;
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    const success = await handleTransaction(
      contract.withdraw(ethers.parseEther(withdrawAmount)),
      setStatus
    );
    if (success) {
      setWithdrawAmount('');
      loadData();
    }
  };

  const onBorrow = async () => {
    if (!signer || !borrowAmount) return;
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    const success = await handleTransaction(
      contract.borrow(ethers.parseEther(borrowAmount)),
      setStatus
    );
    if (success) {
      setBorrowAmount('');
      loadData();
    }
  };

  const onRepay = async () => {
    if (!signer || !repayAmount) return;
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    const success = await handleTransaction(
      contract.repay(ethers.parseEther(repayAmount)),
      setStatus
    );
    if (success) {
      setRepayAmount('');
      loadData();
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="bg-dracula-surface border-b border-dracula-comment sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="text-dracula-red" size={28} />
            <span className="text-xl font-bold text-dracula-fg tracking-tight">Dracula<span className="text-dracula-red">Protocol</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'text-dracula-cyan' : 'text-dracula-fg hover:text-dracula-cyan'}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('how-it-works')}
              className={`text-sm font-medium transition-colors ${activeTab === 'how-it-works' ? 'text-dracula-cyan' : 'text-dracula-fg hover:text-dracula-cyan'}`}
            >
              How It Works
            </button>
          </div>

          <WalletButton />
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-6xl mx-auto w-full px-4 py-8">
        {activeTab === 'how-it-works' ? (
          <HowItWorks />
        ) : (
          <div className="space-y-8 animate-fade-in">
            
            {/* Hero Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="card-dracula !p-4 flex flex-col">
                <span className="text-dracula-comment text-sm font-medium mb-1">ETH Price</span>
                <span className="text-2xl font-bold text-dracula-green">${Number(ethPrice).toFixed(2)}</span>
              </div>
              <div className="card-dracula !p-4 flex flex-col">
                <span className="text-dracula-comment text-sm font-medium mb-1">Max LTV</span>
                <span className="text-2xl font-bold text-dracula-orange">{maxLtv}%</span>
              </div>
              <div className="card-dracula !p-4 flex flex-col">
                <span className="text-dracula-comment text-sm font-medium mb-1">Your Collateral</span>
                <span className="text-2xl font-bold text-dracula-cyan">{Number(collateral).toFixed(4)} ETH</span>
              </div>
              <div className="card-dracula !p-4 flex flex-col">
                <span className="text-dracula-comment text-sm font-medium mb-1">Your Debt</span>
                <span className="text-2xl font-bold text-dracula-pink">{Number(debt).toFixed(2)} DUSD</span>
              </div>
            </div>

            {/* Action Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Supply / Withdraw */}
              <div className="card-dracula space-y-6">
                <div className="flex items-center gap-2 border-b border-dracula-comment pb-4">
                  <ArrowDownCircle className="text-dracula-cyan" />
                  <h2 className="text-xl font-bold">Collateral (ETH)</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-dracula-comment mb-2">Deposit ETH</label>
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        placeholder="0.0" 
                        className="input-dracula"
                      />
                      <button 
                        onClick={onDeposit}
                        disabled={status.loading || !depositAmount}
                        className="btn-primary whitespace-nowrap"
                      >
                        Deposit
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-dracula-comment mb-2">Withdraw ETH</label>
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="0.0" 
                        className="input-dracula"
                      />
                      <button 
                        onClick={onWithdraw}
                        disabled={status.loading || !withdrawAmount}
                        className="btn-secondary whitespace-nowrap"
                      >
                        Withdraw
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Borrow / Repay */}
              <div className="card-dracula space-y-6">
                <div className="flex items-center justify-between border-b border-dracula-comment pb-4">
                  <div className="flex items-center gap-2">
                    <ArrowUpCircle className="text-dracula-pink" />
                    <h2 className="text-xl font-bold">Borrow (DUSD)</h2>
                  </div>
                  <div className="text-sm text-dracula-comment">
                    Balance: <span className="text-dracula-fg">{Number(dusdBalance).toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-dracula-comment mb-2">Borrow DUSD</label>
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        value={borrowAmount}
                        onChange={(e) => setBorrowAmount(e.target.value)}
                        placeholder="0.0" 
                        className="input-dracula"
                      />
                      <button 
                        onClick={onBorrow}
                        disabled={status.loading || !borrowAmount}
                        className="btn-primary !bg-dracula-pink hover:!bg-dracula-purple whitespace-nowrap"
                      >
                        Borrow
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-dracula-comment mb-2">Repay DUSD</label>
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        value={repayAmount}
                        onChange={(e) => setRepayAmount(e.target.value)}
                        placeholder="0.0" 
                        className="input-dracula"
                      />
                      <button 
                        onClick={onRepay}
                        disabled={status.loading || !repayAmount}
                        className="btn-secondary whitespace-nowrap"
                      >
                        Repay
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>

      <Footer />
      <Toast status={status} onClose={() => setStatus({ ...status, error: null, success: false })} />
    </>
  );
}

export default App;
