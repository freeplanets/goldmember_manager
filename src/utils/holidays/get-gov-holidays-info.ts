import { Holiday, HolidayDocument, HolidaySchema } from '../../dto/schemas/holiday.schema';
import { getMongoDB } from '../database/mongodb'
import { GovHolidays } from './gov-holidys';
import { formatDateAddSlashes } from '../common';
import { FilterQuery } from 'mongoose';

interface bulkWriteItem {
    updateOne?: {
        filter: FilterQuery<HolidayDocument>;    // key of document like { key: "yourvalue" }
        update: Partial<Holiday>; // 
        upsert: boolean; // if true, insert a new document if no document matches the filter
    }
}

export const getGovHolidaysInfo = async ():Promise<void> => {
    try {
        const db = await getMongoDB();
        const model = db.model(Holiday.name, HolidaySchema);
        const govHolidays = new GovHolidays();
        const data = await govHolidays.getRecords();
        if (data && data.length > 0) {
            const holidays: bulkWriteItem[] = data.map(item => ({
                updateOne: {
                    filter: { year: parseInt(item.year), date: formatDateAddSlashes(item.date) },
                    update: { 
                        name: item.name || '',
                        isHoliday: item.isholiday === '是',
                        holidayCategory: item.holidaycategory,
                        description: item.description || '',
                    },
                    upsert: true, 
                }
            }));
            const ans = await model.bulkWrite(holidays as any[], { ordered: false, writeConcern: { w: 'majority' }});
            console.log('Inserted holidays:', ans);
        } else {
            console.log('No holidays data found.');
        }
    } catch (error) {
        console.error('Error in getGovHolidaysInfo:', error);
    }
}