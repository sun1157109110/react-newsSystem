import React, { useState,useEffect } from 'react'
import { Table,Button, notification, Tag } from 'antd';
import axios from 'axios';


    //审核列表
    export default function AuditList(props) {
        
        
        const [dataSource,setDataSource] = useState([])
        const {username} = JSON.parse(localStorage.getItem("token"));
        useEffect(() => {
            //从后台获取数据
            axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then((res)=>{
                const list = res.data
                setDataSource(list)
            })
            
        }, [username])   
        const auditList=["未审核","审核中","已通过","未通过"]
        // const publishList=["未发布","待发布","已上线","已下线"]
        const colorList = ["black","orange","green","red"]
        
        
        const columns = [
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
            title: '新闻分类',
            dataIndex: 'category',
            render:(item)=>(
                item.title
            )
        },
        {
            title: '审核状态',
            dataIndex: 'auditState',
            render:(auditState)=>(
                <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
            )
        },
        {
            title: '操作',
            render:(item)=>(
                <div>
                    {
                        item.auditState===1&&<Button type="dashed" onClick={()=>handleRevert(item)}>撤销</Button>
                    }
                    {
                        item.auditState===2&&<Button type="primary" onClick={()=>handlePublish(item)}>发布</Button>
                    }
                    {
                        item.auditState===3&&<Button type="danger" onClick={()=>{handleChange(item)}}>修改</Button>
                    }
                </div>
            )
        },
        ];
        //撤销操作
        const handleRevert = (item)=>{
            setDataSource(dataSource.filter((data)=>data.id!==item.id))
            axios.patch(`/news/${item.id}`,{
                auditState:0
            }).then((res)=>{
                // props.history.push(`/news-manage/draft`)
                notification.info({
                    message: `通知`,
                    description:
                    `您可以到草稿箱中查看文章`,
                    placement:'bottomRight'
                });
            })
           
        };
        //发布操作
        const handlePublish = (item)=>{
            setDataSource(dataSource.filter((data)=>data.id!==item.id))
            axios.patch(`/news/${item.id}`,{
                publishState:2,
                publishTime:Date.now()
            }).then((res)=>{
                // props.history.push(`/news-manage/draft`)
                notification.info({
                    message: `通知`,
                    description:
                    `您可以到[发布管理/已发布]中查看文章`,
                    placement:'bottomRight'
                });
            })
        };
        //修改操作
        const handleChange = (item)=>{
            props.history.push(`/news-manage/update/${item.id}`)
        }
        
        
       
        return (
            <div>
                <Table dataSource={dataSource} columns={columns} pagination={{pageSize:5}} rowKey={(item)=>item.id}/>;
            </div>
        )
    }
    