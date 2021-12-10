import React from 'react'
import { Layout,Dropdown,Menu,Avatar} from 'antd';
import {
    UserOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
  } from '@ant-design/icons';
import { useHistory, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
const { Header} = Layout;

function TopHeader(props) {
  
    // const [collapsed,setCollapsed] = useState(false)
    const history = useHistory()

    // const changeCollapsed = ()=>{
    //     setCollapsed(!collapsed)
    // }
    const quit = ()=>{
      //使用的是useHistory钩子,也可以使用withRouter包裹,props.history.replace进行页面跳转
      localStorage.removeItem("token")
      history.replace('/login')
    }
    const user = JSON.parse(localStorage.getItem("token"));
    const {role:{roleName},username} = user

    const menu = (
        <Menu>
          <Menu.Item key='0'>
            {roleName}
          </Menu.Item>
            <Menu.Item danger onClick={quit} key='1'>退出</Menu.Item>
        </Menu>
      );

    return (
        <Header className="site-layout-background" style={{ padding: '0 16px' }}>
            {/* 通过控制collapsed值选择不同的图标,后面使用redux统一管理 */}
            {props.isCollapsed ? < MenuUnfoldOutlined onClick={props.changeCollapsed}/> : <MenuFoldOutlined onClick={props.changeCollapsed}/>}

            <div style={{float:"right"}}>
                <span>欢迎<span style={{color:"blue"}}>{username}</span>回来</span>
            {/* 下拉菜单 */}
            <Dropdown overlay={menu} trigger={['click']}>
              {/* 头像图标 */}
                <Avatar size="large" icon={<UserOutlined />} />
            </Dropdown>
            </div>
        </Header>
    )
}
//包装UI组件
export default connect(
  //用state对象连续解构赋值
  ({ CollapsedReducer: { isCollapsed } }) => ({
    isCollapsed,
  }),
  //es6 对象简写方式{ changeCollapsed(){ return {type: "change_collapsed"} } }
  { changeCollapsed: ()=>({ type: "change_collapsed" }) }
)(withRouter(TopHeader));
