<template>
  <h1>{{ msg }}</h1>
  <div>
    <div v-for="(day, dayIndex) in week" class="info-wrapper">
      <!-- 顯示星期幾 -->
      <h2>{{ day.daysOfWeek }}</h2>
      <!-- 顯示供餐狀態 -->
      <div class="status-box">
        <input type="checkbox" :checked="day.status" :id="`day-week${dayIndex}`" @change="toggleMealStatus(day)" />
        <label :for="`day-week${dayIndex}`">{{ day.status ? '今日供餐' : '今日不供餐' }}</label>
      </div>
      <!-- 時間選擇框 -->
      <div v-for="(timeRange, timeSpanIndex) in day.oneIndexRanges" class="time-span-box">
        <!-- 上方時間選擇 -->
        <div class="time-select" :class="{ active: isActive(dayIndex, timeSpanIndex, 'top') }" @click="toggleActive(dayIndex, timeSpanIndex, 'top')">
          <!-- 顯示開始時間 -->
          <div>{{ times[timeRange.start] }}</div>
          <!-- 時間列表 -->
          <div class="time-select-list">
            <div class="select-item select-item--disabled">請選擇時間</div>
            <!-- 開始時間選項 -->
            <div v-for="(startTime, timesStartIndex) in times.filter((time, xIndex) => time !== '23:59' && xIndex < timeRange.end)" @click="selectStartTime(day, timeSpanIndex, timesStartIndex)" class="select-item" :class="{ 'select-item--active': timesStartIndex === timeRange.start }">
              {{ startTime }}
            </div>
            <!-- 不可選的開始時間 -->
            <div v-for="startTime in times.filter((time, xIndex) => time !== '23:59' && xIndex >= timeRange.end)" class="select-item select-item--disabled">{{ startTime }}</div>
          </div>
        </div>
        <div class="dash">-</div>
        <!-- 下方時間選擇 -->
        <div class="time-select" :class="{ active: isActive(dayIndex, timeSpanIndex, 'bottom') }" @click="toggleActive(dayIndex, timeSpanIndex, 'bottom')">
          <!-- 顯示結束時間 -->
          <div>{{ times[timeRange.end] }}</div>
          <!-- 時間列表 -->
          <div class="time-select-list">
            <div class="select-item select-item--disabled">請選擇時間</div>
            <!-- 不可選的結束時間 -->
            <div v-for="endTime in times.filter((time, xIndex) => time !== '00:00' && xIndex <= timeRange.start)" class="select-item select-item--disabled">{{ endTime }}</div>
            <!-- 結束時間選項 -->
            <div v-for="(endTime, timesEndIndex) in times.filter((time, xIndex) => time !== '00:00' && xIndex > timeRange.start)" @click="selectEndTime(day, timeSpanIndex, timesEndIndex + timeRange.start + 1)" class="select-item" :class="{ 'select-item--active': timesEndIndex === timeRange.end - timeRange.start - 1 }">
              {{ endTime }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { DaysOfWeek, daysOfWeekTitle } from '../type';
defineProps<{ msg: string }>();
const week = ref<DaysOfWeek[]>([]);
const activeTimeSpan = ref<{ dayIndex: number; timeSpanIndex: number; position: string } | null>(null);
// const timeSpan = ref<{ start: number | null; end: number | null }>({ start: null, end: null });
// 預設資料
const data: {
  [key: string]: string;
} = {
  week_day0: '000000000000000000000000000000000000000000000000',
  week_day1: '111111111111111111111111111111111111111111111111',
  week_day2: '111111111111000000000000000000000000000000000000',
  week_day3: '000000000000111111000000000000000000000000000000',
  week_day4: '000000000000000000000000111111111111000000000000',
  week_day5: '000000000000000000000000000000000000111111111111',
  week_day6: '111111111111111111111111111111111111111111111111',
};

// 初始化列表
for (let i = 0; i < 7; i++) {
  let weekStr = `week_day${i}`;
  week.value.push(new DaysOfWeek(daysOfWeekTitle[i], weekStr, data[weekStr] as string));
}
console.log(week.value);

// 時間區間初始化
const times = ref<string[]>([]);
for (let hour = 0, minute = 0; hour < 24; minute === 30 ? (hour++, (minute = 0)) : (minute = 30)) {
  times.value.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
}
times.value.push('23:59');

/**
 * 切換一個特定星期幾的餐食狀態。
 * @param day - 要切換狀態的星期幾 (DaysOfWeek 類型)
 * @returns {void}
 */
const toggleMealStatus = (day: DaysOfWeek): void => {
  if (day.status) {
    day.info = '0'.repeat(48);
  } else {
    day.info = '1'.repeat(48);
  }
};

/**
 * 選擇一個時間範圍的開始時間，並更新相關資訊。
 * @param day - 星期幾 (DaysOfWeek 類型)
 * @param timeSpanIndex - 時間範圍的索引
 * @param startIndex - 開始時間的索引
 * @returns {void}
 */
const selectStartTime = (day: DaysOfWeek, timeSpanIndex: number, startIndex: number): void => {
  const endIndex = day.oneIndexRanges[timeSpanIndex].end;
  updateInfo(day, startIndex, endIndex);
};

/**
 * 選擇一個時間範圍的結束時間，並更新相關資訊。
 * @param day - 星期幾 (DaysOfWeek 類型)
 * @param timeSpanIndex - 時間範圍的索引
 * @param endIndex - 結束時間的索引
 * @returns {void}
 */
const selectEndTime = (day: DaysOfWeek, timeSpanIndex: number, endIndex: number): void => {
  const startIndex = day.oneIndexRanges[timeSpanIndex].start;
  updateInfo(day, startIndex, endIndex);
};

/**
 * 更新特定星期幾的資訊，指定開始和結束時間的索引。
 * @param day - 星期幾 (DaysOfWeek 類型)
 * @param startIndex - 開始時間的索引
 * @param endIndex - 結束時間的索引
 * @returns {void}
 */
const updateInfo = (day: DaysOfWeek, startIndex: number, endIndex: number): void => {
  day.info = '0'.repeat(48);
  const ones = '1'.repeat(endIndex - startIndex);
  day.info = day.info.substring(0, startIndex) + ones + day.info.substring(endIndex);
};

/**
 * 檢查特定星期幾、時間範圍和位置是否處於活動狀態。
 * @param dayIndex - 星期幾的索引
 * @param timeSpanIndex - 時間範圍的索引
 * @param position - 位置字串
 * @returns {boolean} - 如果處於活動狀態，則為 true；否則為 false
 */
const isActive = (dayIndex: number, timeSpanIndex: number, position: string) => {
  const active = activeTimeSpan.value;
  return active && active.dayIndex === dayIndex && active.timeSpanIndex === timeSpanIndex && active.position === position;
};

/**
 * 切換特定星期幾、時間範圍和位置的活動狀態。
 * @param dayIndex - 星期幾的索引
 * @param timeSpanIndex - 時間範圍的索引
 * @param position - 位置字符串
 * @returns {void}
 */
const toggleActive = (dayIndex: number, timeSpanIndex: number, position: string): void => {
  const active = activeTimeSpan.value;
  if (!active || active.dayIndex !== dayIndex || active.timeSpanIndex !== timeSpanIndex || active.position !== position) {
    activeTimeSpan.value = { dayIndex, timeSpanIndex, position };
  } else {
    activeTimeSpan.value = null;
  }
};

// 點擊其他地方時移除.active
const handleDocumentClick = (event: MouseEvent): void => {
  const target = event.target as HTMLElement;
  if (!target.closest('.time-select')) {
    activeTimeSpan.value = null;
  }
};

onMounted(() => {
  document.addEventListener('click', handleDocumentClick);
});

// TODO1 拆分成components
// TODO2 加分項
</script>
<style scoped lang="scss">
.info-wrapper {
  display: flex;
  align-items: center;
  padding: 50px 0;
  border-bottom: 2px #eee solid;
  h2,
  label {
    font-size: 20px;
    font-weight: bold;
    margin: 0;
    padding: 0;
  }

  h2 {
    margin-right: 20px;
  }
  .status-box {
    display: flex;
    align-items: center;
    margin-right: 50px;
    > * {
      cursor: pointer;
    }
    input[type='checkbox'] {
      width: 20px;
      height: 20px;
    }
  }
  .time-span-box {
    display: flex;
    align-items: center;
    .time-select {
      position: relative;
      display: flex;
      align-items: center;
      width: 180px;
      height: 40px;
      padding: 0 15px;
      border: 1px solid black;
      border-radius: 5px;
      cursor: pointer;
      .time-select-list {
        position: absolute;
        border: 1px solid black;
        width: 100%;
        height: 200px;
        left: 0;
        top: 100%;
        overflow-y: scroll;
        display: none;
        background-color: #fff;
        z-index: 100;
        .select-item {
          padding: 5px 15px;
          &--active {
            color: #7b6;
            background-color: beige;
          }
          &:hover:not(&--disabled) {
            background-color: #ccc;
          }
          &--disabled {
            cursor: not-allowed;
            color: #aaa;
          }
        }
      }
      &.active {
        border: 2px solid #7b6;
        .time-select-list {
          display: block;
        }
      }
    }
    .dash {
      margin: 0 10px;
    }
  }
}
</style>
