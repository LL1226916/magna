//OEE
//从metabase获取数据并展示
  var getDataSettings = {
	  "url": "https://mttmb.magna.cn/public/question/259cf0c8-5239-41b9-8201-5cf0f19a4488.json",
	  "method": "GET"
  }
  var responseData = null;
$.ajax(getDataSettings).done(function (response) {
		if(response[0]){
			responseData = response[0];
			var renderData = {"data" : responseData}
			console.log("aaa");
			console.log(response);
			// 柱状图1模块
			(function() {
			  // 实例化对象
			  var myChart = echarts.init(document.querySelector(".bar .chart"));
			  // 指定配置和数据
			  var option = {
			    color: ["#2f89cf", "#F8B448"],
			    tooltip: {
			      trigger: "item",
			      axisPointer: {
			        // 坐标轴指示器，坐标轴触发有效
			        type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
			      }
			    },
			    grid: {
			      left: "0%",
			      top: "5px",
			      right: "0%",
			      bottom: "4%",
			      containLabel: true
			    },
			    xAxis: [
			      {
			        type: "category",
			        data: [
			            response[0].equipL,
			            response[1].equipL,
			            response[2].equipL,
			            response[3].equipL,
			            response[4].equipL
			        ].map(function (str) {
						return str.replace(' ', '\n');
					}),
			        axisTick: {
			          alignWithLabel: true
			        },
			        axisLabel: {
			          textStyle: {
			            color: "rgba(255,255,255,.6)",
			            fontSize: "6.5"
			          }
			        },
			        axisLine: {
			          show: false
			        }
			      }
			    ],
			    yAxis: [
			      {
			        type: "value",
			        axisLabel: {
			          textStyle: {
			            color: "rgba(255,255,255,.6)",
			            fontSize: "12"
			          }
			        },
			        axisLine: {
			          lineStyle: {
			            color: "rgba(255,255,255,.1)"
			            // width: 1,
			            // type: "solid"
			          }
			        },
			        splitLine: {
			          lineStyle: {
			            color: "rgba(255,255,255,.1)"
			          }
			        }
			      }
			    ],
			    series: [
			      {
			        name: "利用率",
			        type: "bar",
			        barWidth: "30%",
			        data: [
			        	response[0].OEEL > 100 ? 100 : response[0].OEEL
			            response[1].OEEL > 100 ? 100 : response[0].OEEL,
			            response[2].OEEL > 100 ? 100 : response[0].OEEL,
			            response[3].OEEL > 100 ? 100 : response[0].OEEL,
			            response[4].OEEL > 100 ? 100 : response[0].OEEL
						],
						
			        itemStyle: {
			          barBorderRadius: 5
			        },
					label: {
						show: true,
						position: 'top',
						fontSize: 8,
						formatter: function (params) {
							  return params.value + "%"
						}
					              
					}
			      },
				  {
				    name: "目标值",
				    type: "line",
				    smooth: true,
				    data: [
						response[0].targetOEEL,
			            response[1].targetOEEL,
			            response[2].targetOEEL,
			            response[3].targetOEEL,
			            response[4].targetOEEL],
				  					label: {
				  						show: true,
				  						position: 'top',
				  						fontSize: 7,
				  						formatter: function (params) {
				  							  return params.value + "%"
				  						}
				  					              
				  					}
				  }
			    ]
			  };
			
			  // 把配置给实例对象
			  myChart.setOption(option);
			  window.addEventListener("resize", function() {
			    myChart.resize();
			  });
			
			  // 数据变化
			 
			
			  $(".bar h2 ").on("click", "a", function() {
			    option.series[0].data = dataAll[$(this).index()].data;
			    myChart.setOption(option);
			  });
			})();
				
		}

	
	});

//问题清单
//从metabase获取数据并展示
  var getDataSettings = {
	  "url": "https://mttmb.magna.cn/public/question/d9f2db09-1859-45cc-9226-1eacf06f23e0.json",
	  "method": "GET"
  }
  var responseData = null;
