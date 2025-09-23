import { AnyObject } from '../../dto/interface/common.if';
import { ParamTypes } from './settings.enum';
import { IGrading, INofication, IParameter, ITimeslotsValue, IValueScore } from './settings.if';

export interface SystemParameter {
  id: string;
  key: string;
  value: object;
  description?: string;
}

const descriptons = {
  min_score: '評分要求',
  open_months: 'App 開放預約月數',
  daily_max_slots: '每天最多組數',
  total_max_slots: '合計最多可預約組次',
  notification_hours: '提前通知時間',
  initial_score: '初始分數',
  correct_players: '人數正確加分',
  late: '遲到',
  no_show: '未到',
  cancel: '臨時取消',
  on_time: '準時',
  timeslots: '擊球時段',
  
}

export const systemParameters: IParameter<IValueScore | INofication | IGrading | ITimeslotsValue| AnyObject>[] = [
  // App 相關設定
  {
    id: ParamTypes.APP_SETTINGS, //'app_settings',
    key: 'APP_SETTINGS',
    description: 'APP設定值',
    value: {
      app_cancel_hours: 24,
      shareholder: {
        common: {        
          min_score: '0',
          open_months: '3',
          daily_max_slots: '2',
          total_max_slots: '20',
        }
      },
      team: {
        bronze: {        
          min_score: '0',
          open_months: '3',
          daily_max_slots: '2',
          total_max_slots: '20',
        },
        silver: {        
          min_score: '120',
          open_months: '3',
          daily_max_slots: '2',
          total_max_slots: '20',
        },
        gold: {        
          min_score: '200',
          open_months: '3',
          daily_max_slots: '2',
          total_max_slots: '20',
        }        
      },
      member: {
        bronze: {        
          min_score: '0',
          open_months: '3',
          daily_max_slots: '2',
          total_max_slots: '20',
        },
        silver: {        
          min_score: '120',
          open_months: '3',
          daily_max_slots: '2',
          total_max_slots: '20',
        },
        gold: {        
          min_score: '160',
          open_months: '3',
          daily_max_slots: '2',
          total_max_slots: '20',
        },
        platinum: {        
          min_score: '200',
          open_months: '3',
          daily_max_slots: '2',
          total_max_slots: '20',
        }                
      },
    },
  },
          
  // 通知相關設定
  {
    id: ParamTypes.NOTIFICATION, //'notification',
    key: 'NOTIFICATION',
    description: '通知設定',
    value: {
      notification_hours: '72',
    }
  },
  
  // 評分相關設定
  {
    id: ParamTypes.GRADING, //'grading',
    key: 'GRADING',
    description: '評分相關',
    value: {
      initial_score: '100',
      correct_players_bonus: '5',
      attendance: {
        on_time_bonus: '10',
        late_penalty: '-10',
        cancel_penalty: '-15',
        no_show_penalty: '-20',
      }
    }
  },
  
  // 預約相關設定
  {
    id: ParamTypes.RESERVATION, //'reservation',
    key: 'RESERVATION',
    description: '可供預約時段',
    value: {
      timeslots: [
        {
          start_month: 6,
          start_day: 1,
          gap: 7,
          sections: [
            {
              start_time: '05:00',
              number_of_slots: 23
            },
            {
              start_time: '09:40',
              number_of_slots: 23
            }
          ]        
        },
        {
          start_month: 10,
          start_day: 1,
          gap: 7,
          sections: [
            {
              start_time: '05:30',
              number_of_slots: 23
            },
            {
              start_time: '10:10',
              number_of_slots: 23
            }
          ]        
        },
        {
          start_month: 12,
          start_day: 1,
          gap: 7,
          sections: [
            {
              start_time: '06:00',
              number_of_slots: 23
            },
            {
              start_time: '10:50',
              number_of_slots: 23
            }
          ]        
        },
        {
          start_month: 3,
          start_day: 1,
          gap: 7,
          sections: [
            {
              start_time: '05:30',
              number_of_slots: 23
            },
            {
              start_time: '10:50',
              number_of_slots: 23
            }
          ]        
        },
      ]},
      
    }
  ];

export const parameterGroups = [
  {
    category: 'app',
    title: 'App 預約限制設定',
    description: '設定不同會員類型的 App 預約相關參數',
  },
  {
    category: 'grading', //'credit',
    title: '評分相關設定',
    description: '設定信用評分相關的系統參數',
  },
  {
    category: 'notification',
    title: '通知相關設定',
    description: '設定系統通知相關的參數',
  },
  {
    category: 'reservation',
    title: '預約相關設定',
    description: '設定預約時段相關的參數',
  }
];

// Helper function to get parameters by category
export const getParametersByCategory = (category: string): SystemParameter[] => {
  return systemParameters.filter(param => param.key === category.toUpperCase());
};

// Helper function to get parameter by ID
export const getParameterById = (id: string): SystemParameter | undefined => {
  return systemParameters.find(param => param.id === id);
};

// Helper function to get parameter by key
export const getParameterByKey = (key: string): SystemParameter | undefined => {
  return systemParameters.find(param => param.key === key);
};

