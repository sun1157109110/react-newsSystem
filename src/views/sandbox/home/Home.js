import React, { useEffect, useState, useRef } from "react";
import { Card, Col, Row, List, Avatar, Drawer } from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import axios from "axios";
import * as echarts from "echarts";
import _ from "lodash";
const { Meta } = Card;
export default function Home() {
  const [viewList, setViewList] = useState([]);
  const [starList, setStarList] = useState([]);
  const [initValue, setInitValue] = useState(null);
  const [visible, setVisible] = useState(false);
  const [pieList, setPieList] = useState([]);
  const chartRef = useRef();
  const pieRef = useRef();
  useEffect(() => {
    axios
      .get(
        //desc是倒序
        `/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6`
      )
      .then((res) => {
        setViewList(res.data);
      });
  }, []);
  useEffect(() => {
    axios
      .get(
        `/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6`
      )
      .then((res) => {
        setStarList(res.data);
      });
  }, []);

  useEffect(() => {
    axios.get(`/news?publishState=2&_expand=category`).then((res) => {
      // console.log(_.groupBy(res.data, (item) => item.category.value));
      renderBarView(_.groupBy(res.data, (item) => item.category.value));
      setPieList(res.data);
    });
    return () => {
      window.onresize = null;
    };
  }, []);
  const renderBarView = (obj) => {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(chartRef.current);

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: "新闻分类图示",
      },
      tooltip: {},
      legend: {
        data: ["数量"],
      },
      xAxis: {
        data: Object.keys(obj),
        axisLabel: { rotate: 45 },
      },
      yAxis: { minInterval: 1 },
      series: [
        {
          name: "数量",
          type: "bar",
          data: Object.values(obj).map((data) => {
            return data.length;
          }),
        },
      ],
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    //
    window.onresize = () => {
      console.log(1);
      myChart.resize();
    };
  };

  const renderPieView = () => {
    // 基于准备好的dom，初始化echarts实例
    var chartDom = pieRef.current;
    if (!initValue) {
      var myChart = echarts.init(chartDom);
      setInitValue(myChart);
    } else {
      myChart = initValue;
    }
    var { username } = JSON.parse(localStorage.getItem("token"));
    var pieChartList = pieList.filter((item) => item.author === username);
    // console.log(pieChartList);
    var pieObj = _.groupBy(pieChartList,(item)=>item.category.value);
    var pieDate = []
    for(var i in pieObj){
      pieDate.push(
        {
          name:i,
          value:pieObj[i].length
        }
      )
    }
    

    var option;

    // 指定图表的配置项和数据
    option = {
      title: {
        text: "新闻种类",
        // subtext: "纯属虚构",
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          name: "新闻种类",
          type: "pie",
          radius: "50%",
          data: pieDate,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };
    // 使用刚指定的配置项和数据显示图表。
    option && myChart.setOption(option);

    // window.onresize = () => {
    //   console.log(1);
    //   myChart.resize();
    // };
  };
  const {
    username,
    region,
    role: { roleName },
  } = JSON.parse(localStorage.getItem("token"));

  return (
    <div className="site-card-wrapper">
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最长浏览" bordered={true}>
            <List
              size="small"
              bordered={false}
              dataSource={viewList}
              renderItem={(item) => (
                <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户点赞最多" bordered={true}>
            <List
              size="small"
              bordered={false}
              dataSource={starList}
              renderItem={(item) => (
                <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined
                key="setting"
                onClick={() => {
                  setTimeout(() => {
                    setVisible(true);
                    renderPieView();
                  }, 0);
                }}
              />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={
                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              }
              title={username}
              description={
                <div>
                  <b>{region ? region : "全球"}</b>&nbsp;&nbsp;{roleName}
                </div>
              }
            />
          </Card>
        </Col>
      </Row>
      <Drawer
        width="500px"
        title="新闻分类"
        placement="right"
        closable={true}
        onClose={() => {
          setVisible(false);
        }}
        visible={visible}
      >
        {/* 饼状图 */}
        <div
          ref={pieRef}
          id="main"
          style={{ height: "400px", marginTop: "30px" }}
        ></div>
      </Drawer>
      {/* 柱状图 */}
      <div
        ref={chartRef}
        id="main"
        style={{ height: "400px", marginTop: "30px" }}
      ></div>
    </div>
  );
}
