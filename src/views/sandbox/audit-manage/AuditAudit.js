import React, { useState,useEffect, } from 'react';
import { Table,Button,notification} from 'antd';
import { CheckOutlined,CloseOutlined} from '@ant-design/icons';
import axios from 'axios';

export default function AuditAudit() {
    const [dataSource,setDataSource] = useState([])
    const {roleId,region,username} = JSON.parse(localStorage.getItem("token"));
        useEffect(() => {
            axios.get("/news?auditState=1&_expand=category").then((res)=>{
                const list = res.data
                setDataSource(roleId===1?list:[
                    //筛选出自己
                    ...list.filter(item=>item.author===username),
                    //筛选出比自己权利更低的且区域相同的编辑
                    ...list.filter(item=>item.region===region&&item.roleId===3)
                ])
            })
        }, [roleId,region,username])   

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
                title: '操作',
                render:(item)=>(
                    <div>
                        <Button type="primary" shape="circle" icon={<CheckOutlined />} onClick={()=>handleCheck(item,2,1)}></Button>,
                        <Button type="danger"  shape="circle" icon={<CloseOutlined />}onClick={()=>handleCheck(item,3,0)}></Button>
                    </div>
                )
            },
            ];
            const handleCheck = (item,auditState,publishState)=>{
                setDataSource(dataSource.filter((data)=>data.id!==item.id))
                axios.patch(`/news/${item.id}`,{
                    publishState,
                    auditState
                }).then((res)=>{
                    // props.history.push(`/news-manage/draft`)
                    notification.info({
                        message: `通知`,
                        description:
                        `您可以到[审核管理/审核列表]中查看文章状态`,
                        placement:'bottomRight'
                    });
                })
            }
    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{pageSize:5}} rowKey={(item)=>item.id}/>;
        </div>
    )
}
