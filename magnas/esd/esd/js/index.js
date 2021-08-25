//OEE
// //从metabase获取数据并展示
// (function() {
// 			  // 实例化对象
// 			  var myChart = echarts.init(document.querySelector(".bar .chart"));
// 			  // 指定配置和数据
// 			  var option = {
// 			    color: ["#2f89cf", "red"],
// 			    tooltip: {
// 			      trigger: "item",
// 			      axisPointer: {
// 			        // 坐标轴指示器，坐标轴触发有效
// 			        type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
// 			      }
// 			    },
// 			    grid: {
// 			      left: "0%",
// 			      top: "5px",
// 			      right: "0%",
// 			      bottom: "4%",
// 			      containLabel: true
// 			    },
// 			    xAxis: [
// 			      {
// 			        type: "category",
// 			        data: [
// 			            "9701 AACJ0011",
// 						"9702 AACH0011",
// 						"9706 AADN0011",
// 						"9707 AADK0011"
// 			        ].map(function (str) {
// 						return str.replace(' ', '\n');
// 					}),
// 			        axisTick: {
// 			          alignWithLabel: true
// 			        },
// 			        axisLabel: {
// 			          textStyle: {
// 			            color: "rgba(255,255,255,.6)",
// 			            fontSize: "6.5"
// 			          }
// 			        },
// 			        axisLine: {
// 			          show: false
// 			        }
// 			      }
// 			    ],
// 			    yAxis: [
// 			      {
// 			        type: "value",
// 					max: 110,
// 			        axisLabel: {
// 			          textStyle: {
// 			            color: "rgba(255,255,255,.6)",
// 			            fontSize: "12"
// 			          }
// 			        },
// 			        axisLine: {
// 			          lineStyle: {
// 			            color: "rgba(255,255,255,.1)"
// 			            // width: 1,
// 			            // type: "solid"
// 			          }
// 			        },
// 			        splitLine: {
// 			          lineStyle: {
// 			            color: "rgba(255,255,255,.1)"
// 			          }
// 			        }
// 			      }
// 			    ],
// 			    series: [
// 			      {
// 			        name: "利用率",
// 			        type: "bar",
// 			        barWidth: "30%",
// 			        data: [
// 			        	76.6,
// 						69.5,
// 						68.9,
// 						47.0
// 						],
						
// 			        itemStyle: {
// 			          barBorderRadius: 5
// 			        },
// 					label: {
// 						show: true,
// 						position: 'top',
// 						fontSize: 8,
// 						formatter: function (params) {
// 							  return params.value + "%"
// 						}
					              
// 					}
// 			      },
// 				  {
// 				    name: "目标值",
// 				    type: "line",
// 				    smooth: true,
// 				    data: [
// 						82,
// 			            82,
// 			            82,
// 			            82],
// 				  					label: {
// 				  						show: true,
// 				  						position: 'top',
// 				  						fontSize: 7,
// 				  						formatter: function (params) {
// 				  							  return params.value + "%"
// 				  						}
				  					              
// 				  					}
// 				  }
// 			    ]
// 			  };
			
// 			  // 把配置给实例对象
// 			  myChart.setOption(option);
// 			  window.addEventListener("resize", function() {
// 			    myChart.resize();
// 			  });
			
