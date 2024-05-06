import { BrowserRouter, Routes, Route } from "react-router-dom";

import SearchPage from "./pages/SearchPage";
import ResultPage from "./pages/resultPage";
import BusinessPage from "./pages/businessPage";
import UserReviewsPage from "./component/userPage"

export default function App(){
    
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<SearchPage />} />
                    <Route path="/business/:business_id" element={<BusinessPage />} />
                    <Route path="/search_outcome" element={<ResultPage />} />
                    <Route path="/user/:user_id" element={<UserReviewsPage />}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}