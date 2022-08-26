// components/Tabs/Tabs.js
Component({
  properties: {
    tabs:{
      type:Array,
      value:[]
    }
  },
  data: {

  },
  methods: {
    // 点击事件回调
    handleItemTap(e){
      // 获取点击的索引
     const {index}=e.currentTarget.dataset;
     // 触发父组件中的事件
    this.triggerEvent("tabsTtemChange",{index})
    }

  }
})
