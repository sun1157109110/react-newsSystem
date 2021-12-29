import React from 'react'
import Tag from '../../components/Tag'

export default function TagTest() {
    return (
        <div style={{paddingLeft:'200px',paddingTop:'200px',height:'800px',width:'800px',backgroundColor:'#1e1e1e'}}>
            <Tag closable={true}>这是个标签</Tag>
            <Tag color='red'>哈哈哈哈</Tag>
            <Tag color='deepSkyBlue' closable={true}>这是个可关闭的有颜色的标签</Tag>
        </div>
    )
}
