/**
 * 启动app，加载菜单
 */

var ProjectApp = angular.module('ProjectApp', ['f2c.common']);

// 测试专用
var MENUS_TEST = {
    title: "自服务",
    icon: "shopping_cart",
    menus: [
        {
            title: "仪表盘",
            icon: "dashboard",
            name: "dashboard",
            url: "/dashboard",
            templateUrl: "project/html/demo/dashboard.html" + '?_t=' + window.appversion
        }, {
            title: "示例1",
            icon: "assignment",
            children: [
                {
                    title: "表格",
                    name: "table",
                    url: "/table",
                    templateUrl: "project/html/demo/table.html" + '?_t=' + window.appversion
                }, {
                    title: "表单",
                    name: "form",
                    url: "/form",
                    templateUrl: "project/html/demo/form.html" + '?_t=' + window.appversion
                }, {
                    title: "监控",
                    name: "metric",
                    url: "/metric",
                    templateUrl: "project/html/demo/metric.html" + '?_t=' + window.appversion
                }
            ]
        }, {
            title: "示例2",
            icon: "assignment",
            children: [
                {
                    title: "Loading",
                    name: "loading",
                    url: "/loading",
                    templateUrl: "project/html/demo/loading.html" + '?_t=' + window.appversion
                }, {
                    title: "other",
                    name: "other",
                    url: "/other",
                    templateUrl: "project/html/demo/other.html" + '?_t=' + window.appversion
                }
            ]
        }
    ]
};

ProjectApp.controller('DemoCtrl', function ($scope) {
    $scope.module = MENUS_TEST;
});

ProjectApp.controller('TableCtrl', function ($scope, $mdDialog, $mdBottomSheet, FilterSearch, Notification, HttpUtils, Loading) {

    // 定义搜索条件
    $scope.conditions = [
        {
            key: "priority",
            name: "优先级[有查询，可多选]",
            directive: "filter-select-multiple", // 使用哪个指令
            selects: [
                {value: 1, label: "选项1"},
                {value: 2, label: "选项2"},
                {value: 3, label: "选项3"},
                {value: 6, label: "其他"}
            ],
            // 测试select类型条件的搜索框
            search: true
        }, {
            key: "priority",
            name: "优先级[有查询]",
            directive: "filter-select", // 使用哪个指令
            selects: [
                {value: 1, label: "选项1"},
                {value: 2, label: "选项2"},
                {value: 6, label: "其他"}
            ],
            // 测试select类型条件的搜索框
            search: true
        }, {
            key: "priority",
            name: "优先级[无查询]",
            directive: "filter-select",
            selects: [
                {value: 1, label: "选项1"},
                {value: 2, label: "选项2"},
                {value: 6, label: "其他"}
            ]
        },
        {key: "no", name: "工单编号", directive: "filter-input"},
        //查询虚机的条件
        {key: "instanceName", name: "实例名", directive: "filter-contains"},
        {key: "created", name: "创建日期", directive: "filter-date", directiveUnit: "second"},//directiveUnit: "second"返回时间戳为秒
        {key: "os", name: "操作系统", directive: "filter-contains"},
        {key: "localIp", name: "内网IP", directive: "filter-contains"},
        //增加一个异步字典转换的例子，将请求内容转换为value,label格式
        {key: "ajax", name: "异步字典", directive: "filter-select-ajax", url: "demo/status", convert: {value: "id", label: "name"}}

    ];

    // 用于传入后台的参数
    $scope.filters = [
        // 设置默认条件default:true(默认条件不会被删掉)，
        {key: "status", name: "主机状态", value: "Running", default: true, operator: "="},
        {key: "status", name: "主机状态", value: "Running", default: true, operator: "="},
        {key: "status", name: "主机状态", value: "Running"},
        {key: "status", name: "主机状态", value: "Running"},
        {key: "status", name: "主机状态", value: "Running"},
        {key: "status", name: "主机状态", value: "Running"},
        {key: "status", name: "主机状态", value: "Running"},
        {key: "status", name: "主机状态", value: "Running"},
        {key: "status", name: "主机状态", value: "Running", operator: "="},
        // 可以设置是否显示(display:false不显示，不加display或者display:true则显示)
        {key: "status", name: "主机状态", value: "Running", default: true, display: false}
    ];

    // 全选按钮，添加到$scope.columns
    $scope.first = {
        default: true,
        sort: false,
        type: "checkbox",
        checkValue: false,
        change: function (checked) {
            $scope.items.forEach(function (item) {
                item.enable = checked;
            });
        },
        width: "40px"
    };

    $scope.showDetail = function (item) {
        $scope.detail = item;
    };

    $scope.columns = [
        $scope.first,
        {value: "姓名", key: "name", width: "30%"},
        {value: "创建日期", key: "created"},
        {value: "来源", key: "source"},
        {value: "邮箱", key: "email", sort: false},// 不想排序的列，用sort: false
        {value: "", default: true}
    ];

    $scope.items = [
        {name: 'demo1', created: '2018-05-14', source: 'fit2cloud', email: 'demo1@fit2cloud.com'},
        {name: 'demo2', created: '2018-05-14', source: 'fit2cloud', email: 'demo2@fit2cloud.com'},
        {name: 'demo3', created: '2018-05-14', source: 'fit2cloud', email: 'demo3@fit2cloud.com'},
        {name: 'demo4', created: '2018-05-14', source: 'fit2cloud', email: 'demo4@fit2cloud.com'}
    ];

    $scope.create = function () {
        // $scope.formUrl用于side-form
        $scope.formUrl = 'web-public/test/demo/form.html' + '?_t=' + window.appversion;
        // toggleForm由side-form指令生成
        $scope.toggleForm();
    };

    $scope.save = function () {
        Notification.show("保存成功", function () {
            $scope.toggleForm();
        });
    };

    $scope.edit = function (item) {
        $scope.item = item;
        $scope.formUrl = 'web-public/test/demo/form.html' + '?_t=' + window.appversion;
        $scope.toggleForm();
    };

    $scope.openDialog = function (item, event) {
        $scope.item = item;
        $mdDialog.show({
            templateUrl: 'web-public/test/demo/dialog-form.html',
            parent: angular.element(document.body),
            scope: $scope,
            preserveScope: true,
            targetEvent: event,
            clickOutsideToClose: false
        }).then(function (answer) {
            $scope.status = 'You said the information was "' + answer + '".';
        }, function () {
            $scope.status = 'You cancelled the dialog.';
        });
    };

    $scope.closeDialog = function () {
        $mdDialog.cancel();
    };

    $scope.ok = function () {
        console.log("ok");
        $scope.closeDialog();
    };

    $scope.pagination = {
        page: 1,
        total: $scope.items.length,
        limits: [10, 20, 50]
    };

    $scope.list = function (sortObj) {
        var condition = FilterSearch.convert($scope.filters);
        if (sortObj) {
            $scope.sort = sortObj;
        }
        // 保留排序条件，用于分页
        if ($scope.sort) {
            condition.sort = $scope.sort.sql;
        }

        Loading.add(HttpUtils.get("demo/test1/5000", function (response) {
            console.log(response);
        }));
        Loading.add(HttpUtils.get("demo/test1/1000", function (response) {
            console.log(response);
        }));
        // 多个查询用这种方式
        $scope.loadingLayer = Loading.load();

        // 单个查询跟以前一样
        $scope.loadingLayer2 = HttpUtils.get("demo/test1/5000", function (response) {
            console.log(response);
        })
    };

    $scope.help = function () {
        $scope.msg = "Bottom Sheep Demo";
        $mdBottomSheet.show({
            templateUrl: 'web-public/test/demo/bottom-sheet.html',
            scope: $scope,
            preserveScope: true
        }).then(function (clickedItem) {
            $scope.msg = clickedItem['name'] + ' clicked!';
        }).catch(function (error) {
            console.log(error)
            // User clicked outside or hit escape
        });
    }

});

