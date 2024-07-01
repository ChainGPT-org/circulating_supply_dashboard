
const NodeCache = require('node-cache');
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3000;

// BSCSCAN API Key (ENV)
const apiKey = process.env.BSCSCAN_API_KEY;

// Contract address of CGPT token (ENV)
const cgptContractAddress = process.env.CGPT_CONTRACT_ADDRESS;

// Maximum Supply of CGPT token (ENV)
const MaxSupply = process.env.CGPT_MAX_SUPPLY;

const cache = new NodeCache({ stdTTL: 600 }); // Set the cache expiration time to 600 seconds (10 minutes)

// List of contract addresses with additional information
const contractAddresses = [
  {
    address: '0x1f7bAAf93e0449394e80f3A24c14fB2fA667495c',
    chain: 'BSC',
    type: 'TeamFinance Vesting',
    wallet: 'KOLs Round (ref: tokenomics)', 
  },
 // {
 //   address: '0x77A8b449e7cd61dd54B755034Baf9d00EeeD1076',
 //   chain: 'BSC',
 //   type: 'TeamFinance Vesting',
 //   wallet: 'Seedify IDO Fee (3.5%) in tokens', 
 // },
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
//  {
//    address: '0x915a6fF38cab0bB0B027179D7b5f196DAB25C626',
//    chain: 'BSC',
//    type: 'IDO Round Vesting',
//    wallet: 'Seedify IDO', 
//  },
//  {
//    address: '0x6dAa1b5F9cF268AF2fd93Dff8083E2d3ca237008',
//    chain: 'BSC',
//    type: 'Crowdfunding Vesting',
//    wallet: 'YAYNetwork', 
//  },
 // {
 //   address: '0x98E9EBc9539d674cbcd505b6A6483991d50c2356',
//    chain: 'BSC',
//    type: 'Crowdfunding Vesting',
//    wallet: 'Decubate', 
//  },
 // {
 //   address: '0xd377766831DE29B39Ea45687983F9F590add517f',
 //   chain: 'BSC',
 //   type: 'IDO Round Vesting',
 //   wallet: 'EnjinStarter', 
 // },
//  {
//    address: '0x436CE2ce8d8d2Ccc062f6e92faF410DB4d397905',
//    chain: 'BSC',
//    type: 'IDO Round Vesting',
//    wallet: 'Poolz', 
//  },
      {
    address: '0x926D28476A4bB4F7E4c27C913a3495b3d7393006',
    chain: 'BSC',
    type: 'TeamFinance  Contract (Locked)',
    wallet: 'Seedify  Incubation Fee (1%)', 
  },
//  {
//    address: '0xd58DE7168b7d22048db5EdAafa07265B70407Bc0',
//    chain: 'BSC',
//    type: 'IDO Round Vesting',
//    wallet: 'WePad', 
//  },
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
//  {
//    address: '0x28FBFA75850E246BdD454A0e76FeAA42D771757B',
//    chain: 'BSC',
//    type: 'Staking Pools',
//    wallet: 'ChainGPT Pad Staking Pool - Rewards Distributor', 
//  },
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

// This is the home-page URL that will show a detailed list of the excluded addresses from the supply and all the data such as total supply, burnt supply, circulating supply, etc.
app.get('/', async (req, res) => {
  const cachedBalances = cache.get('balances');
  if (cachedBalances !== undefined) {
    res.send(cachedBalances);
    return;
  }

  try {
    const balances = [];

    for (const { address, chain, type, wallet, name } of contractAddresses) {
      
        await new Promise(resolve => setTimeout(resolve, 250));

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
    const burntTokens = MaxSupply - Math.floor(totalSupplyEndpointResult / 10 ** 18);
    const totalSupply = MaxSupply - Math.floor(totalBalance / 10 ** 18) - burntTokens;

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
  <p>Live Circulating Supply of $CGPT: ${totalSupply.toLocaleString()} </p>
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



// This is an API endpoint that will show only the number of the circulating supply (normally used for CMC supply tracking)
app.get('/supply', async (req, res) => {
  const cachedSupply = cache.get('supply');
  if (cachedSupply !== undefined) {
    res.send(cachedSupply);
    return;
  }

  try {
    const balances = [];

    for (const { address, chain, type, wallet, name } of contractAddresses) {
      // Introduce a delay of 250ms (1 second / 4) between each API call
      await new Promise(resolve => setTimeout(resolve, 250));

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
        <td>${Math.floor(balance / 10 ** 18)}</td>
        <td>${chain}</td>
        <td>${type}</td>
        <td>${wallet}</td>
      </tr>`;
    }

    const totalSupplyEndpointResult = await getTotalSupply();
    const burntTokens = MaxSupply - Math.floor(totalSupplyEndpointResult / 10 ** 18);
    const totalSupply = MaxSupply - Math.floor(totalBalance / 10 ** 18) - burntTokens;

    const htmlResponse = `${totalSupply}`;

    cache.set('supply', htmlResponse); // Cache the supply response

    res.send(htmlResponse);
  } catch (error) {
    res.status(500).send('Error fetching data');
  }
});


// This API endpoint will show the total supply
app.get('/totalsupply', async (req, res) => {
  const cachedSupply = cache.get('newtotal');
  if (cachedSupply !== undefined) {
    res.send(cachedSupply);
    return;
  }

  try {
    const balances = [];

    for (const { address, chain, type, wallet, name } of contractAddresses) {
        await new Promise(resolve => setTimeout(resolve, 250));

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
        <td>${Math.floor(balance / 10 ** 18)}</td>
        <td>${chain}</td>
        <td>${type}</td>
        <td>${wallet}</td>
      </tr>`;
    }

    const totalSupplyEndpointResult = await getTotalSupply();
    const burntTokens = MaxSupply - Math.floor(totalSupplyEndpointResult / 10 ** 18);
    const totalSupply = MaxSupply - Math.floor(totalBalance / 10 ** 18) - burntTokens;
    const newTotalS = MaxSupply - burntTokens; 
    const htmlResponse = `${newTotalS}`;

    cache.set('newtotal', htmlResponse); // Cache the newtotal response

    res.send(htmlResponse);
  } catch (error) {
    res.status(500).send('Error fetching data');
  }
});



// This API endpoint will show the total tokens burnt
app.get('/burn', async (req, res) => {
  const cachedSupply = cache.get('burn');
  if (cachedSupply !== undefined) {
    res.send(cachedSupply);
    return;
  }

  try {
    const balances = [];

    for (const { address, chain, type, wallet, name } of contractAddresses) {
        await new Promise(resolve => setTimeout(resolve, 250));

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
    const burntTokens = MaxSupply - Math.floor(totalSupplyEndpointResult / 10 ** 18);
    const totalSupply = MaxSupply - Math.floor(totalBalance / 10 ** 18) - burntTokens;

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
