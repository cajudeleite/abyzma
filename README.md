# Abyzma Project

Welcome to the Abyzma project! This is a React-based web application for ticket checkout functionality.

## 🚀 Tech Stack

- **React** - UI components and state management
- **React Router DOM** - Client-side routing
- **React Bits** - Pre-built, customizable UI components
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Styling and responsive design
- **Framer Motion** - Smooth animations and transitions
- **Animated Icons** - Dynamic, interactive iconography

## 📁 Project Structure

### Pages
- **`/` (Home)** - Landing page with a "coming soon" message
- **`/checkout`** - Ticket checkout page (currently in development)

### Components
- **React Bits** - Pre-built UI components for consistent design
- **Animated Icons** - Interactive icons with smooth transitions

### API Integration
The project connects to an external backend through the `src/api/` folder:

- **`stripe.ts`** - Handles Stripe payment processing integration
- **`phase.ts`** - Fetches the current phase information, like how many tickets are lefts etc...

## 🛠️ Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## 🎯 Current Development Status

- ✅ Home page with coming soon message
- 🚧 Checkout page with multi-step form (in progress)
- ✅ Stripe payment integration setup
- ✅ Responsive design and animations

## 📝 Notes for New Team Members

- We use TypeScript with strict type checking
- All components are built with modern React patterns (hooks, functional components)
- The Stepper component is highly customizable and reusable
- We leverage React Bits for consistent UI components across the application
- Animated icons are used throughout for enhanced user experience
- API calls are organized in the `src/api/` folder for easy maintenance