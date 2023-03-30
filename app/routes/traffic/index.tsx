import "@amap/amap-jsapi-types";
import { useEffect } from 'react';
import $message from '../../components/Message'

declare global {
    interface Window {
        // AMap: typeof AMap;
        _AMapSecurityConfig: object
    }
}

export default function Traffic() {

    function Map() {
        let handleMoving: Function
        let car: any
        let map: any
        let route: any
        let polyline: any
        let passedPolyline: any
        const securityJsKey: string = '196a1bd23df598c31d7c36d20be15ddf'   // key
        const securityJsCode: string = 'b5e51d00d201e10f09375026a1444f98'  // 安全密钥
        let cpoint: number[]
        let searchKey = '停车场'
        useEffect(() => {
            if (typeof window !== 'undefined') {
                window._AMapSecurityConfig = {
                    securityJsCode: securityJsCode,
                }
                const AMapLoader = require('@amap/amap-jsapi-loader')
                AMapLoader.load({
                    key: securityJsKey,                                            // 申请好的Web端开发者Key，首次调用 load 时必填
                    version: "2.0",                                                // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
                    plugins: ['AMap.Geolocation', 'AMap.PlaceSearch', 'AMap.DragRoute', 'AMap.MoveAnimation'],               // 需要使用的的插件列表，如比例尺'AMap.Scale'等
                }).then((AMap: any) => {
                    map = new AMap.Map("container", {           //设置地图容器id
                        resizeEnable: true,                      // 自适应大小
                        pitchEnable: true,                       // 是否允许设置俯仰角度, 3D 视图下为 true, 2D 视图下无效。
                        pitch: 50,                               // 俯仰角度，默认 0
                        viewMode: "3D",                          // 是否为3D地图模式
                        zoom: 7,                                 // 初始化地图级别
                        buildingAnimation: true,                 // 楼块出现是否带动画
                    });
                    // 获取定位
                    getGeolocation(AMap)
                }).catch((e: any) => {
                    console.log(e);
                })
            }
        }, [])

        /**
         * 获取定位
         * @param AMap 
         */
        function getGeolocation(AMap: any) {
            AMap.plugin('AMap.Geolocation', () => {
                const geoOption = {
                    enableHighAccuracy: true,       // 是否使用高精度定位
                    timeout: 10000,                 // 超过10秒后停止定位
                    position: 'RB',                 // 悬停位置，默认为"RB"，即右下角
                    offset: [10, 20],               // 定位按钮与设置的停靠位置的偏移量
                    zoomToAccuracy: true,           // 定位成功后是否自动调整地图视野到定位点
                }
                let geolocation = new AMap.Geolocation(geoOption);
                map.addControl(geolocation);   // 添加控件。
                geolocation.getCurrentPosition((status: any, result: any) => {
                    // 获取定位成功
                    if (status == 'complete') {
                        const { position } = result
                        cpoint = [position.KL, position.kT]
                        searchParking(AMap, cpoint)
                        $message.success('加载成功')
                    } else {
                        console.log('获取定位失败', result);
                        $message.error('获取定位失败，请刷新或到信号强的地方重试')
                    }
                })
            })
        }

        /**
         * 查询附近
         * @param AMap 
         * @param {number[]} cpoint 中心点位置
         */
        function searchParking(AMap: any, cpoint: number[]) {
            AMap.plugin("AMap.PlaceSearch", () => {
                //   切换页码不会被调用 ,只会在第一次加载插件调用
                // 构造地点查询类
                const serchOption = {
                    type: searchKey,           // 兴趣点类别
                    pageSize: 5,             // 单页显示结果条数
                    pageIndex: 1,            // 页码
                    citylimit: true,         // 是否强制限制在设置的城市内搜索
                    map: map,           // 展现结果的地图实例
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
                            dragRoute(AMap, cpoint, destnation)
                        }
                        // 红色标记点事件
                        placeSearch.on('markerClick', handleMarkerClick)
                        // 面版事件
                        placeSearch.on('listElementClick', handleMarkerClick)
                        flag = true
                    } else {
                        console.log(result, "result");
                        $message.error(`查询不到附近${searchKey}信息，请重试。`)
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
        function dragRoute(AMap: any, cpoint: number[], destnation: number[]) {
            // 每次右边点击一次页码, 都会增加一次 , 默认是一次, bug
            const path: number[][] = []
            path.push(cpoint)
            path.push(destnation)
            map.plugin("AMap.DragRoute", () => {
                // 清除上次的规划
                route ? route.destroy() : null
                route = new AMap.DragRoute(map, path, AMap.DrivingPolicy.LEAST_FEE);
                //查询导航路径并开启拖拽导航
                route.search();
                route.on('complete', ({ data }: any) => {
                    // 获得路线中的所有经纬度信息
                    const lineArr: number[][] = []
                    data.routes[0].steps.forEach((step: any) => {
                        step.path.forEach((route: any) => {
                            lineArr.push([route.KL, route.kT])
                        })
                    });
                    // 重新导航时销毁原有的
                    removeAnimation()
                    moveAnimation(AMap, lineArr)

                })
            });
        }

        /**
         * 实现动画
         * @param AMap 
         * @param {number} lineArr  整条路线所有的点
         */
        function moveAnimation(AMap: any, lineArr: number[][]) {
            // JSAPI2.0 使用覆盖物动画必须先加载动画插件
            AMap.plugin('AMap.MoveAnimation', () => {
                // 初始化汽车
                car = new AMap.Marker({
                    map: map,
                    position: lineArr[0],
                    icon: "https://a.amap.com/jsapi_demos/static/demo-center-v2/car.png",
                    offset: new AMap.Pixel(-13, -26),
                })
                // 绘制轨迹
                polyline = new AMap.Polyline({
                    map: map,
                    path: lineArr,
                    showDir: true,
                    strokeColor: "#28F",  //线颜色
                    strokeWeight: 6,      //线宽
                });
                // 走过的路线
                passedPolyline = new AMap.Polyline({
                    map: map,
                    strokeColor: "#AF5",  //线颜色
                    strokeWeight: 6,      //线宽
                });
                handleMoving = (e: any) => {
                    passedPolyline.setPath(e.passedPath);
                    map.setCenter(e.target.getPosition(), true)
                }
                car.on('moving', handleMoving);
                map.setFitView();   // 根据地图上添加的覆盖物分布情况，自动缩放地图到合适的视野级别，参数均可缺省。
                AMap.plugin('AMap.MoveAnimation', () => {
                    car.moveAlong(lineArr, {
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
        function removeAnimation() {
            if (polyline) {
                polyline.hide()
                polyline.setMap(null)
                polyline = null
            }
            if (passedPolyline) {
                passedPolyline.setMap(null)
                passedPolyline = null
            }
            if (car) {
                // 注意：只有当off与on的eventName、handler函数对象、context对象完全一致时才能有效移除监听
                car.off('moving', handleMoving)
                car.stopMove()
                map.remove(car)
                car = null
            }

        }


        return (
            <>
                <div id="container" className="w-full h-[1200px]"> </div>
                <div id="panel" className="fixed bg-[white] max-h-[90%] overflow-y-auto w-[280px] border-b-[solid] border-b-[silver] right-10 top-5;"></div>
            </>
        )
    }

    return (
        <>
            <div className="mx-auto mt-4 flex flex-col w-[1200px] " >
                <Map />
            </div>
        </>
    )
}

