import React from 'react';
import { Droplets, ArrowRightLeft, ShieldAlert, Coins } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: <Droplets className="text-dracula-cyan" size={32} />,
      title: "1. Deposit Collateral",
      desc: "Supply ETH to the protocol to build your borrowing power. Your ETH is securely locked in the smart contract."
    },
    {
      icon: <Coins className="text-dracula-purple" size={32} />,
      title: "2. Borrow DUSD",
      desc: "Mint Dracula USD (DUSD) against your ETH collateral. You can borrow up to the Maximum LTV (Loan-to-Value) ratio."
    },
    {
      icon: <ArrowRightLeft className="text-dracula-pink" size={32} />,
      title: "3. Repay Debt",
      desc: "Return the borrowed DUSD to the protocol at any time to reduce your debt balance and free up your collateral."
    },
    {
      icon: <ShieldAlert className="text-dracula-orange" size={32} />,
      title: "4. Withdraw ETH",
      desc: "Once your debt is repaid, you can safely withdraw your ETH collateral back to your wallet."
    }
  ];

  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-dracula-fg mb-4">How Dracula Protocol Works</h2>
        <p className="text-dracula-comment max-w-2xl mx-auto">
          A decentralized, non-custodial lending protocol allowing you to unlock liquidity without selling your assets.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, i) => (
          <div key={i} className="card-dracula flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
            <div className="bg-dracula-bg p-4 rounded-full mb-4 border border-dracula-comment">
              {step.icon}
            </div>
            <h3 className="text-lg font-semibold text-dracula-fg mb-2">{step.title}</h3>
            <p className="text-sm text-dracula-comment">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
