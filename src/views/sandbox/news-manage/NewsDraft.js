import React, { useState,useEffect } from 'react'
import { Table,Button,Modal, notification } from 'antd';
import axios from 'axios';
import { EditOutlined,DeleteOutlined,ExclamationCircleOutlined,VerticalAlignTopOutlined } from '@ant-design/icons';
const { confirm } = Modal;


    export default function NewsDraft(props) {
        
        
        const [dataSource,setDataSource] = useState([])
        const {username} = JSON.parse(localStorage.getItem("token"));
        useEffect(() => {
            //从后台获取数据 过滤出auditState为0的new
            axios.get(`/news?author=${username}&auditState=0&_expand=category`).then((res)=>{
                const list = res.data
                setDataSource(list);
                console.log(list);
            })
            
        }, [username])   

        
        
        const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render : id=> <b>{id}</b>
        },
        {
            title: '新闻标题',
            dataIndex: 'title',
            render:(title,item)=>{
                //传递param参数
               return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
            }
           
        },
        {
            title: '作者',
            dataIndex: 'author',
           
        },
        {
            title: '分类',
            dataIndex: 'category',
            render:(item)=>(
                item.title
            )
        },
        {
            title: '操作',
            render:(item)=>(
                <div>
                    <Button  type="danger" shape="circle" icon={<DeleteOutlined onClick={()=>confirmMethod(item)}/>} />
                    <Button style={{margin:"0px 5px"}} type="dashed" shape="circle" icon={<EditOutlined />} onClick={/* 跳转到更新页面并传参 */()=>{props.history.push(`/news-manage/update/${item.id}`)}}/>
                    <Button type="primary" shape="circle" icon={<VerticalAlignTopOutlined />} onClick={()=>{handleCheck(item)}}/>
                </div>
            )
        },
        ];
        //提交审核功能
        const handleCheck = (item)=>{
            axios.patch(`/news/${item.id}`,{
                auditState:1
            }).then((res)=>{
                //跳转到审核列表组件
                props.history.push("/audit-manage/list");
                notification.info({
                    message: `通知`,
                    description:
                    `您可以到审核列表中查看文章`,
                    placement:'bottomRight'
                });
            })
            
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
        //确定删除功能
        const deleteMethod = (item)=>{
            // console.log(item);
          
                setDataSource(dataSource.filter((data)=>item.id!==data.id))
                axios.delete(`/news/${item.id}`)

        }
       
        return (
            <div>
                <Table dataSource={dataSource} columns={columns} pagination={{pageSize:5}} rowKey={(item)=>item.id}/>;
            </div>
        )
    }
    