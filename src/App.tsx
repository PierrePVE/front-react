import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import "@style/app.css";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "@components/navbar.tsx";

// Composants des pages
import Login from "./route/Login.tsx";
import Home from "./route/home.tsx";
import UserPage from "./route/userPage.tsx";
import Apropos from "./route/Apropos.tsx";
import Manuel from "./route/ManuelUtilisation.tsx";

const pageVariants = {
  initial: { scale: 1.1, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
};


const transition = { duration: 0.25 };

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ type: "tween", duration: 0.6 }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/Apropos" element={<Apropos />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Manuel" element={<Manuel />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <NavBar />
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
