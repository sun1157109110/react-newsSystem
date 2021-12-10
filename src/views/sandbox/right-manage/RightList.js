import React, { useState,useEffect } from 'react'
import { Table,Tag,Button,Modal, Switch,Popover } from 'antd';
import axios from 'axios';
import { EditOutlined,DeleteOutlined,ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;


    export default function RightList() {
        
        
        const [dataSource,setDataSource] = useState([])
        useEffect(() => {
            axios.get("/rights?_embed=children").then((res)=>{
                const list = res.data
                list.forEach(element => {
                    if(element.children.length === 0) element.children = ''
                });
                setDataSource(list)
            })
        }, [])   

        
        
        const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render : id=> <b>{id}</b>
        },
        {
            title: '权限名称',
            dataIndex: 'title',
           
        },
        {
            title: '权限路径',
            dataIndex: 'key',
            render: key => <Tag color="orange">{key}</Tag>
        },
        {
            title: '操作',
            dataIndex: 'address',
            render:(text,item)=>(
                <div>
                    <Button style={{marginRight:"5px"}} type="danger" shape="circle" icon={<DeleteOutlined onClick={()=>confirmMethod(item)}/>} />
                    <Popover content={<div style={{textAlign:"center"}}><Switch checked={item.pagepermisson} onChange={()=>switchMethod(item)}></Switch></div>} title="页面配置项" trigger={item.pagepermisson===undefined?"":"click"} >
                    <Button type="primary" shape="circle" icon={<EditOutlined />} disabled = {item.pagepermisson===undefined}/>
                    </Popover>
                </div>
            )
        },
        ];
        const switchMethod = (item)=>{
            item.pagepermisson = item.pagepermisson===1?0:1
            setDataSource([...dataSource])
            if (item.grade===1){
                axios.patch(`/rights/${item.id}`,{pagepermisson:item.pagepermisson})
            }else{
                axios.patch(`/children/${item.id}`,{pagepermisson:item.pagepermisson})
            }
        }
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
            if (item.grade===1){
                setDataSource(dataSource.filter((data)=>item.id!==data.id))
                axios.delete(`/rights/${item.id}`)
            }else{
                let list = dataSource.filter(data => data.id===item.rightId)
                list[0].children = list[0].children.filter(data =>data.id !== item.id)
                setDataSource([...dataSource]);
                axios.delete(`/children/${item.id}`)
            }

        }
        return (
            <div>
                <Table dataSource={dataSource} columns={columns} pagination={{pageSize:5}}/>;
            </div>
        )
    }
    