// 			  // 数据变化
			 
			
// 			  $(".bar h2 ").on("click", "a", function() {
// 			    option.series[0].data = dataAll[$(this).index()].data;
// 			    myChart.setOption(option);
// 			  });
// 			})();
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
			  var namey=[]
			  for(var a in response){
				  namey.push(response[a].equipL)
			  }
			  var oee=[]
			  for(var i in response){
				  oee.push(response[i].OEEL > 100 ? 100 : response[i].OEEL)
			  }
			  var targetOEEL = []
			  for(var i in response){
				  targetOEEL.push(response[i].targetOEEL)
			  }
			  // 指定配置和数据
			  var option = {
			    color: ["#2f89cf", "red"],
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
			      bottom: "10%",
			      containLabel: true
			    },
			    xAxis: [
			      {
			        type: "category",
			        data: namey.map(function (str) {
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
					max: 110,
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
			        data: oee,
						
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
				    data: targetOEEL,
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
// (function() {
// 			  // 实例化对象
// 			  var myChart = echarts.init(document.querySelector(".item .chart"));
// 			  // 指定配置和数据
// 			  var option = {
// 			    color: ["#2f89cf", "#F8B448"],
// 			    tooltip: {
// 			      trigger: "item",
// 			      axisPointer: {
// 			        // 坐标轴指示器，坐标轴触发有效
// 			        type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
// 			      }
// 			    },
// 			    grid: {
// 			      left: "0%",
// 			      top: "5px",
// 			      right: "0%",
// 			      bottom: "4%",
// 			      containLabel: true
// 			    },
// 			    xAxis: [
// 			      {
// 			        type: "category",
// 			        data: [
// 			            "AACH0021 设备故障",
// 			            "AACJ0011 设备故障",
// 						"AACK0011 设备故障",
// 						"AADK0011 设备故障",
// 						"AADK0011 0797070002 \n 合格率异常94.3%",
// 						"AADN0011 设备故障"
// 			        ].map(function (str) {
// 						return str.replace(' ', '\n');
// 					}),
// 			        axisTick: {
// 			          alignWithLabel: true
// 			        },
// 			        axisLabel: {
// 			          textStyle: {
// 			            color: "rgba(255,255,255,.6)",
// 			            fontSize: "6"
// 			          }
// 			        },
// 			        axisLine: {
// 			          show: false
// 			        }
// 			      }
// 			    ],
// 			    yAxis: [
// 			      {
// 			        type: "value",
// 					max: 5,
// 			        axisLabel: {
// 			          textStyle: {
// 			            color: "rgba(255,255,255,.6)",
// 			            fontSize: "12"
// 			          }
// 			        },
// 			        axisLine: {
// 			          lineStyle: {
// 			            color: "rgba(255,255,255,.1)"
// 			            // width: 1,
// 			            // type: "solid"
// 			          }
// 			        },
// 			        splitLine: {
// 			          lineStyle: {
// 			            color: "rgba(255,255,255,.1)"
// 			          }
// 			        }
// 			      }
// 			    ],
// 			    series: [
// 			      {
// 			        name: "",
// 			        type: "bar",
// 			        barWidth: "30%",
// 			        data: [
// 						1,
// 						1,
// 						2,
// 						1,
// 						1,
// 						2
// 						],
						
// 			        itemStyle: {
// 			          barBorderRadius: 5
// 			        },
// 					label: {
// 						show: true,
// 						position: 'top',
// 						fontSize: 8,
// 						formatter: function (params) {
// 							  return params.value
// 						}
					              
// 					}
// 			      }
// 			    ]
// 			  };
			
// 			  // 把配置给实例对象
// 			  myChart.setOption(option);
// 			  window.addEventListener("resize", function() {
// 			    myChart.resize();
// 			  });
			
// 			  // 数据变化
			 
			
// 			  $(".bar h2 ").on("click", "a", function() {
// 			    option.series[0].data = dataAll[$(this).index()].data;
// 			    myChart.setOption(option);
// 			  });
// 			})();
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
			  var xdata=[]
			  var data=[]
			  for(var a in response){
			  		xdata.push(response[a].x)
					data.push(response[a].num)
			  }
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
			        data: xdata.map(function (str) {
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
					max: 5,
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
			        name: "",
			        type: "bar",
			        barWidth: "30%",
			        data: data,
						
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
// (function() {
			  
// 			  // 基于准备好的dom，初始化echarts实例
// 			  var myChart = echarts.init(document.querySelector(".line .chart"));
			  
// 			  // (1)准备数据
			  
			
// 			  // 2. 指定配置和数据
// 			  var option = {
// 			    color: ["#00f2f1", "red"],
// 			    tooltip: {
// 			      // 通过坐标轴来触发
// 			      trigger: "axis"
// 			    },
// 			    legend: {
// 			      right: "10%",
// 			      textStyle: {
// 			        color: "#4c9bfd"
// 			      }
// 			    },
// 			    grid: {
// 			      top: "20%",
// 			      left: "3%",
// 			      right: "4%",
// 			      bottom: "3%",
// 			      show: true,
// 			      borderColor: "#012f4a",
// 			      containLabel: true
// 			    },
			
// 			    xAxis: {
// 			      type: "category",
// 			      boundaryGap: false,
// 			      data: [
// 			        "9701",
// 			        "9702",
// 			        "9706",
// 			        "9707",
// 			        "9E01"
// 			      ],
// 			      // 去除刻度
// 			      axisTick: {
// 			        show: false
// 			      },
// 			      // 修饰刻度标签的颜色
// 			      axisLabel: {
// 			        color: "rgba(255,255,255,.7)",
// 					fontSize: "6"
// 			      },
// 			      // 去除x坐标轴的颜色
// 			      axisLine: {
// 			        show: false
// 			      }
// 			    },
// 			    yAxis: {
// 			      type: "value",
// 			      // 去除刻度
// 			      axisTick: {
// 			        show: false
// 			      },
// 			      // 修饰刻度标签的颜色
// 			      axisLabel: {
// 			        color: "rgba(255,255,255,.7)"
// 			      },
// 			      // 修改y轴分割线的颜色
// 			      splitLine: {
// 			        lineStyle: {
// 			          color: "#012f4a"
// 			        }
// 			      }
				  
// 			    },
// 			    series: [
// 			      {
// 			        name: "计划完成率",
// 			        type: "bar",
// 					barWidth: "15%",
// 					itemStyle: {
// 					  barBorderRadius: 5
// 					},
// 			        // 是否让线条圆滑显示
// 			        smooth: true,
// 			        data: [
// 						76,
// 						65,
// 						98,
// 						58,
// 						91
// 					],
// 					label: {
// 						show: true,
// 						position: 'top',
// 						fontSize: 5,
// 						formatter: function (params) {
// 							  return params.value + "%"
// 						}
					              
// 					}
// 			      },
// 			      {
// 			        name: "目标值",
// 			        type: "line",
// 			        smooth: true,
// 			        data: [100, 100, 100, 100, 100],
// 					label: {
// 						show: true,
// 						position: 'top',
// 						fontSize: 5,
// 						formatter: function (params) {
// 							  return params.value + "%"
// 						}
					              
// 					}
// 			      }
// 			    ]
// 			  };
// 			  // 3. 把配置和数据给实例对象
// 			  myChart.setOption(option);
			
// 			  // 重新把配置好的新数据给实例对象
// 			  myChart.setOption(option);
// 			  window.addEventListener("resize", function() {
// 			    myChart.resize();
// 			  });
// 			})();
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
			  var data = []
			  var data2 = []
			  for(var i in response){
			  		
			  		data.push(response[i].compRateL);
			  		data2.push(100);
			  }
			  var details = []
			  
			  for(var i in response){
			  		
			  		details.push(response[i].projectNo);
			  		
			  }
			  // {
			  //   actual: [
			  //     [response[0].compRateL,
			  //       response[1].compRateL,
			  //       response[2].compRateL,
			  //       response[3].compRateL]
			  //   ]
			  // };
			
			  // 2. 指定配置和数据
			  var option = {
			    color: ["#00f2f1", "red"],
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
			      data: details,
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
				  splitNumber : 5,
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
			        type: "bar",
					barWidth: "15%",
					itemStyle: {
					  barBorderRadius: 5
					},
			        // 是否让线条圆滑显示
			        //smooth: true,
			        data: data,
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
			        data: data2,
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
  var getDataSettings = {
	  "url": "https://mttmb.magna.cn/public/question/e494fae2-eb16-4ef9-8e6f-aa2111a2c703.json",
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
			  var myChart = echarts.init(document.querySelector(".pie .chart"));
			  var data = []
			  for(var i in response){
			  		
			  		data.push(response[i].wP);
			  		
			  }
			  var xdata = []
			  for(var i in response){
			  		
			  		xdata.push(response[i].projectNo);
			  		
			  }
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
			        data: xdata.map(function (str) {
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
					max: 1.5,
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
			        name: "工废比率",
			        type: "bar",
			        barWidth: "30%",
			        data: data,
						
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
// (function() {
//   // 基于准备好的dom，初始化echarts实例
//   var myChart = echarts.init(document.querySelector(".pie .chart"));

//   option = {
//     tooltip: {
//       trigger: "item",
//       formatter: "{a} <br/>{b}: {c} ({d}%)",
//       position: function(p) {
//         //其中p为当前鼠标的位置
//         return [p[0] + 10, p[1] - 10];
//       }
//     },
//     legend: {
//       top: "10%",
//       itemWidth: 10,
//       itemHeight: 10,
//       data: ["9328", "9333", "9260", "9352", "9342"],
//       textStyle: {
//         color: "rgba(255,255,255,.5)",
//         fontSize: "12"
//       },
//       orient: 'vertical',
//       left: 'left'
//     },
//     series: [
//       {
//         name: "占比",
//         type: "pie",
//         center: ["50%", "42%"],
//         radius: ["40%", "60%"],
//         color: [
//           "#065aab",
//           "#066eab",
//           "#0682ab",
//           "#0696ab",
//           "#06a0ab",
//           "#06b4ab",
//           "#06c8ab",
//           "#06dcab",
//           "#06f0ab"
//         ],
//         label: { show: true },
//         labelLine: { show: true },
//         data: [
//           { value: 1, name: "9328" },
//           { value: 4, name: "9333" },
//           { value: 2, name: "9260" },
//           { value: 2, name: "9352" },
//           { value: 1, name: "9342" }
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
			  	  titlename.push(response[i].projectNoL)
			  }
			  //console.log(titlename + "：测试");
			  var valdata = [];
			  for(var i in response){
			  	  valdata.push(100)
			  }
			  var myColor =[]
			  			  for (var i in data) {
			  				  var colors ;
			  				  if(response[i].compRateL >= 90){
			  					  colors = "#56D0E3";
			  				  }else if(80 < response[i].compRateL < 90){
			  					  colors = "#f4a639";
			  				  }else{
			  					  colors = "#F57474";
			  				  }
			  			  	myColor.push(colors)
			  			  }
			  //var myColor = ["#1089E7", "#F57474", "#56D0E3", "#F8B448", "#8B78F6"];
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
// (function() {
// 			  // 基于准备好的dom，初始化echarts实例
// 			  var myChart = echarts.init(document.querySelector(".bar1 .chart"));
// 			  // var data = [];
// 			  // for(var i in response){
// 				 //  data.push(response[i].compRateL)
// 			  // }
// 			  // console.log(data);
// 			  // var titlename = [];
// 			  // for(var i in response){
// 			  // 	  titlename.push(response[i].partNumL)
// 			  // }
// 			  // //console.log(titlename + "：测试");
// 			  // var valdata = [];
// 			  // for(var i in response){
// 			  // 	  valdata.push(100)
// 			  // }
// 			  var data = [
// 			  	99,
// 			  	99.8,
// 			  	99.9,
// 			  	94.3
// 			  ]
// 			  var myColor =[]
// 			  for (var i in data) {
// 				  var colors ;
// 				  if(data[i] > 90){
// 					  colors = "#56D0E3";
// 				  }else if(80 < data[i] < 90){
// 					  colors = "#f4a639";
// 				  }else{
// 					  colors = "#F57474";
// 				  }
// 			  	myColor.push(colors)
// 			  }
// 			  //var myColor = ["#1089E7", "#F57474", "#56D0E3", "#F8B448", "#8B78F6"];
// 			  option = {
// 			    //图标位置
// 			    grid: {
// 			      top: "5%",
// 			      left: "22%",
// 			      bottom: "10%"
// 			    },
// 			    xAxis: {
// 			      show: false
// 			    },
// 			    yAxis: [
// 			      {
// 			        show: true,
// 			        data: [
// 						"9701",
// 						"9702",
// 						"9706",
// 						"9707"
// 					],
// 			        inverse: true,
// 			        axisLine: {
// 			          show: false
// 			        },
// 			        splitLine: {
// 			          show: false
// 			        },
// 			        axisTick: {
// 			          show: false
// 			        },
// 			        axisLabel: {
// 			          color: "#fff",
			
// 			          rich: {
// 			            lg: {
// 			              backgroundColor: "#339911",
// 			              color: "#fff",
// 			              borderRadius: 15,
// 			              // padding: 5,
// 			              align: "center",
// 			              width: 15,
// 			              height: 15
// 			            }
// 			          }
// 			        }
// 			      },
// 			      {
// 			        show: true,
// 			        inverse: true,
// 			        data: [100,100,100,100],
// 			        axisLabel: {
// 			          textStyle: {
// 			            fontSize: 12,
// 			            color: "#fff"
// 			          }
// 			        }
// 			      }
// 			    ],
// 			    series: [
// 			      {
// 			        name: "",
// 			        type: "bar",
// 			        yAxisIndex: 0,
// 			        data: data,
// 			        barCategoryGap: 50,
// 			        barWidth: 11,
// 			        itemStyle: {
// 			          normal: {
// 			            barBorderRadius: 20,
// 			            color: function(params) {
// 			              var num = myColor.length;
// 			              return myColor[params.dataIndex % num];
// 			            }
// 			          }
// 			        },
// 			        label: {
// 			          normal: {
// 			            show: true,
// 			            position: "inside",
// 			            formatter: "{c}%"
// 			          }
// 			        }
// 			      },
// 			      {
// 			        name: "框",
// 			        type: "bar",
// 			        yAxisIndex: 1,
// 			        barCategoryGap: 50,
// 			        data: [100, 100, 100, 100, 100],
// 			        barWidth: 15,
// 			        itemStyle: {
// 			          normal: {
// 			            color: "none",
// 			            borderColor: "#00c1de",
// 			            borderWidth: 1,
// 			            barBorderRadius: 15
// 			          }
// 			        }
// 			      }
// 			    ]
// 			  };
			
// 			  // 使用刚指定的配置项和数据显示图表。
// 			  myChart.setOption(option);
// 			  window.addEventListener("resize", function() {
// 			    myChart.resize();
// 			  });
// 			})();
//设备报修
//从metabase获取数据并展示
// (function() {
// 			  // 基于准备好的dom，初始化echarts实例
// 			  var myChart = echarts.init(document.querySelector(".line1 .chart"));
			
// 			  var data = [549,144,136,136,80];
// 			  // for(var i in response){
// 				 //  data.push(response[i].time.toFixed(2))
// 			  // }
// 			  // var titlename = [];
// 			  // for(var i in response){
// 				 //  titlename.push(response[i].deviceName)
// 			  // }
// 			  var myColor = [];
// 			  for(var i in data){
// 			  		myColor.push(data[i] > 120 ? "#F57474" : "#f4a639")
// 			  }
// 			  //var myColor = ["red", "#56D0E3"];
// 			  option = {
// 			    //图标位置
// 			    grid: {
// 			      top: "10%",
// 			      left: "22%",
// 			      bottom: "10%"
// 			    },
// 			    xAxis: {
// 			      show: false
// 			    },
// 			    yAxis: [
// 			      {
// 			        show: true,
// 			        data: [
// 						"AADN0011 MR5自动检测设备_2#",
// 						"AACH0021 9702检测设备_2#",
// 						"AACJ0011 MR4自动检测设备_1#",
// 						"AADK0011 Gen5D_装配及检测线",
// 						"AACK0011 MR4自动检测设备_2#"
// 					].map(function (str) {
// 						return str.replace(' ', '\n');
// 					}),
// 			        inverse: true,
// 			        axisLine: {
// 			          show: false
// 			        },
// 			        splitLine: {
// 			          show: false
// 			        },
// 			        axisTick: {
// 			          show: false
// 			        },
// 			        axisLabel: {
// 			          color: "#fff",
// 					  fontSize: 10,
// 					  interval: 0,
// 			          rich: {
// 			            lg: {
// 			              backgroundColor: "#339911",
// 			              color: "#fff",
// 			              borderRadius: 15,
// 			              // padding: 5,
// 			              align: "center",
// 			              width: 15,
// 			              height: 15
// 			            }
// 			          }
// 			        }
// 			      }
// 			    ],
// 			    series: [
// 			      {
// 			        name: "条",
// 			        type: "bar",
// 			        yAxisIndex: 0,
// 			        data: data,
// 			        barCategoryGap: 50,
// 			        barWidth: 10,
// 			        itemStyle: {
// 			          normal: {
// 			            barBorderRadius: 20,
// 			            color: function(params) {
// 			              var num = myColor.length;
// 			              return myColor[params.dataIndex % num];
// 			            }
// 			          }
// 			        },
// 			        label: {
// 			          normal: {
// 			            show: true,
// 			            position: "inside"
// 			          }
// 			        }
// 			      }
// 			    ]
// 			  };
			
// 			  // 使用刚指定的配置项和数据显示图表。
// 			  myChart.setOption(option);
// 			  window.addEventListener("resize", function() {
// 			    myChart.resize();
// 			  });
// 			})();
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
			  var myColor = [];
			  for(var i in response){
			  		myColor.push(response[i].time > 120 ? "red" : "#f4a639")
			  }
			  //var myColor = ["#F57474", "#56D0E3"];
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
//产能
// 点位分布统计模块
//   var getDataSettings = {
// 	  "url": "https://mttmb.magna.cn/public/question/72bc3524-2d4d-408e-b477-a5f0d4b1870d.json",
// 	  "method": "GET"
//   }
//   var responseData = null;
// $.ajax(getDataSettings).done(function (response) {
// 		if(response[0]){
// 			responseData = response[0];
// 			var renderData = {"data" : responseData}
// 			console.log("aaa");
// 			console.log(response);
// 			(function() {
// 			  // 1. 实例化对象
// 			  var myChart = echarts.init(document.querySelector(".pie1  .chart"));
// 			  var datax = []
// 			  var data1 = []
// 			  var data2 = []
// 			  var data3 = []
// 			  for(var i in response){
			   
// 			   datax.push(response[i].productType)
// 			   data1.push(response[i].unqualified)
// 			   data2.push(response[i].completionL)
// 			   data3.push(response[i].proCapacityL)
// 			  }
// 			  // 2. 指定配置项和数据
// 			  var option = {
// 				tooltip: {
// 					trigger: 'axis',
// 					axisPointer: {            // 坐标轴指示器，坐标轴触发有效
// 						type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
// 					}
// 				},
// 				legend: {
// 						data: ['不良品', '合格品', '产能'],
// 						textStyle: {
// 						  color: "rgba(255,255,255,.6)",
// 						  fontSize: "6.5"
// 						}
// 					},
// 				grid: {
// 					top: '18%',
// 					left: '3%',
// 					right: '4%',
// 					bottom: '5%',
// 					containLabel: true
// 				},
// 				xAxis: [
// 						{
// 							type: 'category',
// 							axisTick: {show: false},
// 							data: datax,
// 							axisLabel: {
// 							  textStyle: {
// 								color: "rgba(255,255,255,.6)",
// 								fontSize: "6.5"
// 							  }
// 							},
// 							axisLine: {
// 							  show: false
// 							}
// 						}
// 					],
// 					yAxis: [
// 						{
// 							type: 'value',
// 							max: 1500,
// 							axisLabel: {
// 							  textStyle: {
// 								color: "rgba(255,255,255,.6)",
// 								fontSize: "6.5"
// 							  }
// 							},
// 							axisLine: {
// 							  show: false
// 							}
// 						},
						
// 					],
// 				series: [
// 					{
// 						name: '不良品',
// 						type: 'bar',
// 						stack: '产品',
// 						emphasis: {
// 							focus: 'series'
// 						},
// 						data: data1,
						
// 						itemStyle: {
// 						  normal: {
// 							color: "red"
// 						  }
// 						}
// 					},
// 					{
// 						name: '合格品',
// 						type: 'bar',
// 						stack: '产品',
// 						emphasis: {
// 							focus: 'series'
// 						},
// 						data: data2,
						
// 						itemStyle: {
// 						  normal: {
// 							color: "#49c7dd"
// 						  }
// 						}
// 					},
// 					{
// 						name: '产能',
// 						type: 'line',
// 						data: data3,
// 						emphasis: {
// 							focus: 'series'
// 						},
// 						itemStyle: {
// 						  normal: {
// 							color: "red"
// 						  }
// 						 }
// 						// markLine: {
// 						// 	lineStyle: {
// 						// 		type: 'dashed'
// 						// 	},
// 						// 	data: [
// 						// 		[{type: 'min'}, {type: 'max'}]
// 						// 	]
// 						// }
// 					}
// 				]
// 			};
// // 3. 配置项和数据给我们的实例化对象
// 			  myChart.setOption(option);
// 			  // 4. 当我们浏览器缩放的时候，图表也等比例缩放
// 			  window.addEventListener("resize", function() {
// 			    // 让我们的图表调用 resize这个方法
// 			    myChart.resize();
// 			  });
// 			})();
// 	}

	
// });
  // var option = {
	 //  grid: {
	 //    top: "5%",
	 //    left: "22%",
	 //    bottom: "15%"
	 //  },
		// 	tooltip: {
		// 		trigger: 'axis',
		// 		axisPointer: {
		// 			type: 'shadow'
		// 		}
		// 	},
		// 	toolbox: {
		// 		show: true,
		// 		orient: 'vertical',
		// 		left: 'right',
		// 		top: 'center',
		// 		//下载、刷新
		// 		// feature: {
		// 		// 	mark: {show: true},
		// 		// 	dataView: {show: true, readOnly: false},
		// 		// 	magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
		// 		// 	restore: {show: true},
		// 		// 	saveAsImage: {show: true}
		// 		// }
		// 	},
		// 	xAxis: [
		// 		{
		// 			type: 'category',
		// 			axisTick: {show: false},
		// 			data: ['MR4', 'MR5', 'MD3', 'Gen 5C/D'],
		// 			axisLabel: {
		// 			  textStyle: {
		// 			    color: "rgba(255,255,255,.6)",
		// 			    fontSize: "6.5"
		// 			  }
		// 			},
		// 			axisLine: {
		// 			  show: false
		// 			}
		// 		}
		// 	],
		// 	yAxis: [
		// 		{
		// 			type: 'value',
		// 			axisLabel: {
		// 			  textStyle: {
		// 			    color: "rgba(255,255,255,.6)",
		// 			    fontSize: "6.5"
		// 			  }
		// 			},
		// 			axisLine: {
		// 			  show: false
		// 			}
		// 		},
				
		// 	],
		// 	series: [
		// 		{
		// 			name: 'Forest',
		// 			type: 'bar',
		// 			barGap: 0,
		// 			emphasis: {
		// 				focus: 'series'
		// 			},
		// 			data: [90, 90, 81, 97],
		// 			label: {
		// 				show: true,
		// 				position: 'top',
		// 				fontSize: 6,
		// 				formatter: function (params) {
		// 					  return params.value + "% \n 产能"
		// 				}
					              
		// 			},
		// 			itemStyle: {
		// 			  normal: {
		// 			    color: "#49c7dd"
		// 			  }
		// 			}
		// 		},
		// 		{
		// 			name: 'Steppe',
		// 			type: 'bar',
		// 			emphasis: {
		// 				focus: 'series'
		// 			},
		// 			data: [237, 237, 204, 270],
		// 			label: {
		// 				show: true,
		// 				position: 'top',
		// 				fontSize: 6,
		// 				formatter: function (params) {
		// 					  return params.value + " \n 合格数"
		// 				}
					              
		// 			},
		// 			itemStyle: {
		// 			  normal: {
		// 			    color: "#ffe957"
		// 			  }
		// 			}
		// 		},
		// 		{
		// 			name: 'Desert',
		// 			type: 'bar',
		// 			emphasis: {
		// 				focus: 'series'
		// 			},
		// 			data: [15, 10, 10, 5],
		// 			label: {
		// 				show: true,
		// 				position: 'top',
		// 				fontSize: 6,
		// 				formatter: function (params) {
		// 					  return params.value + " \n 不合格数"
		// 				}
					              
		// 			},
		// 			itemStyle: {
		// 			  normal: {
		// 			    color: "#fd666d"
		// 			  }
		// 			}
		// 		}
		// 	]
		// };
			
			  

//  var getDataSettings = {
// 	  "url": "https://mttmb.magna.cn/public/question/20e02da7-833b-4cf0-b731-fc7cabe01aaa.json",
// 	  "method": "GET"
//   }
//   var responseData = null;
// $.ajax(getDataSettings).done(function (response) {
// 		if(response[0]){
// 			responseData = response[0];
// 			//var renderData = {"data" : responseData}
// 			console.log("aaa");
// 			console.log(response);
// 			// 柱状图1模块
// 			(function() {
// 			  // 1. 实例化对象
// 			  var myChart = echarts.init(document.querySelector(".pie1  .chart"));
// 			  //var data = []
// 			  // for(var i in response){
// 				 //  var data2 = { value: response[i].num, name: response[i].partName }
// 				 //  data.push(data2)
// 			  // }
// 			  // 2. 指定配置项和数据
// 			  var option = {
// 			    legend: {
// 			      top: "84%",
// 			      itemWidth: 10,
// 			      itemHeight: 10,
// 			      textStyle: {
// 			        color: "rgba(255,255,255,.5)",
// 			        fontSize: "12"
// 			      }
// 			    },
// 			    tooltip: {
// 			      trigger: "item",
// 			      formatter: "{a} <br/>{b} : {c} ({d}%)"
// 			    },
// 			    // 注意颜色写的位置
// 			    color: [
// 			      "#006cff",
// 			      "#60cda0",
// 			      "#ed8884",
// 			      "#ff9f7f",
// 			      "#0096ff",
// 			      "#9fe6b8",
// 			      "#32c5e9",
// 			      "#1d9dff"
// 			    ],
// 			    series: [
// 			      {
// 			        name: "零件抱怨数量占比统计",
// 			        type: "pie",
// 			        // 如果radius是百分比则必须加引号
// 			        radius: ["10%", "70%"],
// 			        center: ["50%", "42%"],
// 			        roseType: "radius",
// 			        data: [
// 							{ value: 1, name: "ASP2.1转向灯（黑色）总成 非正式抱怨" },
// 						    { value: 1, name: "J78A IPM Trun 非正式抱怨" }
// 						   ],
// 			        // 修饰饼形图文字相关的样式 label对象
// 			        label: {
// 			          fontSize: 10
// 			        },
// 			        // 修饰引导线样式
// 			        labelLine: {
// 			          // 连接到图形的线长度
// 			          length: 10,
// 			          // 连接到文字的线长度
// 			          length2: 10
// 			        }
// 			      }
// 			    ]
// 			  };
			
// 			  // 3. 配置项和数据给我们的实例化对象
// 			  myChart.setOption(option);
// 			  // 4. 当我们浏览器缩放的时候，图表也等比例缩放
// 			  window.addEventListener("resize", function() {
// 			    // 让我们的图表调用 resize这个方法
// 			    myChart.resize();
// 			  });
// 			})();
				
// 		}

	
// 	});
	


// //仪表盘
// (function() {
//   // 1. 实例化对象
//   var myChart = echarts.init(document.querySelector(".bar2  .chart"));
//   // 2. 指定配置项和数据
//   var option = {
//     series: [{
//         type: 'gauge',
// 		radius: '100%',
//         axisLine: {
			
//             lineStyle: {
//                 width: 30,
				
//                 color: [
//                     [0.3, '#49c7dd'],
//                     [0.7, '#ffe957'],
//                     [1, '#fd666d']
//                 ]
//             }
//         },
//         pointer: {
// 			width: 2,
//             itemStyle: {
//                 color: 'auto'
//             }
//         },
//         axisTick: {
//             distance: -20,
//             length: 10,
//             lineStyle: {
//                 color: '#fff',
//                 width: 2
//             }
//         },
//         splitLine: {
//             distance: -30,
//             length: 30,
//             lineStyle: {
//                 color: '#fff',
//                 width: 2
//             }
//         },
//         axisLabel: {
//             color: 'auto',
//             distance: 5,
//             fontSize: 13
//         },
//         detail: {
//             valueAnimation: true,
//             formatter: '{value} %',
// 			fontSize: 16,
//             color: 'auto'
//         },
//         data: [{
//             value: 10
//         }]
//     }]
// };

// setInterval(function () {
//     option.series[0].data[0].value = (Math.random() * 100).toFixed(2) - 0;
//     myChart.setOption(option, true);
// }, 2000);

//   // 3. 配置项和数据给我们的实例化对象
//   myChart.setOption(option);
//   // 4. 当我们浏览器缩放的时候，图表也等比例缩放
//   window.addEventListener("resize", function() {
//     // 让我们的图表调用 resize这个方法
//     myChart.resize();
//   });
// })();

//客户抱怨
// (function() {
// 			  // 1. 实例化对象
// 			  var myChart = echarts.init(document.querySelector(".pie1  .chart"));
// 			  //var data = []
// 			  // for(var i in response){
// 				 //  var data2 = { value: response[i].num, name: response[i].partName }
// 				 //  data.push(data2)
// 			  // }
// 			  // 2. 指定配置项和数据
// 			  var option = {
//     title: {
//         text: '某站点用户访问来源',
//         subtext: '纯属虚构',
//         left: 'center'
//     },
//     tooltip: {
//         trigger: 'item'
//     },
//     legend: {
//         orient: 'vertical',
//         left: 'left',
//     },
//     series: [
//         {
//             name: '访问来源',
//             type: 'pie',
//             radius: '50%',
//             data: [
//                 {value: 1, name: "ASP2.1转向灯（黑色）总成 非正式抱怨"},
//                 { value: 1, name: "J78A IPM Trun 非正式抱怨" }
//             ],
//             emphasis: {
//                 itemStyle: {
//                     shadowBlur: 10,
//                     shadowOffsetX: 0,
//                     shadowColor: 'rgba(0, 0, 0, 0.5)'
//                 }
//             }
//         }
//     ]
// };
			
// 			  // 3. 配置项和数据给我们的实例化对象
// 			  myChart.setOption(option);
// 			  // 4. 当我们浏览器缩放的时候，图表也等比例缩放
// 			  window.addEventListener("resize", function() {
// 			    // 让我们的图表调用 resize这个方法
// 			    myChart.resize();
// 			  });
// 			})();
// (function() {
// 			  // 1. 实例化对象
// 			  var myChart = echarts.init(document.querySelector(".pie1  .chart"));
// 			  //var data = []
// 			  // for(var i in response){
// 				 //  var data2 = { value: response[i].num, name: response[i].partName }
// 				 //  data.push(data2)
// 			  // }
// 			  // 2. 指定配置项和数据
// 			  var option = {
// 			    legend: {
// 			      top: "84%",
// 			      itemWidth: 10,
// 			      itemHeight: 10,
// 			      textStyle: {
// 			        color: "rgba(255,255,255,.5)",
// 			        fontSize: "10"
// 			      }
// 			    },
// 			    tooltip: {
// 			      trigger: "item",
// 			      formatter: "{a} <br/>{b} : {c} ({d}%)"
// 			    },
// 			    // 注意颜色写的位置
// 			    color: [
// 			      "#006cff",
// 			      "#60cda0",
// 			      "#ed8884",
// 			      "#ff9f7f",
// 			      "#0096ff",
// 			      "#9fe6b8",
// 			      "#32c5e9",
// 			      "#1d9dff"
// 			    ],
// 			    series: [
// 			      {
// 			        name: "零件抱怨数量占比统计",
// 			        type: "pie",
// 			        // 如果radius是百分比则必须加引号
// 			        radius: ["10%", "70%"],
// 			        center: ["50%", "42%"],
// 			        roseType: "radius",
// 			        data: [
// 			            {value: 1, name: "ASP2.1转向灯（黑色）总成 非正式抱怨"},
// 			            { value: 1, name: "J78A IPM Trun 非正式抱怨" }
// 			        ],
// 			        // 修饰饼形图文字相关的样式 label对象
// 			        label: {
// 			          fontSize: 10
// 			        },
// 			        // 修饰引导线样式
// 			        labelLine: {
// 			          // 连接到图形的线长度
// 			          length: 10,
// 			          // 连接到文字的线长度
// 			          length2: 10
// 			        }
// 			      }
// 			    ]
// 			  };
			
// 			  // 3. 配置项和数据给我们的实例化对象
// 			  myChart.setOption(option);
// 			  // 4. 当我们浏览器缩放的时候，图表也等比例缩放
// 			  window.addEventListener("resize", function() {
// 			    // 让我们的图表调用 resize这个方法
// 			    myChart.resize();
// 			  });
// 			})();

var getDataSettings = {
		      "url": "https://mttmb.magna.cn/public/question/db185451-4f5b-4a41-8a8b-82952ed7c5db.json",
		      "method": "GET"
		  }
		  var responseData = null;
		$.ajax(getDataSettings).done(function (response) {
		        if(response[0]){
		            responseData = response[0];
		            console.log(response);
		            // 柱状图1模块
					if(response[0].equipName != 'undefined'){
						document.querySelector(".p1").innerHTML = response[0].equipName
					}
					if(response[0].equipState != 'undefined'){
					if(response[0].equipState == '3'){
						document.querySelector(".d1").style.backgroundColor = 'yellow'
					}else if(response[0].equipState == '1'){
						document.querySelector(".d1").style.backgroundColor = 'green'
					}else if(response[0].equipState == '2'){
						document.querySelector(".d1").style.backgroundColor = 'red'
					}
					}
					if(response[1].equipName != 'undefined'){
						document.querySelector(".p2").innerHTML =  response[1].equipName
					}
		            if(response[1].equipState != 'undefined'){
		            if(response[1].equipState == '3'){
		            	document.querySelector(".d2").style.backgroundColor = 'yellow'
		            }else if(response[1].equipState == '1'){
		            	document.querySelector(".d2").style.backgroundColor = 'green'
		            }else if(response[0].equipState == '2'){
		            	document.querySelector(".d2").style.backgroundColor = 'red'
		            }
		            }
					   
					  if(response[2].equipName != 'undefined'){
					  	document.querySelector(".p3").innerHTML = response[2].equipName
					  }
					  if(response[2].equipState != 'undefined'){
					   if(response[2].equipState == '3'){
					   	document.querySelector(".d3").style.backgroundColor = 'yellow'
					   }else if(response[2].equipState == '1'){
					   	document.querySelector(".d3").style.backgroundColor = 'green'
					   }else if(response[0].equipState == '2'){
					   	document.querySelector(".d3").style.backgroundColor = 'red'
					   }
					   }
					  if(response[3].equipName != 'undefined'){
					  	document.querySelector(".p4").innerHTML = response[3].equipName
					  }
					  if(response[3].equipState != 'undefined'){
					  if(response[3].equipState == '3'){
					  	document.querySelector(".d4").style.backgroundColor = 'yellow'
					  }else if(response[3].equipState == '1'){
					  	document.querySelector(".d4").style.backgroundColor = 'green'
					  }else if(response[0].equipState == '2'){
					  	document.querySelector(".d4").style.backgroundColor = 'red'
					  }
					  }
					  if(response[4].equipName != 'undefined'){
					  	document.querySelector(".p5").innerHTML = response[4].equipName
					  }
					  if(response[4].equipState != 'undefined'){
					  if(response[4].equipState == '3'){
					  	document.querySelector(".d5").style.backgroundColor = 'yellow'
					  }else if(response[4].equipState == '1'){
					  	document.querySelector(".d5").style.backgroundColor = 'green'
					  }else if(response[0].equipState == '2'){
					  	document.querySelector(".d5").style.backgroundColor = 'red'
					  }
					  }
					  if(response[5].equipName != 'undefined'){
					  	document.querySelector(".p6").innerHTML = response[5].equipName
					  }
					  if(response[5].equipState != 'undefined'){
					  if(response[5].equipState == '3'){
					  	document.querySelector(".d6").style.backgroundColor = 'yellow'
					  }else if(response[5].equipState == '1'){
					  	document.querySelector(".d6").style.backgroundColor = 'green'
					  }else if(response[0].equipState == '2'){
					  	document.querySelector(".d6").style.backgroundColor = 'red'
					  }
					  }
					  if(response[6].equipName != 'undefined'){
					  	document.querySelector(".p7").innerHTML = response[6].equipName
					  }
					  if(response[6].equipState != 'undefined'){
					  if(response[6].equipState == '3'){
					  	document.querySelector(".d7").style.backgroundColor = 'yellow'
					  }else if(response[6].equipState == '1'){
					  	document.querySelector(".d7").style.backgroundColor = 'green'
					  }else if(response[0].equipState == '2'){
					  	document.querySelector(".d7").style.backgroundColor = 'red'
					  }
					  }
					  if(response[7].equipName != 'undefined'){
					  	document.querySelector(".p8").innerHTML = response[7].equipName
					  }
					  if(response[7].equipState != 'undefined'){
					  if(response[7].equipState == '3'){
					  	document.querySelector(".d8").style.backgroundColor = 'yellow'
					  }else if(response[7].equipState == '1'){
					  	document.querySelector(".d8").style.backgroundColor = 'green'
					  }else if(response[0].equipState == '2'){
					  	document.querySelector(".d8").style.backgroundColor = 'red'
					  }
					  }
					  if(response[8].equipName != 'undefined'){
					  	document.querySelector(".p9").innerHTML = response[8].equipName
					  }
					  if(response[8].equipState != 'undefined'){
					  if(response[8].equipState == '3'){
					  	document.querySelector(".d9").style.backgroundColor = 'yellow'
					  }else if(response[8].equipState == '1'){
					  	document.querySelector(".d9").style.backgroundColor = 'green'
					  }else if(response[0].equipState == '2'){
					  	document.querySelector(".d9").style.backgroundColor = 'red'
					  }
					  }
					  if(response[9].equipName != 'undefined'){
					  	document.querySelector(".p10").innerHTML = response[9].equipName
					  }
					 if(response[9].equipState != 'undefined'){
					 if(response[9].equipState == '3'){
					 	document.querySelector(".d10").style.backgroundColor = 'yellow'
					 }else if(response[9].equipState == '1'){
					 	document.querySelector(".d10").style.backgroundColor = 'green'
					 }else if(response[0].equipState == '2'){
					 	document.querySelector(".d10").style.backgroundColor = 'red'
					 }
					 }
					 // document.querySelector(".p3").innerHTML =  !response[2].equipName  ? null : response[2].equipName
					 // document.querySelector(".p4").innerHTML =  !response[3].equipName  ? null : response[3].equipName
					 // document.querySelector(".p5").innerHTML =  !response[4].equipName ? null : response[4].equipName
					 // document.querySelector(".p5").innerHTML =  response[4].equipName === null ? response[4].memo : response[4].equipName
					// if(response[0].equipState != 'undefined'){
					// if(response[0].equipState == '0'){
					// 	document.querySelector(".d1").style.backgroundColor = 'yellow'
					// }else if(response[0].equipState == '1'){
					// 	document.querySelector(".d1").style.backgroundColor = 'green'
					// }else{
					// 	document.querySelector(".d1").style.backgroundColor = 'red'
					// }
					// }
					// if(response[1].equipState != 'undefined'){
					// if(response[1].equipState == '0'){
					// 	document.querySelector(".d2").style.backgroundColor = 'yellow'
					// }else if(response[1].equipState == '1'){
					// 	document.querySelector(".d2").style.backgroundColor = 'green'
					// }else{
					// 	document.querySelector(".d2").style.backgroundColor = 'red'
					// }
					// }
					
					 
					 
					 
					 
					 
					 
					 var lo = []
					 var one = []
					 var two = []
					 for(var i in response){
						 if(response[i].equipState == '0'){
							 lo.push(response[i].equipNo)
						 }else if(response[i].equipState == '1'){
							 one.push(response[i].equipNo)
						 }else{
							 one.push(response[i].equipNo)
						 }
					 }
				}
		
		   
		    });
//状态数量			
var getDataSettings = {
		      "url": "https://mttmb.magna.cn/public/question/94033124-1e3b-47d2-b8b3-7832d963330c.json",
		      "method": "GET"
		  }
		  var responseData = null;
		$.ajax(getDataSettings).done(function (response) {
		        if(response[0]){
		            responseData = response[0];
		            console.log(response);
		            // 柱状图1模块
					document.querySelector(".t1").innerHTML = response[0].powerOn
					document.querySelector(".t2").innerHTML = response[0].standby
					document.querySelector(".t3").innerHTML = response[0].repair
		            document.querySelector(".t4").innerHTML = response[0].reportRepair
					
				}
		
		   
		    });
//合理化建议
var getDataSettings = {
		      "url": "https://mttmb.magna.cn/public/question/5ba0199c-7324-4f30-94f6-1d47d843b7bb.json",
		      "method": "GET"
		  }
		  var responseData = null;
		$.ajax(getDataSettings).done(function (response) {
		       if(response[0]){
		           responseData = response[0];
		            console.log(response);
		            // 柱状图1模块
					
		             document.querySelector(".security2").innerHTML = response[0].num
				}
		    });

//客诉
