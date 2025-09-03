# ⚡ Mira Network Lumira Coin — AirdropToken Automation Script

Automate bulk account creation, login, mining activation, and real-time monitoring on [airdroptoken.com](https://airdroptoken.com) with this robust Node.js script.

---

## ✨ Key Features

- 🔄 **Bulk Account Automation:** Randomized generation of usernames, emails, passwords, phone numbers, and birthdays.
- ✅ **Availability Checks:** Verifies email and username availability before registration.
- 🔗 **Referral Integration:** Reads referral code from `code.txt` for each signup.
- 🔐 **Secure Login:** Authenticates via Firebase API and manages tokens.
- ⛏️ **Mining Activation:** Starts mining and disables ads automatically.
- 📊 **Live Monitoring:** Displays mining stats and user info every 5 seconds.
- 🧾 **Persistent Storage:** Saves all account credentials to `accounts.txt`.
- 🛑 **Graceful Exit:** Handles Ctrl+C to safely terminate and save progress.

---

## 📦 Requirements

- [Node.js](https://nodejs.org/) v14 or higher
- npm (comes bundled with Node.js)

---

## 🛠️ Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/zcsaqueeb/Mira-Network-Lumira-coin-.git
   cd Mira-Network-Lumira-coin-
   ```

2. **Install dependencies:**

   ```bash
   npm install axios readline
   ```

3. **Add your referral code:**

   Create a file named `code.txt` in the root directory and paste your referral code inside.

---

## ▶️ How to Use

Run the script:

```bash
node reff.js
```

- Enter the number of accounts to create when prompted.
- The script will:
  - Generate and register accounts.
  - Log in and activate mining.
  - Display live mining stats every 5 seconds.
- Press `Ctrl+C` to stop and save all account data.

---

## 🔐 Configuration & Security

- **Firebase API Key:** Currently embedded in the script. For enhanced security, consider moving it to environment variables or a `.env` config file.
- **Referral Code:** Must be present in `code.txt`.
- **Compliance:** Use responsibly and adhere to [airdroptoken.com](https://airdroptoken.com) terms of service.

---

## 🧩 Troubleshooting

- Ensure a stable internet connection.
- Confirm `code.txt` exists and contains a valid referral code.
- Watch console logs for API errors or rate limits.
- Keep dependencies updated (`npm update`).

---

## 📜 License

This project is distributed "as-is" without warranty. Use at your own risk.

---



> 💡 *Streamline your  mining workflow with this powerful automation toolkit from Mira Network Lumira Coin.*


---

Let me know if you'd like to add badges, internationalization notes, or Docker support — I can help you modularize and scale this even further.
