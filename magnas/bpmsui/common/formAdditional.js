(function (BPMS) {

    BPMS.formAdditional = {
        setRules: function (processDefinitionKey, taskDefinitionKey, fields) {

            if (processDefinitionKey === "executeJs" && !taskDefinitionKey) {

                //1.设置字段是否必填
                var field = fields.filter(function (tempField) {
                    return tempField.id === "coreaction_审批_1_enum_rbv_$$A";
                })[0];
                if (field) {
                    var updateRequired = function (value) {
                        var targetField = fields.filter(function (tempField) {
                            return tempField.id === "corecomments_审批意见（同意时无需必填，驳回时此处做必填校验）_2_string_t2_$$A";
                        })[0];
                        targetField.required(value !== "同意");
                    }
                    field.value.subscribe(updateRequired);
                }

                //2.设置字段允许填写的范围
                var field = fields.filter(function (tempField) {
                    return tempField.id === "days_t6控件大于0校验_1_string_t6_$$B";
                })[0];
                if (field) {
                    field.min = 0.01;
                }

                //3.设置自动计算的规则
                var field = fields.filter(function (tempField) {
                    return tempField.id === "tbhdexpense_小计（当填写完未税金额和税额时，自动相加计算小计）_amount_13_string_cny_$$A"


                })[0];
                if (field) {
                    var targetFields = fields.filter(function (tempField) {
                        return tempField.id === "tbhdexpense_未税金额_untaxedamount_11_string_cny_$$A"
                            || tempField.id === "tbhdexpense_税额_tax_12_string_cny_$$A";
                    });
                    targetFields.forEach(function (tempField) {
                        tempField.value.subscribe(function () {
                            var untax = Number(targetFields[0].value());
                            var tax = Number(targetFields[1].value());
                            var total = (untax + tax).toString();
                            field.value(total);
                        });
                    });

                }


            }
            //magna差旅报销
            if (processDefinitionKey.split(":")[0] === "MAGNA_TRAVEL") {
//console.log(sessionStorage.getItem('bpms_user'))				
				//项目号默认55555
                var projno = fields.filter(function (tempField) {
                    return tempField.id === "tbhdtravel_项目号（多个请用,分割）_projno_8_string_t1_$$A"
                })[0];
                if(projno){
					projno.value("55555");
                    projno.defaultValue = "55555";
                }
                //出差天数必须填写正数
                var days = fields.filter(function(tempField) {
                    return tempField.id === "days_出差天数_2_string_t6_$$A";
                })[0];
                if (days) {
                    days.value.subscribe(function() {
                        if (! (/^\d+(?=\.{0,1}\d+$|$)/.test(days.value()))) {
                            days.value("");
                        }
                    });
                }
                //汇率必须填写正数
                var rate = fields.filter(function(tempField) {
                    return tempField.id === "tbhdtravel_汇率_rate_14_string_t1_$$A";
                })[0];
                if (rate) {
					rate.value("1");
                    rate.defaultValue = "1";
                    rate.value.subscribe(function() {
                        if (! (/^\d+(?=\.{0,1}\d+$|$)/.test(rate.value()))) {
                            rate.value("");
                        }
                    });
                    var currencyTargetFields = fields.filter(function(tempField) {
                        return tempField.id === "tbhdtravel_币种_currency_13_enum_sbs_$$A";
                    });
                    currencyTargetFields.forEach(function(tempField) {
                        tempField.value.subscribe(function() {
                            var currency = currencyTargetFields[0].value();
                            if(currency === "CNY"){
								rate.value("1");
							}else{
								rate.value("");
							}
                            
                        });
                    });
					
					
                }		
				
                //折合小计=（税额+未税金额）*汇率
                var amount = fields.filter(function(tempField) {
                    return tempField.id === "tbhdtravel_折合小计_amount_15_string_cny_$$A";
                })[0];
                if (amount) {
                    var targetFields = fields.filter(function(tempField) {
                        return tempField.id === "tbhdtravel_未税金额_untaxedamount_11_string_cny_$$A" || tempField.id === "tbhdtravel_税额_tax_12_string_cny_$$A" || tempField.id === "tbhdtravel_汇率_rate_14_string_t1_$$A";
                    });
                    targetFields.forEach(function(tempField) {
                        tempField.value.subscribe(function() {
                            var untax = Number(targetFields[0].value());
                            var tax = Number(targetFields[1].value());
                            var rate = Number(targetFields[2].value());
                            var total = (untax + tax) * rate.toString();
                            amount.value(total);
                        });
                    });

                }


var docNoRules =[
    {
        "type": "交通费", 
        "rules": [
			{"cc":"9010","code":"55025001"},
			{"cc":"9030","code":"55025001"},
			{"cc":"8090","code":"41055001"},
			{"cc":"9060","code":"41055001"},
			{"cc":"9040","code":"41055001"},
			{"cc":"9090","code":"41055001"},
			{"cc":"9070","code":"41055001"},
			{"cc":"9050","code":"41055001"},
			{"cc":"9140","code":"41055001"},
			{"cc":"8020","code":"41055001"},
			{"cc":"8080","code":"41055001"},
			{"cc":"8070","code":"41055001"}
        ]
    },
    {
        "type": "住宿费", 
        "rules": [
			{"cc":"9010","code":"55025001"},
			{"cc":"9030","code":"55025001"},
			{"cc":"8090","code":"41055001"},
			{"cc":"9060","code":"41055001"},
			{"cc":"9040","code":"41055001"},
			{"cc":"9090","code":"41055001"},
			{"cc":"9070","code":"41055001"},
			{"cc":"9050","code":"41055001"},
			{"cc":"9140","code":"41055001"},
			{"cc":"8020","code":"41055001"},
			{"cc":"8080","code":"41055001"},
			{"cc":"8070","code":"41055001"}
        ]
    },
    {
        "type": "误餐费", 
        "rules": [
			{"cc":"9010","code":"55025002"},
			{"cc":"9030","code":"55025002"},
			{"cc":"8090","code":"41055002"},
			{"cc":"9060","code":"41055002"},
			{"cc":"9040","code":"41055002"},
			{"cc":"9090","code":"41055002"},
			{"cc":"9070","code":"41055002"},
			{"cc":"9050","code":"41055002"},
			{"cc":"9140","code":"41055002"},
			{"cc":"8020","code":"41055002"},
			{"cc":"8080","code":"41055002"},
			{"cc":"8070","code":"41055002"}
        ]
    },
    {
        "type": "其它", 
        "rules": [
			{"cc":"9010","code":"55025001"},
			{"cc":"9030","code":"55025001"},
			{"cc":"8090","code":"41055001"},
			{"cc":"9060","code":"41055001"},
			{"cc":"9040","code":"41055001"},
			{"cc":"9090","code":"41055001"},
			{"cc":"9070","code":"41055001"},
			{"cc":"9050","code":"41055001"},
			{"cc":"9140","code":"41055001"},
			{"cc":"8020","code":"41055001"},
			{"cc":"8080","code":"41055001"},
			{"cc":"8070","code":"41055001"}
        ]
    }	
];
                var docno = fields.filter(function(tempField) {
                    return tempField.id === "tbhdtravel_总账账户_accountcode_9_string_t1_$$A";
                })[0];
                if (docno) {
                    var secTargetFields = fields.filter(function(tempField) {
                        return tempField.id === "tbhdtravel_报销类型_type_4_enum_sbs_$$A" || tempField.id === "tbhdtravel_成本中心_costcenter_5_string_tree_$$A";
                    });
                    secTargetFields.forEach(function(tempField) {
                    
                        tempField.value.subscribe(function() {
                        var type = secTargetFields[0].value();
                        var cc = secTargetFields[1].value();
							for(var key in docNoRules){
								if(docNoRules[key].type === type){
									var rules = docNoRules[key].rules;
									for(var key in rules){
										if(cc){
											if(rules[key].cc === cc.code){
												docno.value(rules[key].code);
											}
										}
									}
								}
							}
                           
                        });
                    });

                }



                var co = fields.filter(function(tempField) {
                    return tempField.id === "co_加签人(审核)_3_string_auto_$$Z";
                })[0];
				if (co) {
                co.visible(false);
				}
                var coread = fields.filter(function(tempField) {
                    return tempField.id === "co_加签人(审阅)_4_string_automulti_$$Z";
                })[0];
				if(coread){
					coread.visible(false)
				}				
                //当审批为驳回修改和彻底拒绝时审批意见必填
                var coreaction = fields.filter(function(tempField) {
                    return tempField.id === "coreaction_审批_1_enum_rbv_$$Z";
                })[0];
                if (coreaction) {
                    var updateRequired = function(value) {
                        var corecomments = fields.filter(function(tempField) {
                            return tempField.id === "corecomments_审批意见_2_string_t2_$$Z";
                        })[0];
                        corecomments.required(value !== "同意" && value !== "加签审核" && value !== "加签审阅");
                        if (co) {
                            co.required(value === "加签审核");
                            co.visible(value === "加签审核");
                        }
                        if (coread) {
                            coread.required(value === "加签审阅");
                            coread.visible(value === "加签审阅")
                        }

                    }
                    coreaction.value.subscribe(updateRequired);
                }

            }

			
			//magna招待报销
            if (processDefinitionKey.split(":")[0] === "MAGNA_SERVE") {

                //预计招待天数必须填写正数
                var days = fields.filter(function(tempField) {
                    return tempField.id === "days_预计招待天数_1_string_t6_$$D";
                })[0];
                if (days) {
                    days.value.subscribe(function() {
                        if (! (/^\d+(?=\.{0,1}\d+$|$)/.test(days.value()))) {
                            days.value("");
                        }
                    });
                }			
                //预计招待次数必须填写正数
                var times = fields.filter(function(tempField) {
                    return tempField.id === "times_预计招待次数_2_string_t6_$$D";
                })[0];
                if (times) {
                    times.value.subscribe(function() {
                        if (! (/^\d+(?=\.{0,1}\d+$|$)/.test(times.value()))) {
                            times.value("");
                        }
                    });
                }
				
                //1.设置字段是否必填
                var isconsum = fields.filter(function(tempField) {
                    return tempField.id === "isconsum_是否消费_1_enum_sbs_$$F";
                })[0];
                if (isconsum) {
                    var updateRequired = function(value) {
                        var consumitems = fields.filter(function(tempField) {
                            return tempField.id === "consumitems_消费地点及项目_2_string_t2_$$F";
                        })[0];
                        consumitems.required(value === "是");
						
                        var consumamount = fields.filter(function(tempField) {
                            return tempField.id === "consumamount_消费费用预算_3_string_t11_$$F";
                        })[0];
                        consumamount.required(value === "是");						
                    }
					updateRequired();
                    isconsum.value.subscribe(updateRequired);
                }
				//是否送礼判断必填
                var isgift = fields.filter(function(tempField) {
                    return tempField.id === "isgift_是否送礼_1_enum_sbs_$$G";
                })[0];
                if (isgift) {
                    var updateRequired = function(value) {
                        var giftitems = fields.filter(function(tempField) {
                            return tempField.id === "giftitems_礼品内容_2_string_t2_$$G";
                        })[0];
                        giftitems.required(value === "是");
						
                        var giftamount = fields.filter(function(tempField) {
                            return tempField.id === "giftamount_送礼金额_3_string_t11_$$G";
                        })[0];
                        giftamount.required(value === "是");						
                    }
					updateRequired();
                    isgift.value.subscribe(updateRequired);
                }
				//加签判断
                var co = fields.filter(function(tempField) {
                    return tempField.id === "co_加签人(审核)_3_string_auto_$$Z";
                })[0];
				if (co) {
                co.visible(false);
				}
                var coread = fields.filter(function(tempField) {
                    return tempField.id === "co_加签人(审阅)_4_string_automulti_$$Z";
                })[0];
				if(coread){
					coread.visible(false)
				}
                
                //当审批为驳回修改和彻底拒绝时审批意见必填
                var coreaction = fields.filter(function(tempField) {
                    return tempField.id === "coreaction_审批_1_enum_rbv_$$Z";
                })[0];
                if (coreaction) {
                    var updateRequired = function(value) {
                        var corecomments = fields.filter(function(tempField) {
                            return tempField.id === "corecomments_审批意见_2_string_t2_$$Z";
                        })[0];
                        corecomments.required(value !== "同意" && value !== "加签审核" && value !== "加签审阅");
                        if (co) {
                            co.required(value === "加签审核");
                            co.visible(value === "加签审核");
                        }
                        if (coread) {
                            coread.required(value === "加签审阅");
                            coread.visible(value === "加签审阅")
                        }

                    }
                    coreaction.value.subscribe(updateRequired);
                }
				
                //1.宴请字段是否必填
                var fete = fields.filter(function(tempField) {
                    return tempField.id === "fete_是否宴请_0_enum_sbs_$$K";
                })[0];
				var realdate = fields.filter(function(tempField) {return tempField.id === "realdate_具体招待日期_1_string_t3_$$K";})[0];
				var projno = fields.filter(function(tempField) {return tempField.id === "projno_项目编号（多个请用,分割）_2_string_t1_$$K";})[0];
                var names = fields.filter(function(tempField) {return tempField.id === "names_被招待人员名单（具体姓名）_3_string_t2_$$K";})[0];
				var ournames = fields.filter(function(tempField) {return tempField.id === "ournames_我司陪同人员名单（具体姓名）_4_string_t2_$$K";})[0];
				var address = fields.filter(function(tempField) {return tempField.id === "address_招待地点_5_string_t2_$$K";})[0];
				var realamount = fields.filter(function(tempField) {return tempField.id === "realamount_人均人民币_6_string_t11_$$K";})[0];
				var realtotalamount = fields.filter(function(tempField) {return tempField.id === "realtotalamount_总计人民币_7_string_t11_$$K";})[0];
				var invoiceno = fields.filter(function(tempField) {return tempField.id === "invoiceno_发票号_8_string_t2_$$K";})[0];
				if(realdate){realdate.visible(false);}
				if(projno){projno.visible(false);}
				if(names){names.visible(false);}
				if(ournames){ournames.visible(false);}
				if(address){address.visible(false);}
				if(realamount){realamount.visible(false);}
				if(realtotalamount){realtotalamount.visible(false);}
				if(invoiceno){invoiceno.visible(false);}					
                if (fete) {
					if(fete.value() === "是"){
						realdate.visible(true);
						realdate.required(true);
						projno.visible(true);
						projno.required(true);
						names.visible(true);
						names.required(true);
						ournames.visible(true);
						ournames.required(true);
						address.visible(true);
						address.required(true);
						realamount.visible(true);
						realamount.required(true);
						realtotalamount.visible(true);
						realtotalamount.required(true);
						invoiceno.visible(true);
						invoiceno.required(true);						
						
					}
					var updateRequired = function(value) {
							realdate.required(value === "是");
							realdate.visible(value === "是");
   							projno.visible(value === "是");
							projno.required(value === "是");
							names.visible(value === "是");
							names.required(value === "是");
							ournames.visible(value === "是");
							ournames.required(value === "是");
							address.visible(value === "是");
							address.required(value === "是");
							realamount.visible(value === "是");
							realamount.required(value === "是");
							realtotalamount.visible(value === "是");
							realtotalamount.required(value === "是");
							invoiceno.visible(value === "是");
							invoiceno.required(value === "是");
											
                    }
                    fete.value.subscribe(updateRequired);
                }		
				//2.消费字段是否必填
                var consume = fields.filter(function(tempField) {
                    return tempField.id === "consume_是否消费_0_enum_sbs_$$M";
                })[0];				
				var xfrealdate = fields.filter(function(tempField) {return tempField.id === "xfrealdate_消费时间_1_string_t3_$$M";})[0];
				var xfprojno = fields.filter(function(tempField) {return tempField.id === "xfprojno_项目编号（多个请用,分割）_2_string_t1_$$M";})[0];
                var xfnames = fields.filter(function(tempField) {return tempField.id === "xfnames_被招待人员名单（具体姓名）_3_string_t2_$$M";})[0];
				var xfournames = fields.filter(function(tempField) {return tempField.id === "xfournames_我司陪同人员名单（具体姓名）_4_string_t2_$$M";})[0];
				var xfaddress = fields.filter(function(tempField) {return tempField.id === "xfaddress_消费地点及内容_5_string_t2_$$M";})[0];
				var xfrealamount = fields.filter(function(tempField) {return tempField.id === "xfrealamount_消费人均人民币_6_string_t11_$$M";})[0];
				var xfrealtotalamount = fields.filter(function(tempField) {return tempField.id === "xfrealtotalamount_消费总计人民币_7_string_t11_$$M";})[0];
				var xfinvoiceno = fields.filter(function(tempField) {return tempField.id === "xfinvoiceno_发票号_8_string_t2_$$M";})[0];				
				if(xfrealdate){xfrealdate.visible(false);}
				if(xfprojno){xfprojno.visible(false);}
				if(xfnames){xfnames.visible(false);}
				if(xfournames){xfournames.visible(false);}
				if(xfaddress){xfaddress.visible(false);}
				if(xfrealamount){xfrealamount.visible(false);}
				if(xfrealtotalamount){xfrealtotalamount.visible(false);}
				if(xfinvoiceno){xfinvoiceno.visible(false);}					
                if (consume) {
					if(consume.value() === "是"){
						xfrealdate.visible(true);
						xfrealdate.required(true);
						xfprojno.visible(true);
						xfprojno.required(true);
						xfnames.visible(true);
						xfnames.required(true);
						xfournames.visible(true);
						xfournames.required(true);
						xfaddress.visible(true);
						xfaddress.required(true);						
						xfrealamount.visible(true);
						xfrealamount.required(true);
						xfrealtotalamount.visible(true);
						xfrealtotalamount.required(true);
						xfinvoiceno.visible(true);
						xfinvoiceno.required(true);						
						
					}
					var updateRequired = function(value) {
							xfrealdate.required(value === "是");
							xfrealdate.visible(value === "是");
   							xfprojno.visible(value === "是");
							xfprojno.required(value === "是");
							xfnames.visible(value === "是");
							xfnames.required(value === "是");
							xfournames.visible(value === "是");
							xfournames.required(value === "是");
							xfaddress.visible(value === "是");
							xfaddress.required(value === "是");
							xfrealamount.visible(value === "是");
							xfrealamount.required(value === "是");
							xfrealtotalamount.visible(value === "是");
							xfrealtotalamount.required(value === "是");
							xfinvoiceno.visible(value === "是");
							xfinvoiceno.required(value === "是");
											
                    }
                    consume.value.subscribe(updateRequired);
                }
				
				//3.送礼字段是否必填
                var gift = fields.filter(function(tempField) {
                    return tempField.id === "gift_是否送礼_0_enum_sbs_$$O";
                })[0];				
				var slrealdate = fields.filter(function(tempField) {return tempField.id === "slrealdate_送礼时间_1_string_t3_$$O";})[0];
				var slprojno = fields.filter(function(tempField) {return tempField.id === "slprojno_项目编号（多个请用,分割）_2_string_t1_$$O";})[0];
                var slnames = fields.filter(function(tempField) {return tempField.id === "slnames_收礼人（具体姓名）_3_string_t2_$$O";})[0];
				var slgifts = fields.filter(function(tempField) {return tempField.id === "slgifts_送礼内容_5_string_t2_$$O";})[0];
				var slrealamount = fields.filter(function(tempField) {return tempField.id === "slrealamount_送礼人均人民币_6_string_t11_$$O";})[0];
				var slrealtotalamount = fields.filter(function(tempField) {return tempField.id === "slrealtotalamount_送礼总计人民币_7_string_t11_$$O";})[0];
				var slinvoiceno = fields.filter(function(tempField) {return tempField.id === "slinvoiceno_发票号_8_string_t2_$$O";})[0];				
				if(slrealdate){slrealdate.visible(false);}
				if(slprojno){slprojno.visible(false);}
				if(slnames){slnames.visible(false);}
				if(slgifts){slgifts.visible(false);}
				if(slrealamount){slrealamount.visible(false);}
				if(slrealtotalamount){slrealtotalamount.visible(false);}
				if(slinvoiceno){slinvoiceno.visible(false);}					
                if (gift) {
					if(gift.value() === "是"){
						slrealdate.visible(true);
						slrealdate.required(true);
						slprojno.visible(true);
						slprojno.required(true);
						slnames.visible(true);
						slnames.required(true);
						slgifts.visible(true);
						slgifts.required(true);						
						slrealamount.visible(true);
						slrealamount.required(true);
						slrealtotalamount.visible(true);
						slrealtotalamount.required(true);
						slinvoiceno.visible(true);
						slinvoiceno.required(true);						
						
					}
					var updateRequired = function(value) {
						slrealdate.visible(value === "是");
						slrealdate.required(value === "是");
						slprojno.visible(value === "是");
						slprojno.required(value === "是");
						slnames.visible(value === "是");
						slnames.required(value === "是");
						slgifts.visible(value === "是");
						slgifts.required(value === "是");						
						slrealamount.visible(value === "是");
						slrealamount.required(value === "是");
						slrealtotalamount.visible(value === "是");
						slrealtotalamount.required(value === "是");
						slinvoiceno.visible(value === "是");
						slinvoiceno.required(value === "是");	
											
                    }
                    gift.value.subscribe(updateRequired);
                }			
            }
			

			
			//magna物资采购申请
            if (processDefinitionKey.split(":")[0] === "MAGNA_PUR") {
				
				//项目号默认55555
                var projno = fields.filter(function (tempField) {
                    return tempField.id === "tbhdpur_项目号（多个请用,分割）_projno_5_string_t1_$$A"
                })[0];
                if(projno){
					projno.value("55555");
                    projno.defaultValue = "55555";
                }				
                //折合小计=（税额+未税金额）
                var amount = fields.filter(function(tempField) {
                    return tempField.id === "tbhdpur_折合小计_amount_10_string_cny_$$A";
                })[0];
                if (amount) {
                    var targetFields = fields.filter(function(tempField) {
                        return tempField.id === "tbhdpur_未税金额_untaxedamount_8_string_cny_$$A" || tempField.id === "tbhdpur_税额_tax_9_string_cny_$$A";
                    });
                    targetFields.forEach(function(tempField) {
                        tempField.value.subscribe(function() {
                            var untax = Number(targetFields[0].value());
                            var tax = Number(targetFields[1].value());

                            var total = (untax + tax).toString();
                            amount.value(total);
                        });
                    });

                }
                var co = fields.filter(function(tempField) {
                    return tempField.id === "co_加签人(审核)_3_string_auto_$$Z";
                })[0];
				if (co) {
                co.visible(false);
				}
                var coread = fields.filter(function(tempField) {
                    return tempField.id === "co_加签人(审阅)_4_string_automulti_$$Z";
                })[0];
				if(coread){
					coread.visible(false)
				}
                
                //当审批为驳回修改和彻底拒绝时审批意见必填
                var coreaction = fields.filter(function(tempField) {
                    return tempField.id === "coreaction_审批_1_enum_rbv_$$Z";
                })[0];
                if (coreaction) {
                    var updateRequired = function(value) {
                        var corecomments = fields.filter(function(tempField) {
                            return tempField.id === "corecomments_审批意见_2_string_t2_$$Z";
                        })[0];
                        corecomments.required(value !== "同意" && value !== "加签审核" && value !== "加签审阅");
                        if (co) {
                            co.required(value === "加签审核");
                            co.visible(value === "加签审核");
                        }
                        if (coread) {
                            coread.required(value === "加签审阅");
                            coread.visible(value === "加签审阅")
                        }

                    }
                    coreaction.value.subscribe(updateRequired);
                }

            }
			//magna日常报销流程
            if (processDefinitionKey.split(":")[0] === "MAGNA_EXPENSE") {
				
				//项目号默认55555
                var projno = fields.filter(function (tempField) {
                    return tempField.id === "tbhdexpense_项目号（多个请用,分割）_projno_8_string_t1_$$A"
                })[0];
                if(projno){
					projno.value("55555");
                    projno.defaultValue = "55555";
                }					
                //折合小计=（税额+未税金额）
                var amount = fields.filter(function(tempField) {
                    return tempField.id === "tbhdexpense_小计_amount_13_string_cny_$$A";
                })[0];
                if (amount) {
                    var targetFields = fields.filter(function(tempField) {
                        return tempField.id === "tbhdexpense_未税金额_untaxedamount_11_string_cny_$$A" || tempField.id === "tbhdexpense_税额_tax_12_string_cny_$$A";
                    });
                    targetFields.forEach(function(tempField) {
                        tempField.value.subscribe(function() {
                            var untax = Number(targetFields[0].value());
                            var tax = Number(targetFields[1].value());

                            var total = (untax + tax).toString();
                            amount.value(total);
                        });
                    });

                }
				

var docNoRules =[
    {
        "type": "交通费", 
        "rules": [
			{"cc":"9010","code":"55025201"},
			{"cc":"9030","code":"55025201"},
			{"cc":"8090","code":"41055201"},
			{"cc":"9060","code":"41055201"},
			{"cc":"9040","code":"41055201"},
			{"cc":"9090","code":"41055201"},
			{"cc":"9070","code":"41055201"},
			{"cc":"9050","code":"41055201"},
			{"cc":"9140","code":"41055201"},
			{"cc":"8020","code":"41055201"},
			{"cc":"8080","code":"41055201"},
			{"cc":"8070","code":"41055201"}
        ]
    },
    {
        "type": "自驾交通费", 
        "rules": [
			{"cc":"9010","code":"55025201"},
			{"cc":"9030","code":"55025201"},
			{"cc":"8090","code":"41055201"},
			{"cc":"9060","code":"41055201"},
			{"cc":"9040","code":"41055201"},
			{"cc":"9090","code":"41055201"},
			{"cc":"9070","code":"41055201"},
			{"cc":"9050","code":"41055201"},
			{"cc":"9140","code":"41055201"},
			{"cc":"8020","code":"41055201"},
			{"cc":"8080","code":"41055201"},
			{"cc":"8070","code":"41055201"}
        ]
    },
    {
        "type": "误餐费", 
        "rules": [
			{"cc":"9010","code":"55021100"},
			{"cc":"9030","code":"55021100"},
			{"cc":"8090","code":"41059000"},
			{"cc":"9060","code":"41059000"},
			{"cc":"9040","code":"41059000"},
			{"cc":"9090","code":"41059000"},
			{"cc":"9070","code":"41059000"},
			{"cc":"9050","code":"41059000"},
			{"cc":"9140","code":"41059000"},
			{"cc":"8020","code":"41059000"},
			{"cc":"8080","code":"41059000"},
			{"cc":"8070","code":"41059000"}
        ]
    },
    {
        "type": "住宿（太仓）", 
        "rules": [
			{"cc":"9010","code":"55025001"},
			{"cc":"9030","code":"55025001"},
			{"cc":"8090","code":"41055001"},
			{"cc":"9060","code":"41055001"},
			{"cc":"9040","code":"41055001"},
			{"cc":"9090","code":"41055001"},
			{"cc":"9070","code":"41055001"},
			{"cc":"9050","code":"41055001"},
			{"cc":"9140","code":"41055001"},
			{"cc":"8020","code":"41055001"},
			{"cc":"8080","code":"41055001"},
			{"cc":"8070","code":"41055001"}
        ]
    },
    {
        "type": "TB", 
        "rules": [
			{"cc":"9010","code":"55025205"},
			{"cc":"9030","code":"55025205"},
			{"cc":"8090","code":"41055205"},
			{"cc":"9060","code":"41055205"},
			{"cc":"9040","code":"41055205"},
			{"cc":"9090","code":"41055205"},
			{"cc":"9070","code":"41055205"},
			{"cc":"9050","code":"41055205"},
			{"cc":"9140","code":"41055205"},
			{"cc":"8020","code":"41055205"},
			{"cc":"8080","code":"41055205"},
			{"cc":"8070","code":"41055205"}
        ]
    },
    {
        "type": "体检费", 
        "rules": [
			{"cc":"9010","code":"55022002"},
			{"cc":"9030","code":"55022002"},
			{"cc":"8090","code":"41052000"},
			{"cc":"9060","code":"41052000"},
			{"cc":"9040","code":"41052000"},
			{"cc":"9090","code":"41052000"},
			{"cc":"9070","code":"41052000"},
			{"cc":"9050","code":"41052000"},
			{"cc":"9140","code":"41052000"},
			{"cc":"8020","code":"41052000"},
			{"cc":"8080","code":"41052000"},
			{"cc":"8070","code":"41052000"}
        ]
    },
    {
        "type": "培训费", 
        "rules": [
			{"cc":"9010","code":"55023302"},
			{"cc":"9030","code":"55023302"},
			{"cc":"8090","code":"41053302"},
			{"cc":"9060","code":"41053302"},
			{"cc":"9040","code":"41053302"},
			{"cc":"9090","code":"41053302"},
			{"cc":"9070","code":"41053302"},
			{"cc":"9050","code":"41053302"},
			{"cc":"9140","code":"41053302"},
			{"cc":"8020","code":"41053302"},
			{"cc":"8080","code":"41053302"},
			{"cc":"8070","code":"41053302"}
        ]
    },
    {
        "type": "通讯费", 
        "rules": [
			{"cc":"9010","code":"55021301"},
			{"cc":"9030","code":"55021301"},
			{"cc":"8090","code":"41051200"},
			{"cc":"9060","code":"41051200"},
			{"cc":"9040","code":"41051200"},
			{"cc":"9090","code":"41051200"},
			{"cc":"9070","code":"41051200"},
			{"cc":"9050","code":"41051200"},
			{"cc":"9140","code":"41051200"},
			{"cc":"8020","code":"41051200"},
			{"cc":"8080","code":"41051200"},
			{"cc":"8070","code":"41051200"}
        ]
    }	
];
                var docno = fields.filter(function(tempField) {
                    return tempField.id === "tbhdexpense_总账账户_accountcode_9_string_t1_$$A";
                })[0];
                if (docno) {
                    var secTargetFields = fields.filter(function(tempField) {
                        return tempField.id === "tbhdexpense_报销类型_type_4_enum_sbs_$$A" || tempField.id === "tbhdexpense_成本中心_costcenter_5_string_tree_$$A";
                    });
                    secTargetFields.forEach(function(tempField) {

                        tempField.value.subscribe(function() {
                        var type = secTargetFields[0].value();
                        var cc = secTargetFields[1].value();
							for(var key in docNoRules){
								if(docNoRules[key].type === type){
									var rules = docNoRules[key].rules;
									for(var key in rules){
										if(cc){
											if(rules[key].cc === cc.code){
												docno.value(rules[key].code);
											}
										}
									}
								}
							}
                            
                        });
                    });

                }				

                //1.设置备注是否必填
                var expenseType = fields.filter(function (tempField) {
                    return tempField.id === "tbhdexpense_报销类型_type_4_enum_sbs_$$A";
                })[0];
                if (expenseType) {
					
					var memoFields = fields.filter(function (tempField) {
						return tempField.id === "tbhdexpense_备注_memo_14_string_t2_$$A" ;
					})[0];

                    var updateRequired = function (value) {
						if(memoFields){
							memoFields.required(value === "其它");//收支项目不等于住宿时，出发地必填
						}
                    }
                    expenseType.value.subscribe(updateRequired);
                }					
				
				
				
                var co = fields.filter(function(tempField) {
                    return tempField.id === "co_加签人(审核)_3_string_auto_$$Z";
                })[0];
				if (co) {
					co.visible(false);
				}
                var coread = fields.filter(function(tempField) {
                    return tempField.id === "co_加签人(审阅)_4_string_automulti_$$Z";
                })[0];
				if(coread){
					coread.visible(false)
				}
                
                //当审批为驳回修改和彻底拒绝时审批意见必填
                var coreaction = fields.filter(function(tempField) {
                    return tempField.id === "coreaction_审批_1_enum_rbv_$$Z";
                })[0];
                if (coreaction) {
                    var updateRequired = function(value) {
                        var corecomments = fields.filter(function(tempField) {
                            return tempField.id === "corecomments_审批意见_2_string_t2_$$Z";
                        })[0];
                        corecomments.required(value !== "同意" && value !== "加签审核" && value !== "加签审阅");
                        if (co) {
                            co.required(value === "加签审核");
                            co.visible(value === "加签审核");
                        }
                        if (coread) {
                            coread.required(value === "加签审阅");
                            coread.visible(value === "加签审阅")
                        }

                    }
                    coreaction.value.subscribe(updateRequired);
                }

            }
			
			//人员基本信息修改流程
            if (processDefinitionKey === "MAGNA_EMPLOYEE_UPDATE") {

				var targetFields = fields.filter(function (tempField) {
					return tempField.id === "employeeCode_员工ID_1_string_auto_$$A"
				});
				targetFields.forEach(function (tempField) {
					tempField.value.subscribe(function () {
						var employeecode = targetFields[0].value() ? targetFields[0].value().name : "";
						
						var filters = [{
							"type": "category",
							"target": ["variable", ["template-tag", "sn"]],
							"value": employeecode
						}];
						var param = {
							parameters: JSON.stringify(filters)
						}
						var settings = {
							type: "GET",
							data: {},
							dataType: "json",
							url: "https://mttmb.magna.cn/public/question/5586c703-b53b-4e4a-98b6-3598604673dd.json" + "?" + $.param(param)
						};
						$.ajax(settings).then(function(response){

							if(response.length > 0){
								var department = {"code":response[0].DEPARTMENT_CODE_,"name":response[0].DEPARTMENT_};
								var costcenter = {"code":response[0].COSTCENTER_CODE_,"name":response[0].COSTCENTER_};
								fields.filter(function(tempField) {	return tempField.id === "employeeName_员工姓名_2_string_t1_$$A";})[0].value(response[0].EMPLOYEE_NAME_);//员工姓名
								fields.filter(function(tempField) {	return tempField.id === "wechatId_微信id_2_string_t1_$$A";})[0].value(response[0].WECHAT_CODE_);//员工姓名
								fields.filter(function(tempField) {	return tempField.id === "position_岗位_3_string_t1_$$A";})[0].value(response[0].POSITION_);
								fields.filter(function(tempField) {	return tempField.id === "department_部门_4_string_tree_$$A";})[0].value(department);
								fields.filter(function(tempField) {	return tempField.id === "managerCode_上级领导_5_t1_$$A";})[0].value(response[0].REAL_MANAGER_CODE_);
								fields.filter(function(tempField) {	return tempField.id === "costcenter_成本中心_6_string_tree_$$A";})[0].value(department);
								fields.filter(function(tempField) {	return tempField.id === "mail_邮箱_8_string_t7_$$A";})[0].value(response[0].MAIL_);
								fields.filter(function(tempField) {	return tempField.id === "vendorCode_供应商代码_9_string_t1_$$A";})[0].value(response[0].VENDOR_CODE_);
								fields.filter(function(tempField) {	return tempField.id === "account_供应商银行账号_10_string_t1_$$A";})[0].value(response[0].ACCOUNT_);
								fields.filter(function(tempField) {	return tempField.id === "bank_账号开户行_11_string_t1_$$A";})[0].value(response[0].BANK_);
								fields.filter(function(tempField) {	return tempField.id === "enable_启用状态_12_enum_sbs_$$A";})[0].value(response[0].ENABLE_);
								fields.filter(function(tempField) {	return tempField.id === "englishResults_英语测试成绩_13_string_t1_$$A";})[0].value(response[0].ENGLISH_RESULTS_);
								fields.filter(function(tempField) {	return tempField.id === "depName_部门名称（中文）_15_string_t1_$$A";})[0].value(response[0].DEP_NAME_);
								fields.filter(function(tempField) {	return tempField.id === "tel_电话_14_string_t1_$$A";})[0].value(response[0].OFFICE_TEL_);
							}

						})

					});
				});

            }

			
			//magna差旅预申请流程
            if (processDefinitionKey.split(":")[0] === "MAGNA_TRAVELAPPLY") {
				
				//项目号默认55555
                var projno = fields.filter(function (tempField) {
                    return tempField.id === "itemNumber_项目编号_8_string_t1_$$A"
                })[0];
                if(projno){
					projno.value("55555");
                    projno.defaultValue = "55555";
                }
				
                var co = fields.filter(function(tempField) {
                    return tempField.id === "co_加签人(审核)_3_string_auto_$$Z";
                })[0];
				if (co) {
                co.visible(false);
				}
                var coread = fields.filter(function(tempField) {
                    return tempField.id === "co_加签人(审阅)_4_string_automulti_$$Z";
                })[0];
				if(coread){
					coread.visible(false)
				}
                
                //当审批为驳回修改和彻底拒绝时审批意见必填
                var coreaction = fields.filter(function(tempField) {
                    return tempField.id === "coreaction_审批_1_enum_rbv_$$Z";
                })[0];
                if (coreaction) {
                    var updateRequired = function(value) {
                        var corecomments = fields.filter(function(tempField) {
                            return tempField.id === "corecomments_审批意见_2_string_t2_$$Z";
                        })[0];
                        corecomments.required(value !== "同意" && value !== "加签审核" && value !== "加签审阅");
                        if (co) {
                            co.required(value === "加签审核");
                            co.visible(value === "加签审核");
                        }
                        if (coread) {
                            coread.required(value === "加签审阅");
                            coread.visible(value === "加签审阅")
                        }

                    }
                    coreaction.value.subscribe(updateRequired);
                }				
            }

			//magna差旅预申请流程
            if (processDefinitionKey.split(":")[0] === "MAGNA_PURCHASEAPPLY") {
				
				//项目号默认55555
                var projno = fields.filter(function (tempField) {
                    return tempField.id === "tbhdpurApply_项目编号_projno_3_string_t1_$$A"
                })[0];
                if(projno){
					projno.value("55555");
                    projno.defaultValue = "55555";
                }
                //3.总价=单价*数量
                var field = fields.filter(function (tempField) {
                    return tempField.id === "tbhdpurApply_总价_amount_7_string_cny_$$A"


                })[0];
                if (field) {
                    var targetFields = fields.filter(function (tempField) {
                        return tempField.id === "tbhdpurApply_单价_unitPrice_5_string_cny_$$A"
                            || tempField.id === "tbhdpurApply_数量_qty_6_string_t6_$$A";
                    });
                    targetFields.forEach(function (tempField) {
                        tempField.value.subscribe(function () {
                            var unitPrice = Number(targetFields[0].value());
                            var qty = Number(targetFields[1].value());
                            var total = (unitPrice * qty).toString();
                            field.value(total);
                        });
                    });

                }				
                var co = fields.filter(function(tempField) {
                    return tempField.id === "co_加签人(审核)_3_string_auto_$$Z";
                })[0];
				if (co) {
					co.visible(false);
				}
                var coread = fields.filter(function(tempField) {
                    return tempField.id === "co_加签人(审阅)_4_string_automulti_$$Z";
                })[0];
				if(coread){
					coread.visible(false)
				}
                
                //当审批为驳回修改和彻底拒绝时审批意见必填
                var coreaction = fields.filter(function(tempField) {
                    return tempField.id === "coreaction_审批_1_enum_rbv_$$Z";
                })[0];
                if (coreaction) {
                    var updateRequired = function(value) {
                        var corecomments = fields.filter(function(tempField) {
                            return tempField.id === "corecomments_审批意见_2_string_t2_$$Z";
                        })[0];
                        corecomments.required(value !== "同意" && value !== "加签审核" && value !== "加签审阅");
                        if (co) {
                            co.required(value === "加签审核");
                            co.visible(value === "加签审核");
                        }
                        if (coread) {
                            coread.required(value === "加签审阅");
                            coread.visible(value === "加签审阅")
                        }

                    }
                    coreaction.value.subscribe(updateRequired);
                }				
            }	
			
			//magna日常报销预申请流程
            if (processDefinitionKey.split(":")[0] === "MAGNA_EXPENSEAPPLY") {
				var unitAmount = fields.filter(function(tempField) {
                    return tempField.id === "tbhdexpenseApply_人均费用_unitAmount_9_string_cny_$$A";
                })[0];
				if (unitAmount) {
					unitAmount.visible(false);
				}	
				var pepople = fields.filter(function(tempField) {
                    return tempField.id === "tbhdexpenseApply_参与人名单_pepople_10_string_t2_$$A";
                })[0];
				if (pepople) {
					pepople.visible(false);
				}
				var target = fields.filter(function(tempField) {
                    return tempField.id === "tbhdexpenseApply_培训目标_target_6_string_t1_$$A";
                })[0];
				if (target) {
					target.visible(false);
				}
				var days = fields.filter(function(tempField) {
                    return tempField.id === "tbhdexpenseApply_培训天数_days_7_string_t6_$$A";
                })[0];
				if (days) {
					days.visible(false);
				}
                //当审批为驳回修改和彻底拒绝时审批意见必填
                var type = fields.filter(function(tempField) {
                    return tempField.id === "tbhdexpenseApply_费用类型_type_1_enum_sbs_$$A";
                })[0];
                if (type) {
                    var updateRequired = function(value) {
                        if (unitAmount) {
                            unitAmount.required(value === "TB");
                            unitAmount.visible(value === "TB");
                        }
                        if (pepople) {
                            pepople.required(value === "TB");
                            pepople.visible(value === "TB");
                        }
                        if (target) {
                            target.required(value === "培训");
                            target.visible(value === "培训");
                        }						
                        if (days) {
                            days.required(value === "培训");
                            days.visible(value === "培训")
                        }

                    }
                    type.value.subscribe(updateRequired);
                }
				
				
				
				var co = fields.filter(function(tempField) {
                    return tempField.id === "co_加签人(审核)_3_string_auto_$$Z";
                })[0];
				if (co) {
					co.visible(false);
				}
                var coread = fields.filter(function(tempField) {
                    return tempField.id === "co_加签人(审阅)_4_string_automulti_$$Z";
                })[0];
				if(coread){
					coread.visible(false)
				}
                
                //当审批为驳回修改和彻底拒绝时审批意见必填
                var coreaction = fields.filter(function(tempField) {
                    return tempField.id === "coreaction_审批_1_enum_rbv_$$Z";
                })[0];
                if (coreaction) {
                    var updateRequired = function(value) {
                        var corecomments = fields.filter(function(tempField) {
                            return tempField.id === "corecomments_审批意见_2_string_t2_$$Z";
                        })[0];
                        corecomments.required(value !== "同意" && value !== "加签审核" && value !== "加签审阅");
                        if (co) {
                            co.required(value === "加签审核");
                            co.visible(value === "加签审核");
                        }
                        if (coread) {
                            coread.required(value === "加签审阅");
                            coread.visible(value === "加签审阅")
                        }

                    }
                    coreaction.value.subscribe(updateRequired);
                }				
            }



            if(processDefinitionKey==="saic_claim_sub2") {
                //var co = fields.filter(function(tempField) {
                //    return tempField.id === "voteSecondCK_投票分仓库_5_string_tree_$$HA";
                //})[0];
                //console.log(co)
                //if (co) {
                //    co.visible(false);
                //}
				console.log(fields)
                var coreaction = fields.filter(function(tempField) {
                    return tempField.id === "voteResult_投票结果_4_enum_rbv_$$A";
                })[0];
                if (coreaction) {
                    var updateRequired = function(value) {
						var co = fields.filter(function(tempField) {
							return tempField.id === "voteSecondCK_投票分仓库_5_string_tree_$$HA";
						})[0];		
						co.required(value === "仓库");
                        //console.log(value)
                        //console.log(co)
                        //if (co) {
                        //    co.required(value === "仓库");
                        //    co.visible(value === "仓库");
                        //}
                    }
                    coreaction.value.subscribe(updateRequired);
                }
            }			
            // console.log(processDefinitionKey + " " + taskId + " " + fields.length);
        }
    }
})(window.BPMS = window.BPMS || {})