import { isArray } from "class-validator";

export interface IGovHolidays {
    date: string; //"20240504",
    year: string; //"2024",
    name?: string; // null,
    isholiday: string;  //"是",
    holidaycategory: string; //"星期六、星期日",
    description?: string; //null
}
export class GovHolidays {
    private url: string = 'https://data.ntpc.gov.tw/api/datasets/308dcd75-6434-45bc-a95f-584da4fed251/json?';
    constructor(url:string='') {
        if (url) {
            this.url = url;
        }
    }
    async getRecords(): Promise<IGovHolidays[]> {
        const pages = [10, 11];
        let data: IGovHolidays[] = [];
        try {
            for (let i=0,n=pages.length; i<n; i++) {
                const url = this.url + `page=${pages[i]}&size=100`;
                console.log('url:', url);
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const ans = await response.json();
                    if (isArray(ans) && ans.length > 0) {
                        data = data.concat(ans as IGovHolidays[]);
                    }                
                } else {
                    console.error('HTTP error:', response.status, response.statusText);
                }
            }
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            return
        }
    }
} 