import { Button } from 'antd'
import React, { useState } from 'react'
import Drawer from '../../components/Drawer'

export default function DrawerTest() {
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const handleClick = ()=>{
        setIsDrawerVisible(!isDrawerVisible)
    }
    return (
        <div>
            <Button onClick={handleClick} type="primary">点击弹出抽屉</Button>
            <Drawer isVisible={isDrawerVisible} >
                <h4>这是一个抽屉</h4>
            </Drawer>
        </div>
    )
}