$.ajax(getDataSettings).done(function (response) {
		if(response[0]){
			responseData = response[0];
			var renderData = {"data" : responseData}
			console.log("aaa");
			console.log(response);
			// 柱状图1模块
			(function() {
			  // 实例化对象
			  var myChart = echarts.init(document.querySelector(".item .chart"));
			  // 指定配置和数据
			  var option = {
			    color: ["#2f89cf", "#F8B448"],
			    tooltip: {
			      trigger: "item",
			      axisPointer: {
			        // 坐标轴指示器，坐标轴触发有效
			        type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
			      }
			    },
			    grid: {
			      left: "0%",
			      top: "5px",
			      right: "0%",
			      bottom: "4%",
			      containLabel: true
			    },
			    xAxis: [
			      {
			        type: "category",
			        data: [
			            response[0].x,
			            response[1].x,
			            response[2].x,
			            response[3].x,
			            response[4].x
			        ].map(function (str) {
						return str.replace(' ', '\n');
					}),
			        axisTick: {
			          alignWithLabel: true
			        },
			        axisLabel: {
			          textStyle: {
			            color: "rgba(255,255,255,.6)",
			            fontSize: "6.5"
			          }
			        },
			        axisLine: {
			          show: false
			        }
			      }
			    ],
			    yAxis: [
			      {
			        type: "value",
			        axisLabel: {
			          textStyle: {
			            color: "rgba(255,255,255,.6)",
			            fontSize: "12"
			          }
			        },
			        axisLine: {
			          lineStyle: {
			            color: "rgba(255,255,255,.1)"
			            // width: 1,
			            // type: "solid"
			          }
			        },
			        splitLine: {
			          lineStyle: {
			            color: "rgba(255,255,255,.1)"
			          }
			        }
			      }
			    ],
			    series: [
			      {
			        name: "次数",
			        type: "bar",
			        barWidth: "30%",
			        data: [
						response[0].num,
			            response[1].num,
			            response[2].num,
			            response[3].num,
			            response[4].num
						],
						
			        itemStyle: {
			          barBorderRadius: 5
			        },
					label: {
						show: true,
						position: 'top',
						fontSize: 8,
						formatter: function (params) {
							  return params.value
						}
					              
					}
			      }
			    ]
			  };
			
			  // 把配置给实例对象
			  myChart.setOption(option);
			  window.addEventListener("resize", function() {
			    myChart.resize();
			  });
			
			  // 数据变化
			 
			
			  $(".bar h2 ").on("click", "a", function() {
			    option.series[0].data = dataAll[$(this).index()].data;
			    myChart.setOption(option);
			  });
			})();
				
		}

	
	});

//计划完成率 折线图定制
//从metabase获取数据并展示
  var getDataSettings = {
	  "url": "https://mttmb.magna.cn/public/question/329e1895-e2c6-4851-ba46-f1c8a4f6e60a.json",
	  "method": "GET"
  }
  var responseData = null;
