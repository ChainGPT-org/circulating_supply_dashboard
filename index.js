
const NodeCache = require('node-cache');
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3000;

// BSCSCAN API Key
const apiKey = process.env.BSCSCAN_API_KEY;

const cache = new NodeCache({ stdTTL: 600 }); // Set the cache expiration time to 600 seconds (10 minutes)

// Contract address of CGPT token
const cgptContractAddress = '0x9840652DC04fb9db2C43853633f0F62BE6f00f98';


// List of contract addresses with additional information
const contractAddresses = [
  {
    address: '0x1f7bAAf93e0449394e80f3A24c14fB2fA667495c',
    chain: 'BSC',
    type: 'TeamFinance Vesting',
    wallet: 'KOLs Round (ref: tokenomics)', 
  },
  {
    address: '0x77A8b449e7cd61dd54B755034Baf9d00EeeD1076',
    chain: 'BSC',
    type: 'TeamFinance Vesting',
    wallet: 'Seedify IDO Fee (3.5%) in tokens', 
  },
  {
    address: '0x0aaf30015ee2393dbeab2d8830f6d244f2dfa0f1',
    chain: 'BSC',
    type: 'TeamFinance Vesting',
    wallet: 'Farming/Staking (ref: tokenomics)', 
  },
  {
    address: '0xb63ea5700834975e8349cfd2d54216f7749b0e49',
    chain: 'BSC',
    type: 'TeamFinance Vesting',
    wallet: 'Liquidity Allocation (ref: tokenomics)', 
  },
  {
    address: '0x9d9ceebf7fb22df325c37591c43c7c0e0f36c6a2',
    chain: 'BSC',
    type: 'TeamFinance Vesting',
    wallet: 'Private B Round (ref: tokenomics)', 
  },
  {
    address: '0x2d842cf79aa3d6bcef9e37dd9d8809ebab813ad5',
    chain: 'BSC',
    type: 'TeamFinance Vesting',
    wallet: 'Private A Round (ref: tokenomics)', 
  },
  {
    address: '0x73e49c140c35fc1cc0c716f00d435e22ab8c1305',
    chain: 'BSC',
    type: 'TeamFinance Vesting',
    wallet: 'Treasury, Team, DAO Fund, Marketing, Development (ref: tokenomics)', 
  },
  {
    address: '0x39f119f1d89ba0e14daded2a5901f3c42135726c',
    chain: 'BSC',
    type: 'TeamFinance Vesting',
    wallet: 'Available Advisory Tokens (ref: tokenomics)', 
  },
  {
    address: '0x915a6fF38cab0bB0B027179D7b5f196DAB25C626',
    chain: 'BSC',
    type: 'IDO Round Vesting',
    wallet: 'Seedify IDO', 
  },
  {
    address: '0x6dAa1b5F9cF268AF2fd93Dff8083E2d3ca237008',
    chain: 'BSC',
    type: 'Crowdfunding Vesting',
    wallet: 'YAYNetwork', 
  },
  {
    address: '0x98E9EBc9539d674cbcd505b6A6483991d50c2356',
    chain: 'BSC',
    type: 'Crowdfunding Vesting',
    wallet: 'Decubate', 
  },
  {
    address: '0xd377766831DE29B39Ea45687983F9F590add517f',
    chain: 'BSC',
    type: 'IDO Round Vesting',
    wallet: 'EnjinStarter', 
  },
  {
    address: '0x436CE2ce8d8d2Ccc062f6e92faF410DB4d397905',
    chain: 'BSC',
    type: 'IDO Round Vesting',
    wallet: 'Poolz', 
  },
      {
    address: '0x926D28476A4bB4F7E4c27C913a3495b3d7393006',
    chain: 'BSC',
    type: 'TeamFinance  Contract (Locked)',
    wallet: 'Seedify  Incubation Fee (1%)', 
  },
  {
    address: '0xd58DE7168b7d22048db5EdAafa07265B70407Bc0',
    chain: 'BSC',
    type: 'IDO Round Vesting',
    wallet: 'WePad', 
  },
  {
    address: '0x765a6ee976137801F2661c3644E1fde369A8ED18',
    chain: 'BSC',
    type: 'Staking Pools',
    wallet: 'CGPT Staking Rewards & Staked (via Decubate)', 
  },
  {
    address: '0x62A402DEf6Ca37E9CA7a544bE34954748088CCEE',
    chain: 'BSC',
    type: 'Staking Pools',
    wallet: 'ChainGPT Pad Staking Pool', 
  },
  {
    address: '0x28FBFA75850E246BdD454A0e76FeAA42D771757B',
    chain: 'BSC',
    type: 'Staking Pools',
    wallet: 'ChainGPT Pad Staking Pool - Rewards Distributor', 
  },
  {
    address: '0x3A53269cAE3281155e51d06Ffe14fdE8DC3662f7',
    chain: 'BSC',
    type: 'Claim Portal Balance',
    wallet: 'Claim Portal Balance (KOLs/Advisors/Private)', 
  },
];


