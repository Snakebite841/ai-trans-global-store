# Development Roadmap

## Phase 1: Project Setup & Boilerplate (Done ✨)
- Setup React frontend with Vite, TailwindCSS, & Framer Motion
- Setup Express backend with Firebase Admin
- Define general architecture & folder structure
- Define initial theme & CSS rules (Glassmorphism, dark mode)

## Phase 2: Firebase Integration & Schema
- Setup Firebase project (Firestore & Auth)
- Define `users`, `products`, and `orders` collections
- Setup Firestore Security Rules
- Integrate frontend Context API with Firebase Auth

## Phase 3: Frontend Routes & Core UI Components
- Build Navbar, Footer, and beautiful Layout container
- Implement Home page with Hero, Featured Products, Categories
- Implement reusable components (Glass Card, Glass Button)
- Design interactive Loading States (Skeletons) & Toasts

## Phase 4: Product Exploration
- Implement Product Listing Page
- Build Category filters, dynamic search, price sorting
- Implement Product Details Page (Image Gallery, Stock, Add to cart)

## Phase 5: Cart & Checkout (GHS Currency)
- Build Cart context (localStorage, Add/remove, update quantities)
- Build Checkout View (GHS subtotal & total)
- Handle "Place Order" -> reduces stock, marks "Paid", creates order
- Order Success Page redirect

## Phase 6: Admin Dashboard
- Implement protected Admin routes
- Dashboard overview (Total Sales GHS, Total Orders, charts)
- Product Management (CRUD products tools)
- Order Management (View orders, edit status)
- User Management (View users, toggle Admin flag)

## Phase 7: Polish & Launch
- Responsive testing (Mobile/Tablet optimization)
- Form validation & animations (Framer Motion)
- API endpoint stress testing
- Documentation & Deployment instructions (Vercel/Render)