ProjectApp.controller('MetricController', function ($scope) {
    var now = new Date().getTime();

    $scope.request = {
        startTime: now - 240 * 3600 * 1000,
        endTime: now,
        metricDataQueries: [
            {
                resourceId: '6d8f69b3-0355-4276-a624-4f57af9d0d85',
                resourceName: 'test',
                resourceType: 'VIRTUALMACHINE',
                stat: 'average',
                metric: 'CpuUsage'
            },
            {
                resourceId: '6d8f69b3-0355-4276-a624-4f57af9d0d85',
                resourceName: 'test',
                resourceType: 'VIRTUALMACHINE',
                stat: 'average',
                metric: 'CpuUsageInMhz'
            },
            {
                resourceId: '9430a5ff-00a3-4000-8b04-f3d8bdc7fadb',
                resourceName: 'test',
                resourceType: 'HOSTSYSTEM',
                stat: 'average',
                metric: 'HostCpuInMHZ'
            },
            {
                resourceId: '6d8f69b3-0355-4276-a624-4f57af9d0d85',
                resourceName: 'test',
                resourceType: 'VIRTUALMACHINE',
                stat: 'average',
                metric: 'MemoryUsage'
            },
            {
                resourceId: '6d8f69b3-0355-4276-a624-4f57af9d0d85',
                resourceName: 'test',
                resourceType: 'VIRTUALMACHINE',
                stat: 'average',
                metric: 'MemoryUsageInMB'
            },
            {
                resourceId: '9430a5ff-00a3-4000-8b04-f3d8bdc7fadb',
                resourceName: 'test',
                resourceType: 'HOSTSYSTEM',
                stat: 'average',
                metric: 'HostMemoryInMB'
            }
        ]
    }
})