# ⬛ BILLBORED X : The Digital Times Square

> Traditional advertising is a sunk cost. We fixed it.

BillboredX is a real-time, competitive digital billboard functioning as a status credit system. Brands buy a space. If they get pushed down, they can upgrade their spot later by paying only the difference. No sunk costs. Just pure financial competition.

Reserved strictly for the Top 99 brands globally.

## ⚡ Tech Stack

- **Frontend:** React 19 + Vite + Tailwind CSS
- **Backend:** Vercel Serverless Functions (`/api`)
- **Database:** Firebase Firestore (Real-time syncing)
- **Payments:** Razorpay Checkout Integration
- **Design:** Pure CSS Brutalism, Grid Layouts, CSS Marquees

## 🛠 Architecture (Split Deployment)

This project utilizes a high-performance split architecture:
1. **Frontend:** Hosted on Firebase Hosting (`billbored.web.app`)
2. **Backend API:** Hosted on Vercel (`api/checkout` & `api/webhook`)

When a user executes a "Takeover", the frontend calls the Vercel API. Vercel generates a secure Razorpay Order. Upon successful payment, Razorpay pings the Vercel Webhook, which uses the Firebase Admin SDK to securely bypass client rules and immediately update the live board.

## 🚀 Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
3. Set up your .env file with your Razorpay and Firebase configuration.
4. Run the development server (uses Vite):
   npm run dev


📜 The Rules of the Board
Minimum Takeover: To takeover an existing position, you must bid at least $1 more than the current price.
Dynamic Defense: You can bid as high as you want to defend your billboard from future takeovers.
Credit System: If your rank is stolen, your original bid acts as a credit. You only pay the difference to reclaim your spot.
