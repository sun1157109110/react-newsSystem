import React, { useEffect, useRef, useState } from 'react'
import { Button, PageHeader,Form, Input, Select, message,notification } from 'antd';
import { Steps } from 'antd';
import style from './News.module.css'
import axios from 'axios';
import NewsReactDraft from '../../../components/NewsReactDraft/NewsReactDraft';
const { Option } = Select;
const { Step } = Steps;
export default function NewUpdate(props) {
    //当前状态控制步骤条
    const [currentState, setCurrentState] = useState(0)
    const [newsCategories, setNewsCategories] = useState([])
    const [formInfo, setFormInfo] = useState(null)
    const [editorContent, setEditorContent] = useState("")
    //状态重复 后期可以优化
    const [updateContent, setUpdateContent] = useState("")
    //获取新闻种类数据
    useEffect(()=>{
        axios.get("/categories").then((res)=>{
          setNewsCategories(res.data)
        })
    },[])
    //根据params传参的id值从后台取回相关数据 并将表单设置为默认值
    useEffect(()=>{
        axios.get(`/news/${props.match.params.id}?&_expand=category&_expand=role`).then((res)=>{
          const {title,categoryId,content} = res.data
          addForm.current.setFieldsValue({
            title,
            categoryId
          })
          //将需要更新的内容从后台取出并设置为全局状态里
          setUpdateContent(content)
          setEditorContent(content)
        })
    },[props.match.params.id])
    const addForm = useRef(null)
    const handleNext = ()=>{
        //表单验证
        if(currentState===0){
            addForm.current.validateFields().then(value =>{
                console.log(value);
                setFormInfo(value)
                setCurrentState(currentState+1)
              }).catch( err =>{console.log(err);})
        }else{
            if(editorContent.trim()==="<p></p>" || editorContent===""){
                message.error("新闻不能为空!!!")
            }else{
                setCurrentState(currentState+1)
            }
        }   
    }
    
    const handleSubmit = (auditState)=>{
        axios.patch(`/news/${props.match.params.id}`,{
            ...formInfo,
            "content":editorContent,
            "auditState":auditState,
        }).then((res)=>{
            console.log(res.data);
            props.history.push(auditState===0?"/news-manage/draft":"/audit-manage/list")
            //添加通知提醒框
            notification.info({
                message: `通知`,
                description:
                  `您可以到${auditState===0?'草稿箱':'审核列表'}中查看文章`,
                placement:'bottomRight'
              });
        })

        // axios.delete('/news/直接输入id值即可').then((res)=>{console.log(res.data);}).catch((error)=>{console.log(error);})
    }
    return (
        <div>
           <PageHeader
                onBack={()=>{props.history.goBack()}}
                className="site-page-header"
                title="撰写新闻"
            />
            <Steps current={currentState}>
                <Step title="基本信息" description="新闻标题,新闻分类" />
                <Step title="新闻内容" description="新闻主题内容" />
                <Step title="新闻提交" description="保存草稿或者提交审核" />
            </Steps>
            <div className={currentState===0?"":style.active} style={{marginTop:"50px"}}>
            <Form
                name="basic"
                labelCol={{ span: 2 }}
                wrapperCol={{ span: 22}}
                ref={addForm}
            >
                <Form.Item
                    label="新闻标题"
                    name="title"
                    rules={[{ required: true, message: '请输入新闻标题!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="新闻分类"
                    name="categoryId"
                    rules={[{ required: true, message: '请选择新闻分类!' }]}
                >
                    <Select>
                        {newsCategories.map( item =>{
                            return <Option value={item.id} key={item.id}>{item.title}</Option>
                        })}
                    </Select>
                </Form.Item>
             </Form>
            </div>
            <div className={currentState===1?"":style.active}>
                {/* 引入文本编辑器 */}
                <NewsReactDraft updateContent={updateContent} getEditorDate={(value)=>{setEditorContent(value)}}></NewsReactDraft>
            </div>
            <div className={currentState===2?"":style.active}>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
            </div>
            <div style={{marginTop:"50px"}}>
                {currentState<2 && <Button type="primary" onClick={handleNext}>下一步</Button>}
                {currentState===2 && <Button type="primary" onClick={()=>{handleSubmit(0)}}>保存草稿箱</Button>}
                {currentState===2 && <Button type="primary" danger onClick={()=>{handleSubmit(1)}}>提交审核</Button>}
                {currentState>0 && <Button type="dash"onClick={()=>{setCurrentState(currentState-1)}} >上一步</Button>}
            </div>
        </div>
        
    )
}
