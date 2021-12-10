import React from 'react'
import { Table} from 'antd';




    export default function NewsPublish(props) {
        
        
        
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
                    {props.button(item.id)}
                </div>
            )
        },
        ];
       
        return (
            <div>
                <Table dataSource={props.dataSource} columns={columns} pagination={{pageSize:5}} rowKey={(item)=>item.id}/>;
            </div>
        )
    }
    