import { Route, Routes } from "react-router-dom";
import Home from "./views/home";
import MainLayout from "./layouts/main";
import Punks from "./views/punks";
import Punk from "./views/punk";
function App() {
	return (
		<MainLayout>
			<Routes>
				<Route path="/" element={<Home />}></Route>
				<Route path="/punks" element={<Punks />}></Route>
				<Route path="/punks/:tokenId" element={<Punk />}></Route>
			</Routes>
		</MainLayout>
	);
}

export default App;
