
import "@amap/amap-jsapi-types";
import { message } from 'antd';
import React from 'react';



type StateType = {
    securityJsKey: string,
    securityJsCode: string,
    cpoint: number[],
    searchKey: string
}

type propsType = {
    searchKey: string

}

declare global {
    interface Window {
        // AMap: typeof AMap;
        _AMapSecurityConfig: object
    }
}

export default function Traffic() {
    // 通过 message.useMessage 创建支持读取 context 的 contextHolder。请注意，我们推荐通过顶层注册的方式代替 message 静态方法，因为静态方法无法消费上下文，因而 ConfigProvider 的数据也不会生效。
    const [messageApi, contextHolder] = message.useMessage();
    const handleErrorMessage = (message: string) => {
        messageApi.open({
            type: 'error',
            content: message,
        });
    };


    class Map extends React.Component<propsType, StateType>{
        handleMoving: Function | undefined
        car: any
        map: any
        route: any
        polyline: any
        passedPolyline: any
        constructor(props: any) {
            super(props);
            this.state = {
                securityJsKey: '196a1bd23df598c31d7c36d20be15ddf',   // key
                securityJsCode: 'b5e51d00d201e10f09375026a1444f98',  // 安全密钥
                cpoint: [],                                          // 初始化地图中心点位置
                searchKey: props.searchKey
            }
        }
        // 2.dom渲染成功后进行map对象的创建
        componentDidMount() {
            if (typeof window !== 'undefined') {
                window._AMapSecurityConfig = {
                    securityJsCode: this.state.securityJsCode,
                }
                const AMapLoader = require('@amap/amap-jsapi-loader')
                AMapLoader.load({
                    key: this.state.securityJsKey,                                 // 申请好的Web端开发者Key，首次调用 load 时必填
                    version: "2.0",                                                // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
                    plugins: ['AMap.Geolocation', 'AMap.PlaceSearch', 'AMap.DragRoute', 'AMap.MoveAnimation'],               // 需要使用的的插件列表，如比例尺'AMap.Scale'等
                }).then((AMap: any) => {
                    this.map = new AMap.Map("container", {       //设置地图容器id
                        resizeEnable: true,                      // 自适应大小
                        pitchEnable: true,                       // 是否允许设置俯仰角度, 3D 视图下为 true, 2D 视图下无效。
                        pitch: 50,                               // 俯仰角度，默认 0
                        viewMode: "3D",                          // 是否为3D地图模式
                        zoom: 7,                                 // 初始化地图级别
                        buildingAnimation: true,                 // 楼块出现是否带动画
                    });
                    // 获取定位
                    this.getGeolocation(AMap)
                }).catch((e: any) => {
                    console.log(e);
                })
            }
        }

        /**
         * 获取定位
         * @param AMap 
         */
        getGeolocation(AMap: any) {
            AMap.plugin('AMap.Geolocation', () => {
                const geoOption = {
                    enableHighAccuracy: true,       // 是否使用高精度定位
                    timeout: 10000,                 // 超过10秒后停止定位
                    position: 'RB',                 // 悬停位置，默认为"RB"，即右下角
                    offset: [10, 20],               // 定位按钮与设置的停靠位置的偏移量
                    zoomToAccuracy: true,           // 定位成功后是否自动调整地图视野到定位点
                }
                let geolocation = new AMap.Geolocation(geoOption);
                this.map.addControl(geolocation);   // 添加控件。
                geolocation.getCurrentPosition((status: any, result: any) => {
                    // 获取定位成功
                    if (status == 'complete') {
                        const { position } = result
                        this.setState({ cpoint: [position.KL, position.kT] })
                        this.searchParking(AMap, this.state.cpoint)
                    } else {
                        console.log('获取定位失败', result);
                        handleErrorMessage('获取定位失败，请刷新或到信号强的地方重试')
                    }
                });
            });
        }

        /**
         * 查询附近
         * @param AMap 
         * @param {number[]} cpoint 中心点位置
         */
        searchParking(AMap: any, cpoint: number[]) {
            AMap.plugin("AMap.PlaceSearch", () => {
                //   切换页码不会被调用 ,只会在第一次加载插件调用
                // 构造地点查询类
                const serchOption = {
                    type: this.state.searchKey,           // 兴趣点类别
                    pageSize: 5,             // 单页显示结果条数
                    pageIndex: 1,            // 页码
                    citylimit: true,         // 是否强制限制在设置的城市内搜索
                    map: this.map,           // 展现结果的地图实例
                    panel: "panel",          // 结果列表将在此容器中进行展示。
                    autoFitView: true        // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
                }
                let placeSearch = new AMap.PlaceSearch(serchOption)
                let handleMarkerClick: ((SelectChangeEvent: any) => void) | null = null
                // 判断有没有添加过事件监听器 , 避免重复注册监听器
                let flag = false
                placeSearch.searchNearBy('', cpoint, 0, (status: any, result: any) => {
                    // 查询成功
                    if (status === 'complete') {
                        if (flag) {
                            // 红色标记点事件
                            placeSearch.off('markerClick', handleMarkerClick)
                            // 面版事件
                            placeSearch.off('listElementClick', handleMarkerClick)
                        }
                        // 点击红色标记点
                        // 点击后获得红色标记点的信息
                        handleMarkerClick = (SelectChangeEvent: any) => {
                            const { entr_location, location } = SelectChangeEvent.data
                            // 起点
                            const position = entr_location ? entr_location : location
                            const destnation = [position.KL, position.kT]
                            // 拖拽式导航
                            this.dragRoute(AMap, this.state.cpoint, destnation)
                        }
                        // 红色标记点事件
                        placeSearch.on('markerClick', handleMarkerClick)
                        // 面版事件
                        placeSearch.on('listElementClick', handleMarkerClick)
                        flag = true
                    } else {
                        console.log(result, "result");
                        handleErrorMessage(`查询不到附近${this.state.searchKey}信息，请重试或搜索其他关键词。`)
                    }
                })
            })
        }

        /**
         * 导航功能, 可拖拽路线选择必经点
         * @param AMap 
         * @param {number[]} cpoint 导航起始位置
         * @param {number[]} destnation 导航结束位置
         */
        dragRoute(AMap: any, cpoint: number[], destnation: number[]) {
            // 每次右边点击一次页码, 都会增加一次 , 默认是一次, bug
            const path: number[][] = []
            path.push(cpoint)
            path.push(destnation)
            this.map.plugin("AMap.DragRoute", () => {
                // 清除上次的规划
                this.route ? this.route.destroy() : null
                this.route = new AMap.DragRoute(this.map, path, AMap.DrivingPolicy.LEAST_FEE);
                //查询导航路径并开启拖拽导航
                this.route.search();
                this.route.on('complete', ({ data }: any) => {
                    // 获得路线中的所有经纬度信息
                    const lineArr: number[][] = []
                    data.routes[0].steps.forEach((step: any) => {
                        step.path.forEach((route: any) => {
                            lineArr.push([route.KL, route.kT])
                        })
                    });
                    // 重新导航时销毁原有的
                    this.removeAnimation()
                    this.moveAnimation(AMap, lineArr)

                })
            });
        }

        /**
         * 实现动画
         * @param AMap 
         * @param {number} lineArr  整条路线所有的点
         */
        moveAnimation(AMap: any, lineArr: number[][]) {
            // JSAPI2.0 使用覆盖物动画必须先加载动画插件
            AMap.plugin('AMap.MoveAnimation', () => {
                // 初始化汽车
                this.car = new AMap.Marker({
                    map: this.map,
                    position: lineArr[0],
                    icon: "https://a.amap.com/jsapi_demos/static/demo-center-v2/car.png",
                    offset: new AMap.Pixel(-13, -26),
                })
                // 绘制轨迹
                this.polyline = new AMap.Polyline({
                    map: this.map,
                    path: lineArr,
                    showDir: true,
                    strokeColor: "#28F",  //线颜色
                    strokeWeight: 6,      //线宽
                });
                // 走过的路线
                this.passedPolyline = new AMap.Polyline({
                    map: this.map,
                    strokeColor: "#AF5",  //线颜色
                    strokeWeight: 6,      //线宽
                });
                this.handleMoving = (e: any) => {
                    this.passedPolyline.setPath(e.passedPath);
                    this.map.setCenter(e.target.getPosition(), true)
                }
                this.car.on('moving', this.handleMoving);
                this.map.setFitView();   // 根据地图上添加的覆盖物分布情况，自动缩放地图到合适的视野级别，参数均可缺省。
                AMap.plugin('AMap.MoveAnimation', () => {
                    this.car.moveAlong(lineArr, {
                        // 每一段的时长
                        duration: 300,//可根据实际采集时间间隔设置
                        // JSAPI2.0 是否延道路自动设置角度在 moveAlong 里设置
                        autoRotation: true
                    })
                })

            })
        }

        /**
         * 移除动画
         */
        removeAnimation() {
            if (this.polyline) {
                this.polyline.hide()
                this.polyline.setMap(null)
                this.polyline = null
            }
            if (this.passedPolyline) {
                this.passedPolyline.setMap(null)
                this.passedPolyline = null
            }
            if (this.car) {
                // 注意：只有当off与on的eventName、handler函数对象、context对象完全一致时才能有效移除监听
                this.car.off('moving', this.handleMoving)
                this.car.stopMove()
                this.map.remove(this.car)
                this.car = null
            }

        }

        render() {
            // 1.初始化创建地图容器,div标签作为地图容器，同时为该div指定id属性；
            return (
                <>
                    <div id="container" className="w-full h-[1200px]"> </div>
                    <div id="panel" className="fixed bg-[white] max-h-[90%] overflow-y-auto w-[280px] border-b-[solid] border-b-[silver] right-10 top-5;"></div>
                </>
            );
        }
    }

    return (
        <>
            {contextHolder}
            <div className="mx-auto mt-4 flex flex-col w-[1200px] " >
                <Map searchKey={'停车场'} />
            </div>
        </>
    )
}

