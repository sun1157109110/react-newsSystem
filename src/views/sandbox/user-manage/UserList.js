import React, { useState,useEffect, useRef } from 'react'
import { Table,Button,Modal, Switch,} from 'antd';
import axios from 'axios';
import { EditOutlined,DeleteOutlined,ExclamationCircleOutlined } from '@ant-design/icons';
import UserForm from '../../../components/UserForm/UserForm';
import Progress from '../../../components/Progress';
const { confirm } = Modal;



    export default function UserList() {
        
        
        const [dataSource,setDataSource] = useState([])
        const [isAddVisible,setIsAddVisible] = useState(false)
        const [regions,setRegions] = useState([])
        const [roleList,setRoleList] = useState([])
        const [isUpdateVisible, setIsUpdateVisible] = useState(false)
        const [isUpdateDisabled, setIsUpdateDisabled] = useState(false)
        const [currentItem, setCurrentItem] = useState(null)
        
        const addForm = useRef(null)
        const updateForm = useRef(null)
        const {roleId,region,username} = JSON.parse(localStorage.getItem("token"));
        useEffect(() => {
            axios.get("/users?_expand=role").then((res)=>{
                const list = res.data
                setDataSource(roleId===1?list:[
                    //筛选出自己
                    ...list.filter(item=>item.username===username),
                    //筛选出比自己权利更低的且区域相同的编辑
                    ...list.filter(item=>item.region===region&&item.roleId===3)
                ])
            })
        }, [roleId,region,username])   
        useEffect(() => {
            axios.get("/regions").then((res)=>{
                setRegions(res.data)
            })
        }, [])  
        useEffect(() => {
            axios.get("/roles").then((res)=>{
                setRoleList(res.data)
            })
        }, [])  
        
        
        
        const columns = [
        {
            title: '区域',
            dataIndex: 'region',
            //表头的筛选菜单项
            filters:[
                ...regions.map(item =>({text:item.title,value:item.value})),{text:"全球",value:"全球"}
            ],
            render : item=> <b>{item?item:"全球"}</b>,
            onFilter: (value, item) => {
                if (value === "全球"){
                    return item.region === ""
                }
                return item.region === value
            }
        },
        {
            title: '角色名称',
            dataIndex: 'role',
            render : item => item?.roleName
           
        },
        {
            title: '用户名',
            dataIndex: 'username',
        },
        {
            title: '用户状态',
            dataIndex: 'roleState',
            render: (roleState,item)=><Switch checked={roleState} disabled={item.default} onClick={()=>handleClick(item)}></Switch>
        },

        {
            title: '操作',
            render:(item)=>(
                <div>
                    <Button style={{marginRight:"5px"}} type="danger" shape="circle" icon={<DeleteOutlined onClick={()=>confirmMethod(item)}/>} disabled={item.default}/>
                    
                    <Button type="primary" shape="circle" icon={<EditOutlined />} disabled ={item.default} onClick={()=>handleUpdate(item)}/>
                    
                </div>
            )
        },
        ];
        
        const confirmMethod = (item)=>{
            confirm({
                title: '你确定要删除?',
                icon: <ExclamationCircleOutlined />,
                content: 'Some descriptions',
                onOk() {
                    deleteMethod(item)
                },
                onCancel() {
                  
                },
              });
        }
        const deleteMethod = (item)=>{
            console.log(item);
            setDataSource(dataSource.filter((data)=>item.id!==data.id))
            axios.delete(`/users/${item.id}`)
        }
        const addFormMethod = () => {
            addForm.current.validateFields().then((value)=>{
                setIsAddVisible(false);
                //重置
                addForm.current.resetFields()
                axios.post(`/users`,{
                    ...value,
                    "roleState": true,
                    "default": false,
                }).then((res)=>{
                    setDataSource([
                        ...dataSource,{
                        ...res.data,
                        role:roleList.filter((item)=>item.id===value.roleId)[0]
                    }])

                }).catch((error)=>{
                    console.log(error);
                  })
              
            })
        }
        //修改用户状态
        const handleClick = (item)=>{
           
            item.roleState = !item.roleState
            setDataSource([...dataSource])
            axios.patch(`/users/${item.id}`,{
                roleState:item.roleState
            })
        }
        
        const handleUpdate = (item)=>{
            setTimeout(() => {
                setIsUpdateVisible(true);
                //设置默认值
                updateForm.current.setFieldsValue(item)
                if(item.roleId===1){
                    setIsUpdateDisabled(true)
                }else{
                    setIsUpdateDisabled(false)
                }
            }, 0);
            setCurrentItem(item)
        }
        const updateFormMethod = ()=>{
            updateForm.current.validateFields().then((value)=>{
                setIsUpdateVisible(false)
                // console.log(currentItem);
                // console.log(value);
                setDataSource(dataSource.map((data)=>{
                    if (data.id===currentItem.id){
                        return {...data,...value,role:roleList.filter((item)=>item.id===value.roleId)[0]}
                    }
                    return data
                }))
                axios.patch(`/users/${currentItem.id}`,value)
                //保持isUpdateDisabled和disabled同步
                setIsUpdateDisabled(!isUpdateDisabled)
            })
            

        }
        return (
            <div>
                <Button type="primary" onClick={()=>{setIsAddVisible(true)}}>添加用户</Button>
                <Table dataSource={dataSource} columns={columns} pagination={{pageSize:5}} rowKey={(item)=>item.id}/>;
                <Modal
                visible={isAddVisible}
                title="添加用户"
                okText="确定"
                cancelText="取消"
                onCancel={()=>{setIsAddVisible(false)}}
                onOk={addFormMethod}
                >
                <UserForm ref={addForm} regions={regions} roleList={roleList} />
                </Modal>
                <Modal
                visible={isUpdateVisible}
                title="更新用户"
                okText="确定"
                cancelText="取消"
                onCancel={()=>{setIsUpdateVisible(false);setIsUpdateDisabled(!isUpdateDisabled)}}
                onOk={updateFormMethod}
                >
                {/* isUpdate为是否更新的表单 以区别添加表单 */}
                <UserForm ref={updateForm} regions={regions} roleList={roleList} isUpdateDisabled={isUpdateDisabled} isUpdate={true}/>
                </Modal>
                <Progress percent={50}></Progress>
            </div>
        )
    }
    
