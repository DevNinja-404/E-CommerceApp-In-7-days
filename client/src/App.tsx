import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import { Footer } from "./components/Footer";

const App = () => {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-200px)]">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default App;
