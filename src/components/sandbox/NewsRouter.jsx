import React, { useEffect, useState,lazy, Suspense } from 'react';
import ReactDOM from "react-dom";
import { Redirect, Route, Switch } from 'react-router-dom';
import axios from 'axios';
// import AuditAudit from '../../views/sandbox/audit-manage/AuditAudit'
// import AuditList from '../../views/sandbox/audit-manage/AuditList'
// import Home from '../../views/sandbox/home/Home'
// import NewsAdd from '../../views/sandbox/news-manage/NewsAdd'
// import NewsCategory from '../../views/sandbox/news-manage/NewsCategory'
// import NewsDraft from '../../views/sandbox/news-manage/NewsDraft'
// import NewsPreview from '../../views/sandbox/news-manage/NewsPreview'
// import NewUpdate from '../../views/sandbox/news-manage/NewsUpdate'
// import NoPermission from '../../views/sandbox/noPermission/NoPermission'
// import Published from '../../views/sandbox/publish-manage/Published'
// import PublishSunset from '../../views/sandbox/publish-manage/PublishSunset'
// import Unpublished from '../../views/sandbox/publish-manage/PublishUnpublished'
// import RightList from '../../views/sandbox/right-manage/RightList'
// import RoleList from '../../views/sandbox/right-manage/RoleList'
// import UserList from '../../views/sandbox/user-manage/UserList'
import { Spin } from 'antd'

import { connect } from 'react-redux'

const AuditAudit = lazy(() => import('../../views/sandbox/audit-manage/AuditAudit'));
const AuditList  = lazy(() => import('../../views/sandbox/audit-manage/AuditList'));
const Home = lazy(() => import('../../views/sandbox/home/Home'));
const NewsAdd = lazy(() => import('../../views/sandbox/news-manage/NewsAdd'));
const NewsCategory = lazy(() => import('../../views/sandbox/news-manage/NewsCategory'));
const NewsDraft = lazy(() => import( '../../views/sandbox/news-manage/NewsDraft'));
const NewsPreview  = lazy(() => import('../../views/sandbox/news-manage/NewsPreview'));
const NewUpdate  = lazy(() => import('../../views/sandbox/news-manage/NewsUpdate'));
const NoPermission = lazy(() => import('../../views/sandbox/noPermission/NoPermission'));
const Published  = lazy(() => import('../../views/sandbox/publish-manage/Published'));
const PublishSunset = lazy(() => import('../../views/sandbox/publish-manage/PublishSunset'));
const Unpublished  = lazy(() => import('../../views/sandbox/publish-manage/PublishUnpublished'));
const RightList  = lazy(() => import('../../views/sandbox/right-manage/RightList'));
const RoleList  = lazy(() => import('../../views/sandbox/right-manage/RoleList'));
const UserList  = lazy(() => import('../../views/sandbox/user-manage/UserList'));

function NewsRouter(props) {
    const [BackRouteList, setBackRouteList] = useState([])
    useEffect(()=>{
      Promise.all([
          axios.get("/rights"),
          axios.get("/children"),
      ]).then((res)=>{
          //将后端返回的两个数组合并
        //   console.log(res[0]);
        setBackRouteList([...res[0].data,...res[1].data])
        // console.log(BackRouteList);
      })
    },[])

    //前后端匹配路径
    const localRouterMap = {
        "/home":Home,
        "/user-manage/list":UserList,
        "/right-manage/role/list":RoleList,
        "/right-manage/right/list":RightList,
        "/news-manage/add":NewsAdd,
        "/news-manage/draft":NewsDraft,
        "/news-manage/category":NewsCategory,
        "/news-manage/preview/:id":NewsPreview,
        "/news-manage/update/:id":NewUpdate,
        "/audit-manage/audit":AuditAudit,
        "/audit-manage/list":AuditList,
        "/publish-manage/unpublished":Unpublished,
        "/publish-manage/published":Published,
        "/publish-manage/sunset":PublishSunset
    }
    const {role:{rights}} = JSON.parse(localStorage.getItem("token"));
    //检查是否有pagepermisson权限以及是否有对应的路由组件
    const checkRoute = (item)=>{
        return (item.pagepermisson || item.routepermisson) && localRouterMap[item.key]
    }
    //检查登录的用户的所拥有的权限,限制路由
    const checkUserPermission = (item)=>{
        return rights.includes(item.key)
    }
    
    return (
        //加载中组件
        <Suspense fallback={ReactDOM.createPortal(<Spin size="large" style={{position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)'}}></Spin>,document.body)}>
        <Spin size="large" spinning={props.isSpinning}  style={{position:'fixed!important',top:'50%',left:'50%',transform:'translate(-50%,-50%)'}}>
        <Switch>
            {
                BackRouteList.map( item =>{
                    if (checkRoute(item)&&checkUserPermission(item)){
                        return <Route path={item.key} key={item.key} component={localRouterMap[item.key]} exact/>
                    }
                    return null
                })
            }
            

            <Redirect from="/" to="/home" exact/>
            {BackRouteList.length>0?<Route path="*" component={NoPermission}/>:undefined}
        </Switch>
        </Spin >
        </Suspense>
       
    )
}
export default connect(
    ({SpinningReducer:{isSpinning}})=>({isSpinning}),
    
)(NewsRouter)