// List of contract addresses with additional information
const contractAddressesCMC = [
  {
    address: '0x5930976fc5eacccea648555cc12438a3278a9fbe',
    chain: 'BSC',
    type: 'Gnosis Multi-Sig Wallet (Team-Controlled',
    wallet: 'Team Controlled Wallet - Multisig', 
  },
  {
    address: '0x1D01AFAEAA4e0103c7f595C796CF01B0A2fEAB6D',
    chain: 'BSC',
    type: '#2 Gnosis Multi-Sig Wallet (Team-Controlled',
    wallet: 'Team Controlled Wallet - Multisig', 
  },
  
  {
    address: '0x699cfbbb29f7734ccb1a342b3dfbeac391423d48',
    chain: 'BSC',
    type: 'Gnosis Multi-Sig Wallet (Team-Controlled',
    wallet: 'Team Controlled Wallet - Multisig', 
  },
  
  {
    address: '0xbc9755809702906a9351c846e33d840541f19d73',
    chain: 'BSC',
    type: 'Gnosis Multi-Sig Wallet (Team-Controlled',
    wallet: 'Team Controlled Wallet - Multisig', 
  },
  {
    address: '0x1f7bAAf93e0449394e80f3A24c14fB2fA667495c',
    chain: 'BSC',
    type: 'TeamFinance Vesting',
    wallet: 'KOLs Round (ref: tokenomics)', 
  },
  {
    address: '0x77A8b449e7cd61dd54B755034Baf9d00EeeD1076',
    chain: 'BSC',
    type: 'TeamFinance Vesting',
    wallet: 'Seedify IDO Fee (3.5%) in tokens', 
  },
  {
    address: '0x0aaf30015ee2393dbeab2d8830f6d244f2dfa0f1',
    chain: 'BSC',
    type: 'TeamFinance Vesting',
    wallet: 'Farming/Staking (ref: tokenomics)', 
  },
  {
    address: '0xb63ea5700834975e8349cfd2d54216f7749b0e49',
    chain: 'BSC',
    type: 'TeamFinance Vesting',
    wallet: 'Liquidity Allocation (ref: tokenomics)', 
  },
  {
    address: '0x9d9ceebf7fb22df325c37591c43c7c0e0f36c6a2',
    chain: 'BSC',
    type: 'TeamFinance Vesting',
    wallet: 'Private B Round (ref: tokenomics)', 
  },
  {
    address: '0x2d842cf79aa3d6bcef9e37dd9d8809ebab813ad5',
    chain: 'BSC',
    type: 'TeamFinance Vesting',
    wallet: 'Private A Round (ref: tokenomics)', 
  },
  {
    address: '0x73e49c140c35fc1cc0c716f00d435e22ab8c1305',
    chain: 'BSC',
    type: 'TeamFinance Vesting',
    wallet: 'Treasury, Team, DAO Fund, Marketing, Development (ref: tokenomics)', 
  },
  {
    address: '0x39f119f1d89ba0e14daded2a5901f3c42135726c',
    chain: 'BSC',
    type: 'TeamFinance Vesting',
    wallet: 'Available Advisory Tokens (ref: tokenomics)', 
  },
  {
    address: '0x915a6fF38cab0bB0B027179D7b5f196DAB25C626',
    chain: 'BSC',
    type: 'IDO Round Vesting',
    wallet: 'Seedify IDO', 
  },
  {
    address: '0x6dAa1b5F9cF268AF2fd93Dff8083E2d3ca237008',
    chain: 'BSC',
    type: 'Crowdfunding Vesting',
    wallet: 'YAYNetwork', 
  },
  {
    address: '0x98E9EBc9539d674cbcd505b6A6483991d50c2356',
    chain: 'BSC',
    type: 'Crowdfunding Vesting',
    wallet: 'Decubate', 
  },
  {
    address: '0xd377766831DE29B39Ea45687983F9F590add517f',
    chain: 'BSC',
    type: 'IDO Round Vesting',
    wallet: 'EnjinStarter', 
  },
  {
    address: '0x436CE2ce8d8d2Ccc062f6e92faF410DB4d397905',
    chain: 'BSC',
    type: 'IDO Round Vesting',
    wallet: 'Poolz', 
  },
      {
    address: '0x926D28476A4bB4F7E4c27C913a3495b3d7393006',
    chain: 'BSC',
    type: 'TeamFinance  Contract (Locked)',
    wallet: 'Seedify  Incubation Fee (1%)', 
  },
  {
    address: '0xd58DE7168b7d22048db5EdAafa07265B70407Bc0',
    chain: 'BSC',
    type: 'IDO Round Vesting',
    wallet: 'WePad', 
  },
  {
    address: '0x765a6ee976137801F2661c3644E1fde369A8ED18',
    chain: 'BSC',
    type: 'Staking Pools',
    wallet: 'CGPT Staking Rewards & Staked (via Decubate)', 
  },
  {
    address: '0x62A402DEf6Ca37E9CA7a544bE34954748088CCEE',
    chain: 'BSC',
    type: 'Staking Pools',
    wallet: 'ChainGPT Pad Staking Pool', 
  },
  {
    address: '0x28FBFA75850E246BdD454A0e76FeAA42D771757B',
    chain: 'BSC',
    type: 'Staking Pools',
    wallet: 'ChainGPT Pad Staking Pool - Rewards Distributor', 
  },
  {
    address: '0x3A53269cAE3281155e51d06Ffe14fdE8DC3662f7',
    chain: 'BSC',
    type: 'Claim Portal Balance',
    wallet: 'Claim Portal Balance (KOLs/Advisors/Private)', 
  },
];

