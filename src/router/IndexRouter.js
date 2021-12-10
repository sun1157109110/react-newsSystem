import React from 'react'
import { HashRouter,Redirect,Route, Switch } from 'react-router-dom'
import Login from '../views/Login/Login' 
import Detail from '../views/news/Detail/Detail'
import NewsList from '../views/news/NewsList/NewsList'


import NewsSandBox from '../views/sandbox/NewsSandBox' 

export default function IndexRouter() {
    return (
            <HashRouter>
                <Switch>
                    <Route path="/login" component={Login}/>
                    <Route path="/news" component={NewsList}/>
                    <Route path="/detail/:id" component={Detail}/>
                    <Route path="/" render={()=>
                        localStorage.getItem("token")?
                        <NewsSandBox></NewsSandBox>:
                        <Redirect to="/login"/>

                    }/>
                </Switch>
            </HashRouter>
    )
}