// Helper function to get reservation limit configuration
export const getReservationLimit = () => {
  const param = getParameterByKey('RESERVATION_LIMIT');
  if (param && param.value) {
    try {
      return param.value;
    } catch (error) {
      console.error('Error parsing reservation limit:', error);
      return [];
    }
  }
  return [];
};

// Helper function to get member tier based on credit score
// export const getMemberTier = (membershipType: string, creditScore: number): string => {
//   if (membershipType === 'share_holder' || membershipType === 'dependents') {
//     return 'shareholder'; // 股東/眷屬會員不分級
//   }
  
//   if (membershipType === 'general_member') {
//     const platinumMinScore = parseInt(getParameterByKey('GENERAL_PLATINUM_MIN_SCORE')?.value || '95');
//     const goldMinScore = parseInt(getParameterByKey('GENERAL_GOLD_MIN_SCORE')?.value || '90');
//     const silverMinScore = parseInt(getParameterByKey('GENERAL_SILVER_MIN_SCORE')?.value || '80');
    
//     if (creditScore >= platinumMinScore) {
//       return 'platinum';
//     } else if (creditScore >= goldMinScore) {
//       return 'gold';
//     } else if (creditScore >= silverMinScore) {
//       return 'silver';
//     } else {
//       return 'first_time';
//     }
//   }
  
//   return 'first_time';
// };

// // Helper function to get team tier based on credit score
// export const getTeamTier = (creditScore: number): string => {
//   const goldMinScore = parseInt(getParameterByKey('TEAM_GOLD_MIN_SCORE')?.value || '90');
//   const silverMinScore = parseInt(getParameterByKey('TEAM_SILVER_MIN_SCORE')?.value || '80');
//   const bronzeMinScore = parseInt(getParameterByKey('TEAM_BRONZE_MIN_SCORE')?.value || '70');
  
//   if (creditScore >= goldMinScore) {
//     return 'gold';
//   } else if (creditScore >= silverMinScore) {
//     return 'silver';
//   } else if (creditScore >= bronzeMinScore) {
//     return 'bronze';
//   } else {
//     return 'basic';
//   }
// };

// // Helper function to get reservation limits for a member
// export const getMemberReservationLimits = (membershipType: string, creditScore: number) => {
//   const tier = getMemberTier(membershipType, creditScore);
  
//   if (tier === 'shareholder') {
//     return {
//       maxPlayers: parseInt(getParameterByKey('SHAREHOLDER_MAX_PLAYERS')?.value || '4'),
//       maxSlotsPerDay: parseInt(getParameterByKey('SHAREHOLDER_MAX_SLOTS_PER_DAY')?.value || '4'),
//       maxSlotsTotal: parseInt(getParameterByKey('SHAREHOLDER_MAX_SLOTS_TOTAL')?.value || '20'),
//     };
//   } else if (tier === 'platinum') {
//     return {
//       maxPlayers: parseInt(getParameterByKey('GENERAL_PLATINUM_MAX_PLAYERS')?.value || '4'),
//       maxSlotsPerDay: parseInt(getParameterByKey('GENERAL_PLATINUM_MAX_SLOTS_PER_DAY')?.value || '3'),
//       maxSlotsTotal: parseInt(getParameterByKey('GENERAL_PLATINUM_MAX_SLOTS_TOTAL')?.value || '10'),
//     };
//   } else if (tier === 'gold') {
//     return {
//       maxPlayers: parseInt(getParameterByKey('GENERAL_GOLD_MAX_PLAYERS')?.value || '3'),
//       maxSlotsPerDay: parseInt(getParameterByKey('GENERAL_GOLD_MAX_SLOTS_PER_DAY')?.value || '3'),
//       maxSlotsTotal: parseInt(getParameterByKey('GENERAL_GOLD_MAX_SLOTS_TOTAL')?.value || '6'),
//     };
//   } else if (tier === 'silver') {
//     return {
//       maxPlayers: parseInt(getParameterByKey('GENERAL_SILVER_MAX_PLAYERS')?.value || '2'),
//       maxSlotsPerDay: parseInt(getParameterByKey('GENERAL_SILVER_MAX_SLOTS_PER_DAY')?.value || '2'),
//       maxSlotsTotal: parseInt(getParameterByKey('GENERAL_SILVER_MAX_SLOTS_TOTAL')?.value || '4'),
//     };
//   } else {
//     // first_time
//     return {
//       maxPlayers: parseInt(getParameterByKey('GENERAL_FIRST_MAX_PLAYERS')?.value || '2'),
//       maxSlotsPerDay: parseInt(getParameterByKey('GENERAL_FIRST_MAX_SLOTS_PER_DAY')?.value || '2'),
//       maxSlotsTotal: parseInt(getParameterByKey('GENERAL_FIRST_MAX_SLOTS_TOTAL')?.value || '4'),
//     };
//   }
// };

// // Helper function to get team reservation limits
// export const getTeamReservationLimits = () => {
//   return {
//     maxGroups: parseInt(getParameterByKey('TEAM_MAX_GROUPS')?.value || '5'),
//     maxSlotsPerDay: parseInt(getParameterByKey('TEAM_MAX_SLOTS_PER_DAY')?.value || '20'),
//   };
// };