const contractAddresses2 = [
  {
    address: '0x1f3215f8E5b449BbD30824037c6b55f61c4E9D19',
    chain: 'BSC',
    type: 'Multi-Sig Wallet',
    wallet: 'Treasury Allocation (ref: tokenomics)', 
  },
  {
    address: '0x74697c848Bcf5B19b5fcA65137C6c33Ffba8c387',
    chain: 'BSC',
    type: 'Multi-Sig Wallet',
    wallet: 'Team Allocation (ref: tokenomics)', 
  },
  {
    address: '0x699cFBBb29f7734Ccb1a342b3DfbEaC391423D48',
    chain: 'BSC',
    type: 'Multi-Sig Wallet',
    wallet: 'Marketing Allocation (ref: tokenomics)', 
  },
  
  {
    address: '0xdcca71344714D20543934b46688f15F064281dAF',
    chain: 'BSC',
    type: 'Multi-Sig Wallet',
    wallet: '#2 Marketing Allocation (ref: tokenomics)', 
  },
  {
    address: '0xfBadedB005DFFa61F9A4afc070EF3B65AbbD6aC0',
    chain: 'BSC',
    type: 'Multi-Sig Wallet',
    wallet: 'DAO Allocation (ref: tokenomics)', 
  },
  {
    address: '0x32C069267771881bAc811843E0bb5e2FAe3c39fe',
    chain: 'BSC',
    type: 'Multi-Sig Wallet',
    wallet: 'Development Allocation (ref: tokenomics)', 
  },
  {
    address: '0x1b0D9076bB98002f1795706ea4032797E611E1a4',
    chain: 'BSC',
    type: 'Multi-Sig Wallet',
    wallet: 'Advisory Allocation (ref: tokenomics)', 
  },
  {
    address: '0xbc9755809702906A9351C846E33D840541f19d73',
    chain: 'BSC',
    type: 'Multi-Sig Wallet',
    wallet: 'ClaimPortal Funds (Advisors,Private,KOLs)', 
  },
  {
    address: '0x5930976FC5eaccCea648555cC12438a3278A9FBe',
    chain: 'BSC',
    type: 'Multi-Sig Wallet',
    wallet: 'Liquidity & Farm Allocation (ref: tokenomics) + LPs', 
  },
  {
    address: '0x1D01AFAEAA4e0103c7f595C796CF01B0A2fEAB6D',
    chain: 'BSC',
    type: 'Multi-Sig Wallet',
    wallet: '#2 Liquidity & Farm Allocation (ref: tokenomics) + LPs', 
  },
  {
    address: '0x1f7bAAf93e0449394e80f3A24c14fB2fA667495c',
    chain: 'BSC',
    type: 'TeamFinance Vesting',
    wallet: 'KOLs Round (ref: tokenomics)', 
  },
  {
    address: '0x77A8b449e7cd61dd54B755034Baf9d00EeeD1076',
    chain: 'BSC',
    type: 'TeamFinance Vesting',
    wallet: 'Seedify IDO Fee (3.5%) in tokens', 
  },
  {
    address: '0x49631af13fe31e1688ff5a018eeb7917a1e59f81',
    chain: 'BSC',
    type: 'TeamFinance Vesting',
    wallet: 'Seedify Incubation Fee (1%)', 
  },
  {
    address: '0x0aaf30015ee2393dbeab2d8830f6d244f2dfa0f1',
    chain: 'BSC',
    type: 'TeamFinance Vesting',
    wallet: 'Farming/Staking (ref: tokenomics)', 
  },
  {
    address: '0xb63ea5700834975e8349cfd2d54216f7749b0e49',
    chain: 'BSC',
    type: 'TeamFinance Vesting',
    wallet: 'Liquidity Allocation (ref: tokenomics)', 
  },
  {
    address: '0x9d9ceebf7fb22df325c37591c43c7c0e0f36c6a2',
    chain: 'BSC',
    type: 'TeamFinance Vesting',
    wallet: 'Private B Round (ref: tokenomics)', 
  },
  {
    address: '0x2d842cf79aa3d6bcef9e37dd9d8809ebab813ad5',
    chain: 'BSC',
    type: 'TeamFinance Vesting',
    wallet: 'Private A Round (ref: tokenomics)', 
  },
  {
    address: '0x73e49c140c35fc1cc0c716f00d435e22ab8c1305',
    chain: 'BSC',
    type: 'TeamFinance Vesting',
    wallet: 'Treasury, Team, DAO Fund, Marketing, Development (ref: tokenomics)', 
  },
  {
    address: '0x39f119f1d89ba0e14daded2a5901f3c42135726c',
    chain: 'BSC',
    type: 'TeamFinance Vesting',
    wallet: 'Available Advisory Tokens (ref: tokenomics)', 
  },
  {
    address: '0x1477D450b95Fc5469dd19fA9Dc3629271d5e1121',
    chain: 'BSC',
    type: 'Vesting Contract (Locked)',
    wallet: 'Seedify Incubation Fee (1%)', 
  },
    {
    address: '0x926D28476A4bB4F7E4c27C913a3495b3d7393006',
    chain: 'BSC',
    type: 'TeamFinance  Contract (Locked)',
    wallet: 'Seedify  Incubation Fee (1%)', 
  },
  {
    address: '0xB44889a0Da462090922F72D7FaF69bCEB3aDb7C6',
    chain: 'BSC',
    type: 'Vesting Contract (Claimable)',
    wallet: 'Seedify Incubation Fee (1%)', 
  },
  {
    address: '0x915a6fF38cab0bB0B027179D7b5f196DAB25C626',
    chain: 'BSC',
    type: 'IDO Round Vesting',
    wallet: 'Seedify IDO', 
  },
  {
    address: '0x6dAa1b5F9cF268AF2fd93Dff8083E2d3ca237008',
    chain: 'BSC',
    type: 'Crowdfunding Vesting',
    wallet: 'YAYNetwork', 
  },
  {
    address: '0x98E9EBc9539d674cbcd505b6A6483991d50c2356',
    chain: 'BSC',
    type: 'Crowdfunding Vesting',
    wallet: 'Decubate', 
  },
  {
    address: '0xd377766831DE29B39Ea45687983F9F590add517f',
    chain: 'BSC',
    type: 'IDO Round Vesting',
    wallet: 'EnjinStarter', 
  },
  {
    address: '0x436CE2ce8d8d2Ccc062f6e92faF410DB4d397905',
    chain: 'BSC',
    type: 'IDO Round Vesting',
    wallet: 'Poolz', 
  },
  {
    address: '0xd58DE7168b7d22048db5EdAafa07265B70407Bc0',
    chain: 'BSC',
    type: 'IDO Round Vesting',
    wallet: 'WePad', 
  },
  {
    address: '0x765a6ee976137801F2661c3644E1fde369A8ED18',
    chain: 'BSC',
    type: 'Staking Pools',
    wallet: 'CGPT Staking Rewards & Staked (via Decubate)', 
  },
  {
    address: '0x62A402DEf6Ca37E9CA7a544bE34954748088CCEE',
    chain: 'BSC',
    type: 'Staking Pools',
    wallet: 'ChainGPT Pad Staking Pool', 
  },
  {
    address: '0x28FBFA75850E246BdD454A0e76FeAA42D771757B',
    chain: 'BSC',
    type: 'Staking Pools',
    wallet: 'ChainGPT Pad Staking Pool - Rewards Distributor', 
  },
  {
    address: '0x3A53269cAE3281155e51d06Ffe14fdE8DC3662f7',
    chain: 'BSC',
    type: 'Claim Portal Balance',
    wallet: 'Claim Portal Balance (KOLs/Advisors/Private)', 
  },

  {
    address: '0xEE9ECc8032849112778a8372ef3355888ea85C55',
    chain: 'BSC',
    type: 'Liquidity Pool',
    wallet: 'PancakeSwap V3 (0.25%)',
  },
  {
    address: '0xC773F8873fA213117B3b56fb970e30aB9D5FeB9D',
    chain: 'BSC',
    type: 'Liquidity Pool',
    wallet: 'PancakeSwap V3 (0.01%)',
  },
  {
    address: '0x9338892AC6B2b19ccF17A84D93713aA14CcB2193',
    chain: 'BSC',
    type: 'Liquidity Pool',
    wallet: 'PancakeSwap V3 (1%)',
  },
  {
    address: '0xDBbDB7dd8870ee0433f50Dd17cE849703be56704',
    chain: 'BSC',
    type: 'Liquidity Pool',
    wallet: 'PancakeSwap V3 (1%)',
  },
  {
    address: '0xcFE847AAE922CBe3Dcbba61DBB1ed97D2124d322',
    chain: 'BSC',
    type: 'Liquidity Pool',
    wallet: 'PancakeSwap V2',
  },
  {
    address: '0xff88AC1476127DA0b05Ec771556D8E0dD3174c3d',
    chain: 'ETH',
    type: 'Liquidity Pool',
    wallet: 'Uniswap V3',
  },
  {
    address: '0x9a1a5F79e3E8beB5Baa8eAe8A3760Fa28B662646',
    chain: 'BSC',
    type: 'Liquidity Pool',
    wallet: 'BabyDoge DEX',
  },
  {
    address: '0x9840652DC04fb9db2C43853633f0F62BE6f00f98',
    chain: 'BSC',
    type: 'Liquidity Pool',
    wallet: 'Kyber Swap V2',
  },
  {
    address: '0x1B376bd0693956161caf6C4a3D31046bbd2d32E6',
    chain: 'BSC',
    type: 'Liquidity Pool',
    wallet: 'ApeSwap V2',
  },
  {
    address: '0xc9182fFB9abBfC88f4e273e4F4b11575AEcb60B4',
    chain: 'BSC',
    type: 'Liquidity Pool',
    wallet: 'Biswap V3 (0.08%)',
  },
  {
    address: '0x262c1d63e6ac0444f96CFF61eC7B9a850faB6De4',
    chain: 'BSC',
    type: 'Liquidity Pool',
    wallet: 'Biswap V2',
  },
  {
    address: '0xfa17fE365e63Dd102E6b3b508e78738f1cB57385',
    chain: 'BSC',
    type: 'MarketMaker Wallet',
    wallet: 'MarketMaker Wallet (DEXs Arbitrage)',
  },
  {
    address: '0x2cd90158baae285010a5ed7c549c2e5b4c0715f4',
    chain: 'BSC',
    type: 'ChainPort Bridge',
    wallet: 'ChainPort Bridge (UniSwap & CEX liquidity)',
  },
];

