import React from "react";
import Banner from "./Banner";
import Features from "../Features/Features";
import Menu from "../Menu/Menu";
import Timeline from "../Timeline/Timeline";
import NavBar from "../../NavBar/NavBar";

const Home = () => {
  return (
    <div className="flex-1">
      <NavBar />
      <Banner />
      <Features />
      <Timeline />
    </div>
  );
};

export default Home;