$.ajax(getDataSettings).done(function (response) {
		if(response[0]){
			responseData = response[0];
			var renderData = {"data" : responseData};
			var dataActual = [];
			for(var i in response){
					var str = response[i].compRateL + ":" + response[i].partNumL;
					dataActual.push(str);
					
			}
			(function() {
			  
			  // 基于准备好的dom，初始化echarts实例
			  var myChart = echarts.init(document.querySelector(".line .chart"));
			  
			  // (1)准备数据
			  var data = {
			    actual: [
			      [response[0].compRateL,
			        response[1].compRateL,
			        response[2].compRateL,
			        response[3].compRateL,
			        response[4].compRateL]
			    ]
			  };
			
			  // 2. 指定配置和数据
			  var option = {
			    color: ["#00f2f1", "#ed3f35"],
			    tooltip: {
			      // 通过坐标轴来触发
			      trigger: "axis"
			    },
			    legend: {
			      right: "10%",
			      textStyle: {
			        color: "#4c9bfd"
			      }
			    },
			    grid: {
			      top: "20%",
			      left: "3%",
			      right: "4%",
			      bottom: "3%",
			      show: true,
			      borderColor: "#012f4a",
			      containLabel: true
			    },
			
			    xAxis: {
			      type: "category",
			      boundaryGap: false,
			      data: [
			        response[0].partNumL,
			        response[1].partNumL,
			        response[2].partNumL,
			        response[3].partNumL,
			        response[4].partNumL
			      ],
			      // 去除刻度
			      axisTick: {
			        show: false
			      },
			      // 修饰刻度标签的颜色
			      axisLabel: {
			        color: "rgba(255,255,255,.7)",
					fontSize: "6"
			      },
			      // 去除x坐标轴的颜色
			      axisLine: {
			        show: false
			      }
			    },
			    yAxis: {
			      type: "value",
			      // 去除刻度
			      axisTick: {
			        show: false
			      },
			      // 修饰刻度标签的颜色
			      axisLabel: {
			        color: "rgba(255,255,255,.7)"
			      },
			      // 修改y轴分割线的颜色
			      splitLine: {
			        lineStyle: {
			          color: "#012f4a"
			        }
			      }
				  
			    },
			    series: [
			      {
			        name: "计划完成率",
			        type: "line",
			        // 是否让线条圆滑显示
			        smooth: true,
			        data: data.actual[0],
					label: {
						show: true,
						position: 'top',
						fontSize: 5,
						formatter: function (params) {
							  return params.value + "%"
						}
					              
					}
			      },
			      {
			        name: "目标值",
			        type: "line",
			        smooth: true,
			        data: [90, 90, 90, 90, 90],
					label: {
						show: true,
						position: 'top',
						fontSize: 5,
						formatter: function (params) {
							  return params.value + "%"
						}
					              
					}
			      }
			    ]
			  };
			  // 3. 把配置和数据给实例对象
			  myChart.setOption(option);
			
			  // 重新把配置好的新数据给实例对象
			  myChart.setOption(option);
			  window.addEventListener("resize", function() {
			    myChart.resize();
			  });
			})();
				
		}

	
	});


//从metabase获取数据并展示
//   var getDataSettings = {
// 	  "url": "https://mttmb.magna.cn/public/question/e494fae2-eb16-4ef9-8e6f-aa2111a2c703.json",
// 	  "method": "GET"
//   }
//   var responseData = null;
// $.ajax(getDataSettings).done(function (response) {
// 		if(response[0]){
// 			responseData = response[0];
// 			var renderData = {"data" : responseData}
// 			console.log("aaa");
// 			console.log(response);
// 			// 柱状图1模块
// 			(function() {
// 			  // 基于准备好的dom，初始化echarts实例
// 			  var myChart = echarts.init(document.querySelector(".pie .chart"));
			
// 			  option = {
// 			    tooltip: {
// 			      trigger: "item",
// 			      formatter: "{a} <br/>{b}: {c} ({d}%)",
// 			      position: function(p) {
// 			        //其中p为当前鼠标的位置
// 			        return [p[0] + 10, p[1] - 10];
// 			      }
// 			    },
// 			    legend: {
// 			      top: "10%",
// 			      itemWidth: 10,
// 			      itemHeight: 10,
// 			      data: ["9328", "9333", "9260", "9352", "9342"],
// 			      textStyle: {
// 			        color: "rgba(255,255,255,.5)",
// 			        fontSize: "12"
// 			      },
// 			      orient: 'vertical',
// 			      left: 'left'
// 			    },
// 			    series: [
// 			      {
// 			        name: "工废分布",
// 			        type: "pie",
// 			        center: ["50%", "42%"],
// 			        radius: ["40%", "60%"],
// 			        color: [
// 			          "#065aab",
// 			          "#066eab",
// 			          "#0682ab",
// 			          "#0696ab",
// 			          "#06a0ab",
// 			          "#06b4ab",
// 			          "#06c8ab",
// 			          "#06dcab",
// 			          "#06f0ab"
// 			        ],
// 			        label: { show: true },
// 			        labelLine: { show: true },
// 			        data: [
// 			          { value: response[0].unqualifiedL, name: response[0].processNumL },
// 			          { value: response[0].unqualifiedL, name: response[1].processNumL },
// 			          { value: response[0].unqualifiedL, name: response[2].processNumL },
// 			          { value: response[0].unqualifiedL, name: response[3].processNumL },
// 			          { value: response[0].unqualifiedL, name: response[4].processNumL }
// 			        ]
// 			      }
// 			    ]
// 			  };
			
