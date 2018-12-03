<template>
    <div>
<el-table
    :data="tableData2"
    style="width: 100%"
    :row-class-name="tableRowClassName">
     <el-table-column
      label="用户"
      width="180">
     <template slot-scope="scope">
         <img width="20%" src='../assets/logo.png'>
     </template>
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      width="180">
    </el-table-column>
    <!-- <el-table-column
      prop="address"
      label="地址">
    </el-table-column> -->
     <el-table-column
      prop="childNum"
      label="拉粉数量"
      width="180">
    </el-table-column>
  </el-table>
    </div>
</template>
<script>
export default {
    methods: {
      tableRowClassName({row, rowIndex}) {
        if (rowIndex === 1) {
          return 'warning-row';
        } else if (rowIndex === 3) {
          return 'success-row';
        }
        return '';
      }
    },
    async mounted(){
        
        try {
      //获取排名
        // let data=await(await fetch('http://localhost:8080/mgs/tongji?name=张三丰',{
          fetch('http://ydfx.hkaspire.net/mgs/tongji?name=张三丰').then(a=>a.json()).then(b=>console.log(b))
//            let data=await(await fetch('http://ydfx.hkaspire.net/mgs/tongji?name=张三丰',{
// 	method:'GET',
// 	headers:{
// 		'Content-Type': 'application/json',
// 		// 'Authorization':`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoxMjMsImlhdCI6MTU0MjA5OTE3OCwiZXhwIjoxNTQyMTA1MTc4fQ.kEFhljYiftFHRCYtnXEf3xZ-iF5yhrP6kC_Z3lulMWw`
// }	
// })).json()
        
//       console.log(data)
        } catch (error) {
            console.error(error);
        }
      
    },
    data() {
           //此处应该从数据库获取数据
      return {
        tableData2: [{
       
          name: '王小虎1',
        //   address: '上海市普陀区金沙江路 1518 弄',
          childNum:5
        }, {
      
          name: '王小虎2',
        //   address: '上海市普陀区金沙江路 1518 弄',
          childNum:5
        }, {
      
          name: '王小虎3',
        //   address: '上海市普陀区金沙江路 1518 弄',
           childNum:5
        }, {
          name: '王小虎4',
        //   address: '上海市普陀区金沙江路 1518 弄',
           childNum:5
        }]
      }
    }
}
</script>
<style scoped>
 .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>

