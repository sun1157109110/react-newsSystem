import React, { useEffect, useState } from 'react'
import { PageHeader, Descriptions } from 'antd';
import {HeartTwoTone} from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';

export default function Detail(props) {
    const [previewData, setPreviewData] = useState(null)
    useEffect(() => {
        axios.get(`/news/${props.match.params.id}?&_expand=category&_expand=role`).then(res=>{

            setPreviewData({
                ...res.data,
                view:res.data.view+1
            });
            axios.patch(`/news/${props.match.params.id}`,{
                view:res.data.view+1
            })
        })
    }, [props.match.params.id]);
    if(previewData){
        var {title,category,author,publishTime,region,view,star,content} = previewData
    }
    const handleStar = ()=>{
        setPreviewData({
            ...previewData,
            star:previewData.star+1
        });
        axios.patch(`/news/${props.match.params.id}`,{
            star:previewData.star+1
        })
    }
    return (
        previewData&&(
        <div>
            <PageHeader
                onBack={() => window.history.back()}
                title={title}
                subTitle={
                    <div>
                        {category.title}&nbsp;&nbsp;
                        <HeartTwoTone twoToneColor="#eb2f96" onClick={handleStar}/>
                    </div>
                }
                >
                <Descriptions size="small" column={3}>
                    <Descriptions.Item label="创建者">{author}</Descriptions.Item>
                    <Descriptions.Item label="发布时间"> {moment(publishTime).format('YYYY/MM/DD HH:mm:ss')}</Descriptions.Item>
                    <Descriptions.Item label="区域">{region}</Descriptions.Item>
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