// 			  // 使用刚指定的配置项和数据显示图表。
// 			  myChart.setOption(option);
// 			  window.addEventListener("resize", function() {
// 			    myChart.resize();
// 			  });
// 			})();
				
// 		}

	
// 	});
	
//工废	
(function() {
  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(document.querySelector(".pie .chart"));

  option = {
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
      position: function(p) {
        //其中p为当前鼠标的位置
        return [p[0] + 10, p[1] - 10];
      }
    },
    legend: {
      top: "10%",
      itemWidth: 10,
      itemHeight: 10,
      data: ["9328", "9333", "9260", "9352", "9342"],
      textStyle: {
        color: "rgba(255,255,255,.5)",
        fontSize: "12"
      },
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: "占比",
        type: "pie",
        center: ["50%", "42%"],
        radius: ["40%", "60%"],
        color: [
          "#065aab",
          "#066eab",
          "#0682ab",
          "#0696ab",
          "#06a0ab",
          "#06b4ab",
          "#06c8ab",
          "#06dcab",
          "#06f0ab"
        ],
        label: { show: true },
        labelLine: { show: true },
        data: [
          { value: 1, name: "9328" },
          { value: 4, name: "9333" },
          { value: 2, name: "9260" },
          { value: 2, name: "9352" },
          { value: 1, name: "9342" }
        ]
      }
    ]
  };

  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);
  window.addEventListener("resize", function() {
    myChart.resize();
  });
})();

//合格率
//从metabase获取数据并展示
  var getDataSettings = {
	  "url": "https://mttmb.magna.cn/public/question/b9d52a46-371d-4912-b731-e22526678ce1.json",
	  "method": "GET"
  }
  var responseData = null;
$.ajax(getDataSettings).done(function (response) {
		if(response[0]){
			responseData = response[0];
			var renderData = {"data" : responseData}
			//console.log("aaa");
			console.log(response);
			// 柱状图1模块
			(function() {
			  // 基于准备好的dom，初始化echarts实例
			  var myChart = echarts.init(document.querySelector(".bar1 .chart"));
			  var data = [];
			  for(var i in response){
				  data.push(response[i].compRateL)
			  }
			  console.log(data);
			  var titlename = [];
			  for(var i in response){
			  	  titlename.push(response[i].partNumL)
			  }
			  //console.log(titlename + "：测试");
			  var valdata = [];
			  for(var i in response){
			  	  valdata.push(100)
			  }
			  var myColor = ["#1089E7", "#F57474", "#56D0E3", "#F8B448", "#8B78F6"];
			  option = {
			    //图标位置
			    grid: {
			      top: "5%",
			      left: "22%",
			      bottom: "10%"
			    },
			    xAxis: {
			      show: false
			    },
			    yAxis: [
			      {
			        show: true,
			        data: titlename,
			        inverse: true,
			        axisLine: {
			          show: false
			        },
			        splitLine: {
			          show: false
			        },
			        axisTick: {
			          show: false
			        },
			        axisLabel: {
			          color: "#fff",
			
			          rich: {
			            lg: {
			              backgroundColor: "#339911",
			              color: "#fff",
			              borderRadius: 15,
			              // padding: 5,
			              align: "center",
			              width: 15,
			              height: 15
			            }
			          }
			        }
			      },
			      {
			        show: true,
			        inverse: true,
			        data: valdata,
			        axisLabel: {
			          textStyle: {
			            fontSize: 12,
			            color: "#fff"
			          }
			        }
			      }
			    ],
			    series: [
			      {
			        name: "条",
			        type: "bar",
			        yAxisIndex: 0,
			        data: data,
			        barCategoryGap: 50,
			        barWidth: 11,
			        itemStyle: {
			          normal: {
			            barBorderRadius: 20,
			            color: function(params) {
			              var num = myColor.length;
			              return myColor[params.dataIndex % num];
			            }
			          }
			        },
			        label: {
			          normal: {
			            show: true,
			            position: "inside",
			            formatter: "{c}%"
			          }
			        }
			      },
			      {
			        name: "框",
			        type: "bar",
			        yAxisIndex: 1,
			        barCategoryGap: 50,
			        data: [100, 100, 100, 100, 100],
			        barWidth: 15,
			        itemStyle: {
			          normal: {
			            color: "none",
			            borderColor: "#00c1de",
			            borderWidth: 1,
			            barBorderRadius: 15
			          }
			        }
			      }
			    ]
			  };
			
			  // 使用刚指定的配置项和数据显示图表。
			  myChart.setOption(option);
			  window.addEventListener("resize", function() {
			    myChart.resize();
			  });
			})();
				
		}

	
	});
