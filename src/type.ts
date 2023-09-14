export class TodoListItem {
    userId: number = 0;
    id: number = 0;
    title: string = '';
    completed: boolean = false;
}

export class DaysOfWeek {
    daysOfWeek: string;
    weekIndex: string;
    info: string;
    constructor(daysOfWeek: string, weekIndex: string, info: string) {
        this.daysOfWeek = daysOfWeek;
        this.weekIndex = weekIndex;
        this.info = info;
      }
      get status(): boolean {
        return this.info.includes('1');
      }
      get oneIndexRanges(): { start: number; end: number }[] {
        const indexRanges: { start: number; end: number }[] = [];
        let start = -1;
    
        for (let i = 0; i < this.info.length; i++) {
          if (this.info.charAt(i) === '1') {
            if (start === -1) {
              start = i;
            }
          } else {
            if (start !== -1) {
              const end = i;
              indexRanges.push({ start, end });
              start = -1;
            }
          }
        }
    
        if (start !== -1) {
          // 處理最後一個區間
          indexRanges.push({ start, end: this.info.length });
        }
    
        return indexRanges;
      }
}

export const daysOfWeekTitle = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];