async function getTotalSupply() {
  const cachedTotalSupply = cache.get('totalSupply');
  if (cachedTotalSupply !== undefined) {
    return cachedTotalSupply;
  }

  try {
    const url = `https://api.bscscan.com/api?module=stats&action=tokensupply&contractaddress=${cgptContractAddress}&apikey=${apiKey}`;
    const response = await axios.get(url);
    const result = response.data.result;

    cache.set('totalSupply', result); // Cache the total supply

    return result;
  } catch (error) {
    console.error('Error fetching total supply:', error);
    throw error;
  }
}

app.get('/', async (req, res) => {
  const cachedBalances = cache.get('balances');
  if (cachedBalances !== undefined) {
    res.send(cachedBalances);
    return;
  }

  try {
    const balances = [];

    for (const { address, chain, type, wallet, name } of contractAddresses) {
      const url = `https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=${cgptContractAddress}&address=${address}&tag=latest&apikey=${apiKey}`;
      const response = await axios.get(url);
      const balance = parseInt(response.data.result);

      balances.push({ address, balance, chain, type, wallet, name });
    }

    balances.sort((a, b) => b.balance - a.balance); // Sort balances in descending order

    let totalBalance = 0;
    
    let tableRows = '';

    for (const { address, balance, chain, type, wallet } of balances) {
      totalBalance += balance;
      const bscScanLink = `https://bscscan.com/token/0x9840652DC04fb9db2C43853633f0F62BE6f00f98?a=${address}`;
 
      tableRows += `<tr>
      <td><a href="${bscScanLink}" target="_blank">${address}</a></td>
        <td>${Math.floor(balance / 10 ** 18).toLocaleString()}</td>
        <td>${chain}</td>
        <td>${type}</td>
        <td>${wallet}</td>
      </tr>`;
    }

    const totalSupplyEndpointResult = await getTotalSupply();
    const burntTokens = 1000000000 - Math.floor(totalSupplyEndpointResult / 10 ** 18);
    const totalSupply = 1000000000 - Math.floor(totalBalance / 10 ** 18) - burntTokens;

    const htmlResponse = ` <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #f5f5f5;
    }
  
    h1 {
      color: #333;
      font-size: 32px;
      margin-bottom: 20px;
      text-align: center;
    }
  
    p {
      color: #666;
      font-size: 16px;
      margin-bottom: 10px;
    }
  
    table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 20px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      background-color: #fff;
    }
  
    th,
    td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
  
    th {
      background-color: #f9f9f9;
      font-weight: bold;
      font-size: 16px;
    }
  
    tr:nth-child(even) {
      background-color: #f2f2f2;
    }
  
    a {
      color: #337ab7;
      text-decoration: underline;
    }
  
    a:hover {
      color: #23527c;
    }
  
    .title-row {
      background-color: #333;
      color: black;
      font-weight: bold;
      font-size: 18px;
    }
  
    .total-supply-row {
      background-color: #f9f9f9;
    }
  
    .empty-row {
      background-color: transparent;
    }
  
    /* Responsive Styles */
    @media screen and (max-width: 600px) {
      h1 {
        font-size: 24px;
      }
  
      p {
        font-size: 14px;
      }
  
      th,
      td {
        padding: 8px;
      }
    }
  </style>
  
  <h1>$CGPT Circulating Supply Tracker</h1>
  <p>Total Supply: 1,000,000,000</p>
  <p>Burnt $CGPT: ${burntTokens.toLocaleString()}</p>
  <p>Live Circulating Supply of $CGPT: ${totalSupply.toLocaleString()} (LP.included)</p>
  <p>Track supply with liquidity & Multi-Sig wallets <b>excluded from the CS</b> <a href="https://supply.chaingpt.org/LP">Click Here</a></p>
  <br><br>
  <table>
    <tr class="title-row">
      <th>Contract Address</th>
      <th>Balance (CGPT)</th>
      <th>Chain</th>
      <th>Type</th>
      <th>Name</th>
    </tr>
    ${tableRows}
    <tr class="empty-row">
      <td colspan="5"></td>
    </tr>
    <tr class="total-supply-row">
      <td>$CGPT Circulating Supply</td>
      <td>${totalSupply.toLocaleString()}</td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
  </table>

    `;

    cache.set('balances', htmlResponse); // Cache the response

    res.send(htmlResponse);
  } catch (error) {
    res.status(500).send('Error fetching data');
  }
});

 
app.get('/LP', async (req, res) => {
  try {
    const cachedBalances = cache.get('balances2');
    if (cachedBalances !== undefined) {
      res.send(cachedBalances);
      return;
    }

    const balances2 = [];

    for (const { address, chain, type, wallet, name } of contractAddresses2) {
      const url = `https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=${cgptContractAddress}&address=${address}&tag=latest&apikey=${apiKey}`;
      const response = await axios.get(url);
      const balance = parseInt(response.data.result);

      balances2.push({ address, balance, chain, type, wallet, name });
    }

    balances2.sort((a, b) => b.balance - a.balance); // Sort balances2 in descending order

    let totalBalance = 0;
    let tableRows = '';

    for (const { address, balance, chain, type, wallet } of balances2) {
      totalBalance += balance;
      const bscScanLink = `https://bscscan.com/token/0x9840652DC04fb9db2C43853633f0F62BE6f00f98?a=${address}`;


      tableRows += `<tr>
        <td><a href="${bscScanLink}" target="_blank">${address}</a></td>
        <td>${Math.floor(balance / 10 ** 18).toLocaleString()}</td>
        <td>${chain}</td>
        <td>${type}</td>
        <td>${wallet}</td>
      </tr>`;
    }

    const totalSupplyEndpointResult = await getTotalSupply();
    const burntTokens = 1000000000 - Math.floor(totalSupplyEndpointResult / 10 ** 18);
    const totalSupply = 1000000000 - Math.floor(totalBalance / 10 ** 18) - burntTokens;

    const htmlResponse = `
    <style>
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f5f5f5;
  }

  h1 {
    color: #333;
    font-size: 32px;
    margin-bottom: 20px;
    text-align: center;
  }

  p {
    color: #666;
    font-size: 16px;
    margin-bottom: 10px;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    background-color: #fff;
  }

  th,
  td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: left;
  }

  th {
    background-color: #f9f9f9;
    font-weight: bold;
    font-size: 16px;
  }

  tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  a {
    color: #337ab7;
    text-decoration: underline;
  }

  a:hover {
    color: #23527c;
  }

  .title-row {
    background-color: #333;
    color: black;
    font-weight: bold;
    font-size: 18px;
  }

  .total-supply-row {
    background-color: #f9f9f9;
  }

  .empty-row {
    background-color: transparent;
  }

  /* Responsive Styles */
  @media screen and (max-width: 600px) {
    h1 {
      font-size: 24px;
    }

    p {
      font-size: 14px;
    }

    th,
    td {
      padding: 8px;
    }
  }
</style>
 
 
    <h1>$CGPT Circulating Supply Tracker</h1>
      <p>Total Supply: 1,000,000,000</p>
    <p>Burnt $CGPT: ${burntTokens.toLocaleString()}</p>
    <p>Live Circulating Supply of $CGPT: ${totalSupply.toLocaleString()} (LP.excluded)</p>
    <p>Track supply with liquidity + Multi-sig wallets <b>included in the CS</b> <a href="https://supply.chaingpt.org/">Click Here</a></p><br>
    <br>
    <table>
    <tr class="title-row">
        <th>Contract Address</th>
        <th>Balance (CGPT)</th>
        <th>Chain</th>
        <th>Type</th>
        <th>Name</th>
      </tr>
      ${tableRows}
      <tr>
        <td>$CGPT Circulating Supply</td>
        <td>${totalSupply.toLocaleString()}</td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    </table>
    `;

    cache.set('balances2', htmlResponse); // Cache the response

    res.send(htmlResponse);
  } catch (error) {
    res.status(500).send('Error fetching data');
  }
});





