const axios = require('axios');
const fs = require('fs');
const readline = require('readline');

const headers = {
    'user-agent': 'Dart/3.6 (dart:io)',
    'accept-encoding': 'gzip',
    'host': 'api.airdroptoken.com',
    'accept': '*/*',
    'content-type': 'application/json'
};

const firebaseHeaders = {
    'Content-Type': 'application/json',
    'X-Android-Package': 'com.lumira_mobile',
    'X-Android-Cert': '1A1F179100AAF62649EAD01C6870FDE2510B1BC2',
    'Accept-Language': 'en-US',
    'X-Client-Version': 'Android/Fallback/X22003001/FirebaseCore-Android',
    'X-Firebase-GMPID': '1:599727959790:android:5c819be0c7e7e3057a4dff',
    'X-Firebase-Client': 'H4sIAAAAAAAAAKtWykhNLCpJSk0sKVayio7VUSpLLSrOzM9TslIyUqoFAFyivEQfAAAA',
    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 7.1.2; ASUS_Z01QD Build/N2G48H)',
    'Host': 'www.googleapis.com',
    'Connection': 'Keep-Alive',
    'Accept-Encoding': 'gzip'
};

function generateRandomString(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function generateRandomBirthday() {
    const start = new Date(1980, 0, 1);
    const end = new Date(2005, 11, 31);
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    const year = randomDate.getFullYear();
    const month = String(randomDate.getMonth() + 1).padStart(2, '0');
    const day = String(randomDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function generateAccountData() {
    const randomStr = generateRandomString(8);
    const referralCode = fs.readFileSync('code.txt', 'utf8').trim();
    return {
        full_name: `user${randomStr}`,
        username: `user${randomStr}`,
        email: `user${randomStr}@gmail.com`,
        password: `Pass${randomStr}123`,
        phone: `+628${Math.floor(100000000 + Math.random() * 900000000)}`,
        referral_code: referralCode,
        country: 'ID',
        birthday: generateRandomBirthday()
    };
}

async function checkEmail(email) {
    try {
        const response = await axios.get(
            `https://api.airdroptoken.com/user/email-in-use?email=${encodeURIComponent(email)}`,
            { headers }
        );
        return !response.data.in_use;
    } catch (error) {
        console.error('Error checking email:', error.message);
        return false;
    }
}

async function checkUsername(username) {
    try {
        const response = await axios.get(
            `https://api.airdroptoken.com/user/username-in-use?username=${username}`,
            { headers }
        );
        return !response.data.in_use;
    } catch (error) {
        console.error('Error checking username:', error.message);
        return false;
    }
}

async function login(email, password) {
    try {
        const payload = {
            email: email,
            password: password,
            returnSecureToken: true,
            clientType: 'CLIENT_TYPE_ANDROID'
        };

        const response = await axios.post(
            'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyB0YXNLWl-mPWQNX-tvd7rp-HVNr_GhAmk',
            payload,
            { headers: firebaseHeaders }
        );

        return response.data.idToken;
    } catch (error) {
        console.error('Login failed:', error.response?.data?.error?.message || error.message);
        return null;
    }
}

async function startMining(token) {
    try {
        await axios.put(
            'https://api.airdroptoken.com/miners/miner',
            {},
            {
                headers: {
                    ...headers,
                    'authorization': `Bearer ${token}`,
                    'content-length': 0
                }
            }
        );

        await axios.put(
            'https://api.airdroptoken.com/user/ads',
            'ads_enabled=false',
            {
                headers: {
                    ...headers,
                    'authorization': `Bearer ${token}`,
                    'content-type': 'application/x-www-form-urlencoded; charset=utf-8',
                    'content-length': '17'
                }
            }
        );

        return true;
    } catch (error) {
        console.error('Error starting mining:', error.message);
        return false;
    }
}

async function monitorUserAndMiningInfo(token, email, accounts, accountIndex) {
    let running = true;

    process.on('SIGINT', () => {
        console.log(`\nStopping monitoring for ${email}...`);
        running = false;
        saveToFile(accounts);
    });

    while (running) {
        try {
            const userResponse = await axios.get(
                'https://api.airdroptoken.com/user/user/',
                {
                    headers: {
                        ...headers,
                        'authorization': `Bearer ${token}`
                    }
                }
            );

            const miningResponse = await axios.get(
                'https://api.airdroptoken.com/miners/miner/',
                {
                    headers: {
                        ...headers,
                        'authorization': `Bearer ${token}`
                    }
                }
            );

            const userData = userResponse.data;
            const userDetails = userData.details || {};
            const miningData = miningResponse.data.object || {};

            accounts[accountIndex] = {
                ...accounts[accountIndex],
                miner_active: userDetails.miner_active ?? 'N/A',
                adt_balance: userDetails.adt_balance ?? 'N/A',
                max_miners: userDetails.max_miners ?? 'N/A',
                mining_info: {
                    active: miningData.active ?? 'N/A',
                    adt_earned: miningData.adt_earned ?? 'N/A',
                    mining_time_left: miningData.mining_time_left ?? 'N/A',
                    adt_per_hour: miningData.adt_per_hour ?? 'N/A'
                }
            };

            console.clear();
            console.log(`Information for ${email}:`);
            console.log(`Full Name: ${userData.full_name || 'N/A'}`);
            console.log(`Email: ${userData.email || 'N/A'}`);
            console.log(`Country: ${userData.country || 'N/A'}`);
            console.log(`Miner Active: ${userDetails.miner_active ?? 'N/A'}`);
            console.log(`ADT Balance: ${userDetails.adt_balance ?? 'N/A'}`);
            console.log(`Max Miners: ${userDetails.max_miners ?? 'N/A'}`);
            console.log(`Mining Active: ${miningData.active ?? 'N/A'}`);
            console.log(`ADT Earned: ${miningData.adt_earned ?? 'N/A'}`);
            console.log(`Mining Time Left: ${miningData.mining_time_left ?? 'N/A'} seconds`);
            console.log(`ADT Per Hour: ${miningData.adt_per_hour ?? 'N/A'}`);
            console.log('\nPress Ctrl+C to stop monitoring...');

            await new Promise(resolve => setTimeout(resolve, 5000));
        } catch (error) {
            console.error(`Error monitoring for ${email}:`, error.message);
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
}

async function registerAccount(accountData) {
    try {
        const [emailAvailable, usernameAvailable] = await Promise.all([
            checkEmail(accountData.email),
            checkUsername(accountData.username)
        ]);

        if (!emailAvailable || !usernameAvailable) {
            throw new Error('Email or username already in use');
        }

        const response = await axios.post(
            'https://api.airdroptoken.com/user/register',
            accountData,
            {
                headers: {
                    ...headers,
                    'authorization': 'Bearer null',
                    'content-length': JSON.stringify(accountData).length
                }
            }
        );

        return {
            success: true,
            data: accountData,
            response: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
            data: accountData
        };
    }
}

function saveToFile(accounts) {
    fs.writeFileSync('accounts.txt', accounts.map(account => JSON.stringify(account)).join('\n'));
}

async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Enter the number of accounts to create: ', async (answer) => {
        const count = parseInt(answer);
        if (isNaN(count) || count <= 0) {
            console.log('Enter a valid number!');
            rl.close();
            return;
        }

        const accounts = [];
        console.log(`Starting creation of ${count} accounts...`);

        for (let i = 0; i < count; i++) {
            console.log(`Creating account ${i + 1}...`);
            const accountData = generateAccountData();
            const result = await registerAccount(accountData);

            if (result.success) {
                console.log(`Account ${i + 1} created successfully: ${accountData.email}`);
                accounts.push(result.data);
            } else {
                console.log(`Failed to create account ${i + 1}: ${result.error}`);
            }

            await new Promise(resolve => setTimeout(resolve, 1000)); // Delay between account creations
        }

        saveToFile(accounts);
        console.log(`All accounts created! Account data saved to accounts.txt`);

        // Start mining for all created accounts
        for (const account of accounts) {
            const token = await login(account.email, account.password);
            if (token) {
                const miningStarted = await startMining(token);
                console.log(`Mining ${miningStarted ? 'started successfully' : 'failed to start'} for ${account.email}`);
                if (miningStarted) {
                    await monitorUserAndMiningInfo(token, account.email, accounts, accounts.length - 1);
                }
            } else {
                console.log(`Failed to login for ${account.email}`);
            }
        }

        rl.close();
    });
}

main().catch(console.error);
