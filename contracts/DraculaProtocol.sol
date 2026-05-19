// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DraculaProtocol {
    string public name = "Dracula USD";
    string public symbol = "DUSD";
    uint8 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    mapping(address => uint256) public collateral; // ETH collateral
    mapping(address => uint256) public debt;       // DUSD debt

    // Mock price for demonstration: 1 ETH = 3000 DUSD
    uint256 public constant ETH_PRICE = 3000; 
    // Maximum Loan-to-Value ratio: 50%
    uint256 public constant MAX_LTV = 50; 

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event Borrow(address indexed user, uint256 amount);
    event Repay(address indexed user, uint256 amount);

    // Minimal ERC20 Implementation for DUSD
    function _mint(address to, uint256 amount) internal {
        totalSupply += amount;
        balanceOf[to] += amount;
        emit Transfer(address(0), to, amount);
    }

    function _burn(address from, uint256 amount) internal {
        balanceOf[from] -= amount;
        totalSupply -= amount;
        emit Transfer(from, address(0), amount);
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    // Lending Protocol Logic
    function deposit() external payable {
        require(msg.value > 0, "Must deposit ETH");
        collateral[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external {
        require(collateral[msg.sender] >= amount, "Insufficient collateral");
        
        uint256 remainingCollateral = collateral[msg.sender] - amount;
        uint256 maxBorrow = (remainingCollateral * ETH_PRICE * MAX_LTV) / 100;
        require(debt[msg.sender] <= maxBorrow, "Withdrawal would cause undercollateralization");

        collateral[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdraw(msg.sender, amount);
    }

    function borrow(uint256 amount) external {
        uint256 maxBorrow = (collateral[msg.sender] * ETH_PRICE * MAX_LTV) / 100;
        require(debt[msg.sender] + amount <= maxBorrow, "Exceeds max LTV");

        debt[msg.sender] += amount;
        _mint(msg.sender, amount);
        emit Borrow(msg.sender, amount);
    }

    function repay(uint256 amount) external {
        require(balanceOf[msg.sender] >= amount, "Insufficient DUSD balance");
        require(debt[msg.sender] >= amount, "Repaying more than debt");

        debt[msg.sender] -= amount;
        _burn(msg.sender, amount);
        emit Repay(msg.sender, amount);
    }

    // Helper function for UI to fetch all relevant user data in one call
    function getAccountInfo(address user) external view returns (uint256 _collateral, uint256 _debt, uint256 _maxBorrow) {
        _collateral = collateral[user];
        _debt = debt[user];
        _maxBorrow = (_collateral * ETH_PRICE * MAX_LTV) / 100;
    }
}