app.get('/supply', async (req, res) => {
  const cachedSupply = cache.get('supply');
  if (cachedSupply !== undefined) {
    res.send(cachedSupply);
    return;
  }

  try {
    const balances = [];

    for (const { address, chain, type, wallet, name } of contractAddresses) {
      const url = `https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=${cgptContractAddress}&address=${address}&tag=latest&apikey=${apiKey}`;
      const response = await axios.get(url);
      const balance = parseInt(response.data.result);

      balances.push({ address, balance, chain, type, wallet, name });
    }

    balances.sort((a, b) => b.balance - a.balance); // Sort balances in descending order

    let totalBalance = 0;
    let tableRows = '';

    for (const { address, balance, chain, type, wallet } of balances) {
      totalBalance += balance;
      tableRows += `<tr>
        <td>${address}</td>
        <td>${Math.floor(balance / 10 ** 18).toLocaleString()}</td>
        <td>${chain}</td>
        <td>${type}</td>
        <td>${wallet}</td>
      </tr>`;
    }

    const totalSupplyEndpointResult = await getTotalSupply();
    const burntTokens = 1000000000 - Math.floor(totalSupplyEndpointResult / 10 ** 18);
    const totalSupply = 1000000000 - Math.floor(totalBalance / 10 ** 18) - burntTokens;

    const htmlResponse = `${totalSupply.toLocaleString()}`;

    cache.set('supply', htmlResponse); // Cache the supply response

    res.send(htmlResponse);
  } catch (error) {
    res.status(500).send('Error fetching data');
  }
});


