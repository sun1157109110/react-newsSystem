import React,{useEffect, useState} from 'react'
import { Layout, Menu } from 'antd';
import { withRouter } from 'react-router-dom';
import {
    SettingOutlined,
    UserOutlined,
    VideoCameraOutlined,
  } from '@ant-design/icons';
import './index.css'
import axios from 'axios';
import { connect } from 'react-redux';
const { SubMenu } = Menu;

const { Sider } = Layout;

// const menuList = [
//   {key:'/home',title:'首页',icon:<UserOutlined />},
//   {key:'/user-manage',title:'用户管理',icon:<VideoCameraOutlined />,children:[{key:'/user-manage/list',title:'用户列表',icon:<VideoCameraOutlined />}]},
//   {key:'/right-manage',title:'权限管理',icon:<SettingOutlined />,children:[{key:'/right-manage/role/list',title:'角色列表',icon:<SettingOutlined />},{key:'/right-manage/right/list',title:'权限列表',icon:<SettingOutlined />}]},

// ]

function SideMenu(props) {
  const [menu,setMenu] = useState([])

  useEffect(()=>{
    axios.get("/rights?_embed=children").then((res)=>{
      setMenu(res.data)
  })},[])
  const checkPagePerimission =  (item)=>{
    //返回有权限值且筛选登录用户特有的权限
      return item.pagepermisson ===1 && rights.includes(item.key)
  }
  const users = JSON.parse(localStorage.getItem("token"));
  const {role:{rights}} = users

  const iconList = {
    '/home':<UserOutlined />,
    '/user-manage':<VideoCameraOutlined />,
    '/user-manage/list':<VideoCameraOutlined />,
    '/right-manage':<SettingOutlined />,
    '/right-manage/role/list':<UserOutlined />,
    '/right-manage/right/list':<UserOutlined />
  }
  const renderMenu = (menuList)=>{
    return menuList.map( item =>{
      const {key,title,children} = item
      if (children && children.length > 0 && checkPagePerimission(item)){
        return <SubMenu key={key} icon={iconList[key]} title={title}>
                {renderMenu(children)}
               </SubMenu>
      }else{
        return checkPagePerimission(item)&&<Menu.Item key={key} icon={iconList[key]} onClick={()=>{props.history.push(key)}}>
                {title}
              </Menu.Item>
      }
    })
  }
  

  const selectedKeys = [props.location.pathname]
  const openKeys = ["/"+props.location.pathname.split("/")[1]]

    return (
        <Sider trigger={null}  collapsed={props.isCollapsed}>
          <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
            <div className="logo" >新闻发布管理系统</div>
            <div style={{flex:"1","overflow":"auto"}}>
              <Menu theme="dark" mode="inline" selectedKeys={selectedKeys} defaultOpenKeys={openKeys}>
                {renderMenu(menu)}
              </Menu>
            </div>
          </div>
        </Sider>
    )
}
export default connect(
  (state)=>({isCollapsed:state.CollapsedReducer.isCollapsed})
)(withRouter(SideMenu))