//设备报修
//从metabase获取数据并展示
  var getDataSettings = {
	  "url": "https://mttmb.magna.cn/public/question/67e9df7c-8048-4b8a-b6be-4c950292a02a.json",
	  "method": "GET"
  }
  var responseData = null;
$.ajax(getDataSettings).done(function (response) {
		if(response[0]){
			responseData = response[0];
			var renderData = {"data" : responseData}
			console.log("aaa");
			console.log(response);
			// 柱状图1模块
			(function() {
			  // 基于准备好的dom，初始化echarts实例
			  var myChart = echarts.init(document.querySelector(".line1 .chart"));
			
			  var data = [];
			  for(var i in response){
				  data.push(response[i].time.toFixed(2))
			  }
			  var titlename = [];
			  for(var i in response){
				  titlename.push(response[i].deviceName)
			  }
			  var myColor = ["#F57474", "#56D0E3"];
			  option = {
			    //图标位置
			    grid: {
			      top: "10%",
			      left: "22%",
			      bottom: "10%"
			    },
			    xAxis: {
			      show: false
			    },
			    yAxis: [
			      {
			        show: true,
			        data: titlename.map(function (str) {
						return str.replace(' ', '\n');
					}),
			        inverse: true,
			        axisLine: {
			          show: false
			        },
			        splitLine: {
			          show: false
			        },
			        axisTick: {
			          show: false
			        },
			        axisLabel: {
			          color: "#fff",
					  fontSize: 10,
					  interval: 0,
			          rich: {
			            lg: {
			              backgroundColor: "#339911",
			              color: "#fff",
			              borderRadius: 15,
			              // padding: 5,
			              align: "center",
			              width: 15,
			              height: 15
			            }
			          }
			        }
			      }
			    ],
			    series: [
			      {
			        name: "条",
			        type: "bar",
			        yAxisIndex: 0,
			        data: data,
			        barCategoryGap: 50,
			        barWidth: 10,
			        itemStyle: {
			          normal: {
			            barBorderRadius: 20,
			            color: function(params) {
			              var num = myColor.length;
			              return myColor[params.dataIndex % num];
			            }
			          }
			        },
			        label: {
			          normal: {
			            show: true,
			            position: "inside"
			          }
			        }
			      }
			    ]
			  };
			
			  // 使用刚指定的配置项和数据显示图表。
			  myChart.setOption(option);
			  window.addEventListener("resize", function() {
			    myChart.resize();
			  });
			})();
				
		}

	
	});
	
 
// 折线图 
// (function() {
//   // 基于准备好的dom，初始化echarts实例
//   var myChart = echarts.init(document.querySelector(".line1 .chart"));

//   option = {
//     tooltip: {
//       trigger: "axis",
//       axisPointer: {
//         lineStyle: {
//           color: "#dddc6b"
//         }
//       }
//     },
//     legend: {
//       top: "0%",
//       textStyle: {
//         color: "rgba(255,255,255,.5)",
//         fontSize: "12"
//       }
//     },
//     grid: {
//       left: "10",
//       top: "30",
//       right: "10",
//       bottom: "10",
//       containLabel: true
//     },

//     xAxis: [
//       {
//         type: "category",
//         boundaryGap: false,
//         axisLabel: {
//           textStyle: {
//             color: "rgba(255,255,255,.6)",
//             fontSize: 12
//           }
//         },
//         axisLine: {
//           lineStyle: {
//             color: "rgba(255,255,255,.2)"
//           }
//         },