app.get('/api', async (req, res) => {
  const cachedSupply = cache.get('supply');
  if (cachedSupply !== undefined) {
    res.send(cachedSupply);
    return;
  }

  try {
    const balances = [];

    for (const { address, chain, type, wallet, name } of contractAddressesCMC) {
      const url = `https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=${cgptContractAddress}&address=${address}&tag=latest&apikey=${apiKey}`;
      const response = await axios.get(url);
      const balance = parseInt(response.data.result);

      balances.push({ address, balance, chain, type, wallet, name });
    }

    balances.sort((a, b) => b.balance - a.balance); // Sort balances in descending order

    let totalBalance = 0;
    let tableRows = '';

    for (const { address, balance, chain, type, wallet } of balances) {
      totalBalance += balance;
      tableRows += `<tr>
        <td>${address}</td>
        <td>${Math.floor(balance / 10 ** 18).toLocaleString()}</td>
        <td>${chain}</td>
        <td>${type}</td>
        <td>${wallet}</td>
      </tr>`;
    }

    const totalSupplyEndpointResult = await getTotalSupply();
    const burntTokens = 1000000000 - Math.floor(totalSupplyEndpointResult / 10 ** 18);
    const totalSupply = 1000000000 - Math.floor(totalBalance / 10 ** 18) - burntTokens;

    const htmlResponse = `${totalSupply.toLocaleString()}`;

    cache.set('supply', htmlResponse); // Cache the supply response

    res.send(htmlResponse);
  } catch (error) {
    res.status(500).send('Error fetching data');
  }
});


