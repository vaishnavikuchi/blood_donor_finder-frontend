# BloodLink India 🇮🇳 - Frontend (React)

A React 18 Single Page Application (SPA) frontend for the **Blood Donor Finder with Emergency Requests** application, built with Vite, Tailwind CSS, React Router v6, Axios, and Recharts.

## 🛠 Tech Stack
- **React 18** + **Vite** – Fast SPA development
- **React Router DOM v6** – Client-side routing (5 pages)
- **Tailwind CSS** – Utility-first styling
- **Axios** – HTTP client with JWT interceptor
- **Recharts** – Blood group distribution charts
- **Lucide React** – Icon library
- **Context API** – Auth & Toast state management

## 🚀 Running Locally

> ⚠️ Make sure the [backend server](https://github.com/vaishnavikuchi/bloodlink-india-backend) is running at `http://localhost:8081` first.

```bash
# Clone the repo
git clone https://github.com/vaishnavikuchi/bloodlink-india-frontend.git
cd bloodlink-india-frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```
App runs at: **http://localhost:5173**

## 📄 Pages (5 total)
| Route | Page | Access |
|-------|------|--------|
| `/` | Home | Public |
| `/donors` | Find Donors | Public |
| `/requests` | Blood Requests | Public (actions need login) |
| `/donor-dashboard` | Donor Dashboard | Protected |
| `/auth` | Login / Register | Public |

## 🔑 Demo Login (1-click)
On the `/auth` page, use the quick-login buttons for:
- **Rahul Sharma** – Donor in Hyderabad (O+)
- **Aarav Kumar** – Donor in Bengaluru (A+)
- **Divya Mehra** – Request owner in Mumbai

Password for all demo accounts: `password123`

## 🏗 Project Structure
```
src/
├── api/            # Axios instance with JWT interceptor
├── context/        # AuthContext, ToastContext
├── pages/          # Home, FindDonors, Requests, DonorDashboard, Auth
├── components/     # Navbar, PrivateRoute, Toast
└── App.jsx         # Router configuration
```

## 🔗 Backend Repository
[bloodlink-india-backend](https://github.com/vaishnavikuchi/bloodlink-india-backend)
