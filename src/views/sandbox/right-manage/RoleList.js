import React, { useState,useEffect } from 'react'
import { Table,Button,Modal,Tree } from 'antd';
import axios from 'axios';
import { UnorderedListOutlined,DeleteOutlined,ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;


    export default function RoleList() {
        
        
        const [dataSource,setDataSource] = useState([])
        const [isModalVisible,setIsModalVisible] = useState(false)
        const [rightsList,setRightList] = useState([])
        const [rights,setRights] = useState([])
        const [currentId,setCurrentId] = useState(0)
        useEffect(() => {
            axios.get("/roles").then((res)=>{
                const list = res.data
                setDataSource(list)
            })
            axios.get("/rights?_embed=children").then((res)=>{
                const list = res.data
                setRightList(list)
            })
        }, [])   

        
        
        const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render : id=> <b>{id}</b>
        },
        {
            title: '角色名称',
            dataIndex: 'roleName',
           
        },
        {
            title: '操作',
            render:(item)=>(
                <div>
                    <Button style={{marginRight:"5px"}} type="danger" shape="circle" icon={<DeleteOutlined onClick={()=>confirmMethod(item)}/>} />
                    <Button type="primary" shape="circle" icon={<UnorderedListOutlined />} onClick={()=>{setIsModalVisible(true);setRights(item.rights);setCurrentId(item.id)}}/>
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
            // console.log(item);
          
                setDataSource(dataSource.filter((data)=>item.id!==data.id))
                axios.delete(`/roles/${item.id}`)

        }
        const handleOk = ()=>{
            setIsModalVisible(false);
            setDataSource(dataSource.map((item)=>{
                if(item.id === currentId){
                    item.rights = rights
                }
                return item
            }))
            axios.patch(`/roles/${currentId}`,{rights:rights})
        }
        const handleCancel = ()=>{
            setIsModalVisible(false)
        }
        const onCheck = (checkedKeys)=>{
            console.log(checkedKeys);
            setRights(checkedKeys.checked)
        }   
        return (
            <div>
                <Table dataSource={dataSource} columns={columns} pagination={{pageSize:5}} rowKey={(item)=>item.id}/>;
                <Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Tree
                    //节点前添加 Checkbox 复选框
                    checkable
                    checkedKeys={rights}
                    //完全受控
                    checkStrictly={true}
                    onCheck={onCheck}
                    treeData={rightsList}
                />
                </Modal>
            </div>
        )
    }
    