app.get('/supplyLP', async (req, res) => {
  const cachedSupply = cache.get('supplyLP');
  if (cachedSupply !== undefined) {
    res.send(cachedSupply);
    return;
  }

  try {
    const balances = [];

    for (const { address, chain, type, wallet, name } of contractAddresses2) {
      const url = `https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=${cgptContractAddress}&address=${address}&tag=latest&apikey=${apiKey}`;
      const response = await axios.get(url);
      const balance = parseInt(response.data.result);

      balances.push({ address, balance, chain, type, wallet, name });
    }

    balances.sort((a, b) => b.balance - a.balance); // Sort balances in descending order

    let totalBalance = 0;
    let tableRows = '';

    for (const { address, balance, chain, type, wallet } of balances) {
      totalBalance += balance;
      tableRows += `<tr>
        <td>${address}</td>
        <td>${Math.floor(balance / 10 ** 18).toLocaleString()}</td>
        <td>${chain}</td>
        <td>${type}</td>
        <td>${wallet}</td>
      </tr>`;
    }

    const totalSupplyEndpointResult = await getTotalSupply();
    const burntTokens = 1000000000 - Math.floor(totalSupplyEndpointResult / 10 ** 18);
    const totalSupply = 1000000000 - Math.floor(totalBalance / 10 ** 18) - burntTokens;

    const htmlResponse = `${totalSupply.toLocaleString()}`;

    cache.set('supplyLP', htmlResponse); // Cache the supplyLP response

    res.send(htmlResponse);
  } catch (error) {
    res.status(500).send('Error fetching data');
  }
});


