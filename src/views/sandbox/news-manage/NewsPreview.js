import React, { useEffect, useState } from 'react'
import { PageHeader, Descriptions } from 'antd';
import axios from 'axios';
import moment from 'moment';

export default function NewsPreview(props) {
    const [previewData, setPreviewData] = useState(null)
    useEffect(() => {
        axios.get(`/news/${props.match.params.id}?&_expand=category&_expand=role`).then(res=>{
            setPreviewData(res.data)
        })
    }, [props.match.params.id]);
    const auditList=["未审核","审核中","已通过","未通过"]
    const publishList=["未发布","待发布","已上线","已下线"]
    const colorList = ["black","orange","green","red"]
    if(previewData){
        var {title,category,author,createTime,auditState,region,publishState,view,star,content} = previewData
    }
    return (
        previewData&&(
        <div>
            <PageHeader
                onBack={() => window.history.back()}
                title={title}
                subTitle={category.title}
                >
                <Descriptions size="small" column={3}>
                    <Descriptions.Item label="创建者">{author}</Descriptions.Item>
                    <Descriptions.Item label="创建时间">
                    {moment(createTime).format('YYYY/MM/DD HH:mm:ss')}
                    </Descriptions.Item>
                    <Descriptions.Item label="发布时间">-</Descriptions.Item>
                    <Descriptions.Item label="区域">{region}</Descriptions.Item>
                    <Descriptions.Item label="审核状态"><span style={{color:colorList[publishState]}}>{publishList[publishState]}</span></Descriptions.Item>
                    <Descriptions.Item label="发布状态"><span style={{color:colorList[auditState]}}>{auditList[auditState]}</span></Descriptions.Item>
                    <Descriptions.Item label="访问数量">{view}</Descriptions.Item>
                    <Descriptions.Item label="点赞数量">{star}</Descriptions.Item>
                    <Descriptions.Item label="评论数量">0</Descriptions.Item>
                </Descriptions>
            </PageHeader>
            <div dangerouslySetInnerHTML={{__html:content}} style={{padding:"10px",margin:"0 24px",border:"1px solid gray",minHeight:"272px",overflow:"auto"}}>

            </div>
        </div>
    ))
}
