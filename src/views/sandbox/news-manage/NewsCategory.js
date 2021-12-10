import React, { useState,useEffect,useContext,useRef } from 'react'
import { Table,Button,Modal,Input,Form, } from 'antd';
import axios from 'axios';
import {DeleteOutlined,ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;

const EditableContext = React.createContext(null);


    export default function NewsCategory() {
        const [dataSource,setDataSource] = useState([])
        useEffect(() => {
            axios.get("/categories").then((res)=>{
                const list = res.data
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
            title: '栏目名称',
            dataIndex: 'title',
            //设置单元格属性
            onCell: (record) => ({
                record,
                //可编辑!!!
                editable: true,
                dataIndex: 'title',
                title: '栏目名称',
                handleSave:handleSave,
              })
           
        },
        {
            title: '操作',
            render:(item)=>(
                <div>
                    <Button type="danger" shape="circle" icon={<DeleteOutlined onClick={()=>confirmMethod(item)}/>} />
                  
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
            setDataSource(dataSource.filter((data)=>item.id!==data.id))
            axios.delete(`/categories/${item.id}`)
        };
        //引入可编辑功能
        const EditableRow = ({ index, ...props }) => {
            const [form] = Form.useForm();
            return (
              <Form form={form} component={false}>
                <EditableContext.Provider value={form}>
                  <tr {...props} />
                </EditableContext.Provider>
              </Form>
            );
          };
          
          const EditableCell = ({
            title,
            editable,
            children,
            dataIndex,
            record,
            handleSave,
            ...restProps
          }) => {
            const [editing, setEditing] = useState(false);
            const inputRef = useRef(null);
            const form = useContext(EditableContext);
            useEffect(() => {
              if (editing) {
                inputRef.current.focus();
              }
            }, [editing]);
            const toggleEdit = () => {
                setEditing(!editing);
                form.setFieldsValue({
                  [dataIndex]: record[dataIndex],
                });
              };
            
              const save = async () => {
                try {
                  const values = await form.validateFields();
                  toggleEdit();
                  handleSave({ ...record, ...values });
                } catch (errInfo) {
                  console.log('Save failed:', errInfo);
                }
              };
              let childNode = children;

            if (editable) {
                childNode = editing ? (
                <Form.Item
                    style={{
                    margin: 0,
                    }}
                    name={dataIndex}
                    rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                    ]}
                >
                    <Input ref={inputRef} onPressEnter={save} onBlur={save} />
                </Form.Item>
                ) : (
                <div
                    className="editable-cell-value-wrap"
                    style={{
                    paddingRight: 24,
                    }}
                    onClick={toggleEdit}
                >
                    {children}
                </div>
                );
            }

            return <td {...restProps}>{childNode}</td>;
            };

        const handleSave = (record)=>{
            setDataSource(dataSource.map((item)=>{
                if (item.id===record.id){
                    return record
                }
                return item
            }))
            axios.patch(`/categories/${record.id}`,{
                ...record
            })
        }

        return (
            <div>
                <Table dataSource={dataSource} columns={columns} pagination={{pageSize:5}} rowKey={(item)=>item.id}
                //定制好可编辑的行和cell单元格
                components={{
                    body: {
                      row: EditableRow,
                      cell: EditableCell,
                    },
                  }}
                />;
            </div>
        )
    }
    