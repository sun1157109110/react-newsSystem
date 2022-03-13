import React, { lazy, Suspense } from "react";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";
import { Spin } from 'antd'

// import Detail from "../views/news/Detail/Detail";
// import NewsList from "../views/news/NewsList/NewsList";
// import NewsSandBox from "../views/sandbox/NewsSandBox";
// import SelectTest from "../views/SelectTest";

const Login = lazy(() => import("../views/Login/Login"));
const Detail = lazy(() => import("../views/news/Detail/Detail"));
const NewsList = lazy(() => import("../views/news/NewsList/NewsList"));
const NewsSandBox = lazy(() => import("../views/sandbox/NewsSandBox"));

export default function IndexRouter() {
  return (
    <HashRouter>
      <Suspense fallback={<Spin size="large"></Spin>}>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/news" component={NewsList} />
          <Route path="/detail/:id" component={Detail} />
          <Route
            path="/"
            render={() =>
              localStorage.getItem("token") ? (
                <NewsSandBox></NewsSandBox>
              ) : (
                <Redirect to="/login" />
              )
            }
          />
        </Switch>
      </Suspense>
    </HashRouter>
  );
}
