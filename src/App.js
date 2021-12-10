import React from "react";
import IndexRouter from "./router/IndexRouter";

import "./App.css";
import { Provider } from "react-redux";
import { store,persistor } from "./redux/store";
import { PersistGate } from 'redux-persist/integration/react'

export default function App() {
  
  // useEffect(()=>{
  //   axios.get("/ajax/topRatedMovies?token=&optimus_uuid=12159750E89811EB9B074353A5984C301DD1673B926E4F4CAEEBB4C40E19CF49&optimus_risk_level=71&optimus_code=10").then((res) => {
  //     console.log(res);
  //   })
  // },[])
  return (
    <Provider store={store}>
      {/* 延迟应用 UI 的呈现，直到您的持久状态被检索并保存到 redux */}
      <PersistGate loading={null} persistor={persistor}>
      <IndexRouter></IndexRouter>
      </PersistGate>
    </Provider>
  );
}