//         data: [
//           "01",
//           "02",
//           "03",
//           "04",
//           "05",
//           "06",
//           "07",
//           "08",
//           "09",
//           "11",
//           "12",
//           "13",
//           "14",
//           "15",
//           "16",
//           "17",
//           "18",
//           "19",
//           "20",
//           "21",
//           "22",
//           "23",
//           "24",
//           "25",
//           "26",
//           "27",
//           "28",
//           "29",
//           "30"
//         ]
//       },
//       {
//         axisPointer: { show: false },
//         axisLine: { show: false },
//         position: "bottom",
//         offset: 20
//       }
//     ],

//     yAxis: [
//       {
//         type: "value",
//         axisTick: { show: false },
//         axisLine: {
//           lineStyle: {
//             color: "rgba(255,255,255,.1)"
//           }
//         },
//         axisLabel: {
//           textStyle: {
//             color: "rgba(255,255,255,.6)",
//             fontSize: 12
//           }
//         },

//         splitLine: {
//           lineStyle: {
//             color: "rgba(255,255,255,.1)"
//           }
//         }
//       }
//     ],
//     series: [
//       {
//         name: "播放量",
//         type: "line",
//         smooth: true,
//         symbol: "circle",
//         symbolSize: 5,
//         showSymbol: false,
//         lineStyle: {
//           normal: {
//             color: "#0184d5",
//             width: 2
//           }
//         },
//         areaStyle: {
//           normal: {
//             color: new echarts.graphic.LinearGradient(
//               0,
//               0,
//               0,
//               1,
//               [
//                 {
//                   offset: 0,
//                   color: "rgba(1, 132, 213, 0.4)"
//                 },
//                 {
//                   offset: 0.8,
//                   color: "rgba(1, 132, 213, 0.1)"
//                 }
//               ],
//               false
//             ),
//             shadowColor: "rgba(0, 0, 0, 0.1)"
//           }
//         },
//         itemStyle: {
//           normal: {
//             color: "#0184d5",
//             borderColor: "rgba(221, 220, 107, .1)",
//             borderWidth: 12
//           }
//         },
//         data: [
//           30,
//           40,
//           30,
//           40,
//           30,
//           40,
//           30,
//           60,
//           20,
//           40,
//           20,
//           40,
//           30,
//           40,
//           30,
//           40,
//           30,
//           40,
//           30,
//           60,
//           20,
//           40,
//           20,
//           40,
//           30,
//           60,
//           20,
//           40,
//           20,
//           40
//         ]
//       },
//       {
//         name: "转发量",
//         type: "line",
//         smooth: true,
//         symbol: "circle",
//         symbolSize: 5,
//         showSymbol: false,
//         lineStyle: {
//           normal: {
//             color: "#00d887",
//             width: 2
//           }
//         },
//         areaStyle: {
//           normal: {
//             color: new echarts.graphic.LinearGradient(
//               0,
//               0,
//               0,
//               1,
//               [
//                 {
//                   offset: 0,
//                   color: "rgba(0, 216, 135, 0.4)"
//                 },
//                 {
//                   offset: 0.8,
//                   color: "rgba(0, 216, 135, 0.1)"
//                 }
//               ],
//               false
//             ),
//             shadowColor: "rgba(0, 0, 0, 0.1)"
//           }
//         },
//         itemStyle: {
//           normal: {
//             color: "#00d887",
//             borderColor: "rgba(221, 220, 107, .1)",
//             borderWidth: 12
//           }
//         },
//         data: [
//           50,
//           30,
//           50,
//           60,
//           10,
//           50,
//           30,
//           50,
//           60,
//           40,
//           60,
//           40,
//           80,
//           30,
//           50,
//           60,
//           10,
//           50,
//           30,
//           70,
//           20,
//           50,
//           10,
//           40,
//           50,
//           30,
//           70,
//           20,
//           50,
//           10,
//           40
//         ]
//       }
//     ]
//   };

