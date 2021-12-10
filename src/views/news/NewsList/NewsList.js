import React, { useState,useEffect } from "react";
import { PageHeader, Card, Col, Row, List } from "antd";
import axios from "axios";
import _ from "lodash";


export default function NewsList() {
    const [dataSource, setDataSource] = useState([])
    useEffect(() => {
        axios.get(`/news?publishState=2&_expand=category`).then((res)=>{
            
            const List =Object.entries(_.groupBy(res.data,(item)=>item.category.value))
            console.log(List);
            setDataSource(List)
        })
    }, []);
  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="全球大新闻"
        subTitle="查看新闻"
      />
      <div className="site-card-wrapper" style={{width:"95%",margin:"0 auto"}}>
        <Row gutter={[16, 16]} >
          {dataSource.map((item)=>
              <Col span={8}>
              <Card title={item[0]} bordered={true} hoverable={true}>
                <List
                  size="small"
                  bordered={false}
                  dataSource={item[1]}
                  pagination={{pageSize:3}}
                  renderItem={(data) => <List.Item><a href={`#/detail/${data.id}`}>{data.title}</a></List.Item>}
                />
              </Card>
            </Col>
          )}
        </Row>
      </div>
    </div>
  );
}
