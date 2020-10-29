<template>
  <div class="dashboard-editor-container">

    <panel-group />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart v-if="showChart" :chart-data="lineChartData" />
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import { fetchRecentDays } from '@/api/statistics'

export default {
  name: 'Dashboard',
  components: { PanelGroup, LineChart },
  data() {
    return {
      lineChartData: {},
      showChart: false
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.getRecentDays()
  },
  methods: {
    getRecentDays() {
      fetchRecentDays().then(res => {
        const days = []
        const nums = []
        const data = res.data
        data.forEach(el => {
          days.push(el.days.split('T')[0])
          nums.push(el.count)
        })
        this.lineChartData = { days: days, nums: nums }
        this.showChart = true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  /*.dashboard {*/
  /*  &-container {*/
  /*    margin: 30px;*/
  /*  }*/
  /*  &-text {*/
  /*    font-size: 30px;*/
  /*    line-height: 46px;*/
  /*  }*/
  /*}*/
  .dashboard-editor-container {
    background-color: #f0f2f5;
    min-height: 100vh;
    padding: 50px 60px 0px;

    .pan-info-roles {
      font-size: 12px;
      font-weight: 700;
      color: #333;
      display: block;
    }

    .info-container {
      position: relative;
      margin-left: 190px;
      height: 150px;
      line-height: 200px;

      .display_name {
        font-size: 48px;
        line-height: 48px;
        color: #212121;
        position: absolute;
        top: 25px;
      }
    }
  }
  @media (max-width:1024px) {
    .chart-wrapper {
      padding: 8px;
    }
  }
</style>