//   // 使用刚指定的配置项和数据显示图表。
//   myChart.setOption(option);
//   window.addEventListener("resize", function() {
//     myChart.resize();
//   });
// })();
//客户投诉
// 点位分布统计模块
 var getDataSettings = {
	  "url": "https://mttmb.magna.cn/public/question/20e02da7-833b-4cf0-b731-fc7cabe01aaa.json",
	  "method": "GET"
  }
  var responseData = null;
$.ajax(getDataSettings).done(function (response) {
		if(response[0]){
			responseData = response[0];
			//var renderData = {"data" : responseData}
			console.log("aaa");
			console.log(response);
			// 柱状图1模块
			(function() {
			  // 1. 实例化对象
			  var myChart = echarts.init(document.querySelector(".pie1  .chart"));
			  var data = []
			  for(var i in response){
				  var data2 = { value: response[i].num, name: response[i].partName }
				  data.push(data2)
			  }
			  // 2. 指定配置项和数据
			  var option = {
			    legend: {
			      top: "84%",
			      itemWidth: 10,
			      itemHeight: 10,
			      textStyle: {
			        color: "rgba(255,255,255,.5)",
			        fontSize: "12"
			      }
			    },
			    tooltip: {
			      trigger: "item",
			      formatter: "{a} <br/>{b} : {c} ({d}%)"
			    },
			    // 注意颜色写的位置
			    color: [
			      "#006cff",
			      "#60cda0",
			      "#ed8884",
			      "#ff9f7f",
			      "#0096ff",
			      "#9fe6b8",
			      "#32c5e9",
			      "#1d9dff"
			    ],
			    series: [
			      {
			        name: "点位统计",
			        type: "pie",
			        // 如果radius是百分比则必须加引号
			        radius: ["10%", "70%"],
			        center: ["50%", "42%"],
			        roseType: "radius",
			        data: data,
			        // 修饰饼形图文字相关的样式 label对象
			        label: {
			          fontSize: 10
			        },
			        // 修饰引导线样式
			        labelLine: {
			          // 连接到图形的线长度
			          length: 10,
			          // 连接到文字的线长度
			          length2: 10
			        }
			      }
			    ]
			  };
			
			  // 3. 配置项和数据给我们的实例化对象
			  myChart.setOption(option);
			  // 4. 当我们浏览器缩放的时候，图表也等比例缩放
			  window.addEventListener("resize", function() {
			    // 让我们的图表调用 resize这个方法
			    myChart.resize();
			  });
			})();
				
		}

	
	});
	


//仪表盘
(function() {
  // 1. 实例化对象
  var myChart = echarts.init(document.querySelector(".bar2  .chart"));
  // 2. 指定配置项和数据
  var option = {
    series: [{
        type: 'gauge',
		radius: '100%',
        axisLine: {
			
            lineStyle: {
                width: 30,
				
                color: [
                    [0.3, '#67e0e3'],
                    [0.7, '#37a2da'],
                    [1, '#fd666d']
                ]
            }
        },
        pointer: {
			width: 2,
            itemStyle: {
                color: 'auto'
            }
        },
        axisTick: {
            distance: -20,
            length: 10,
            lineStyle: {
                color: '#fff',
                width: 2
            }
        },
        splitLine: {
            distance: -30,
            length: 30,
            lineStyle: {
                color: '#fff',
                width: 2
            }
        },
        axisLabel: {
            color: 'auto',
            distance: 5,
            fontSize: 13
        },
        detail: {
            valueAnimation: true,
            formatter: '{value} %',
			fontSize: 16,
            color: 'auto'
        },
        data: [{
            value: 10
        }]
    }]
};

setInterval(function () {
    option.series[0].data[0].value = (Math.random() * 100).toFixed(2) - 0;
    myChart.setOption(option, true);
}, 2000);

  // 3. 配置项和数据给我们的实例化对象
  myChart.setOption(option);
  // 4. 当我们浏览器缩放的时候，图表也等比例缩放
  window.addEventListener("resize", function() {
    // 让我们的图表调用 resize这个方法
    myChart.resize();
  });
})();
