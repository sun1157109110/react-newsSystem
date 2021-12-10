import React, { forwardRef,useEffect,useState } from 'react'
import { Form, Input,Select } from 'antd';
const { Option } = Select;
//接受父组件ref.引用传递
const UserForm = forwardRef((props,ref)=>{
    const [isDisabled,setIsDisabled] = useState(false)
    const {isUpdateDisabled} = props
    //监听isUpdateDisabled,使得与IsDisabled状态同步
    useEffect(()=>{
        setIsDisabled(isUpdateDisabled)
    },[isUpdateDisabled])
    //读取登录用户信息
    const {roleId,region} = JSON.parse(localStorage.getItem("token"));
    //限制更新以及添加用户更新添加的区域范围
    const checkRegionDisabled = (item)=>{
        if(props.isUpdate){
            if(roleId===1){
                return false
            }else{
                return true
            }
        }else{
            if(roleId===1){
                return false
            }else{
                return region!==item.value
            }
        }
    }
    //限制更新以及添加用户更新添加的角色范围
    const checkRoleDisabled = (item)=>{
        //如果是更新表单,不是超级管理员则都禁用
        if(props.isUpdate){
            if(roleId===1){
                return false
            }else{
                return true
            }
        }else{
            if(roleId===1){
                //超级管理员都可以添加
                return false
            }else{
                //如果是区域管理员 只能添加区域编辑 否则不添加
                return item.id !==3
            }
        }
    }
    return (
      
        <Form ref={ref} layout="vertical">
                <Form.Item
                name="username"
                label="用户名"
                rules={[{ required: true, message: 'Please input the title of collection!' }]}
                >
                <Input />
                </Form.Item>
                <Form.Item
                name="password"
                label="密码"
                rules={[{ required: true, message: 'Please input the title of collection!' }]}
                >
                <Input />
                </Form.Item>
                <Form.Item
                name="region"
                label="区域"
                rules={{isDisabled}?[]:[{ required: true, message: 'Please input the title of collection!' }]}
                >
                    <Select disabled={isDisabled}>
                        {props.regions.map((region)=>{
                            return <Option disabled={checkRegionDisabled(region)} value={region.value} key={region.id}>{region.title}</Option>
                        })}
                    </Select>
                </Form.Item>
                <Form.Item
                name="roleId"
                label="角色"
                rules={[{ required: true, message: 'Please input the title of collection!' }]}
                >
                    <Select onChange={(value)=>{
                      if(value===1){
                          setIsDisabled(true)
                          ref.current.setFieldsValue(
                              {region:""}
                          )
                      }else{
                          setIsDisabled(false)
                      }
                    }}>
                        {props.roleList.map((role)=>{
                            return <Option disabled={checkRoleDisabled(role)} value={role.id} key={role.id}>{role.roleName}</Option>
                        })}
                    </Select>
                </Form.Item>
        </Form>
    )
})
export default UserForm