app.get('/totalsupply', async (req, res) => {
  const cachedSupply = cache.get('newtotal');
  if (cachedSupply !== undefined) {
    res.send(cachedSupply);
    return;
  }

  try {
    const balances = [];

    for (const { address, chain, type, wallet, name } of contractAddresses2) {
      const url = `https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=${cgptContractAddress}&address=${address}&tag=latest&apikey=${apiKey}`;
      const response = await axios.get(url);
      const balance = parseInt(response.data.result);

      balances.push({ address, balance, chain, type, wallet, name });
    }

    balances.sort((a, b) => b.balance - a.balance); // Sort balances in descending order

    let totalBalance = 0;
    let tableRows = '';

    for (const { address, balance, chain, type, wallet } of balances) {
      totalBalance += balance;
      tableRows += `<tr>
        <td>${address}</td>
        <td>${Math.floor(balance / 10 ** 18).toLocaleString()}</td>
        <td>${chain}</td>
        <td>${type}</td>
        <td>${wallet}</td>
      </tr>`;
    }

    const totalSupplyEndpointResult = await getTotalSupply();
    const burntTokens = 1000000000 - Math.floor(totalSupplyEndpointResult / 10 ** 18);
    const totalSupply = 1000000000 - Math.floor(totalBalance / 10 ** 18) - burntTokens;
    const newTotalS = 1000000000 - burntTokens; 
    const htmlResponse = `${newTotalS.toLocaleString()}`;

    cache.set('newtotal', htmlResponse); // Cache the newtotal response

    res.send(htmlResponse);
  } catch (error) {
    res.status(500).send('Error fetching data');
  }
});


app.get('/burn', async (req, res) => {
  const cachedSupply = cache.get('burn');
  if (cachedSupply !== undefined) {
    res.send(cachedSupply);
    return;
  }

  try {
    const balances = [];

    for (const { address, chain, type, wallet, name } of contractAddresses2) {
      const url = `https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=${cgptContractAddress}&address=${address}&tag=latest&apikey=${apiKey}`;
      const response = await axios.get(url);
      const balance = parseInt(response.data.result);

      balances.push({ address, balance, chain, type, wallet, name });
    }

    balances.sort((a, b) => b.balance - a.balance); // Sort balances in descending order

    let totalBalance = 0;
    let tableRows = '';

    for (const { address, balance, chain, type, wallet } of balances) {
      totalBalance += balance;
      tableRows += `<tr>
        <td>${address}</td>
        <td>${Math.floor(balance / 10 ** 18).toLocaleString()}</td>
        <td>${chain}</td>
        <td>${type}</td>
        <td>${wallet}</td>
      </tr>`;
    }

    const totalSupplyEndpointResult = await getTotalSupply();
    const burntTokens = 1000000000 - Math.floor(totalSupplyEndpointResult / 10 ** 18);
    const totalSupply = 1000000000 - Math.floor(totalBalance / 10 ** 18) - burntTokens;

    const htmlResponse = `${burntTokens.toLocaleString()}`;

    cache.set('burn', htmlResponse); // Cache the burn response

    res.send(htmlResponse);
  } catch (error) {
    res.status(500).send('Error fetching data');
  }
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
