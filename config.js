const portfolioConfig = {
    projects: [
        {
            id: 1,
            title: "项目名称1",
            description: "这是一个使用React开发的Web应用...",
            details: [
                "使用 React 18 和 TypeScript 开发的现代化 Web 应用",
                "实现了完整的用户认证和授权系统",
                "集成了实时数据更新和消息推送功能",
                "采用 Redux Toolkit 进行状态管理",
                "使用 Jest 和 React Testing Library 进行单元测试"
            ],
            image: "https://picsum.photos/400/300?random=1",
            demoUrl: "#",
            githubUrl: "#",
            techStack: ["React", "Node.js", "MongoDB"]
        },
        {
            id: 2,
            title: "项目名称2",
            description: "一个基于Vue.js的电商平台...",
            details: [
                "基于 Vue 3 和 Vite 构建的现代电商平台",
                "实现了商品展示、购物车、订单管理等核心功能",
                "集成了支付宝和微信支付接口",
                "使用 Vuex 4 管理应用状态",
                "采用 Element Plus 组件库构建用户界面"
            ],
            image: "https://picsum.photos/400/300?random=2",
            demoUrl: "#",
            githubUrl: "#",
            techStack: ["Vue.js", "Express", "MySQL"]
        },
        {
            id: 3,
            title: "项目名称3",
            description: "使用Python开发的数据分析工具...",
            image: "https://picsum.photos/400/300?random=3",
            details: [
                "1使用 React 18 和 TypeScript 开发的现代化 Web 应用",
                "1实现了完整的用户认证和授权系统",
                "1集成了实时数据更新和消息推送功能",
                "1采用 Redux Toolkit 进行状态管理",
                "1使用 Jest 和 React Testing Library 进行单元测试"
            ],
            demoUrl: "#",
            githubUrl: "#",
            techStack: ["Python", "Django", "PostgreSQL"]
        },
        {
            id: 4,
            title: "项目名称4",
            description: "使用Python开发的数据分析工具...",
            image: "https://picsum.photos/400/300?random=4",
            demoUrl: "#",
            githubUrl: "#",
            techStack: ["Python", "Django", "PostgreSQL"]
        },
        {
            id: 5,
            title: "项目名称5",
            description: "使用Python开发的数据分析工具...",
            image: "https://picsum.photos/400/300?random=5",
            demoUrl: "#",
            githubUrl: "#",
            techStack: ["Python", "Django", "PostgreSQL"]

        },
        {
            id: 6,
            title: "项目名称6",
            description: "使用Python开发的数据分析工具...",
            image: "https://picsum.photos/400/300?random=6",
            demoUrl: "#",
            githubUrl: "#",
            techStack: ["Python", "Django", "PostgreSQL"]
        },
        {
            id: 7,
            title: "项目名称7",
            description: "使用Python开发的数据分析工具...",
            image: "https://picsum.photos/400/300?random=7",
            demoUrl: "#",
            githubUrl: "#",
            techStack: ["Python", "Django", "PostgreSQL"]

        }
        // 可以继续添加更多项目
    ]
};

module.exports = {
    plugins: [
        // 其他插件...
        require('./postcss-rpx-to-viewport')({
            viewportWidth: 750,    // 设计稿宽度
            unitPrecision: 5,      // 小数点位数
            minPixelValue: 1,      // 最小转换值
            multiplier: 1,         // rpx 与 px 的倍数关系
            exclude: [/node_modules/]
        })
    ]
}; 